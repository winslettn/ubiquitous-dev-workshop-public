/**
 * Repository for customer product requests and internal staff notes
 */

import { randomBytes } from 'crypto';
import { getDatabase, DatabaseConnection } from '../db/sqlite';
import {
  ProductRequest,
  ProductRequestInput,
  ProductRequestNote,
  ProductRequestStatus,
  PRODUCT_REQUEST_STATUSES,
  PRODUCT_REQUEST_TRANSITIONS,
} from '../models/productRequest';
import {
  handleDatabaseError,
  NotFoundError,
  ValidationError,
  ConflictError,
} from '../utils/errors';
import { objectToCamelCase, mapDatabaseRows, DatabaseRow } from '../utils/sql';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value: unknown, field: string, max: number, required: boolean): string | null {
  if (value === undefined || value === null || value === '') {
    if (required) throw new ValidationError(`${field} is required`);
    return null;
  }
  if (typeof value !== 'string') throw new ValidationError(`${field} must be a string`);
  const trimmed = value.trim();
  if (!trimmed) {
    if (required) throw new ValidationError(`${field} is required`);
    return null;
  }
  if (trimmed.length > max) throw new ValidationError(`${field} must be at most ${max} characters`);
  return trimmed;
}

export function validateProductRequestInput(input: unknown): {
  contactEmail: string;
  itemName: string;
  description: string;
  preferredBrandModel: string | null;
  targetPrice: number | null;
} {
  if (typeof input !== 'object' || input === null) {
    throw new ValidationError('Request body must be an object');
  }
  const body = input as Record<string, unknown>;
  const contactEmail = cleanString(body.contactEmail, 'contactEmail', 254, true) as string;
  if (!EMAIL_PATTERN.test(contactEmail)) {
    throw new ValidationError('contactEmail must be a valid email address');
  }
  const itemName = cleanString(body.itemName, 'itemName', 200, true) as string;
  const description = cleanString(body.description, 'description', 2000, true) as string;
  const preferredBrandModel = cleanString(body.preferredBrandModel, 'preferredBrandModel', 200, false);

  let targetPrice: number | null = null;
  if (body.targetPrice !== undefined && body.targetPrice !== null && body.targetPrice !== '') {
    if (typeof body.targetPrice !== 'number' || !Number.isFinite(body.targetPrice) || body.targetPrice < 0) {
      throw new ValidationError('targetPrice must be a non-negative number');
    }
    targetPrice = body.targetPrice;
  }

  return { contactEmail, itemName, description, preferredBrandModel, targetPrice };
}

export function validateNote(note: unknown): string {
  return cleanString(note, 'note', 2000, true) as string;
}

export class ProductRequestsRepository {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  private generateReference(): string {
    return `PR-${randomBytes(4).toString('hex').toUpperCase()}`;
  }

  /**
   * Create a request (customer submission)
   */
  async create(input: ProductRequestInput): Promise<ProductRequest> {
    try {
      const data = validateProductRequestInput(input);
      for (let attempt = 0; attempt < 5; attempt++) {
        const reference = this.generateReference();
        try {
          const result = await this.db.run(
            `INSERT INTO product_requests
               (reference, contact_email, item_name, description, preferred_brand_model, target_price)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              reference,
              data.contactEmail,
              data.itemName,
              data.description,
              data.preferredBrandModel,
              data.targetPrice,
            ],
          );
          const created = await this.findById(result.lastID || 0);
          if (!created) throw new Error('Failed to retrieve created product request');
          return created;
        } catch (error) {
          const message = error instanceof Error ? error.message : '';
          if (!message.includes('UNIQUE')) throw error;
        }
      }
      throw new ConflictError('Could not generate a unique request reference');
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * List requests (newest first), optionally filtered by status
   */
  async findAll(status?: string): Promise<ProductRequest[]> {
    try {
      if (status !== undefined && !PRODUCT_REQUEST_STATUSES.includes(status as ProductRequestStatus)) {
        throw new ValidationError(`status must be one of: ${PRODUCT_REQUEST_STATUSES.join(', ')}`);
      }
      const rows = status
        ? await this.db.all<DatabaseRow>(
            'SELECT * FROM product_requests WHERE status = ? ORDER BY product_request_id DESC',
            [status],
          )
        : await this.db.all<DatabaseRow>(
            'SELECT * FROM product_requests ORDER BY product_request_id DESC',
          );
      return mapDatabaseRows<ProductRequest>(rows);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get a request by ID (without notes)
   */
  async findById(id: number): Promise<ProductRequest | null> {
    try {
      const row = await this.db.get<DatabaseRow>(
        'SELECT * FROM product_requests WHERE product_request_id = ?',
        [id],
      );
      return row ? objectToCamelCase<ProductRequest>(row) : null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get a request by ID including its internal notes (staff view)
   */
  async findByIdWithNotes(id: number): Promise<ProductRequest | null> {
    const request = await this.findById(id);
    if (!request) return null;
    request.notes = await this.listNotes(id);
    return request;
  }

  private async requireRequest(id: number): Promise<ProductRequest> {
    const request = await this.findById(id);
    if (!request) throw new NotFoundError('Product request', id);
    return request;
  }

  /**
   * Transition a request to a new status following the workflow
   */
  async updateStatus(id: number, status: unknown): Promise<ProductRequest> {
    try {
      if (typeof status !== 'string' || !PRODUCT_REQUEST_STATUSES.includes(status as ProductRequestStatus)) {
        throw new ValidationError(`status must be one of: ${PRODUCT_REQUEST_STATUSES.join(', ')}`);
      }
      const next = status as ProductRequestStatus;
      const current = await this.requireRequest(id);
      if (!PRODUCT_REQUEST_TRANSITIONS[current.status].includes(next)) {
        throw new ConflictError(`Cannot change status from ${current.status} to ${next}`);
      }
      await this.db.run(
        'UPDATE product_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE product_request_id = ?',
        [next, id],
      );
      return await this.requireRequest(id);
    } catch (error) {
      handleDatabaseError(error, 'Product request', id);
    }
  }

  /**
   * Link a fulfilled request to a catalog product
   */
  async linkProduct(id: number, productId: unknown): Promise<ProductRequest> {
    try {
      if (typeof productId !== 'number' || !Number.isInteger(productId) || productId <= 0) {
        throw new ValidationError('productId must be a positive integer');
      }
      const current = await this.requireRequest(id);
      if (current.status !== 'fulfilled') {
        throw new ConflictError('Only fulfilled requests can be linked to a product');
      }
      const product = await this.db.get('SELECT product_id FROM products WHERE product_id = ?', [
        productId,
      ]);
      if (!product) throw new ValidationError(`Product ${productId} does not exist`);
      await this.db.run(
        'UPDATE product_requests SET product_id = ?, updated_at = CURRENT_TIMESTAMP WHERE product_request_id = ?',
        [productId, id],
      );
      return await this.requireRequest(id);
    } catch (error) {
      handleDatabaseError(error, 'Product request', id);
    }
  }

  async listNotes(requestId: number): Promise<ProductRequestNote[]> {
    try {
      const rows = await this.db.all<DatabaseRow>(
        'SELECT * FROM product_request_notes WHERE product_request_id = ? ORDER BY note_id',
        [requestId],
      );
      return mapDatabaseRows<ProductRequestNote>(rows);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  private async findNote(requestId: number, noteId: number): Promise<ProductRequestNote> {
    const row = await this.db.get<DatabaseRow>(
      'SELECT * FROM product_request_notes WHERE note_id = ? AND product_request_id = ?',
      [noteId, requestId],
    );
    if (!row) throw new NotFoundError('Note', noteId);
    return objectToCamelCase<ProductRequestNote>(row);
  }

  async addNote(requestId: number, note: unknown): Promise<ProductRequestNote> {
    try {
      const text = validateNote(note);
      await this.requireRequest(requestId);
      const result = await this.db.run(
        'INSERT INTO product_request_notes (product_request_id, note) VALUES (?, ?)',
        [requestId, text],
      );
      return await this.findNote(requestId, result.lastID || 0);
    } catch (error) {
      handleDatabaseError(error, 'Product request', requestId);
    }
  }

  async updateNote(requestId: number, noteId: number, note: unknown): Promise<ProductRequestNote> {
    try {
      const text = validateNote(note);
      await this.findNote(requestId, noteId);
      await this.db.run(
        'UPDATE product_request_notes SET note = ?, updated_at = CURRENT_TIMESTAMP WHERE note_id = ?',
        [text, noteId],
      );
      return await this.findNote(requestId, noteId);
    } catch (error) {
      handleDatabaseError(error, 'Note', noteId);
    }
  }

  async deleteNote(requestId: number, noteId: number): Promise<void> {
    try {
      await this.findNote(requestId, noteId);
      await this.db.run('DELETE FROM product_request_notes WHERE note_id = ?', [noteId]);
    } catch (error) {
      handleDatabaseError(error, 'Note', noteId);
    }
  }
}

export async function createProductRequestsRepository(
  isTest: boolean = false,
): Promise<ProductRequestsRepository> {
  const db = await getDatabase(isTest);
  return new ProductRequestsRepository(db);
}

let productRequestsRepo: ProductRequestsRepository | null = null;

export async function getProductRequestsRepository(
  isTest: boolean = false,
): Promise<ProductRequestsRepository> {
  const isTestEnv = isTest || process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
  if (isTestEnv) {
    return createProductRequestsRepository(true);
  }
  if (!productRequestsRepo) {
    productRequestsRepo = await createProductRequestsRepository(false);
  }
  return productRequestsRepo;
}

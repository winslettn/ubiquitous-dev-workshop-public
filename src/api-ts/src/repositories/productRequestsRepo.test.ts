import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProductRequestsRepository } from './productRequestsRepo';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';

const input = { contactEmail: ' a@example.com ', itemName: ' Drill ', description: 'desc' };

describe('ProductRequestsRepository', () => {
  let repo: ProductRequestsRepository;

  beforeEach(async () => {
    await closeDatabase();
    const db = await getDatabase(true);
    await runMigrations(true);
    repo = new ProductRequestsRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it('creates a request with trimmed values, default status and unique reference', async () => {
    const a = await repo.create({ ...input, targetPrice: 0 });
    const b = await repo.create(input);
    expect(a).toMatchObject({
      contactEmail: 'a@example.com',
      itemName: 'Drill',
      status: 'new',
      targetPrice: 0,
      preferredBrandModel: null,
      productId: null,
    });
    expect(a.reference).not.toBe(b.reference);
  });

  it('validates input', async () => {
    await expect(repo.create({ ...input, contactEmail: 'bad' })).rejects.toBeInstanceOf(ValidationError);
    await expect(repo.create({ ...input, itemName: '' })).rejects.toBeInstanceOf(ValidationError);
    await expect(repo.create({ ...input, targetPrice: -5 })).rejects.toBeInstanceOf(ValidationError);
    await expect(repo.create(null as never)).rejects.toBeInstanceOf(ValidationError);
  });

  it('enforces status transitions', async () => {
    const r = await repo.create(input);
    await expect(repo.updateStatus(r.productRequestId, 'approved')).rejects.toBeInstanceOf(ConflictError);
    expect((await repo.updateStatus(r.productRequestId, 'declined')).status).toBe('declined');
    expect((await repo.updateStatus(r.productRequestId, 'reviewing')).status).toBe('reviewing');
    await expect(repo.updateStatus(999, 'reviewing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('manages notes and cascades on delete', async () => {
    const r = await repo.create(input);
    const n = await repo.addNote(r.productRequestId, 'hello');
    await repo.updateNote(r.productRequestId, n.noteId, 'bye');
    expect((await repo.findByIdWithNotes(r.productRequestId))?.notes?.[0].note).toBe('bye');
    await expect(repo.updateNote(r.productRequestId + 1, n.noteId, 'x')).rejects.toBeInstanceOf(NotFoundError);
    const db = await getDatabase();
    await db.run('DELETE FROM product_requests WHERE product_request_id = ?', [r.productRequestId]);
    expect(await repo.listNotes(r.productRequestId)).toHaveLength(0);
  });

  it('only links fulfilled requests to existing products', async () => {
    const db = await getDatabase();
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (1, ?)', ['S']);
    await db.run(
      'INSERT INTO products (product_id, supplier_id, name, price, sku, unit) VALUES (1, 1, ?, 1, ?, ?)',
      ['P', 'S1', 'u'],
    );
    const r = await repo.create(input);
    await expect(repo.linkProduct(r.productRequestId, 1)).rejects.toBeInstanceOf(ConflictError);
    for (const s of ['reviewing', 'approved', 'fulfilled']) await repo.updateStatus(r.productRequestId, s);
    await expect(repo.linkProduct(r.productRequestId, 42)).rejects.toBeInstanceOf(ValidationError);
    expect((await repo.linkProduct(r.productRequestId, 1)).productId).toBe(1);
    await db.run('DELETE FROM products WHERE product_id = 1');
    expect((await repo.findById(r.productRequestId))?.productId).toBeNull();
  });
});

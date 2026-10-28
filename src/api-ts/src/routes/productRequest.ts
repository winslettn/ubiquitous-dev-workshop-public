/**
 * @swagger
 * tags:
 *   name: Product Requests
 *   description: >
 *     Customers can request products that are not in the catalog without an account.
 *     Staff review requests through endpoints protected by server-side authorization
 *     (StaffToken bearer security scheme).
 */

/**
 * @swagger
 * /api/product-requests:
 *   post:
 *     summary: Submit a product request (public, no account required)
 *     tags: [Product Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequestInput'
 *     responses:
 *       201:
 *         description: Request saved. Returns a reference and a confirmation that makes no promise of sale, availability, fulfillment or timing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductRequestConfirmation'
 *       400:
 *         description: Validation error (missing itemName/description, invalid contactEmail, invalid targetPrice, over-long values)
 *   get:
 *     summary: List product requests (staff only)
 *     tags: [Product Requests]
 *     security:
 *       - StaffToken: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, reviewing, approved, declined, fulfilled]
 *     responses:
 *       200:
 *         description: Request queue, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductRequest'
 *       400:
 *         description: Invalid status filter
 *       401:
 *         description: Missing or malformed staff credentials
 *       403:
 *         description: Invalid staff credentials
 *
 * /api/product-requests/{id}:
 *   get:
 *     summary: Get a request including internal notes and linked product (staff only)
 *     tags: [Product Requests]
 *     security:
 *       - StaffToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request with notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductRequest'
 *       401:
 *         description: Missing or malformed staff credentials
 *       403:
 *         description: Invalid staff credentials
 *       404:
 *         description: Request not found
 *
 * /api/product-requests/{id}/status:
 *   put:
 *     summary: Change request status (staff only)
 *     description: >
 *       Allowed transitions: new to reviewing or declined, reviewing to approved or declined,
 *       approved to fulfilled or declined, declined to reviewing. fulfilled is terminal.
 *     tags: [Product Requests]
 *     security:
 *       - StaffToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, reviewing, approved, declined, fulfilled]
 *     responses:
 *       200:
 *         description: Updated request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductRequest'
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Missing or malformed staff credentials
 *       403:
 *         description: Invalid staff credentials
 *       404:
 *         description: Request not found
 *       409:
 *         description: Transition not allowed by the workflow
 *
 * /api/product-requests/{id}/product:
 *   put:
 *     summary: Link a fulfilled request to a catalog product (staff only)
 *     description: The product must already exist (created through the product workflow) and the request must be fulfilled.
 *     tags: [Product Requests]
 *     security:
 *       - StaffToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated request with productId set
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductRequest'
 *       400:
 *         description: Invalid or non-existent productId
 *       401:
 *         description: Missing or malformed staff credentials
 *       403:
 *         description: Invalid staff credentials
 *       404:
 *         description: Request not found
 *       409:
 *         description: Request is not fulfilled
 *
 * /api/product-requests/{id}/notes:
 *   post:
 *     summary: Add an internal note (staff only)
 *     tags: [Product Requests]
 *     security:
 *       - StaffToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [note]
 *             properties:
 *               note:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductRequestNote'
 *       400:
 *         description: Note missing or too long
 *       401:
 *         description: Missing or malformed staff credentials
 *       403:
 *         description: Invalid staff credentials
 *       404:
 *         description: Request not found
 *
 * /api/product-requests/{id}/notes/{noteId}:
 *   put:
 *     summary: Update an internal note (staff only)
 *     tags: [Product Requests]
 *     security:
 *       - StaffToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [note]
 *             properties:
 *               note:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       200:
 *         description: Note updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductRequestNote'
 *       400:
 *         description: Note missing or too long
 *       401:
 *         description: Missing or malformed staff credentials
 *       403:
 *         description: Invalid staff credentials
 *       404:
 *         description: Request or note not found
 *   delete:
 *     summary: Delete an internal note (staff only)
 *     tags: [Product Requests]
 *     security:
 *       - StaffToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Note deleted
 *       401:
 *         description: Missing or malformed staff credentials
 *       403:
 *         description: Invalid staff credentials
 *       404:
 *         description: Request or note not found
 */

import express from 'express';
import { getProductRequestsRepository } from '../repositories/productRequestsRepo';
import { ValidationError } from '../utils/errors';
import { requireStaff } from '../utils/staffAuth';

const router = express.Router();

export const CONFIRMATION_MESSAGE =
  'Thanks for your request. We will review it, but submitting a request does not guarantee that the item will be sold, made available, or fulfilled, and we cannot commit to any timeframe.';

function parseId(value: string, name = 'id'): number {
  if (!/^\d+$/.test(value)) {
    throw new ValidationError(`${name} must be a positive integer`);
  }
  return parseInt(value, 10);
}

// Public: submit a request. Only the reference and a confirmation are returned.
router.post('/', async (req, res, next) => {
  try {
    const repo = await getProductRequestsRepository();
    const created = await repo.create(req.body);
    res.status(201).json({ reference: created.reference, message: CONFIRMATION_MESSAGE });
  } catch (error) {
    next(error);
  }
});

// Everything below is staff-only
router.use(requireStaff);

router.get('/', async (req, res, next) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const repo = await getProductRequestsRepository();
    res.json(await repo.findAll(status));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const repo = await getProductRequestsRepository();
    const request = await repo.findByIdWithNotes(id);
    if (!request) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product request not found' } });
      return;
    }
    res.json(request);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const repo = await getProductRequestsRepository();
    await repo.updateStatus(id, req.body?.status);
    res.json(await repo.findByIdWithNotes(id));
  } catch (error) {
    next(error);
  }
});

router.put('/:id/product', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const repo = await getProductRequestsRepository();
    await repo.linkProduct(id, req.body?.productId);
    res.json(await repo.findByIdWithNotes(id));
  } catch (error) {
    next(error);
  }
});

router.post('/:id/notes', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const repo = await getProductRequestsRepository();
    res.status(201).json(await repo.addNote(id, req.body?.note));
  } catch (error) {
    next(error);
  }
});

router.put('/:id/notes/:noteId', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const noteId = parseId(req.params.noteId, 'noteId');
    const repo = await getProductRequestsRepository();
    res.json(await repo.updateNote(id, noteId, req.body?.note));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/notes/:noteId', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const noteId = parseId(req.params.noteId, 'noteId');
    const repo = await getProductRequestsRepository();
    await repo.deleteNote(id, noteId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

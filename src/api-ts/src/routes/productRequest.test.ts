import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRequestRouter, { CONFIRMATION_MESSAGE } from './productRequest';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';
import { errorHandler } from '../utils/errors';

let app: express.Express;
const TOKEN = 'test-staff-token';
const staff = { Authorization: `Bearer ${TOKEN}` };
const valid = {
  contactEmail: 'customer@example.com',
  itemName: 'Cordless drill',
  description: 'Need a 20V cordless drill',
  preferredBrandModel: 'Acme X1',
  targetPrice: 99.5,
};

async function submit(body: object = valid) {
  return request(app).post('/requests').send(body);
}

describe('Product Requests API', () => {
  beforeEach(async () => {
    process.env.STAFF_API_TOKEN = TOKEN;
    await closeDatabase();
    await getDatabase(true);
    await runMigrations(true);
    app = express();
    app.use(express.json());
    app.use('/requests', productRequestRouter);
    app.use(errorHandler);
  });

  afterEach(async () => {
    delete process.env.STAFF_API_TOKEN;
    await closeDatabase();
  });

  describe('customer submission', () => {
    it('accepts a valid request without authentication and returns reference + no-promise message', async () => {
      const res = await submit();
      expect(res.status).toBe(201);
      expect(res.body.reference).toMatch(/^PR-[0-9A-F]{8}$/);
      expect(res.body.message).toBe(CONFIRMATION_MESSAGE);
      expect(res.body.message).toMatch(/does not guarantee/);
      expect(Object.keys(res.body).sort()).toEqual(['message', 'reference']);
    });

    it('accepts a request with only required fields', async () => {
      const res = await submit({
        contactEmail: 'a@b.co',
        itemName: 'Widget',
        description: 'A widget',
      });
      expect(res.status).toBe(201);
    });

    it.each([
      ['missing itemName', { ...valid, itemName: undefined }],
      ['blank description', { ...valid, description: '   ' }],
      ['missing email', { ...valid, contactEmail: undefined }],
      ['invalid email', { ...valid, contactEmail: 'not-an-email' }],
      ['negative price', { ...valid, targetPrice: -1 }],
      ['non-numeric price', { ...valid, targetPrice: 'cheap' }],
      ['too long name', { ...valid, itemName: 'x'.repeat(201) }],
    ])('rejects %s', async (_name, body) => {
      const res = await submit(body);
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('authorization', () => {
    it.each([
      ['GET', '/requests'],
      ['GET', '/requests/1'],
      ['PUT', '/requests/1/status'],
      ['PUT', '/requests/1/product'],
      ['POST', '/requests/1/notes'],
      ['PUT', '/requests/1/notes/1'],
      ['DELETE', '/requests/1/notes/1'],
    ])('rejects unauthenticated %s %s', async (method, path) => {
      const res = await (request(app) as any)[method.toLowerCase()](path).send({});
      expect(res.status).toBe(401);
    });

    it('rejects a wrong token', async () => {
      const res = await request(app).get('/requests').set('Authorization', 'Bearer wrong');
      expect(res.status).toBe(403);
    });

    it('rejects everything when no staff token is configured', async () => {
      delete process.env.STAFF_API_TOKEN;
      const res = await request(app).get('/requests').set('Authorization', 'Bearer ');
      expect(res.status).toBe(401);
      const res2 = await request(app).get('/requests').set('Authorization', 'Bearer anything');
      expect(res2.status).toBe(401);
    });

    it('does not let an admin hint from the client bypass checks', async () => {
      const res = await request(app).get('/requests').set('X-Admin', 'true');
      expect(res.status).toBe(401);
    });
  });

  describe('staff workflow', () => {
    async function createRequest() {
      await submit();
      const list = await request(app).get('/requests').set(staff);
      return list.body[0];
    }

    it('lists the queue and filters by status', async () => {
      await submit();
      await submit({ ...valid, itemName: 'Second' });
      const all = await request(app).get('/requests').set(staff);
      expect(all.status).toBe(200);
      expect(all.body).toHaveLength(2);
      expect(all.body[0].itemName).toBe('Second');
      const none = await request(app).get('/requests?status=approved').set(staff);
      expect(none.body).toHaveLength(0);
      const bad = await request(app).get('/requests?status=bogus').set(staff);
      expect(bad.status).toBe(400);
    });

    it('returns a request with notes and 404 for unknown id', async () => {
      const r = await createRequest();
      const res = await request(app).get(`/requests/${r.productRequestId}`).set(staff);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'new', notes: [], productId: null });
      expect((await request(app).get('/requests/999').set(staff)).status).toBe(404);
      expect((await request(app).get('/requests/abc').set(staff)).status).toBe(400);
    });

    it('follows the status workflow', async () => {
      const r = await createRequest();
      const url = `/requests/${r.productRequestId}/status`;
      const put = (status: string) => request(app).put(url).set(staff).send({ status });

      expect((await put('fulfilled')).status).toBe(409);
      expect((await put('bogus')).status).toBe(400);
      expect((await put('reviewing')).body.status).toBe('reviewing');
      expect((await put('approved')).body.status).toBe('approved');
      expect((await put('fulfilled')).body.status).toBe('fulfilled');
      expect((await put('reviewing')).status).toBe(409);
      expect(
        (await request(app).put('/requests/999/status').set(staff).send({ status: 'reviewing' })).status,
      ).toBe(404);
    });

    it('manages internal notes and never exposes them to customers', async () => {
      const r = await createRequest();
      const base = `/requests/${r.productRequestId}/notes`;
      const created = await request(app).post(base).set(staff).send({ note: 'Check supplier' });
      expect(created.status).toBe(201);
      expect(created.body.note).toBe('Check supplier');
      expect((await request(app).post(base).set(staff).send({ note: ' ' })).status).toBe(400);
      expect((await request(app).post('/requests/999/notes').set(staff).send({ note: 'x' })).status).toBe(404);

      const updated = await request(app)
        .put(`${base}/${created.body.noteId}`)
        .set(staff)
        .send({ note: 'Updated' });
      expect(updated.body.note).toBe('Updated');
      expect((await request(app).put(`${base}/999`).set(staff).send({ note: 'x' })).status).toBe(404);

      const detail = await request(app).get(`/requests/${r.productRequestId}`).set(staff);
      expect(detail.body.notes).toHaveLength(1);

      const customer = await submit();
      expect(JSON.stringify(customer.body)).not.toContain('Updated');

      expect((await request(app).delete(`${base}/${created.body.noteId}`).set(staff)).status).toBe(204);
      expect((await request(app).delete(`${base}/${created.body.noteId}`).set(staff)).status).toBe(404);
    });

    it('links a fulfilled request to an existing catalog product', async () => {
      const db = await getDatabase();
      await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (1, ?)', ['Sup']);
      await db.run(
        'INSERT INTO products (product_id, supplier_id, name, price, sku, unit) VALUES (5, 1, ?, 10, ?, ?)',
        ['Drill', 'SKU1', 'piece'],
      );
      const r = await createRequest();
      const link = (productId: unknown) =>
        request(app).put(`/requests/${r.productRequestId}/product`).set(staff).send({ productId });

      expect((await link(5)).status).toBe(409);
      for (const status of ['reviewing', 'approved', 'fulfilled']) {
        await request(app).put(`/requests/${r.productRequestId}/status`).set(staff).send({ status });
      }
      expect((await link(999)).status).toBe(400);
      expect((await link('x')).status).toBe(400);
      const ok = await link(5);
      expect(ok.status).toBe(200);
      expect(ok.body.productId).toBe(5);
      const detail = await request(app).get(`/requests/${r.productRequestId}`).set(staff);
      expect(detail.body.productId).toBe(5);
    });
  });
});

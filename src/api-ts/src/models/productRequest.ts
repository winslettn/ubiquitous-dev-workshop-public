/**
 * @swagger
 * components:
 *   securitySchemes:
 *     StaffToken:
 *       type: http
 *       scheme: bearer
 *       description: >
 *         Shared staff secret supplied as `Authorization: Bearer <token>`. The server compares it
 *         with the STAFF_API_TOKEN environment variable. If STAFF_API_TOKEN is not configured all
 *         staff endpoints are rejected.
 *   schemas:
 *     ProductRequestInput:
 *       type: object
 *       required:
 *         - contactEmail
 *         - itemName
 *         - description
 *       properties:
 *         contactEmail:
 *           type: string
 *           format: email
 *           maxLength: 254
 *         itemName:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *           maxLength: 2000
 *         preferredBrandModel:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *         targetPrice:
 *           type: number
 *           minimum: 0
 *           nullable: true
 *           description: Optional target price, a non-negative number
 *     ProductRequestConfirmation:
 *       type: object
 *       properties:
 *         reference:
 *           type: string
 *           example: PR-1A2B3C4D
 *         message:
 *           type: string
 *           description: Confirmation text. It makes no promise of sale, availability, fulfillment or timing.
 *     ProductRequestNote:
 *       type: object
 *       properties:
 *         noteId:
 *           type: integer
 *         productRequestId:
 *           type: integer
 *         note:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *     ProductRequest:
 *       type: object
 *       description: Staff view of a product request. Internal notes are never returned to customers.
 *       properties:
 *         productRequestId:
 *           type: integer
 *         reference:
 *           type: string
 *         contactEmail:
 *           type: string
 *         itemName:
 *           type: string
 *         description:
 *           type: string
 *         preferredBrandModel:
 *           type: string
 *           nullable: true
 *         targetPrice:
 *           type: number
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [new, reviewing, approved, declined, fulfilled]
 *         productId:
 *           type: integer
 *           nullable: true
 *           description: Catalog product linked to this (fulfilled) request
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         notes:
 *           type: array
 *           description: Internal staff notes (only included on single-request reads)
 *           items:
 *             $ref: '#/components/schemas/ProductRequestNote'
 */
export const PRODUCT_REQUEST_STATUSES = [
  'new',
  'reviewing',
  'approved',
  'declined',
  'fulfilled',
] as const;

export type ProductRequestStatus = (typeof PRODUCT_REQUEST_STATUSES)[number];

/**
 * Allowed staff status transitions. `fulfilled` is terminal.
 */
export const PRODUCT_REQUEST_TRANSITIONS: Record<ProductRequestStatus, ProductRequestStatus[]> = {
  new: ['reviewing', 'declined'],
  reviewing: ['approved', 'declined'],
  approved: ['fulfilled', 'declined'],
  declined: ['reviewing'],
  fulfilled: [],
};

export interface ProductRequestInput {
  contactEmail: string;
  itemName: string;
  description: string;
  preferredBrandModel?: string | null;
  targetPrice?: number | null;
}

export interface ProductRequestNote {
  noteId: number;
  productRequestId: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  productRequestId: number;
  reference: string;
  contactEmail: string;
  itemName: string;
  description: string;
  preferredBrandModel: string | null;
  targetPrice: number | null;
  status: ProductRequestStatus;
  productId: number | null;
  createdAt: string;
  updatedAt: string;
  notes?: ProductRequestNote[];
}

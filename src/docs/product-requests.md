# Product Requests

Customers can ask for products that are not in the catalog, and staff review those requests. No customer account is needed to submit a request.

## Customer flow

- The request form is at the bottom of the Products page (`ProductRequestForm`).
- Required: contact email (valid format), item name, description. Optional: preferred brand/model, target price (non-negative number).
- `POST /api/product-requests` returns `{ reference, message }` only (reference looks like `PR-1A2B3C4D`).
- The confirmation makes no promise of sale, availability, fulfillment, or timing.

## Staff flow

- Queue UI: `/admin/product-requests` (Admin menu > Product Requests). Staff enter the staff token, which is kept in `sessionStorage` for the tab.
- Staff can filter and view requests, change status, manage internal notes, and link a fulfilled request to a catalog product.
- Notes are never returned from the public endpoint.

### Authorization

All staff endpoints are enforced server-side by `requireStaff` (`api-ts/src/utils/staffAuth.ts`):

- Send `Authorization: ******; the token is compared (constant time) with the `STAFF_API_TOKEN` environment variable.
- Missing/malformed header, or `STAFF_API_TOKEN` unset: `401`. Wrong token: `403`.
- The frontend `isAdmin` check only hides the page and grants no API access.

### Status workflow

| From | Allowed next |
| --- | --- |
| `new` | `reviewing`, `declined` |
| `reviewing` | `approved`, `declined` |
| `approved` | `fulfilled`, `declined` |
| `declined` | `reviewing` |
| `fulfilled` | (terminal) |

Invalid transitions return `409`.

### Linking a product

Create the product through the existing product workflow (Admin > Manage Products), mark the request `fulfilled`, then `PUT /api/product-requests/{id}/product` with `{ "productId": <id> }`. The product must exist (otherwise `400`) and the request must be fulfilled (otherwise `409`). Deleting the product clears the link.

## API summary

| Method and path | Access | Purpose |
| --- | --- | --- |
| `POST /api/product-requests` | public | Submit a request |
| `GET /api/product-requests[?status=]` | staff | Queue |
| `GET /api/product-requests/{id}` | staff | Request with notes and linked product |
| `PUT /api/product-requests/{id}/status` | staff | Change status |
| `PUT /api/product-requests/{id}/product` | staff | Link catalog product |
| `POST /api/product-requests/{id}/notes` | staff | Add note |
| `PUT /api/product-requests/{id}/notes/{noteId}` | staff | Update note |
| `DELETE /api/product-requests/{id}/notes/{noteId}` | staff | Delete note |

Full request/response schemas are in Swagger (`/api-docs`) and `api-ts/api-swagger.json`.

## Data model

Migration `database/migrations/003_add_product_requests.sql` adds `product_requests` (unique `reference`, `status` CHECK, nullable `product_id` FK with `ON DELETE SET NULL`) and `product_request_notes` (cascade-deleted with the request).

## Configuration and tests

- Set `STAFF_API_TOKEN` on the API.
- API/repository tests: `npx vitest run` in `api-ts`.
- Frontend component tests: `npm run test:unit` in `frontend`.

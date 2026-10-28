-- Migration 003: Add customer product requests and internal staff notes

CREATE TABLE product_requests (
    product_request_id INTEGER PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    contact_email TEXT NOT NULL,
    item_name TEXT NOT NULL,
    description TEXT NOT NULL,
    preferred_brand_model TEXT,
    target_price REAL CHECK (target_price IS NULL OR target_price >= 0),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'approved', 'declined', 'fulfilled')),
    product_id INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
);

CREATE INDEX idx_product_requests_status ON product_requests(status);

CREATE INDEX idx_product_requests_product_id ON product_requests(product_id);

CREATE TABLE product_request_notes (
    note_id INTEGER PRIMARY KEY,
    product_request_id INTEGER NOT NULL,
    note TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_request_id) REFERENCES product_requests(product_request_id) ON DELETE CASCADE
);

CREATE INDEX idx_product_request_notes_request_id ON product_request_notes(product_request_id)

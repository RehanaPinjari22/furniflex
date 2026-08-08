# FurniFlex — Furniture Rental Web Application

A full-stack furniture rental platform built as a college final-year project. Users
can browse furniture across 9 categories, rent items on Monthly / Quarterly / Yearly
plans, manage a cart, check out with a simulated Card/UPI/GPay QR payment step, and
view order history. Admins get a full CRUD panel for products, categories, orders
and users.

- **Frontend:** React (Vite) + Material UI, INR pricing
- **Backend:** Python 3.12 + FastAPI, JWT auth
- **Database:** PostgreSQL (via Docker Compose)

## Project Structure

```
furniflex/
├── backend/
│   ├── app/
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── routers/      # FastAPI route handlers (auth, products, cart, orders, admin...)
│   │   ├── core/         # security (JWT/password hashing), auth dependencies
│   │   ├── config.py     # environment-based settings + static/image paths
│   │   ├── database.py   # SQLAlchemy engine/session
│   │   ├── seed.py       # seeds categories, rental plans, ~63 products, demo users
│   │   └── main.py       # FastAPI app entrypoint, mounts /static
│   ├── static/images/    # product & category images, one subfolder per category slug
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/   # layout, product, admin, checkout, common components
│   │   ├── pages/        # route-level pages (incl. pages/admin)
│   │   ├── routes/        # AppRoutes.jsx route table
│   │   ├── services/      # axios API client modules
│   │   ├── context/       # AuthContext, CartContext, ThemeModeContext
│   │   └── theme/         # MUI theme (amber/cream palette, light + dark)
│   └── package.json
└── docker-compose.yml     # PostgreSQL + backend
```

## Getting Started

### 1. Start PostgreSQL + Backend (Docker)

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` and the FastAPI backend on
`http://localhost:8000`, automatically seeding the database on first run
(9 categories, ~63 products, 3 rental plans, 1 admin + 1 demo user).

> If you change `backend/app/seed.py` (categories/products) or add columns to a
> model after the database already has data, the seed script won't re-run (it
> skips once categories exist) and `create_all()` won't alter existing tables.
> Reset with `docker compose down -v && docker compose up -d --build`.

API docs (Swagger UI): **http://localhost:8000/docs**

### 2. Start the Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults already point to http://localhost:8000/api
npm run dev
```

App runs at **http://localhost:5173**.

### Running the backend without Docker

```bash
cd backend
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Point DATABASE_URL at your own Postgres instance, or copy .env.example -> .env
python -m app.seed              # seed the database (safe to re-run, skips if already seeded)
uvicorn app.main:app --reload
```

## Demo Accounts

| Role     | Email                 | Password   |
|----------|------------------------|-----------|
| Admin    | admin@furniflex.com    | Admin@123 |
| Customer | demo@furniflex.com     | Demo@123  |

Or register a new account from the app.

## Key Features

- Browse 9 furniture categories (Bedroom, BHK Combos, Living Room, Steal Deals,
  Storage, Kids, Study, Dining, Luxury)
- Global search (navbar search bar → `/search`) across all categories, plus
  per-category search — both with category/price filters and sort
- Monthly / Quarterly / Yearly rental plans with automatic discount pricing
- Cart, checkout with a simulated payment step (Card / UPI / GPay QR), order history
- User profile management
- Light/dark mode toggle (navbar icon), persisted in `localStorage`, defaults to
  the OS preference on first visit
- Admin panel: dashboard stats, full CRUD for products & categories (with image
  upload), order status management, user listing

## Payment (demo only)

Checkout includes a payment method step (Card, UPI, GPay QR) purely for demo
realism — **no real payment processing is wired up**, nothing is charged, and no
card data is stored (only a masked reference like "Card ending 1234" or the UPI ID
is saved against the order). This is intentional for a college project; do not
connect real payment credentials to this form.

To use a real GPay QR image instead of the placeholder icon, drop your QR code
image at `frontend/src/assets/gpay-qr.png` and update the placeholder `Box` in
`frontend/src/components/checkout/PaymentMethodSelector.jsx` (the `GPAY_QR` branch)
to render an `<img>` with that source.

## Image Storage & Admin Uploads

Product and category images are stored **locally on disk**, not hotlinked —
organized one subfolder per category:

```
backend/static/images/
  bedroom/       img-1.jpg, img-2.jpg, ...
  bhk-combos/
  living-room/
  steal-deals/
  storage/
  kids/
  study/
  dining/
  luxury/
```

They're served by FastAPI at `http://localhost:8000/static/images/<slug>/<file>`
(mounted in `backend/app/main.py`). The frontend resolves stored paths like
`/static/images/bedroom/img-1.jpg` against the backend origin via
`resolveImageUrl()` in `frontend/src/services/api.js`.

**Admin uploads:** in the Admin Panel → Products / Categories forms, click the
image tile to upload a file (jpg/png/webp/gif, max 5MB). It's sent to
`POST /api/admin/upload-image` (admin-only), saved into
`static/images/<category-slug>/<uuid>.<ext>`, and the returned URL is attached
to the product/category automatically — no manual URL pasting needed. Product
forms support multiple images (with delete buttons); category forms take one
cover image. Uploading requires a category to be selected first (products) or
the slug field to be filled in (categories), since that's the folder name.

When running via Docker, `backend/static` is bind-mounted into the container
(see `docker-compose.yml`), so uploads land directly in your local
`backend/static/images/` folder and persist across container restarts.

## Notes

- Prices are in INR (₹) throughout.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import IMAGES_DIR, STATIC_DIR, settings
from app.database import Base, engine
from app.routers import admin, auth, cart, categories, orders, products, rental_plans, users

Base.metadata.create_all(bind=engine)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="FurniFlex API",
    description="REST API for the FurniFlex furniture rental platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Category/product images: seeded at build time, admin-uploaded at runtime.
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(rental_plans.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok"}

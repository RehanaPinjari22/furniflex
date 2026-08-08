"""
Seeds the database with rental plans, categories, ~63 demo products,
one admin account and one demo customer account.

Run with: python -m app.seed
Safe to re-run — it skips seeding if categories already exist.
"""

from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models.category import Category
from app.models.product import Product
from app.models.rental_plan import RentalPlan
from app.models.user import User

# Demo images live under backend/static/images/<category-slug>/img-N.jpg and are
# served at /static/images/<category-slug>/img-N.jpg (see main.py's static mount).
# Admin-uploaded images land in the same per-category folders (see routers/admin.py).
CATEGORY_IMAGE_FILES: dict[str, list[str]] = {
    "Bedroom": [f"img-{i}.jpg" for i in range(1, 7)],
    "BHK Combos": [f"img-{i}.jpg" for i in range(1, 7)],
    "Living Room": [f"img-{i}.jpg" for i in range(1, 7)],
    "Steal Deals": [f"img-{i}.jpg" for i in range(1, 7)],
    "Storage": [f"img-{i}.jpg" for i in range(1, 7)],
    "Kids": [f"img-{i}.jpg" for i in range(1, 7)],
    "Study": [f"img-{i}.jpg" for i in range(1, 7)],
    "Dining": [f"img-{i}.jpg" for i in range(1, 7)],
    "Luxury": [f"img-{i}.jpg" for i in range(1, 6)],
}


def _local_image(slug: str, filename: str) -> str:
    return f"/static/images/{slug}/{filename}"


def _images_for_category(category_name: str, slug: str, index: int, count: int = 2) -> list[str]:
    files = CATEGORY_IMAGE_FILES[category_name]
    return [_local_image(slug, files[(index + i) % len(files)]) for i in range(count)]


# (name, monthly_price_inr, description)
CATEGORY_PRODUCTS: dict[str, list[tuple[str, int, str]]] = {
    "Bedroom": [
        ("Queen Bed with Storage", 1499, "Solid engineered-wood queen bed with hydraulic storage, includes a plush headboard for extra comfort."),
        ("King Size Bed", 1899, "Spacious king-size bed frame with a sturdy build, perfect for large bedrooms."),
        ("Bedside Table", 399, "Compact bedside table with a drawer and open shelf, finished in warm walnut."),
        ("Wooden Wardrobe 3-Door", 1299, "3-door wardrobe with hanging rails, shelves and a full-length mirror."),
        ("Dressing Table with Mirror", 799, "Elegant dressing table with a large mirror and multiple storage drawers."),
        ("Bunk Bed", 1599, "Space-saving bunk bed with sturdy metal frame and safety rails, ideal for shared rooms."),
        ("Bedroom Bench", 549, "Cushioned bench for the foot of the bed, adds a touch of luxury to any bedroom."),
        ("Chest of Drawers", 899, "5-drawer chest offering ample storage for clothes and accessories."),
    ],
    "BHK Combos": [
        ("1BHK Starter Combo", 4999, "Complete furniture set for a 1BHK — bed, wardrobe, sofa, dining table and TV unit."),
        ("2BHK Complete Combo", 8999, "Fully furnish a 2BHK home with beds, wardrobes, living room and dining furniture."),
        ("3BHK Premium Combo", 13999, "Premium furniture combo covering all bedrooms, living and dining areas of a 3BHK."),
        ("Bachelor Studio Combo", 3499, "Compact combo designed for studio apartments — bed, desk, wardrobe and mini sofa."),
        ("Newlywed Combo Pack", 6499, "Curated combo with a queen bed, wardrobe, dining set and living room essentials."),
        ("Work-From-Home Combo", 2999, "Ergonomic study desk, chair, bookshelf and storage unit bundled for home offices."),
        ("Compact 1BHK Combo", 4499, "Space-efficient combo tailored for compact 1BHK apartments."),
        ("Family 2BHK Combo", 9499, "Spacious combo with kids furniture, master bedroom and living room sets."),
    ],
    "Living Room": [
        ("3-Seater Sofa", 1699, "Comfortable fabric 3-seater sofa with cushioned armrests and durable upholstery."),
        ("L-Shaped Sectional Sofa", 2499, "Large L-shaped sectional sofa, perfect for spacious living rooms and family time."),
        ("Recliner Chair", 1299, "Single-seat manual recliner with a footrest for ultimate relaxation."),
        ("Coffee Table", 599, "Modern wooden coffee table with a lower storage shelf."),
        ("TV Entertainment Unit", 899, "Wall-style TV unit with storage cabinets for set-top boxes and accessories."),
        ("Bookshelf", 499, "5-tier open bookshelf, great for books, decor and plants."),
        ("Accent Armchair", 999, "Stylish accent armchair to complement any living room decor."),
        ("Center Rug & Table Set", 749, "Coffee table bundled with a soft area rug for a cozy living space."),
    ],
    "Steal Deals": [
        ("Clearance Sofa Set", 999, "Gently refurbished 3-seater sofa set at a steal price, limited stock."),
        ("Refurbished Dining Table", 799, "Quality-checked 4-seater dining table, refurbished and ready to use."),
        ("Budget Bed Frame", 599, "No-frills sturdy bed frame at an unbeatable monthly rate."),
        ("Discounted Wardrobe", 699, "2-door wardrobe available at a special clearance price."),
        ("Last-Piece Recliner", 899, "Single last-piece recliner chair, heavily discounted."),
        ("Value Study Desk", 349, "Compact study desk offered at our best value pricing."),
        ("Sale Bookshelf", 299, "3-tier bookshelf at a steal-deal monthly price."),
    ],
    "Storage": [
        ("Modular Wardrobe", 999, "Customizable modular wardrobe with adjustable shelves and drawers."),
        ("Shoe Rack", 349, "Multi-layer shoe rack with a bench top, fits up to 18 pairs."),
        ("Storage Cabinet", 599, "Multi-purpose storage cabinet with lockable doors."),
        ("Utility Cabinet", 449, "Compact utility cabinet for storing household essentials."),
        ("Bookshelf Storage Unit", 499, "Combination bookshelf and storage unit with mixed open/closed sections."),
        ("Under-bed Storage Box", 249, "Rolling under-bed storage box, maximizes hidden storage space."),
        ("Multi-purpose Rack", 379, "Sturdy metal rack for kitchen, garage or balcony storage."),
    ],
    "Kids": [
        ("Kids Study Table", 449, "Colorful adjustable-height study table designed for children."),
        ("Bunk Bed for Kids", 1399, "Fun and safe bunk bed with guard rails and a sturdy ladder."),
        ("Toy Storage Unit", 349, "Bright toy storage unit with bins to keep the playroom tidy."),
        ("Kids Wardrobe", 799, "Compact wardrobe sized perfectly for a child's room."),
        ("Kids Bean Bag", 299, "Soft and durable bean bag in fun colors for kids' rooms."),
        ("Kids Bed with Rails", 999, "Single bed with safety rails, designed for young children."),
        ("Kids Bookshelf", 349, "Low-height bookshelf so kids can reach their favorite books."),
    ],
    "Study": [
        ("Study Table with Drawers", 549, "Spacious study table with 3 drawers for stationery and files."),
        ("Ergonomic Office Chair", 699, "Adjustable-height ergonomic chair with lumbar support for long work hours."),
        ("Bookshelf", 449, "Tall 6-shelf bookshelf, ideal for books and study material."),
        ("Computer Table", 599, "Study table with a keyboard tray and CPU stand, built for desktop setups."),
        ("Study Lamp Desk Set", 299, "Desk bundled with an adjustable LED study lamp."),
        ("L-Shaped Study Desk", 899, "Large L-shaped desk offering ample workspace for study or WFH."),
    ],
    "Dining": [
        ("4-Seater Dining Set", 1199, "Elegant 4-seater dining table set with cushioned chairs."),
        ("6-Seater Dining Set", 1799, "Spacious 6-seater dining set, perfect for family gatherings."),
        ("Dining Bench", 599, "Wooden dining bench that pairs well with any dining table."),
        ("Bar Stool Set", 699, "Set of 2 adjustable-height bar stools for kitchen counters."),
        ("Crockery Unit", 899, "Glass-front crockery unit for elegant dinnerware display."),
        ("Round Dining Table", 999, "Compact round dining table, great for small families."),
    ],
    "Luxury": [
        ("Premium Leather Sofa", 3499, "Genuine leather 3-seater sofa with premium stitching and comfort."),
        ("Designer King Bed", 3999, "Designer upholstered king bed with a tufted headboard."),
        ("Luxury Recliner Set", 4499, "Set of 2 premium power recliners with USB charging ports."),
        ("Chandelier Dining Set", 5299, "8-seater dining set paired with an elegant chandelier."),
        ("Premium Wardrobe", 2999, "4-door premium wardrobe with soft-close hinges and mirror panels."),
        ("Luxury Lounge Chair", 2499, "Designer lounge chair, a statement piece for any living room."),
    ],
}

CATEGORY_META = {
    "Bedroom": "Beds, wardrobes and everything for a restful bedroom.",
    "BHK Combos": "Complete furniture combos for 1BHK, 2BHK and 3BHK homes.",
    "Living Room": "Sofas, recliners and decor to furnish your living room.",
    "Steal Deals": "Refurbished and clearance furniture at unbeatable prices.",
    "Storage": "Wardrobes, racks and cabinets to organize your space.",
    "Kids": "Safe, fun and functional furniture for children's rooms.",
    "Study": "Desks, chairs and shelves for productive study or work-from-home.",
    "Dining": "Dining tables, chairs and sets for every family size.",
    "Luxury": "Premium, designer furniture for a touch of luxury.",
}


def slugify(name: str) -> str:
    return name.lower().replace(" ", "-")


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Category).first():
            print("Database already seeded — skipping.")
            return

        # Rental plans
        plans = [
            RentalPlan(name="Monthly", duration_months=1, discount_percent=0),
            RentalPlan(name="Quarterly", duration_months=3, discount_percent=10),
            RentalPlan(name="Yearly", duration_months=12, discount_percent=25),
        ]
        db.add_all(plans)
        db.flush()

        # Categories
        categories: dict[str, Category] = {}
        for name, description in CATEGORY_META.items():
            slug = slugify(name)
            cover_file = CATEGORY_IMAGE_FILES[name][0]
            category = Category(
                name=name,
                slug=slug,
                description=description,
                image_url=_local_image(slug, cover_file),
            )
            db.add(category)
            categories[name] = category
        db.flush()

        # Products
        product_count = 0
        for category_name, items in CATEGORY_PRODUCTS.items():
            category = categories[category_name]
            for position, (name, monthly, description) in enumerate(items):
                quarterly = round(monthly * 3 * 0.90 / 10) * 10
                yearly = round(monthly * 12 * 0.75 / 10) * 10
                deposit = round(monthly * 2 / 10) * 10

                product = Product(
                    name=name,
                    category_id=category.id,
                    description=description,
                    image_urls=_images_for_category(category_name, category.slug, position * 2),
                    monthly_price=monthly,
                    quarterly_price=quarterly,
                    yearly_price=yearly,
                    deposit=deposit,
                    stock_qty=15,
                    is_featured=(position == 0),
                )
                db.add(product)
                product_count += 1

        # Users
        admin = User(
            name="Admin",
            email="admin@furniflex.com",
            hashed_password=hash_password("Admin@123"),
            is_admin=True,
        )
        demo_user = User(
            name="Demo Customer",
            email="demo@furniflex.com",
            hashed_password=hash_password("Demo@123"),
            phone="9876543210",
            address="221B Baker Street, Bengaluru, Karnataka",
            is_admin=False,
        )
        db.add_all([admin, demo_user])

        db.commit()
        print(f"Seeded {len(categories)} categories, {product_count} products, 3 rental plans, 2 users.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

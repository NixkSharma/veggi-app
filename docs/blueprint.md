# **App Name**: VeggieDash

## Core Features:

- Browse Vegetables: Display a curated list of available vegetables with clear images, descriptions, and pricing.
- Vegetable Search: Allow users to quickly find vegetables using a search bar and category filters.
- Cart Management: Enable users to add selected vegetables to a cart, adjust quantities, and view cart contents.
- Checkout Process: Implement a streamlined checkout process for users to confirm their order and provide delivery details. Use local storage instead of involving a backend server or database.
- User Registration: Register a new user (customer, vendor, or admin) with email, password, role, and other details.
- User Login: Authenticate a user and return a JWT token for session management.
- Get User Details: Fetch the authenticated user’s details (requires JWT token).
- List Products: List all products (with pagination, filters: category, price, stock).
- Get Product Details: Fetch details of a specific product.
- Add Product: Add a new product (vendor/admin only: name, price, stock, image_url).
- Update Product: Update a product (vendor/admin only: update price, stock, etc.).
- Get Cart: Get the user’s cart (requires authentication).
- Add to Cart: Add a product to the cart (product ID, quantity).
- Update Cart: Update the quantity of a product in the cart (product ID, new quantity).
- Create Order: Create a new order (from cart, includes customer details).
- List Orders: List the user’s orders (customer: own orders; vendor: assigned orders; admin: all orders).
- Get Order Details: Fetch details of a specific order (with items).
- Update Order Status: Update order status (vendor/admin: e.g., “pending” to “shipped”).
- List Vendor Products: List the vendor’s products (with stock levels).
- Update Product Stock: Update stock for a product (vendor only).
- Real-time Order Updates: WebSocket/polling endpoint for real-time order status updates.
- Find Nearby Vendors: Find vendors/stores near the user’s location (using Google Maps API).
- Get User Profile: Fetch the user’s profile details.
- Update User Profile: Update the user’s profile (e.g., name, address, phone).

## Style Guidelines:

- Primary color: Fresh green (#4CAF50) to evoke a sense of freshness and health.
- Secondary color: Earthy brown (#795548) for a natural and grounded feel.
- Accent: Orange (#FF9800) to highlight key elements like CTAs and sale prices.
- Clean and readable typography that aligns with the simplicity of the website. A sans-serif font should provide a contemporary and easy-to-read interface, ensuring the focus remains on the vegetables being sold.
- Simple and recognizable icons for navigation, product categories, and user actions.
- Clean, modern layout with a focus on product imagery and easy navigation.
- Subtle animations and transitions to enhance user experience without being distracting.
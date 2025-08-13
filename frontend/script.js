// E-commerce Product Catalog JavaScript

class EcommerceApp {
    constructor() {
        this.products = [];
        this.categories = [];
        this.cart = this.loadCart();
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.filteredProducts = [];
        this.currentProduct = null;
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.updateCartUI();
        this.showSection('products');
        this.renderProducts();
        this.renderCategories();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });

        // Filter event listeners
        document.querySelectorAll('input[name="categoryFilter"]').forEach(radio => {
            radio.addEventListener('change', () => this.applyFilters());
        });

        document.querySelectorAll('input[name="ratingFilter"]').forEach(radio => {
            radio.addEventListener('change', () => this.applyFilters());
        });

        document.getElementById('minPrice').addEventListener('input', () => this.applyFilters());
        document.getElementById('maxPrice').addEventListener('input', () => this.applyFilters());

        // Sort functionality
        document.getElementById('sortSelect').addEventListener('change', () => this.sortProducts());

        // Enter key for search
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchProducts(e.target.value);
            }
        });
    }

    loadSampleData() {
        // Sample products data
        this.products = [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
                price: 99.99,
                originalPrice: 129.99,
                category: "electronics",
                rating: 4.5,
                reviews: 1250,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
                inStock: true,
                featured: true,
                badges: ["sale", "featured"]
            },
            {
                id: 2,
                name: "Smartphone Case",
                description: "Durable protective case for smartphones with wireless charging compatibility.",
                price: 24.99,
                category: "electronics",
                rating: 4.2,
                reviews: 890,
                image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
                inStock: true,
                badges: ["new"]
            },
            {
                id: 3,
                name: "Cotton T-Shirt",
                description: "Comfortable 100% cotton t-shirt available in multiple colors and sizes.",
                price: 19.99,
                category: "clothing",
                rating: 4.0,
                reviews: 456,
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
                inStock: true,
                badges: []
            },
            {
                id: 4,
                name: "Running Shoes",
                description: "Lightweight running shoes with advanced cushioning technology.",
                price: 89.99,
                originalPrice: 109.99,
                category: "clothing",
                rating: 4.7,
                reviews: 2100,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
                inStock: true,
                badges: ["sale"]
            },
            {
                id: 5,
                name: "Coffee Maker",
                description: "Programmable coffee maker with thermal carafe and auto-brew feature.",
                price: 79.99,
                category: "home",
                rating: 4.3,
                reviews: 678,
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
                inStock: true,
                badges: []
            },
            {
                id: 6,
                name: "Indoor Plant Pot",
                description: "Ceramic plant pot with drainage system, perfect for indoor plants.",
                price: 15.99,
                category: "home",
                rating: 4.1,
                reviews: 234,
                image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
                inStock: true,
                badges: []
            },
            {
                id: 7,
                name: "Programming Book",
                description: "Complete guide to modern web development with practical examples.",
                price: 39.99,
                category: "books",
                rating: 4.8,
                reviews: 1890,
                image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop",
                inStock: true,
                badges: ["featured"]
            },
            {
                id: 8,
                name: "Laptop Stand",
                description: "Adjustable aluminum laptop stand for better ergonomics and cooling.",
                price: 49.99,
                category: "electronics",
                rating: 4.4,
                reviews: 567,
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
                inStock: true,
                badges: []
            },
            {
                id: 9,
                name: "Yoga Mat",
                description: "Non-slip yoga mat with extra cushioning for comfortable practice.",
                price: 29.99,
                category: "clothing",
                rating: 4.6,
                reviews: 789,
                image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
                inStock: true,
                badges: ["new"]
            },
            {
                id: 10,
                name: "Fiction Novel",
                description: "Bestselling fiction novel with compelling characters and plot twists.",
                price: 14.99,
                category: "books",
                rating: 4.2,
                reviews: 3456,
                image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
                inStock: true,
                badges: []
            },
            {
                id: 11,
                name: "Wireless Mouse",
                description: "Ergonomic wireless mouse with precision tracking and long battery life.",
                price: 34.99,
                category: "electronics",
                rating: 4.3,
                reviews: 890,
                image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
                inStock: true,
                badges: []
            }
        ];

        // Sample categories
        this.categories = [
            {
                id: 'electronics',
                name: 'Electronics',
                description: 'Latest gadgets and electronic devices',
                image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
                count: this.products.filter(p => p.category === 'electronics').length
            },
            {
                id: 'clothing',
                name: 'Clothing & Accessories',
                description: 'Fashion and lifestyle products',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
                count: this.products.filter(p => p.category === 'clothing').length
            },
            {
                id: 'home',
                name: 'Home & Garden',
                description: 'Everything for your home and garden',
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
                count: this.products.filter(p => p.category === 'home').length
            },
            {
                id: 'books',
                name: 'Books',
                description: 'Educational and entertainment books',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
                count: this.products.filter(p => p.category === 'books').length
            }
        ];

        this.filteredProducts = [...this.products];
    }

    loadCart() {
        const stored = localStorage.getItem('shoppingCart');
        return stored ? JSON.parse(stored) : [];
    }

    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
    }

    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showAlert(`${product.name} added to cart!`, 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCart();
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
                this.renderCart();
            }
        }
    }

    updateCartUI() {
        const cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = cartCount;

        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cartShipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;

        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.disabled = this.cart.length === 0;
    }

    searchProducts(query = '') {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        this.currentPage = 1;
        this.renderProducts();
    }

    applyFilters() {
        let filtered = [...this.products];

        // Category filter
        const selectedCategory = document.querySelector('input[name="categoryFilter"]:checked').value;
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Price filter
        const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
        const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
        filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);

        // Rating filter
        const selectedRating = document.querySelector('input[name="ratingFilter"]:checked').value;
        if (selectedRating !== 'all') {
            const minRating = parseFloat(selectedRating);
            filtered = filtered.filter(product => product.rating >= minRating);
        }

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
    }

    clearFilters() {
        document.getElementById('catAll').checked = true;
        document.getElementById('ratingAll').checked = true;
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('searchInput').value = '';
        
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.renderProducts();
    }

    sortProducts() {
        const sortBy = document.getElementById('sortSelect').value;
        
        switch (sortBy) {
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
        }

        this.renderProducts();
    }

    renderProducts() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        const grid = document.getElementById('productsGrid');
        const productCount = document.getElementById('productCount');

        productCount.textContent = this.filteredProducts.length;

        if (productsToShow.length === 0) {
            grid.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h5>No products found</h5>
                        <p>Try adjusting your search or filters</p>
                        <button class="btn btn-primary" onclick="ecommerceApp.clearFilters()">Clear Filters</button>
                    </div>
                </div>
            `;
            this.renderPagination();
            return;
        }

        grid.innerHTML = productsToShow.map(product => this.renderProductCard(product)).join('');
        this.renderPagination();
    }

    renderProductCard(product) {
        const badges = product.badges?.map(badge => 
            `<span class="badge badge-${badge} position-absolute top-0 start-0 m-2">${badge}</span>`
        ).join('') || '';

        const originalPrice = product.originalPrice ? 
            `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : '';

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card product-card h-100" onclick="ecommerceApp.showProductModal(${product.id})">
                    <div class="position-relative">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        ${badges}
                    </div>
                    <div class="product-info">
                        <h5 class="product-title">${product.name}</h5>
                        <div class="product-rating mb-2">
                            <span class="rating-stars">${this.renderStars(product.rating)}</span>
                            <span class="rating-count">(${product.reviews})</span>
                        </div>
                        <div class="product-price mb-3">
                            $${product.price.toFixed(2)}
                            ${originalPrice}
                        </div>
                        <div class="product-actions" onclick="event.stopPropagation()">
                            <button class="btn btn-primary btn-add-cart" onclick="ecommerceApp.addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                            <button class="btn btn-quick-view" onclick="ecommerceApp.showProductModal(${product.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const pagination = document.getElementById('pagination');

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ecommerceApp.goToPage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="ecommerceApp.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ecommerceApp.goToPage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = this.categories.map(category => `
            <div class="col-lg-3 col-md-6 mb-4">
                <a href="#" class="category-card card h-100" onclick="ecommerceApp.filterByCategory('${category.id}')">
                    <img src="${category.image}" alt="${category.name}" class="category-image">
                    <div class="category-info">
                        <h5 class="category-title">${category.name}</h5>
                        <p class="category-count">${category.count} products</p>
                    </div>
                </a>
            </div>
        `).join('');
    }

    filterByCategory(categoryId) {
        document.getElementById(`cat${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}`).checked = true;
        this.applyFilters();
        this.showSection('products');
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">Your cart is empty</h5>
                    <p class="text-muted">Add some products to get started!</p>
                    <button class="btn btn-primary" onclick="ecommerceApp.showSection('products')">Continue Shopping</button>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h6 class="cart-item-title">${item.name}</h6>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="ecommerceApp.updateCartQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="ecommerceApp.updateCartQuantity(${item.id}, parseInt(this.value))" min="1">
                    <button class="quantity-btn" onclick="ecommerceApp.updateCartQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="btn btn-sm btn-outline-danger ms-3" onclick="ecommerceApp.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.currentProduct = product;

        document.getElementById('productModalTitle').textContent = product.name;
        document.getElementById('productModalName').textContent = product.name;
        document.getElementById('productModalImage').src = product.image;
        document.getElementById('productModalImage').alt = product.name;
        document.getElementById('productModalPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('productModalDescription').textContent = product.description;
        document.getElementById('productModalRating').innerHTML = `
            <span class="rating-stars">${this.renderStars(product.rating)}</span>
            <span class="rating-count">(${product.reviews} reviews)</span>
        `;
        document.getElementById('productQuantity').value = 1;

        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }

    addToCartFromModal() {
        if (this.currentProduct) {
            const quantity = parseInt(document.getElementById('productQuantity').value) || 1;
            this.addToCart(this.currentProduct.id, quantity);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
            modal.hide();
        }
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        document.getElementById(sectionId).style.display = 'block';

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Render section-specific content
        if (sectionId === 'cart') {
            this.renderCart();
        }
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alert);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }
}

// Global functions for HTML onclick events
function showSection(sectionId) {
    ecommerceApp.showSection(sectionId);
}

function searchProducts() {
    const query = document.getElementById('searchInput').value;
    ecommerceApp.searchProducts(query);
}

function applyFilters() {
    ecommerceApp.applyFilters();
}

function clearFilters() {
    ecommerceApp.clearFilters();
}

function sortProducts() {
    ecommerceApp.sortProducts();
}

// Initialize the app when the page loads
let ecommerceApp;
document.addEventListener('DOMContentLoaded', () => {
    ecommerceApp = new EcommerceApp();
});


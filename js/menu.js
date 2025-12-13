// Café de Olla Products - Matches Square catalog prices
const products = [
    {
        id: 1,
        name: "Coffee Bag 16 oz. / 40 servings",
        description: "Grandma Traditional Blend - Medium Roast, Sweet & Spicy",
        price: 34.99,
        image: "../images/coffee-bag-16oz.png",
        category: "coffee"
    },
    {
        id: 2,
        name: "Coffee Aluminum Can 8 oz. / 20 servings",
        description: "Grandma Traditional Blend - Medium Roast, Sweet & Spicy",
        price: 17.99,
        image: "../images/coffee-can-8oz.png",
        category: "coffee"
    },
    {
        id: 3,
        name: "6-Month Subscription - Coffee Bag 16 oz.",
        description: "Get 6 bags delivered monthly with 25% OFF! (Shipping NOT included)",
        price: 157.46,
        image: "../images/coffee-bag-16oz.png",
        category: "subscription"
    },
    {
        id: 4,
        name: "6-Month Subscription - Coffee Can 8 oz.",
        description: "Get 6 cans delivered monthly with 25% OFF! (Shipping NOT included)",
        price: 80.96,
        image: "../images/coffee-can-8oz.png",
        category: "subscription"
    },
    {
        id: 5,
        name: "Ingredients & Preparation Guide",
        description: "Learn about our premium ingredients and brewing instructions",
        price: 0,
        image: "../images/ingredients.png",
        category: "info",
        isInfo: true
    }
];

// Load products to page
function loadProducts(containerId, featured = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let productsToShow;
    if (featured) {
        // For homepage: show 2 regular coffee products + ingredients image (3 total)
        productsToShow = [
            products.find(p => p.id === 1), // Coffee Bag
            products.find(p => p.id === 2), // Coffee Can
            products.find(p => p.id === 5)  // Ingredients
        ].filter(Boolean);
    } else {
        // For menu page: show only regular products (no subscriptions, no ingredients)
        productsToShow = products.filter(p => p.category === 'coffee');
    }
    
    if (featured) {
        // Featured: Just show clickable images
        container.innerHTML = productsToShow.map(product => `
            <a href="menu.html" class="featured-product-link">
                <img src="${product.image}" alt="${product.name}" class="featured-product-image">
            </a>
        `).join('');
    } else {
        // Menu: Show full product cards with link to detail page
        container.innerHTML = productsToShow.map(product => `
            <div class="product-card">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </a>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-primary">
                        View Details
                    </a>
                    <button class="btn btn-secondary" onclick="addToCart(${product.id})" style="margin-top: 0.5rem;">
                        Quick Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Cart management
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.isInfo) return;
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(cart);
    
    // Show toast notification
    showToast(`${product.name} added to cart!`);
}

function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach(el => el.textContent = count);
}

function removeFromCart(productId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    saveCart(filteredCart);
    
    // Reload cart display
    if (typeof displayCart === 'function') {
        displayCart();
    }
}

function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            
            // Reload cart display
            if (typeof displayCart === 'function') {
                displayCart();
            }
        }
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Load featured products on homepage
    if (document.getElementById('featured-products')) {
        loadProducts('featured-products', true);
    }
});
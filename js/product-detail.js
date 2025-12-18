// Product Detail Page JavaScript

// Get product ID from URL parameter
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

// Load product details
function loadProductDetail() {
    const productId = getProductIdFromURL();
    const product = products.find(p => p.id === productId);
    
    if (!product || product.isInfo) {
        window.location.href = 'menu.html';
        return;
    }
    
    // Update page content
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('total-price').textContent = `$${product.price.toFixed(2)}`;
    
    // Update description
    if (product.description) {
        document.getElementById('product-desc').textContent = product.description;
    }
}

// Quantity controls
function increaseQuantity() {
    const input = document.getElementById('quantity');
    const currentValue = parseInt(input.value);
    if (currentValue < 99) {
        input.value = currentValue + 1;
        updateTotalPrice();
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
        updateTotalPrice();
    }
}

// Update total price based on quantity
function updateTotalPrice() {
    const productId = getProductIdFromURL();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantity = parseInt(document.getElementById('quantity').value);
    const total = product.price * quantity;
    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
}

// Handle subscription radio change
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetail();
    
    // Subscription toggle
    const subscriptionRadio = document.getElementById('subscription-radio');
    const frequencySelect = document.getElementById('subscription-frequency');
    const purchaseRadios = document.querySelectorAll('input[name="purchase-type"]');
    
    purchaseRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'subscription') {
                frequencySelect.disabled = false;
            } else {
                frequencySelect.disabled = true;
            }
        });
    });
    
    // Quantity input change
    document.getElementById('quantity').addEventListener('input', updateTotalPrice);
});

// Add product to cart - simplified (no fulfillment type needed here)
function addProductToCart() {
    const productId = getProductIdFromURL();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantity = parseInt(document.getElementById('quantity').value);
    const isSubscription = document.querySelector('input[name="purchase-type"]:checked').value === 'subscription';
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity,
            isSubscription: isSubscription
            // Fulfillment type will be selected in the cart
        });
    }
    
    saveCart(cart);
    
    // Show success message
    showToast(`${quantity} x ${product.name} added to cart!`);
    
    // Redirect to cart after short delay
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
}

// Collapsible sections
function toggleSection(button) {
    button.classList.toggle('active');
    const content = button.nextElementSibling;
    content.classList.toggle('active');
}
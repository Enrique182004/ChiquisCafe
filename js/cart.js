// Display cart items
function displayCart() {
    const cart = getCart();
    const cartContent = document.getElementById('cart-content');
    const cartSummary = document.getElementById('cart-summary');
    const fulfillmentSection = document.getElementById('fulfillment-section');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some delicious items to get started!</p>
                <a href="menu.html" class="btn btn-primary">Browse Menu</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        fulfillmentSection.style.display = 'none';
        return;
    }
    
    // Show cart items
    cartContent.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <div class="item-total">
                        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                    <button class="btn btn-secondary" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `).join('')}
        </div>
    `;
    
    // Update summary
    const total = getCartTotal();
    document.getElementById('subtotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    cartSummary.style.display = 'block';
    fulfillmentSection.style.display = 'block';
}

// Handle fulfillment type changes
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    
    const fulfillmentRadios = document.querySelectorAll('input[name="fulfillment"]');
    const addressForm = document.getElementById('address-form');
    const pickupLocation = document.getElementById('pickup-location');
    
    fulfillmentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'PICKUP') {
                addressForm.classList.remove('active');
                pickupLocation.style.display = 'block';
                
                // Remove required from address fields
                addressForm.querySelectorAll('input').forEach(input => {
                    input.removeAttribute('required');
                });
            } else {
                addressForm.classList.add('active');
                pickupLocation.style.display = 'none';
                
                // Add required to address fields
                addressForm.querySelectorAll('input').forEach(input => {
                    input.setAttribute('required', 'required');
                });
            }
        });
    });
});

// Proceed to checkout
async function proceedToCheckout(event) {
    event.preventDefault();
    
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty! Add some coffee first 😊');
        return;
    }
    
    // Get fulfillment type
    const fulfillmentType = document.querySelector('input[name="fulfillment"]:checked').value;
    
    // Validate address if needed
    if (fulfillmentType !== 'PICKUP') {
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zipCode = document.getElementById('zipCode').value;
        
        if (!fullName || !phone || !email || !address || !city || !state || !zipCode) {
            showToast('⚠️ Please fill in all required address fields');
            return;
        }
    }
    
    // Get location for pickup
    const locationId = fulfillmentType === 'PICKUP' 
        ? document.getElementById('location').value 
        : 'LZ8GQYSRJ8QRV'; // Default to Cafe de Olla main location
    
    // Prepare order data
    const orderData = {
        cart: cart,
        fulfillmentType: fulfillmentType,
        locationId: locationId,
        customerInfo: fulfillmentType !== 'PICKUP' ? {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: {
                addressLine1: document.getElementById('address').value,
                locality: document.getElementById('city').value,
                administrativeDistrictLevel1: document.getElementById('state').value,
                postalCode: document.getElementById('zipCode').value,
                country: 'US'
            }
        } : null
    };
    
    // Show loading state
    const checkoutBtn = event.target;
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Processing...';
    
    try {
        // Send to backend to create Square order and payment link
        const response = await fetch('api/create-order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }
        
        const result = await response.json();
        
        if (result.success && result.paymentUrl) {
            // Clear cart
            localStorage.removeItem('cart');
            
            // Redirect to Square payment page
            window.location.href = result.paymentUrl;
        } else {
            throw new Error(result.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('⚠️ Error processing checkout. Please make sure your server is configured correctly.');
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Proceed to Checkout';
    }
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
    
    // Hide and remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}
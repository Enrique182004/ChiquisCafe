// Display cart items
function displayCart() {
    const cart = getCart();
    const cartContent = document.getElementById('cart-content');
    const cartSummary = document.getElementById('cart-summary');
    const fulfillmentSection = document.getElementById('fulfillment-section');
    const subscriptionOption = document.getElementById('subscription-option');
    
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
    
    // Check if cart has eligible items for subscription (regular coffee products only)
    const hasEligibleItems = cart.some(item => item.category === 'coffee');
    
    // Show/hide subscription option
    if (hasEligibleItems && subscriptionOption) {
        subscriptionOption.style.display = 'block';
    } else if (subscriptionOption) {
        subscriptionOption.style.display = 'none';
    }
    
    // Update summary
    updateCartSummary();
    
    cartSummary.style.display = 'block';
    fulfillmentSection.style.display = 'block';
    
    // Check delivery area and update options
    checkDeliveryArea();
}

// Update cart summary with subscription discount
function updateCartSummary() {
    const cart = getCart();
    const subscribeCheckbox = document.getElementById('subscribe-checkbox');
    const isSubscription = subscribeCheckbox && subscribeCheckbox.checked;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = isSubscription ? subtotal * 0.25 : 0;
    const total = subtotal - discount;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Show/hide discount row
    const discountRow = document.getElementById('discount-row');
    if (isSubscription && discountRow) {
        discountRow.style.display = 'flex';
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
}

// Add event listener for subscription checkbox
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    
    const subscribeCheckbox = document.getElementById('subscribe-checkbox');
    if (subscribeCheckbox) {
        subscribeCheckbox.addEventListener('change', updateCartSummary);
    }
    
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
    
    // Get subscription option
    const subscribeCheckbox = document.getElementById('subscribe-checkbox');
    const isSubscription = subscribeCheckbox && subscribeCheckbox.checked;
    
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
    
    // Apply subscription discount if checked
    let finalCart = cart;
    if (isSubscription) {
        finalCart = cart.map(item => ({
            ...item,
            price: item.price * 0.75, // Apply 25% discount
            isSubscription: true,
            subscriptionMonths: 6
        }));
    }
    
    // Prepare order data
    const orderData = {
        cart: finalCart,
        fulfillmentType: fulfillmentType,
        locationId: locationId,
        isSubscription: isSubscription,
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
        const response = await fetch('../api/create-order.php', {
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

// Check delivery area based on zip code
function checkDeliveryArea() {
    const deliveryArea = localStorage.getItem('deliveryArea');
    const userZipCode = localStorage.getItem('userZipCode');
    
    const pickupOption = document.querySelector('input[value="PICKUP"]');
    const deliveryOption = document.querySelector('input[value="DELIVERY"]');
    const shipmentOption = document.querySelector('input[value="SHIPMENT"]');
    
    if (deliveryArea === 'outside') {
        // Hide pickup and delivery options
        if (pickupOption && pickupOption.parentElement) {
            pickupOption.parentElement.style.display = 'none';
        }
        if (deliveryOption && deliveryOption.parentElement) {
            deliveryOption.parentElement.style.display = 'none';
        }
        
        // Select shipment by default
        if (shipmentOption) {
            shipmentOption.checked = true;
            // Trigger change event to show address form
            const event = new Event('change');
            shipmentOption.dispatchEvent(event);
        }
        
        // Add notification
        const fulfillmentOptions = document.querySelector('.fulfillment-options');
        if (fulfillmentOptions && !document.getElementById('zip-notice')) {
            const notice = document.createElement('div');
            notice.id = 'zip-notice';
            notice.style.cssText = 'background: #fff3cd; border: 2px solid #ffc107; padding: 1rem; border-radius: 10px; margin-bottom: 1rem; color: #856404;';
            notice.innerHTML = `
                <strong>📦 Shipping Only</strong><br>
                Pickup and delivery available in El Paso only (799xx).
            `;
            fulfillmentOptions.insertBefore(notice, fulfillmentOptions.firstChild);
        }
    }
}
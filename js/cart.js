// Display cart items with improved design - creates all elements from scratch
function displayCart() {
    const cart = getCart();
    const cartContent = document.getElementById('cart-content');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some delicious Café de Olla to your cart!</p>
                <a href="menu.html" class="btn btn-primary">Browse Menu</a>
            </div>
        `;
        return;
    }
    
    // Check if cart has eligible items for subscription
    const hasEligibleItems = cart.some(item => item.category === 'coffee');
    
    // Create complete cart layout with all sections
    cartContent.innerHTML = `
        <div class="cart-content-wrapper">
            <div class="cart-left-column">
                <!-- Cart Items -->
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                            
                            <div class="item-details-wrapper">
                                <div class="item-details">
                                    <h3>${item.name}</h3>
                                    <p class="item-price">$${item.price.toFixed(2)} each</p>
                                </div>
                                
                                <div class="item-controls">
                                    <div class="quantity-controls">
                                        <button onclick="updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
                                        <span>${item.quantity}</span>
                                        <button onclick="updateQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
                                    </div>
                                    <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Fulfillment Options -->
                <div class="fulfillment-options">
                    <h3>How would you like to receive your order?</h3>
                    <form id="fulfillment-form">
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="fulfillment" value="PICKUP" checked>
                                <span>🚗 Pickup - I'll pick it up at your location</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="fulfillment" value="DELIVERY">
                                <span>🚚 Local Delivery - Deliver to my address (El Paso area)</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="fulfillment" value="SHIPMENT">
                                <span>📦 Shipping - Ship to my address</span>
                            </label>
                        </div>

                        <!-- Location Selection for Pickup -->
                        <div class="form-group" id="pickup-location">
                            <label for="location">Pickup Location:</label>
                            <select id="location" name="location">
                                <option value="L6CGBKNZBHZX8">Cafe de Olla - Airport Pickup - 6701 Convair Rd</option>
                            </select>
                        </div>

                        <!-- Shipping/Delivery Form -->
                        <div class="shipping-form" id="address-form">
                            <div class="address-form-header">
                                <h4>📍 Where should we send your coffee?</h4>
                                <p class="form-subtitle">We'll deliver your delicious Café de Olla right to your door!</p>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="fullName">👤 Full Name</label>
                                    <input type="text" id="fullName" name="fullName" placeholder="John Doe">
                                </div>

                                <div class="form-group">
                                    <label for="phone">📞 Phone Number</label>
                                    <input type="tel" id="phone" name="phone" placeholder="(915) 555-1234">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="email">📧 Email Address</label>
                                <input type="email" id="email" name="email" placeholder="[email protected]">
                            </div>

                            <div class="form-group">
                                <label for="address">🏠 Street Address</label>
                                <input type="text" id="address" name="address" placeholder="123 Main Street, Apt 4B">
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="city">🌆 City</label>
                                    <input type="text" id="city" name="city" placeholder="El Paso">
                                </div>

                                <div class="form-group">
                                    <label for="state">📍 State</label>
                                    <input type="text" id="state" name="state" value="TX" placeholder="TX">
                                </div>

                                <div class="form-group">
                                    <label for="zipCode">📮 Zip Code</label>
                                    <input type="text" id="zipCode" name="zipCode" placeholder="79901">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Cart Summary Sidebar -->
            <div class="cart-summary">
                <h3>Order Summary</h3>
                
                <!-- Discount Code Section -->
                <div id="discount-code-section">
                    <label for="discount-code">🎟️ Have a discount code?</label>
                    <div class="discount-code-input-group">
                        <input type="text" id="discount-code" placeholder="Enter code" maxlength="20">
                        <button type="button" class="apply-code-btn" onclick="applyDiscountCode()">Apply</button>
                    </div>
                    <p class="discount-code-message" id="discount-message"></p>
                </div>
                
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span id="subtotal">$0.00</span>
                </div>
                <div class="summary-row" id="discount-row" style="display: none;">
                    <span>Discount:</span>
                    <span id="discount">-$0.00</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span id="total">$0.00</span>
                </div>
                <button class="btn btn-primary" onclick="proceedToCheckout(event)">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    `;
    
    // Now setup event listeners
    setupFulfillmentToggles();
    updateCartSummary();
    checkDeliveryArea();
}

// Discount code functionality (placeholder - no active codes yet)
let appliedDiscount = 0;
let discountCode = '';

function applyDiscountCode() {
    const codeInput = document.getElementById('discount-code');
    const code = codeInput.value.trim().toUpperCase();
    const messageEl = document.getElementById('discount-message');
    
    // Clear previous message
    messageEl.textContent = '';
    messageEl.className = 'discount-code-message';
    
    if (!code) {
        messageEl.textContent = 'Please enter a code';
        messageEl.classList.add('error');
        return;
    }
    
    // For now, no codes are active
    // In the future, you can add code validation here like:
    // const validCodes = {
    //     'WELCOME10': 0.10,  // 10% off
    //     'SAVE20': 0.20      // 20% off
    // };
    
    messageEl.textContent = 'Invalid code. No active discount codes at the moment.';
    messageEl.classList.add('error');
    appliedDiscount = 0;
    discountCode = '';
    updateCartSummary();
}

function setupFulfillmentToggles() {
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
}

// Update cart summary with discount code
function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Apply discount code if any
    const discount = subtotal * appliedDiscount;
    const total = subtotal - discount;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Show/hide discount row
    const discountRow = document.getElementById('discount-row');
    if (appliedDiscount > 0 && discountRow) {
        discountRow.style.display = 'flex';
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
}

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
    
    // Apply discount if code was applied
    let finalCart = cart;
    if (appliedDiscount > 0) {
        finalCart = cart.map(item => ({
            ...item,
            price: item.price * (1 - appliedDiscount)
        }));
    }
    
    // Prepare order data
    const orderData = {
        cart: finalCart,
        fulfillmentType: fulfillmentType,
        locationId: locationId,
        discountCode: discountCode || null,
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
});
<?php
/**
 * Square API Configuration for Chiquis Café de Olla
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://developer.squareup.com/
 * 2. Sign in with your Square account
 * 3. Click on "Applications" > Select or create your app
 * 4. Copy your credentials below
 * 
 * IMPORTANT SECURITY NOTES:
 * - NEVER share your access token publicly
 * - NEVER commit this file to public repositories
 * - Start with SANDBOX for testing, then switch to PRODUCTION
 */

// ==========================================
// STEP 1: CHOOSE YOUR ENVIRONMENT
// ==========================================
// Set to true for testing, false for live payments
define('USE_SANDBOX', true);

// ==========================================
// STEP 2: SANDBOX CREDENTIALS (For Testing)
// ==========================================
// Get these from: https://developer.squareup.com/apps > Your App > Sandbox > Credentials
define('SANDBOX_ACCESS_TOKEN', 'EAAAEAA2utjrlNYCqb0bWXxQsPR12evSvu0us0mFDzslteYZWeNwrsVLlj_-Cf7Q');
define('SANDBOX_APPLICATION_ID', 'sandbox-sq0idb-37fCFMXaBJ8sQNQqbomN7g');

// ==========================================
// STEP 3: PRODUCTION CREDENTIALS (For Live Payments)
// ==========================================
// Get these from: https://developer.squareup.com/apps > Your App > Production > Credentials
// ONLY add these when you're ready to accept real payments!
define('PRODUCTION_ACCESS_TOKEN', 'YOUR_PRODUCTION_ACCESS_TOKEN_HERE');
define('PRODUCTION_APPLICATION_ID', 'sqOidp-mbz7lgZz3XaHP6EZ2cUMfQ');

// ==========================================
// AUTO-CONFIGURATION (Don't modify below)
// ==========================================
if (USE_SANDBOX) {
    // Use Sandbox for testing
    define('SQUARE_ACCESS_TOKEN', SANDBOX_ACCESS_TOKEN);
    define('SQUARE_APPLICATION_ID', SANDBOX_APPLICATION_ID);
    define('SQUARE_API_URL', 'https://connect.squareupsandbox.com/v2');
    error_reporting(E_ALL); // Show errors during testing
    ini_set('display_errors', 1);
} else {
    // Use Production for live payments
    define('SQUARE_ACCESS_TOKEN', PRODUCTION_ACCESS_TOKEN);
    define('SQUARE_APPLICATION_ID', PRODUCTION_APPLICATION_ID);
    define('SQUARE_API_URL', 'https://connect.squareup.com/v2');
    error_reporting(0); // Hide errors in production
    ini_set('display_errors', 0);
}

// ==========================================
// STEP 4: YOUR WEBSITE URL
// ==========================================
// Update this to your actual domain (use https:// when SSL is enabled)
define('WEBSITE_URL', 'https://chiquiscuisine.com');

// ==========================================
// STEP 5: YOUR SQUARE LOCATION IDs
// ==========================================
// Get these from: https://squareup.com/dashboard/locations
// Click on each location to see its ID

// Main cafe location
define('LOCATION_MAIN', 'L5QHW4E621DZC');

// Cafe de Olla - Main pickup location
define('LOCATION_CAFE', 'LZ8GQYSRJ8QRV');

// Airport pickup location
define('LOCATION_AIRPORT', 'L6CGBKNZBHZX8');

/**
 * HOW TO GET YOUR LOCATION IDs:
 * 1. Go to https://squareup.com/dashboard
 * 2. Click on "Locations" in the left menu
 * 3. Click on a location
 * 4. The Location ID appears at the top of the page
 * 5. Copy each ID and paste above
 */

// ==========================================
// TESTING CHECKLIST
// ==========================================
/**
 * Before testing, verify:
 * ✅ USE_SANDBOX is set to true
 * ✅ SANDBOX_ACCESS_TOKEN is filled in
 * ✅ SANDBOX_APPLICATION_ID is filled in
 * ✅ Location IDs are correct
 * ✅ WEBSITE_URL matches your domain
 * 
 * Test with Square test card:
 * Card Number: 4111 1111 1111 1111
 * CVV: 111
 * Expiration: Any future date
 * Zip: 12345
 * 
 * After successful testing:
 * 1. Set USE_SANDBOX to false
 * 2. Fill in PRODUCTION credentials
 * 3. Test with a small real transaction
 * 4. Verify order appears in Square Dashboard
 */

// ==========================================
// PRODUCTION CHECKLIST
// ==========================================
/**
 * Before going live:
 * ✅ All sandbox tests passed
 * ✅ PRODUCTION_ACCESS_TOKEN is filled in
 * ✅ PRODUCTION_APPLICATION_ID is filled in
 * ✅ USE_SANDBOX is set to false
 * ✅ SSL certificate is installed (https://)
 * ✅ WEBSITE_URL uses https://
 * ✅ Test transaction completed successfully
 * ✅ Customer email confirmations working
 */
?>
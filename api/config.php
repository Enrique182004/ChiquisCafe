<?php
// Square API Configuration
// IMPORTANT: Replace these with your actual credentials from Square Developer Dashboard

define('SQUARE_ACCESS_TOKEN', 'YOUR_PRODUCTION_ACCESS_TOKEN_HERE');
define('SQUARE_APPLICATION_ID', 'sqOidp-mbz7lgZz3XaHP6EZ2cUMfQ');

// Square API endpoint
define('SQUARE_API_URL', 'https://connect.squareup.com/v2');

// Your website URL for redirects after payment
define('WEBSITE_URL', 'https://chiquiscuisine.com'); // Change to your actual domain

// Location IDs
define('LOCATION_MAIN', 'L5QHW4E621DZC');
define('LOCATION_CAFE', 'LZ8GQYSRJ8QRV');
define('LOCATION_AIRPORT', 'L6CGBKNZBHZX8');

// Enable error reporting for development (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
?>
# Chiquis Grandma Cuisine - Custom E-Commerce Website

This is a custom-built e-commerce website that integrates with Square's API for payment processing and order management.

## Features

- Custom product catalog
- Shopping cart with local storage
- Multiple fulfillment options (Pickup, Delivery, Shipping)
- Square payment integration
- Responsive design
- Clean, modern UI

## Setup Instructions

### 1. Upload Files to Bluehost

Upload all files to your Bluehost hosting account:
- Use FTP (FileZilla, Cyberduck) or Bluehost File Manager
- Upload to `/public_html/` directory (or your domain's root folder)

### 2. Configure Square API Credentials

Edit `api/config.php` and replace:

```php
define('SQUARE_ACCESS_TOKEN', 'YOUR_PRODUCTION_ACCESS_TOKEN_HERE');
```

With your actual Access Token from Square Developer Dashboard.

Also update:
```php
define('WEBSITE_URL', 'https://chiquiscuisine.com'); // Your actual domain
```

### 3. File Permissions

Make sure the API directory has proper permissions:
```bash
chmod 755 api/
chmod 644 api/config.php
chmod 644 api/create-order.php
```

### 4. Test in Sandbox Mode (Optional)

For testing, you can:
1. Use Square's Sandbox credentials first
2. Change `SQUARE_API_URL` to sandbox endpoint
3. Test with Square's test credit cards

### 5. Update Product Catalog

Edit `js/menu.js` to add/modify your products:

```javascript
const products = [
    {
        id: 1,
        name: "Product Name",
        description: "Description",
        price: 25.00,
        image: "image-url",
        category: "main"
    },
    // Add more products...
];
```

## File Structure

```
/public_html/
├── index.html          # Homepage
├── menu.html           # Products page
├── cart.html           # Shopping cart
├── thank-you.php       # Order confirmation
├── css/
│   └── style.css       # All styles
├── js/
│   ├── menu.js         # Product data & cart management
│   └── cart.js         # Cart page logic
└── api/
    ├── config.php      # Square credentials
    └── create-order.php # Square API integration
```

## How It Works

1. **Customer browses** products on your custom site
2. **Adds to cart** - stored in browser localStorage
3. **Selects fulfillment** option (Pickup/Delivery/Shipping)
4. **Clicks checkout** - sends request to `create-order.php`
5. **Backend creates**:
   - Square Order via Orders API
   - Payment Link via Checkout API
6. **Customer redirects** to Square's secure checkout
7. **Completes payment** on Square
8. **Returns to** your thank-you page
9. **Order appears** in Square Dashboard

## Customization

### Change Colors
Edit `css/style.css` variables:
```css
:root {
    --primary-color: #d4521f;
    --secondary-color: #8b3a1e;
    /* etc... */
}
```

### Add More Products
Edit `js/menu.js` and add to the `products` array

### Modify Layout
Edit HTML files and CSS as needed

## Important Notes

1. **Security**: Never commit `config.php` with real credentials to Git
2. **HTTPS**: Make sure your site uses HTTPS (Bluehost provides free SSL)
3. **Testing**: Test thoroughly before going live
4. **Backups**: Keep backups of your files

## Square API Documentation

- Checkout API: https://developer.squareup.com/docs/checkout-api
- Orders API: https://developer.squareup.com/docs/orders-api
- API Reference: https://developer.squareup.com/reference/square

## Support

- Square Developer Forums: https://developer.squareup.com/forums
- Your phone: 915-691-5937
- Email: [email protected]

## Next Steps

1. Add real product images
2. Implement proper error handling
3. Add email notifications (optional)
4. Set up webhooks for order updates (optional)
5. Add analytics tracking
6. SEO optimization

## Production Checklist

- [ ] Update config.php with production credentials
- [ ] Set correct WEBSITE_URL
- [ ] Update all product data
- [ ] Add real product images
- [ ] Test all fulfillment types
- [ ] Test payment flow end-to-end
- [ ] Disable error reporting in config.php
- [ ] Set up SSL certificate
- [ ] Test on mobile devices
- [ ] Set up email confirmations (optional)

Good luck with your site!

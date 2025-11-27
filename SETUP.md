# QUICK SETUP GUIDE - Chiquis Grandma Cuisine

## Step 1: Upload to Bluehost

### Option A: Using FTP (Recommended)
1. Download FileZilla (free FTP client)
2. Get FTP credentials from Bluehost cPanel
3. Connect to your server
4. Upload all files to `/public_html/` or your domain folder

### Option B: Using Bluehost File Manager
1. Log in to Bluehost cPanel
2. Go to File Manager
3. Navigate to `/public_html/`
4. Click "Upload" and upload all files
5. Extract if you uploaded as .zip

## Step 2: Configure Square API

1. Open `api/config.php` in a text editor
2. Replace this line:
   ```php
   define('SQUARE_ACCESS_TOKEN', 'YOUR_PRODUCTION_ACCESS_TOKEN_HERE');
   ```
   
   With your actual token:
   ```php
   define('SQUARE_ACCESS_TOKEN', 'EAAAl...your actual token here');
   ```

3. Update your website URL:
   ```php
   define('WEBSITE_URL', 'https://yourdomain.com');
   ```

## Step 3: Update Your Products

Edit `js/menu.js` - replace the sample products with your actual menu items.

## Step 4: Test Everything

1. Go to https://yourdomain.com
2. Click "Menu"
3. Add items to cart
4. Go to cart
5. Select fulfillment type
6. Click "Proceed to Checkout"
7. You should redirect to Square's payment page
8. Use Square test card: 4111 1111 1111 1111
9. Complete payment
10. You should return to thank-you page

## Step 5: Go Live

Once testing is successful:
1. Make sure you're using PRODUCTION credentials (not sandbox)
2. Test with a small real payment
3. Verify order appears in Square Dashboard
4. You're live! 🎉

## Common Issues

### "Failed to create order"
- Check that your Access Token is correct
- Make sure it's the PRODUCTION token, not Sandbox
- Verify in `api/config.php`

### "Cannot connect to Square"
- Check that `create-order.php` is uploaded
- Verify file permissions (644 for PHP files)
- Check Bluehost PHP error logs

### Cart not working
- Make sure browser allows localStorage
- Check browser console for JavaScript errors
- Verify all JS files are uploaded

### Payment redirect not working
- Make sure WEBSITE_URL in config.php is correct
- Check that thank-you.php is uploaded
- Verify redirect URL in Square response

## Your Credentials Reference

From Square Developer Portal:
- Application ID: sqOidp-mbz7lgZz3XaHP6EZ2cUMfQ
- Access Token: (copy from credentials page)
- Main Location ID: L5QHW4E621DZC
- Cafe Location ID: LZ8GQYSRJ8QRV
- Airport Location ID: L6CGBKNZBHZX8

## Need Help?

1. Check browser console (F12) for errors
2. Check Bluehost error logs in cPanel
3. Review Square API logs in Developer Dashboard
4. Test with Square's API Explorer tool

## File Checklist

Make sure these files are uploaded:
- [ ] index.html
- [ ] menu.html
- [ ] cart.html
- [ ] thank-you.php
- [ ] css/style.css
- [ ] js/menu.js
- [ ] js/cart.js
- [ ] api/config.php (with YOUR credentials)
- [ ] api/create-order.php
- [ ] .htaccess

That's it! Your custom e-commerce site integrated with Square is ready to go! 🚀

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed - Café de Olla</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .confirmation-container {
            max-width: 800px;
            margin: 4rem auto;
            padding: 2rem;
            text-align: center;
        }
        
        .success-icon {
            font-size: 5rem;
            color: var(--success-color);
            margin-bottom: 1rem;
        }
        
        .confirmation-content {
            background: var(--light-color);
            padding: 3rem;
            border-radius: 10px;
            margin-top: 2rem;
        }
        
        .order-details {
            background: var(--white);
            padding: 2rem;
            border-radius: 10px;
            margin-top: 2rem;
            text-align: left;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <nav class="navbar">
            <div class="container">
                <div class="logo">
                    <img src="../images/logo.png" alt="Café de Olla">
                    <h1>Chiquis Cafe de Olla</h1>
                </div>
                <button class="menu-toggle" onclick="toggleMenu()" aria-label="Toggle menu">
                    ☰
                </button>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="home.html">Home</a></li>
                    <li><a href="menu.html">Menu</a></li>
                    <li><a href="home.html#about">About</a></li>
                    <li><a href="home.html#contact">Contact</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <!-- Confirmation Content -->
    <main>
    <div class="confirmation-container">
        <div class="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order. We've received your payment and will start preparing your delicious Café de Olla!</p>
        
        <div class="confirmation-content">
            <h2>What's Next?</h2>
            <p>You'll receive an email confirmation shortly with your order details.</p>
            
            <?php
            // Get order ID from URL
            $orderId = $_GET['order_id'] ?? null;
            
            if ($orderId) {
                echo '<div class="order-details">';
                echo '<h3>Order Information</h3>';
                echo '<div class="detail-row">';
                echo '<strong>Order ID:</strong>';
                echo '<span>' . htmlspecialchars($orderId) . '</span>';
                echo '</div>';
                echo '<div class="detail-row">';
                echo '<strong>Status:</strong>';
                echo '<span>Payment Received</span>';
                echo '</div>';
                echo '</div>';
            }
            ?>
            
            <p style="margin-top: 2rem;">
                We'll notify you when your order is ready for pickup or out for delivery.
            </p>
            
            <div style="margin-top: 2rem;">
                <a href="menu.html" class="btn btn-primary">Order Again</a>
                <a href="home.html" class="btn btn-secondary" style="margin-left: 1rem;">Back to Home</a>
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 1rem; background: var(--light-color); border-radius: 10px;">
            <h3>Questions about your order?</h3>
            <p>Contact us at <strong>915-691-5937</strong> or <strong>[email protected]</strong></p>
        </div>
    </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2025 Café de Olla by Chiquis. All rights reserved.</p>
            <p>Email: [email protected]</p>
        </div>
    </footer>
    
    <script src="../js/main.js"></script>
</body>
</html>
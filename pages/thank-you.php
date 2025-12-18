<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed - Café de Olla</title>
    <link rel="stylesheet" href="../css/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
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
        
        /* Ticket Styles */
        .ticket-container {
            margin: 2rem auto;
            max-width: 600px;
        }
        
        .ticket {
            background: linear-gradient(135deg, #B8457D, #8B2942);
            border-radius: 20px;
            padding: 2.5rem;
            color: white;
            box-shadow: 0 10px 40px rgba(184, 69, 125, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .ticket::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
        }
        
        .ticket-header {
            text-align: center;
            padding-bottom: 1.5rem;
            border-bottom: 2px dashed rgba(255,255,255,0.3);
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
        }
        
        .ticket-logo {
            font-size: 3rem;
            margin-bottom: 0.5rem;
        }
        
        .ticket-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin: 0.5rem 0;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .ticket-subtitle {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        .ticket-body {
            position: relative;
            z-index: 1;
        }
        
        .ticket-row {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            font-size: 1rem;
        }
        
        .ticket-label {
            opacity: 0.8;
            font-weight: 500;
        }
        
        .ticket-value {
            font-weight: 700;
            text-align: right;
        }
        
        .ticket-barcode {
            text-align: center;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 2px dashed rgba(255,255,255,0.3);
        }
        
        .barcode {
            background: white;
            color: #333;
            padding: 1rem;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 1.2rem;
            letter-spacing: 2px;
        }
        
        .download-btn {
            margin-top: 1.5rem;
            background: white;
            color: #B8457D;
            padding: 1rem 2.5rem;
            border-radius: 10px;
            border: none;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        .download-icon {
            margin-right: 0.5rem;
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
            
            <?php
            // Generate ticket information
            $orderId = $_GET['order_id'] ?? 'ORD-' . strtoupper(substr(md5(time()), 0, 8));
            $orderDate = date('F j, Y');
            $orderTime = date('g:i A');
            ?>
            
            <!-- Downloadable Ticket -->
            <div class="ticket-container">
                <div class="ticket" id="orderTicket">
                    <div class="ticket-header">
                        <div class="ticket-logo">☕</div>
                        <h2 class="ticket-title">Chiquis Café de Olla</h2>
                        <p class="ticket-subtitle">Order Receipt</p>
                    </div>
                    
                    <div class="ticket-body">
                        <div class="ticket-row">
                            <span class="ticket-label">Order ID:</span>
                            <span class="ticket-value"><?php echo htmlspecialchars($orderId); ?></span>
                        </div>
                        <div class="ticket-row">
                            <span class="ticket-label">Date:</span>
                            <span class="ticket-value"><?php echo $orderDate; ?></span>
                        </div>
                        <div class="ticket-row">
                            <span class="ticket-label">Time:</span>
                            <span class="ticket-value"><?php echo $orderTime; ?></span>
                        </div>
                        <div class="ticket-row">
                            <span class="ticket-label">Status:</span>
                            <span class="ticket-value">✓ Confirmed</span>
                        </div>
                        
                        <div class="ticket-barcode">
                            <div class="barcode"><?php echo htmlspecialchars($orderId); ?></div>
                        </div>
                    </div>
                </div>
                
                <button onclick="downloadTicket()" class="download-btn">
                    <span class="download-icon">⬇</span>
                    Download Order Receipt
                </button>
            </div>
            
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
            <div class="social-media-links">
                <a href="https://www.tiktok.com/@chiquisbakery?_r=1&_t=ZP-91ooqM0zHxv" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ffffff"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
                <a href="https://www.instagram.com/chiquisbakery.elp?igsh=eG5rMG5laDN4N2ds&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.facebook.com/share/1FZLDC6sJA/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ffffff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
            </div>
            <p>&copy; 2025 Café de Olla by Chiquis. All rights reserved.</p>
            <p>Email: [email protected]</p>
        </div>
    </footer>
    
    <script src="../js/main.js"></script>
    <script>
        function downloadTicket() {
            const ticket = document.getElementById('orderTicket');
            
            html2canvas(ticket, {
                scale: 2,
                backgroundColor: null,
                logging: false
            }).then(canvas => {
                // Convert to image
                const link = document.createElement('a');
                link.download = 'chiquis-order-receipt-<?php echo htmlspecialchars($orderId); ?>.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    </script>
</body>
</html>
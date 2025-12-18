<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid request data']);
    exit;
}

$cart = $data['cart'] ?? [];
$fulfillmentType = $data['fulfillmentType'] ?? 'PICKUP';
$locationId = 'LF294RNFKGH3D';
$customerInfo = $data['customerInfo'] ?? null;

if (empty($cart)) {
    echo json_encode(['success' => false, 'error' => 'Cart is empty']);
    exit;
}

// Calculate total in cents
$totalCents = 0;
$lineItems = [];

foreach ($cart as $item) {
    $itemTotalCents = (int)($item['price'] * $item['quantity'] * 100);
    $totalCents += $itemTotalCents;
    
    $lineItems[] = [
        'name' => $item['name'],
        'quantity' => (string)$item['quantity'],
        'base_price_money' => [
            'amount' => (int)($item['price'] * 100),
            'currency' => 'USD'
        ]
    ];
}

// Create idempotency key
$idempotencyKey = uniqid('order_', true);

// Build order request
$orderRequest = [
    'idempotency_key' => $idempotencyKey,
    'order' => [
        'location_id' => $locationId,
        'line_items' => $lineItems
    ]
];

// Add fulfillment details
$fulfillment = ['type' => $fulfillmentType];

if ($fulfillmentType === 'PICKUP') {
    $fulfillment['pickup_details'] = [
        'recipient' => [
            'display_name' => $customerInfo['fullName'] ?? 'Customer'
        ],
        'schedule_type' => 'ASAP'
    ];
} elseif ($fulfillmentType === 'SHIPMENT') {
    if ($customerInfo && isset($customerInfo['address'])) {
        $fulfillment['shipment_details'] = [
            'recipient' => [
                'display_name' => $customerInfo['fullName'],
                'phone_number' => $customerInfo['phone'] ?? '',
                'address' => $customerInfo['address']
            ]
        ];
    }
} elseif ($fulfillmentType === 'DELIVERY') {
    if ($customerInfo && isset($customerInfo['address'])) {
        $fulfillment['delivery_details'] = [
            'recipient' => [
                'display_name' => $customerInfo['fullName'],
                'phone_number' => $customerInfo['phone'] ?? '',
                'address' => $customerInfo['address']
            ],
            'schedule_type' => 'SCHEDULED'
        ];
    }
}

$orderRequest['order']['fulfillments'] = [$fulfillment];

// Create order via Square API
$orderResponse = makeSquareRequest('/orders', 'POST', $orderRequest);

if (!$orderResponse || !isset($orderResponse['order'])) {
    echo json_encode([
        'success' => false, 
        'error' => 'Failed to create order',
        'details' => $orderResponse
    ]);
    exit;
}

$orderId = $orderResponse['order']['id'];

// Create payment link
$paymentLinkRequest = [
    'idempotency_key' => uniqid('link_', true),
    'quick_pay' => [
        'name' => 'Café de Olla - Order #' . substr($orderId, 0, 8),
        'price_money' => [
            'amount' => $totalCents,
            'currency' => 'USD'
        ],
        'location_id' => $locationId
    ],
    'checkout_options' => [
        'redirect_url' => WEBSITE_URL . '/pages/thank-you.php?order_id=' . $orderId
    ]
];

if ($customerInfo) {
    $paymentLinkRequest['pre_populated_data'] = [
        'buyer_email' => $customerInfo['email'] ?? '',
        'buyer_phone_number' => $customerInfo['phone'] ?? ''
    ];
    
    if (isset($customerInfo['address'])) {
        $paymentLinkRequest['pre_populated_data']['buyer_address'] = $customerInfo['address'];
    }
}

$paymentLinkResponse = makeSquareRequest('/online-checkout/payment-links', 'POST', $paymentLinkRequest);

if (!$paymentLinkResponse || !isset($paymentLinkResponse['payment_link'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to create payment link',
        'details' => $paymentLinkResponse
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'orderId' => $orderId,
    'paymentUrl' => $paymentLinkResponse['payment_link']['url']
]);

function makeSquareRequest($endpoint, $method = 'GET', $data = null) {
    $url = SQUARE_API_URL . $endpoint;
    
    $headers = [
        'Authorization: Bearer ' . SQUARE_ACCESS_TOKEN,
        'Content-Type: application/json',
        'Square-Version: 2025-10-16'
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $result = json_decode($response, true);
    
    if ($httpCode >= 400) {
        error_log("Square API Error ($httpCode): " . print_r($result, true));
    }
    
    return $result;
}
?>
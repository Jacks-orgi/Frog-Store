<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

$response = [];

$rawInput = json_decode(file_get_contents("php://input"));
$product_id = $rawInput->product_id ?? '';

if (empty($product_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing product_id']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT related_product_id FROM related_products WHERE product_id = ?");
    $stmt->execute([$product_id]);
    $relatedProducts = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if ($relatedProducts && count($relatedProducts) > 0) {
        echo json_encode(['success' => true, 'related_products' => array_map('intval', $relatedProducts)]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No related products found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error', 'error' => $e->getMessage()]);
}
?>

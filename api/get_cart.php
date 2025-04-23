<?php
require_once 'jwt/src/JWT.php';
require_once 'jwt/src/Key.php';
require_once 'db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Access-Control-Allow-Origin: https://jacks-orgi.github.io");
header("Access-Control-Allow-Origin: http://localhost:5173"); // TEMP
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$token = $data["token"] ?? '';

if (!$token) {
    echo json_encode([
        "success" => false,
        "message" => "No token provided"
    ]);
    exit();
}

$secret_key = 'Gv93a!xKzq#8BmT2@Wn7Lp*eJ6rQz9UvYf4HtX0c$sNhMdVw';

try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    $userid = $decoded->userid;  // Use userid from token

    $stmt = $pdo->prepare("
        SELECT 
            c.product_id, 
            c.quantity, 
            p.name, 
            p.price, 
            p.image_url, 
            p.description
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = :userid
    ");

    $stmt->execute(['userid' => $userid]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "cart" => $cartItems,
        "message" => "Cart loaded"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid or expired token",
        "error" => $e->getMessage()
    ]);
}
?>

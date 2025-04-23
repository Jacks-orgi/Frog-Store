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
$product_id = $data["product_id"] ?? '';
$quantity = $data["quantity"] ?? 1;
$remove = $data["remove"] ?? false;

if (!$token || !$product_id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing token or product_id"
    ]);
    exit();
}

$secret_key = 'Gv93a!xKzq#8BmT2@Wn7Lp*eJ6rQz9UvYf4HtX0c$sNhMdVw';

try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    $userid = $decoded->userid;

	$stmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = :userid AND product_id = :product_id");
	$stmt->execute(['userid' => $userid, 'product_id' => $product_id]);
	$existingItem = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($existingItem) {
		
		if ($remove) {
			$stmt = $pdo->prepare("UPDATE cart SET quantity = :quantity - quantity WHERE user_id = :userid AND product_id = :product_id");
		}
		else {
			$stmt = $pdo->prepare("UPDATE cart SET quantity = quantity + :quantity WHERE user_id = :userid AND product_id = :product_id");
		}
		
		$stmt->execute(['quantity' => $quantity, 'userid' => $userid, 'product_id' => $product_id]);

		echo json_encode([
			"success" => true,
			"message" => "Cart updated"
		]);
	} else {
		$stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (:userid, :product_id, :quantity)");
		$stmt->execute(['userid' => $userid, 'product_id' => $product_id, 'quantity' => $quantity]);

		echo json_encode([
			"success" => true,
			"message" => "Product added to cart"
		]);
	}
	
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid or expired token",
        "error" => $e->getMessage()
    ]);
}
?>

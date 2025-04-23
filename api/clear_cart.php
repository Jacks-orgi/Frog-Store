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
        "message" => "Missing token"
    ]);
    exit();
}

$secret_key = 'Gv93a!xKzq#8BmT2@Wn7Lp*eJ6rQz9UvYf4HtX0c$sNhMdVw';

try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    $userid = $decoded->userid;

    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = :userid");
    $stmt->execute(['userid' => $userid]);

    echo json_encode([
        "success" => true,
        "message" => "Cart cleared successfully"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid or expired token",
        "error" => $e->getMessage()
    ]);
}
?>

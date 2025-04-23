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
$usernameOrEmail = $data["usernameOrEmail"] ?? '';
$password = $data["password"] ?? '';

if (!$usernameOrEmail || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "Missing username, email or password"
    ]);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :usernameOrEmail OR email = :usernameOrEmail LIMIT 1");
$stmt->execute(['usernameOrEmail' => $usernameOrEmail]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    $payload = [
        "iat" => time(),
        "exp" => time() + 3600, // Token expires in 1 hour
		"userid" => $user['id']
    ];

    $secret_key = 'Gv93a!xKzq#8BmT2@Wn7Lp*eJ6rQz9UvYf4HtX0c$sNhMdVw';
    $jwt = JWT::encode($payload, $secret_key, 'HS256');

    echo json_encode([
        "success" => true,
        "key" => $jwt,
        "message" => "Login successful"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid credentials"
    ]);
}
?>

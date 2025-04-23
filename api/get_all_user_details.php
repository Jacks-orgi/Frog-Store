<?php
require_once 'jwt/src/JWT.php';
require_once 'jwt/src/Key.php';
require_once 'db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Access-Control-Allow-Origin: *"); // Replace with specific domain later
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

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
    $userid = $decoded->userid;

    // Updated the query to match your new schema
    $stmt = $pdo->prepare("
        SELECT 
            u.id AS user_id, 
            u.firstname, 
            u.lastname, 
            u.username, 
            u.email, 
            u.created_at, 
            ai.address_line1, 
            ai.address_line2, 
            ai.city, 
            ai.state, 
            ai.postcode, 
            ai.country,
            ci.card_number, 
            ci.expiration,
            CASE WHEN ai.id IS NOT NULL THEN 1 ELSE 0 END AS has_address,
            CASE WHEN ci.user_id IS NOT NULL THEN 1 ELSE 0 END AS has_card
        FROM users u
        LEFT JOIN user_addresses ua ON u.id = ua.user_id
        LEFT JOIN addresses ai ON ua.address_id = ai.id
        LEFT JOIN user_card_info ci ON u.id = ci.user_id
        WHERE u.id = :userid
    ");

    $stmt->execute([':userid' => $userid]);  // Bind the named parameter
    $userDetails = $stmt->fetch(PDO::FETCH_ASSOC);  // Fetch the user details

    if ($userDetails) {
        echo json_encode([
            "success" => true,
            "user_details" => $userDetails,  // Return user details (not cart items)
            "message" => "User details loaded"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No user found"
        ]);
    }
} catch (Exception $e) {
    error_log($e->getMessage()); // Log the error for debugging
    echo json_encode([
        "success" => false,
        "message" => "Invalid or expired token",
        "error" => $e->getMessage()
    ]);
}
?>

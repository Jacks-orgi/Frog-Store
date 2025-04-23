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

// --- DECODE JSON INPUT ---
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

$firstname = $data["firstname"] ?? '';
$lastname = $data["lastname"] ?? '';
$email = $data["email"] ?? '';
$phone = $data["phone"] ?? '';
$address_line1 = $data["address_line1"] ?? '';
$address_line2 = $data["address_line2"] ?? '';
$city = $data["city"] ?? '';
$postcode = $data["postcode"] ?? '';
$country = $data["country"] ?? '';
$state = $data["state"] ?? '';
$cardNumber = $data["cardNumber"] ?? '';
$expirationDate = $data["expirationDate"] ?? '';
$cardCSC = $data["cardCSC"] ?? '';
$token = $data["token"] ?? '';
$cart = $data["cart"] ?? [];   
$total = $data["total"] ?? [];   

if (
    !$firstname || 
    !$lastname || 
    !$email || 
    !$address_line1 || 
    !$city || 
    !$postcode || 
    !$country || 
    !$state || 
    !$cardNumber || 
    !$expirationDate || 
	!$cardCSC || 
    !$cart ||
	!$total
) {
    echo json_encode([
        "success" => false,
        "error" => "Missing required fields"
    ]);
    exit();
}

if ($token) {
    $secret_key = 'Gv93a!xKzq#8BmT2@Wn7Lp*eJ6rQz9UvYf4HtX0c$sNhMdVw';
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    $userid = $decoded->userid; // User ID from decoded token
}

$pdo->beginTransaction();
try {
	
	$stmt = $pdo->prepare("
		SELECT id FROM addresses
		WHERE address_line1 = :address_line1
		  AND address_line2 = :address_line2
		  AND city = :city
		  AND state = :state
		  AND postcode = :postcode
		  AND country = :country
		LIMIT 1
	");

	$stmt->execute([
		'address_line1' => $address_line1,
		'address_line2' => $address_line2,
		'city' => $city,
		'state' => $state,
		'postcode' => $postcode,
		'country' => $country
	]);

	$existing = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($existing) {
		$address_id = $existing['id']; // Use the existing address
	} else {
		// Insert new address
		$stmt = $pdo->prepare("
			INSERT INTO addresses (
				address_line1,
				address_line2,
				city,
				state,
				postcode,
				country
			) VALUES (
				:address_line1,
				:address_line2,
				:city,
				:state,
				:postcode,
				:country
			)
		");

		$stmt->execute([
			'address_line1' => $address_line1,
			'address_line2' => $address_line2,
			'city' => $city,
			'state' => $state,
			'postcode' => $postcode,
			'country' => $country
		]);

		$address_id = $pdo->lastInsertId();
	}
	
	// Create the order_details
	$stmt = $pdo->prepare("
        INSERT INTO order_details (
		user_id, 
		address_id,
		total
		)
        VALUES (
		:userid, 
		:address_id, 
		:total
	)");
	
	$stmt->execute([
        ':userid' => $userid,
        ':address_id' => $address_id,
        ':total' => $total
    ]);
	
	$order_id = $pdo->lastInsertId();

    // Create the order record
    $stmt = $pdo->prepare("
        INSERT INTO order_items (
		order_id, 
		product_id, 
		quantity
		)
        VALUES (
		:order_id,
		:product_id,
		:quantity
    )");
	
	foreach ($cart as $item) {
		$stmt->execute([
			':order_id' => $order_id,
			':product_id' => $item['product_id'],
			':quantity' => $item['quantity']
		]);
	}

	$pdo->commit();

    // Return a success response
    echo json_encode([
        "success" => true,
        "message" => "Order processed successfully"
    ]);
} catch (Exception $e) {
	$pdo->rollBack();
    echo json_encode([
        "success" => false,
        "message" => "Error processing order",
        "error" => $e->getMessage()
    ]);
}
?>

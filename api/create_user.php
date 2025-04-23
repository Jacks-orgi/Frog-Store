<?php
require_once 'jwt/src/JWT.php';
require_once 'jwt/src/Key.php';
require_once 'db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// --- CORS HEADERS ---
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

// --- USER INFO ---
$firstname = isset($data['firstname']) ? trim($data['firstname']) : '';
$lastname = isset($data['lastname']) ? trim($data['lastname']) : '';
$username = isset($data['username']) ? trim($data['username']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

// --- ADDRESS INFO ---
$address_line1 = isset($data['address_line1']) ? trim($data['address_line1']) : '';
$address_line2 = isset($data['address_line2']) ? trim($data['address_line2']) : '';
$city = isset($data['city']) ? trim($data['city']) : '';
$state = isset($data['state']) ? trim($data['state']) : '';
$postcode = isset($data['postcode']) ? trim($data['postcode']) : '';
$country = isset($data['country']) ? trim($data['country']) : '';

// --- VALIDATION ---
if (!($firstname && $lastname && $username && $email && $password && $address_line1 && $city && $state && $postcode && $country)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

if (!preg_match("/^[a-zA-Z0-9_]+$/", $username)) {
    echo json_encode(['success' => false, 'message' => 'Username can only contain letters, numbers, and underscores']);
    exit;
}

// --- CHECK IF USER EXISTS ---
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username OR email = :email");
$stmt->execute(['username' => $username, 'email' => $email]);

if ($stmt->rowCount() > 0) {
    echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
    exit;
}

// --- HASH PASSWORD ---
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    $pdo->beginTransaction();

    // Insert into users table
	$stmt = $pdo->prepare("INSERT INTO users (firstname, lastname, username, email, phone, password) VALUES (:firstname, :lastname, :username, :email, :phone, :password)");
    $stmt->execute([
        'firstname' => $firstname,
        'lastname' => $lastname,
        'username' => $username,
        'email' => $email,
		'phone' => $phone,
        'password' => $hashed_password
    ]);
	
    $user_id = $pdo->lastInsertId();

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

		$address_id = $pdo->lastInsertId(); // Use new ID
	}
	
    // Insert into user_address
	$stmt = $pdo->prepare("
	INSERT INTO user_addresses (
		user_id,
		address_id
	) VALUES (
		:user_id,
		:address_id
	)");

	$stmt->execute([
        'user_id' => $user_id,
        'address_id' => $address_id,
	]);

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'User created successfully', 'user_id' => $user_id]);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Error creating user: ' . $e->getMessage()]);
}
?>

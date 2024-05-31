<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = new mysqli("localhost", "root", '', "test");
mysqli_set_charset($mysqli, "utf8");
// Prepared statement, stage 1: prepare 
$stmt = $mysqli->prepare("INSERT INTO users(id, vorname, nachname, adresse, adresse2, ort, plz, land, username, password, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Prepared statement, stage 2: bind and execute 
$id = NULL;
$vorname = $_POST['vorname'];
$nachname = $_POST['nachname'];
$adresse = $_POST['adresse'];
$adresse2 = $_POST['adresse2'];
$ort = $_POST['ort'];
$plz = $_POST['plz'];
$land = $_POST['land'];
$username = $_POST['username']; 
$password = $_POST['password'];
$isAdmin = NULL;

$stmt->bind_param('sssssssssss', $id, $vorname, $nachname, $adresse, $adresse2, $ort, $plz, $land, $username, $password, $isAdmin); // "is" means that $id is bound as an integer and $label as a string

$stmt->execute();

$filename = "../data/users.json";
$sel = "SELECT * FROM users";
$result = $mysqli->query($sel);
if($result->num_rows>0){
    
    $rows = $result->fetch_all(MYSQLI_ASSOC);
    $rowsAsJSON = json_encode($rows);
    file_put_contents("../data/users.json", $rowsAsJSON);
}
?>

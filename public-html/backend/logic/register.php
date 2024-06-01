<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = new mysqli("localhost", "root", '', "test");
mysqli_set_charset($mysqli, "utf8");

if(isset($_GET['register'])) {
    $error = false;
    $email = $_POST['username'];
    $password = $_POST['password'];
    $password2 = $_POST['password2'];
    $username = $_POST['username'];

    if(strlen($passwort) == 0) {
        echo 'Bitte ein Passwort angeben<br>';
        $error = true;
    }
    if($passwort != $passwort2) {
        echo 'Die Passwörter müssen übereinstimmen<br>';
        $error = true;
    }
    //Überprüfe, dass die E-Mail-Adresse noch nicht registriert wurde
    if(!$error) { 
        $statement = $pdo->prepare("SELECT * FROM users WHERE username = :username");
        $result = $statement->execute(array('username' => $username));
        $user = $statement->fetch();
        
        if($user !== false) {
            echo 'Der Benutzername ist bereits vergeben<br>';
            $error = true;
        }    
    }
    if(!$error) {    
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
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
        $isAdmin = NULL;
        
        $stmt->bind_param('sssssssssss', $id, $vorname, $nachname, $adresse, $adresse2, $ort, $plz, $land, $username, $password_hash, $isAdmin); // "is" means that $id is bound as an integer and $label as a string

        $stmt->execute();

        $filename = "../data/users.json";
        $sel = "SELECT * FROM users";
        $result = $mysqli->query($sel);
        if($result->num_rows>0){
            
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            $rowsAsJSON = json_encode($rows);
            file_put_contents("../data/users.json", $rowsAsJSON);
        }   
}
}
?>

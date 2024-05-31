<?php

echo $_POST['vorname'];
echo $_REQUEST['vorname'];
/*
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = new mysqli("localhost", "root", '', "test");

/* Prepared statement, stage 1: prepare 
$stmt = $mysqli->prepare("INSERT INTO users(id, vorname, nachname, adresse, adresse2, ort, plz, land, username, password, isAdmin) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)");

/* Prepared statement, stage 2: bind and execute 
$id = NULL;
$vorname, nachname, adresse, adresse2, ort, plz, land, username, password, isAdmin

$stmt->bind_param($id, $label); // "is" means that $id is bound as an integer and $label as a string

$stmt->execute();

*/
?>

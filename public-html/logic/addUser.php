<?php

$connect = mysqli_connect('localhost', 'root', '', 'test');

$filename = "data/users.json";

$data = file_get_contents($filename);

$array = json_decode($data, true);


foreach ($array as $value){

    $query = "INSERT INTO `users`(`vorname`, `nachname`, `adresse`, `adresse2`, `ort`, `plz`, `land`, `username`, `password`, `isAdmin`)
    VALUES ('".$value['vorname']."','".$value['name']."','".$value['adresse']."','".$value['adresse2']."','".$value['ort']."','".$value['plz']."','".$value['land']."','".$value['username']."','".$value['password']."')";
    
    mysqli_query($connect, $query);

}   


?>
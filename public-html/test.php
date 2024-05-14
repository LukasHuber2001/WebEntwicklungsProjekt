<?php
# need to run the command "docker-php-ext-install mysqli" in the php:apache container in order for the mysqli functions to work.

$connect = mysqli_connect('localhost', 'root', '', 'test');

$filename = "data/products.json";

$data= file_get_contents($filename);

$array = json_decode($data, true);

foreach ($array as $value){

    $query = "INSERT INTO `artikel`(`art_num`, `name`, `gender`, `price`, `size`, `color`, `category`, `image_url`) VALUES 
    ('".$value['art_num']."','".$value['name']."','".$value['gender']."','".$value['price']."','".$value['size']."','".$value['color']."','".$value['category']."','".$value['image_url']."')";

    mysqli_query($connect, $query);

}   

echo "Data inserted sucessfully";
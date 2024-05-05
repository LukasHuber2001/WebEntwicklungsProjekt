<?php
# need to run the command "docker-php-ext-install mysqli" in the php:apache container in order for the mysqli functions to work.
echo "Hello World";

$connect = mysqli_connect(
    'db', #service name
    'php_docker', # username
    'password', #password
    'php_docker' #db table
);

$tableName = "Artikel";

$query = "SELECT * FROM $tableName";

$respone = mysqli_query($connect, $query);

echo "<strong> $tableName: </strong>";
while($i = mysqli_fetch_assoc($respone)){
    echo "<p>".$i['art_num']."</p>";
    echo "<p>".$i['name']."</p>";
    echo "<p>".$i['gender']."</p>";
    echo "<p>".$i['price']."</p>";
    echo "<p>".$i['size']."</p>";
    echo "<p>".$i['color']."</p>";
    echo "<p>".$i['category']."</p>";
    echo "<p>".$i['image_url']."</p>";
    echo "<br />";
}
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = '../data/receipts/'; //pfad setzen
        $uploadFile = $uploadDir . basename($_FILES['pdf']['name']); //fetch name dateiname vom formdata

        // sichergehen dass der dateipfad existiert
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // datei speichern
        if (move_uploaded_file($_FILES['pdf']['tmp_name'], $uploadFile)) {
            echo "File is valid, and was successfully uploaded.\n";
        } else {
            echo "Possible file upload attack!\n";
        }
    } else {
        echo "Upload failed with error code: " . $_FILES['pdf']['error'];
    }
} else {
    echo "Invalid request method.";
}
?>

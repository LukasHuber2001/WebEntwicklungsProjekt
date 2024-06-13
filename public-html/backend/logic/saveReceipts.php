<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = '../data/receipts/';

        // ensure that the filepath exists
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Move uploaded file to destination
        $tempFile = $_FILES['pdf']['tmp_name'];
        $targetFile = $uploadDir . basename($_FILES['pdf']['name']);

        if (move_uploaded_file($tempFile, $targetFile)) {
            // Respond with the filename for client-side download
            echo basename($_FILES['pdf']['name']);
        } else {
            echo "Failed to save receipt.";
        }
    } else {
        echo "Upload failed with error code: " . $_FILES['pdf']['error'];
    }
} else {
    echo "Invalid request method.";
}
?>


<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = '../data/receipts/'; //pfad setzen
        $uploadFile = $uploadDir . basename($_FILES['pdf']['name']); //fetch name dateiname vom formdata

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

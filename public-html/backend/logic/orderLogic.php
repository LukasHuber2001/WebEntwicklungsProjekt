<?php
class orderLogic
{
    private $dh;

    public function __construct($dh)
    {
        $this->dh = $dh;
    }
    function getReceiptByUser($param){
        $username= $param['username'];
        // datenbankverbindung überprüfen
        if (!$this->dh->checkConnection()) {
            $result["error"] = "Versuchen Sie es später erneut!";
            return $result; 
        }
        $stmt = $this->dh->db_obj->prepare("SELECT `id`  FROM `users` WHERE `username` = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $queryResult = $stmt->get_result();
        $row = $queryResult->fetch_assoc();
        $user_id = $row['id'];
        $stmt->close();

        $sql = $this->dh->db_obj->prepare("SELECT `id`, `total`, `datum`, `land`, `adresse`, `ort`, `plz` FROM `receipt` WHERE `username` = ? ORDER BY id ASC");
        $sql->bind_param("i", $user_id);
        
        while($line=mysqli_fetch_array($sql)) {    
            $results[]=array('id'=>$line['id'],'total'=>$line['total'],'datum'=>$line['datum'],'land'=>$line['land'],'adresse'=>$line['adresse'],'plz'=>$line['plz'],'ort'=>$line['ort']);
        }
        return $results; 

    }

    function processOrder($param) //bestellung verarbeiten
    {
        $result = array();
        $total = 0;
        // datenbankverbindung überprüfen
        if (!$this->dh->checkConnection()) {
            $result["error"] = "Versuchen Sie es später erneut!";
            return $result; 
        }

        // Start a transaction
        $this->dh->db_obj->begin_transaction(); //Gruppiert einer Reihe von Datenbankoperationen als einen Schritt

        //parameter aus $param speichern. 
        $username = $param['username'];
        $cartItems = $param['cartItems'];
        
    

        // userid je nach username abfragen
        $stmt = $this->dh->db_obj->prepare("SELECT *  FROM `users` WHERE `username` = ?");
        $stmt->bind_param("s", $username);
        if (!$stmt->execute()) {
            $result['error'] = "Fehler bei der Datenbank!";
            $this->dh->db_obj->rollback();
            $stmt->close();
            return $result;
        }
        $queryResult = $stmt->get_result();
        $row = $queryResult->fetch_assoc();

        if (!$row) {
            $result['error'] = "Benutzer nicht gefunden!";
            $this->dh->db_obj->rollback();
            $stmt->close();
            return $result;
        }

        $user_id = $row['id'];
        $address = $row['adresse'];
        $postcode = $row['plz'];
        $city = $row['ort'];
        $country = $row['land'];
        

        $stmt->close();


        //Rechnung in db einfügen
        $stmt = $this->dh->db_obj->prepare("INSERT INTO `receipt` (user_id, adresse, land, plz, ort, datum) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->bind_param("issss", $user_id, $address, $country, $postcode, $city);
        if (!$stmt->execute()) {
            $result['error'] = "Fehler bei der Datenbank!";
            $this->dh->db_obj->rollback();
            $stmt->close();
            return $result;
        }
        $receipt_id = $stmt->insert_id;

        $stmt->close();

        // Orderlines erstellen
        try {
            foreach ($cartItems as $item) {
                $product_id = $item['id'];
                $preis = $item['price'];
                $anzahl = $item['quantity'];
                $total += $preis*$anzahl;
                // Orderlines in db einfügen
                $stmt = $this->dh->db_obj->prepare("INSERT INTO `orders` (r_id, a_id, preis, anzahl) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("iidi", $receipt_id, $product_id, $preis, $anzahl);
                if (!$stmt->execute()) {
                    $result['error'] = "Fehler bei der Erstellung der Bestellung!";
                    $this->dh->db_obj->rollback();
                    return $result;
                }
                $stmt->close();
            }
                    } catch (Exception $e) {
            $result['error'] = "Fehler bei der Erstellung der Bestellung!";
            $this->dh->db_obj->rollback();
            $stmt->close();
            return $result;
        }
        
        $stmt = $this->dh->db_obj->prepare("UPDATE `receipt` SET `total` = ? WHERE `id` = ?");
            $stmt->bind_param("di", $total, $receipt_id);
            if (!$stmt->execute()) {
                $result['error'] = "Fehler bei der Erstellung der Bestellung!";
                $this->dh->db_obj->rollback();
                return $result;
            }
            $stmt->close();
            
        $this->dh->db_obj->commit();
        // gibt nachricht zurück
        $result['success'] = 'Bestellung erfolgreich abgeschlossen!';
        $result['receipt'] = $receipt_id;
        return $result;
    }


    function getOrders($param) //Bestellungen zu einem user aus der db holen
    {
        $username = $param['username'];
        $tab = array();
        $idx = 0;
        $cur = 0;
        $arr = array();


        if (!$this->dh->checkConnection()) {
            $result["error"] = "Versuchen Sie es später erneut!";
            return $result;
        }

        // SQL statement

        //Da der username gegeben ist und nicht die userid, wird diese mittels SELECT 'id' from 'users' where username = ? ermittelt
        //table products und orderlines werden gejoined, sodass die rechnungsids übereinstimmen
        //es wird zuerst nach datum, dann nach aufsteigender rechnungsid sortiert. 
        //summe, produktname, datum, rechnungsid, adresse, productid, preis der einzelnen produkte werden aus den tabellen geholt.
        $sql = "SELECT `receipt`.`total`,`artikel`.`name`, `receipt`.`datum`, 
        `receipt`.`id`, `receipt`.`adresse`, `receipt`.`plz`, `receipt`.`ort`, `receipt`.`land`, 
        `orders`.`anzahl`, `orders`.`a_id`, `orders`.`preis` 
        FROM `receipt` INNER JOIN `orders` ON `receipt`.`id` = `orders`.`r_id` 
        INNER JOIN `artikel` ON `orders`.`a_id` = `artikel`.`art_num` 
        WHERE `receipt`.`user_id` = (SELECT `id` FROM `users` WHERE `username` = ?) 
        ORDER BY `receipt`.`datum`, `receipt`.`id` ASC";
        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        // Füge die Ergebnisse in das Array ein,
        // in dem jeder Eintrag ein weiteres Array mit der selben Rechnungsid ist. 

        while ($row = $result->fetch_assoc()) {
            if ($idx == 0) {
                $cur = $row['id'];
            }
            if ($row['id'] == $cur) { //alte receipt_id
                array_push($arr, $row);
            } else { //neue receipt id
                array_push($tab, $arr); //alte Werte werden auf tab gepushed
                $arr = array(); //array leeren für neue werte
                array_push($arr, $row); //aktuellen wert auf das zwischenstand array pushen
                $cur = $row['id']; //aktuelle receipt id aktualisieren
            }
            $idx++;
        }
        array_push($tab, $arr);

        $stmt->close();

        return $tab;
    }
    function getReceipt($param)
    {
        $receipt_id = $param;
    
        if (!$this->dh->checkConnection()) {
            return ["error" => "Versuchen Sie es später erneut!"];
        }
    
        // SQL query to retrieve receipt and associated order details
        $sql = "SELECT `receipt`.`id`, `receipt`.`user_id`, `receipt`.`adresse`, 
                `receipt`.`land`, `receipt`.`plz`, `receipt`.`ort`, `receipt`.`datum`, 
                `orders`.`a_id`, `orders`.`preis`, `orders`.`anzahl`,
                `artikel`.`name`, `artikel`.`price`,
                `users`.`vorname` AS `buyer_firstName`,
                `users`.`nachname` AS `buyer_lastName`,
                `users`.`adresse` AS `buyer_address`,
                `users`.`plz` AS `buyer_zip`,
                `users`.`ort` AS `buyer_city`,
                `users`.`land` AS `buyer_country`
                FROM `receipt`
                INNER JOIN `orders` ON `receipt`.`id` = `orders`.`r_id`
                INNER JOIN `artikel` ON `orders`.`a_id` = `artikel`.`art_num`
                INNER JOIN `users` ON `receipt`.`user_id` = `users`.`id`
                WHERE `receipt`.`id` = ?";
    
        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param("i", $receipt_id);
        if (!$stmt->execute()) {
            return ["error" => "Fehler bei der Datenbank!"];
        }
    
        $result = $stmt->get_result();
    
        // Check if receipt data is found
        if ($result->num_rows === 0) {
            return ["error" => "Beleg nicht gefunden!"];
        }
    
        $receiptData = [];
        while ($row = $result->fetch_assoc()) {
            // Prepare data structure for each item
            $receiptData["receipt_id"] = $row['id'];
            $receiptData["buyer"] = [
                "vorname" => $row['buyer_firstName'],
                "nachname" => $row['buyer_lastName'],
                "address" => $row['buyer_address'],
                "city" => $row['buyer_city'],
                "zip" => $row['buyer_zip'],
                "country" => $row['buyer_country'] // Adding country to buyer details
            ];
            $receiptData["datum"] = $row['datum']; // Adding receipt date
            $receiptData["products"][] = [
                "id" => $row['a_id'],
                "name" => $row['name'],
                "price" => $row['price'],
                "quantity" => $row['anzahl']
            ];
        }
    
        $stmt->close();
    
        return $receiptData;
    }
        
}
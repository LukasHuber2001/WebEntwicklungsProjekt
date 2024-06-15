<?php
class adminLogic
{
    private $dh;

    public function __construct($dh)
    {
        $this->dh = $dh;
    }

    // Methode zum Laden aller Benutzer
    public function loadAllUsers()
    {
        $result = array();
        $notAdmin = 0;

        // Verbindung zur DB testen
        if (!$this->dh->checkConnection()) {
            $result['error'] = 'Versuchen Sie es später erneut!';
            return $result;
        }

        // Query um Beutzer die nicht Admin sind abzurufen
        $sql = 'SELECT `id`, `username` FROM `users` WHERE `isAdmin` = ? ORDER BY `username`';
        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param('i', $notAdmin);

        if ($stmt->execute()) {
            $queryResult = $stmt->get_result();
            // Wenn es Beneutzer gibt iterieren und in result-Array einfügen
            if ($queryResult->num_rows > 0) {
                $result['success'] = 'Benutzer wurden gefunden!';
                $users = [];
                while ($row = $queryResult->fetch_assoc()) {
                    array_push($users, $row);
                }
                $result['users'] = $users;
            } else {
                $result['error'] = 'Keine Benutzer vorhanden!';
            }
        } else {
            $result['error'] = 'Fehler bei der Abfrage!';
        }

        $stmt->close();

        return $result;
    }
    // Methode zum Laden eines bestimmten Benutzer nach ID
    public function loadUserByID($param)
    {
        $result = array();

        // Verbindung zu DB testen
        if (!$this->dh->checkConnection()) {
            $result['error'] = 'Versuchen Sie es später erneut!';
            return $result;
        }

        // Lade alle notwendigen Daten des Benutzers
        $sql = 'SELECT `id`, `aktiv`, `vorname`, `nachname`, `adresse`, `plz`, `ort`, `land`, `email`, `username`
        FROM `users` WHERE `id` = ?';
        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param('i', $param);

        if ($stmt->execute()) {
            $queryResult = $stmt->get_result();
            // Wenn der Benutzer gefunden wurde, schicke das Ergebnis im result-Array mit
            if ($queryResult->num_rows == 1) {
                $result['success'] = 'Benutzer gefunden!';
                $result['data'] = $queryResult->fetch_assoc();
            } else {
                $result['error'] = 'Benutzer nicht gefunden!';
            }
        } else {
            $result['error'] = 'Inkorrekte Abfragedaten!';
        }

        $stmt->close();

        return $result;
    }
    // Methode zum Aktivieren eines Benutzers
    public function activateUser($param)
    {
        $result = array();

        // Verbindung zu DB testen
        if (!$this->dh->checkConnection()) {
            $result['error'] = 'Versuchen Sie es später erneut!';
            return $result;
        }

        // Update-Query zum Ändern des booleans `aktiv` des Benutzers
        $sql = 'UPDATE `users` SET `aktiv` = 1 WHERE `id` = ?';
        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param('i', $param);

        // Wenn erfolgreiche Query und die Reihe verändert wurde dann teile das mit
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            $result['success'] = 'Benutzer erfolgreich aktiviert!';
        } else {
            // Ansonsten informieren, dass der Benutzer bereits aktiviert ist
            $result['error'] = 'Benutzer ist bereits aktiviert!';
        }

        $stmt->close();

        return $result;
    }
    // Methode zum Deaktivieren eines Benutzers
    public function deactivateUser($param)
    {
        $result = array();
        // Verbindung zu DB testen
        if (!$this->dh->checkConnection()) {
            $result['error'] = 'Versuchen Sie es später erneut!';
            return $result;
        }

        // Update-Query zum Ändern des booleans `aktiv` des Benutzers
        $sql = 'UPDATE `users` SET `aktiv` = 0 WHERE `id` = ?';
        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param('i', $param);

        // Wenn erfolgreiche Query und die Reihe verändert wurde dann teile das mit
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            $result['success'] = 'Benutzer erfolgreich deaktiviert!';
        } else {
            // Ansonsten informieren, dass der Benutzer bereits deaktiviert ist
            $result['error'] = 'Benutzer ist bereits deaktiviert!';
        }

        $stmt->close();

        return $result;
    }
    // Methode zum Laden der Bestellungen eines Benutzers
    public function loadOrdersByUserID($param)
    {
        $result = array();

        // Verbindung zu DB testen
        if (!$this->dh->checkConnection()) {
            $result['error'] = 'Versuchen Sie es später erneut!';
            return $result;
        }

        // Query zum Laden aller IDs von Bestellungen des gewählten Benutzers
        $sql = 'SELECT `id` FROM `receipt` WHERE `user_id` = ? ORDER BY `timestamp`, `id`';
        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param('i', $param);

        if ($stmt->execute()) {
            $queryResult = $stmt->get_result();
            // Wenn der Benutzer Bestellungen hat in result-Array speichern
            if ($queryResult->num_rows > 0) {
                $orders = array();
                while ($row = $queryResult->fetch_assoc()) {
                    array_push($orders, $row);
                }
                $result['success'] = 'Bestellungen geladen';
                $result['data'] = $orders;
            } else {
                // Ansonsten mitteilen, dass er keine Bestellungen hat
                $result['noOrders'] = 'Dieser Benuter hat keine Bestellungen';
            }
        } else {
            $result['error'] = 'Inkorrekte Benutzerdaten, versuchen Sie es später erneut!';
        }

        $stmt->close();

        return $result;
    }
    // Methode zum Laden der Bestellungsdaten einer spezifischen Bestellung
    public function loadOrderByID($param)
    {
        $result = array();

        // Verbindung zur DB testen
        if (!$this->dh->checkConnection()) {
            $result['error'] = 'Versuchen Sie es später erneut!';
            return $result;
        }

        // Query zum Abfragen aller Infos zu einer Bestellung
        $sql = "SELECT r.id AS receipt_id, r.user_id, r.summe, r.strasse, r.plz, r.ort, r.datum,
        ol.id AS orderline_id, ol.product_id, ol.preis, ol.anzahl,
        a.name AS product_name
        FROM receipt r
        JOIN orders ol ON r.id = ol.receipt_id
        JOIN artikel a ON ol.product_id = p.id
        WHERE r.id = ?;";
        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param('i', $param);

        if ($stmt->execute()) {
            $queryResult = $stmt->get_result();
            // Wenn die Bestellpositionen gefunden wurden dann im result-Array mitgeben
            if ($queryResult->num_rows > 0) {
                $order = array();
                while ($row = $queryResult->fetch_assoc()) {
                    array_push($order, $row);
                }
                $result['success'] = 'Bestellung geladen';
                $result['data'] = $order;
            } else {
                $result['error'] = 'Diese Bestellung existiert nicht!';
            }
        } else {
            $result['error'] = 'Inkorrekte Bestelldaten, versuchen Sie es später erneut!';
        }

        $stmt->close();

        return $result;
    }
}
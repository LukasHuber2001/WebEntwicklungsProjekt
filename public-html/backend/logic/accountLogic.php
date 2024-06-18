<?php
class accountLogic{
    private $dh;
    // Der Konstruktor
    public function __construct($dh)
    {
        $this->dh = $dh;
    }
    // Diese Methode gibt die Information darüber,
    // um was für einen User es sich handelt. 
    public function getSessionInfo()
    {
        $result = array();
        if (isset($_SESSION['username']) && isset($_SESSION['admin'])) {
            if ($_SESSION['admin']) {
                //als Admin eingeloggt
                $result['status'] = 'loggedInAdmin';
            } else {
                // als User eingeloggt
                $result['status'] = 'loggedInUser';
            }
        } elseif (isset($_COOKIE['rememberCheck']) && isset($_COOKIE['username'])) {
            // setze Session-Daten wenn Cookies vorhanden
            if (!isset($_SESSION)) {
                session_start();
            }
            // der status, wenn zusätzlich ein cookie gestzt wurde (bzw das rememberCheck aktiviert ist)
            $_SESSION['username'] = $_COOKIE['username'];
            $_SESSION['admin'] = $_COOKIE['admin'] ?? false;
            if ($_SESSION['admin']) {
                // Status für eingeloggten Admin
                $result['status'] = 'loggedInAdmin';
                $result['check'] = 'newDataHandler works';
            } else {
                // Status für eingeloggten User
                $result['status'] = 'loggedInUser';
            }
        } else {
            // Status, wenn man nicht eingeloggt ist
            $result['status'] = 'notLoggedIn';
        }
        return $result;
    }
    public function registerUser($param)
    {
        $result = array();
        $person = $param;
        // Handling, wenn ein Eintrag fehlt
        if (empty($person['firstName']) || strlen(trim($person['firstName'])) == 0) {
            $result['error'] = 'Bitte geben Sie einen validen Vornamen ein!';
            return $result;
        }
        if (empty($person['lastName']) || strlen(trim($person['lastName'])) == 0) {
            $result['error'] = 'Bitte geben Sie einen validen Nachnamen ein!';
            return $result;
        }
        if (empty($param['address']) || !isset($param['address']) || strlen(trim($param['address'])) == 0) {
            $result['error'] = 'Bitte geben Sie eine valide Adresse ein!';
        }
        if (empty($param['postcode']) || !isset($param['postcode']) || strlen(trim($param['postcode'])) == 0) {
            $result['error'] = 'Bitte geben Sie eine valide Postleitzahl ein!';
        }
        if (empty($param['city']) || !isset($param['city']) || strlen(trim($param['city'])) == 0) {
            $result['error'] = 'Bitte geben Sie einen validen Ort ein!';
        }
        if (empty($param['country']) || !isset($param['country']) || strlen(trim($param['country'])) == 0) {
            $result['error'] = 'Bitte geben Sie einen valides Land ein!';
        }
        if (empty($person['email']) || strlen(trim($person['email'])) == 0 || !filter_var($this->test_input($person["email"]), FILTER_VALIDATE_EMAIL)) {
            $result['error'] = 'Bitte geben Sie eine valide E-Mail ein!';
            return $result;
        }
        if (empty($person['username']) || strlen(trim($person['username'])) == 0) {
            $result['error'] = 'Bitte geben Sie einen validen Username ein!';
            return $result;
        }
        if (empty($person['password']) || strlen(trim($person['password'])) == 0 || strlen(trim($person['password'])) < 8) {
            $result['error'] = 'Bitte geben Sie ein Passwort mit mindestens 8 Zeichen ein!';
            return $result;
        }
        if (empty($person['password2']) || strlen(trim($person['password2'])) == 0 || strlen(trim($person['password2'])) < 8) {
            $result['error'] = 'Bitte geben Sie ein Passwort mit mindestens 8 Zeichen ein!';
            return $result;
        }
        if ($person['password'] != $person['password2']) {
            $result['error'] = 'Ihre Passworteingaben stimmen nicht überein!';
            return $result;
        }
        //JS-Injection Protection
        $firstName = htmlspecialchars($person['firstName'], ENT_QUOTES);
        $lastName = htmlspecialchars($person['lastName'], ENT_QUOTES);
        $address = htmlspecialchars($person['address'], ENT_QUOTES);
        $postcode = htmlspecialchars($person['postcode'], ENT_QUOTES);
        $city = htmlspecialchars($person['city'], ENT_QUOTES);
        $country = htmlspecialchars($person['country'], ENT_QUOTES);
        $email = htmlspecialchars($person['email'], ENT_QUOTES);
        $uname = htmlspecialchars($person['username'], ENT_QUOTES);
        $password = htmlspecialchars(password_hash($person['password'], PASSWORD_DEFAULT), ENT_QUOTES);
        $isAdmin = 0;

        if (!$this->dh->checkConnection()) {
            $result['error'] = 'Registrierung fehlgeschlagen, versuchen Sie es später erneut';
            return $result;
        }

        // Der neue User wird in die Datenbank hinzugefügt, wenn es nicht bereits einen User mit demselben Usernamen gibt.
        $sql = 'INSERT INTO `users` (`vorname`, `nachname`, `adresse`, `ort`, `plz`, `land`, `username`, `password`, `email`, `isAdmin`) 
        SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        FROM DUAL
        WHERE NOT EXISTS (SELECT * FROM `users` WHERE `username` = ?)';


        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param('sssssssssss', $firstName, $lastName, $address, $city, $postcode, $country, $uname, $password, $email, $uname, $isAdmin);
        // Wenn der Benutzer erfolgreich in die Datenbank hinzugefügt wurde, dass erscheint die Meldung, dass ein/e neue/r BenutzerIn erstellt wurde
        // eine entsprechende Meldung erscheint. Andernfalls bedeutet es dass der eingegebene Username bereits existiert und diese Meldunge erscheint auch.
        // if executed and a row affected return success message, else return error message
        // if the statement executes sucessfully the entire database table is updated into the JSON-file
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            $result['success'] = 'Neuer Benutzer erstellt!';
            $sel = "SELECT * FROM users";
            $resultJson = $this->dh->db_obj->query($sel);
            $rows = $resultJson->fetch_all(MYSQLI_ASSOC);
            $rowsAsJSON = json_encode($rows);
            file_put_contents("../data/users.json", $rowsAsJSON);
    
        } else {
            $result['error'] = 'Benutzername existiert bereits!';
        }

        $stmt->close();

        return $result;
    }
    
    public function loginUser($param)
    {
        // userinput und password sind die angegebenen Daten
        $result = array();
        $userInput = $param['userInput'];
        $password = $param['passwordInput'];
        $active = 1;
        // wenn etwas mit der C onnection nicht in Ordnung ist, erscheint diese Meldung
        if (!$this->dh->checkConnection()) {
            $result['error'] = 'Login nicht möglich, versuchen Sie es später erneut!';
        }
        // Wenn der Userinput leer ist
        if (empty($userInput)) {
            $result['error'] = 'Geben Sie bitte einen Benutzernamen oder E-Mail ein!';
            return $result;
            // Wenn das Passwort leer ist
        } else if (empty($password)) {
            $result['error'] = 'Geben Sie bitte ein Passwort ein!';
            return;
        } else {
            // Man holt sich die Daten von dem User
            $sql = 'SELECT `email`, `username`, `password`, `isAdmin` FROM `users`
                     WHERE (`username`=? OR `email` = ?) AND `aktiv` = ?';
            $stmt = $this->dh->db_obj->prepare($sql);
            $stmt->bind_param('ssi', $userInput, $userInput, $active);
        }

        if ($stmt->execute()) {
            $user = $stmt->get_result();
            // Wenn die Abfrage von der Datenbank 1 ergibt, dann bedeutet das, dass es einen User mit den Daten gibt und der Login war erfolgreich
            if ($user->num_rows == 1) {
                $row = $user->fetch_assoc();
                // Nun wird pberüprüft, ob das eingegebene Passwort korrekt ist
                
                if (password_verify($password, $row['password'])) {
                    $result['success'] = 'Login erfolgreich, willkommen ' . $row['username'] . '!';
                    $result['username'] = $row['username'];
                    $result['admin'] = $row['isAdmin'];
                    if (!(isset($_SESSION))) {
                        session_start();
                    }
                    // Der session['name'] wird zugeordnet
                    $_SESSION['username'] = $row['username'];
                    $_SESSION['admin'] = $row['isAdmin'];
                    // wenn das rememberCheck angeklickt wurde, dann wird entweder ein 1h cookie oder ein 30 Tage cookie gesetzt
                    if (isset($param['rememberCheck']) && $param['rememberCheck']) {
                        // 30-Tage Cookie wenn Login merken
                        setcookie('rememberCheck', true, time() + (86400 * 30), '/');
                        setcookie('username', $row['username'], time() + (86400 * 30), '/');
                        setcookie('admin', $row['isAdmin'], time() + (86400 * 30), '/');
                    } else {
                        // 1-Stunde Cookie wenn nicht Login merken für Benutzerfreundlichkeit
                        setcookie('rememberCheck', true, time() + 3600, '/');
                        setcookie('username', $row['username'], time() + 3600, '/');
                        setcookie('admin', $row['isAdmin'], time() + 3600, '/');
                    }
                } else {
                    // Wenn das Passwort nicht korrekt war
                    $result['error'] = 'Falsches Passwort!'.$row['password'].' '.$password;

                }
            } else {
                // Wenn es keinen Eintrag in der Datenbank gibt, wo username oder email dem entsprechen
                $result['error'] = 'Benutzer nicht gefunden bzw. inaktiv!';
            }
        } else {
            // wenn ein anderer Fehler aufgetreten ist
            $result['error'] = 'Login nicht möglich, versuchen Sie es später erneut!';
        }

        $stmt->close();
        return $result;
    }

     // wenn man seine eigenen Daten ändern will, wird zuerst die Methode getProfileData aufgerufen, welche die alten Daten anzeigt
     function getProfileData($param)
     {
 
         $result = array();
         // Wenn die Connection nicht erfolgreich war
         if (!$this->dh->checkConnection()) {
             $result['error'] = "Versuchen Sie es später erneut";
             return;
         }
         // Man holt sich die Daten des Users aus der Datenbank
         $sql = 'SELECT `vorname`, `nachname`, `adresse`, `plz`, `ort`, `land`, `email`, `username`
         FROM `users` WHERE `username` = ?';
         $stmt = $this->dh->db_obj->prepare($sql);
         $stmt->bind_param('s', $param);
         if ($stmt->execute()) {
             $queryResult = $stmt->get_result();
             // wenn es einen Eintrag in der Datenbank gibt
             if ($queryResult->num_rows == 1) {
                 $result = $queryResult->fetch_assoc();
             } else {
                 // wenn es keinen Eintrag in der Datenbank gibt
                 $result['error'] = "Fehler bei der Abfrage";
             }
         } else {
             $result['error'] = "Fehler bei der Abfrage";
         }
 
         $stmt->close();
         return $result;
     }

     // wenn der User seine Daten ändern will
    function updateUserData($param)
    {
        // wenn der User seine Daten ändern will, dann muss er davor einige Voraussetzungen erfüllen, wie zum Beispiel, dass das Passwort
        // des Users/ der Userin eingetragen werden muss...
        $result = array();
        //man holt sich erneut die Daten des users, wo sie dem Usernamen entsprechen
        $sql = 'SELECT vorname, nachname, adresse, plz, ort, land, email, username, password FROM users WHERE username = ?';
        $stmt = $this->dh->db_obj->prepare($sql);
        $stmt->bind_param('s', $param['actualusername']);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows == 1) {

            $row = $result->fetch_assoc();
            if (empty($param['pw_alt'])) {
                // wenn man das alte Passwort nicht angegeben hat
                $data['error'] = "Sie haben Ihr altes Passwort nicht eingegeben.";
                return $data;
            } elseif (!password_verify($param['pw_alt'], $row['password'])) {
                // wenn man ein falsches, altes Passwort eingegeben hat
                $data['error'] = "Das eingegebene Passwort ist nicht korrekt. Bitte probieren Sie es noch einmal.";
                return $data;
            } else {
                // wenn man Daten ausfüllt, wird das in der Variable Data gespeichert,
                // ansonsten bleibt data gleich, wie die alten Daten aus der Datenbank
                if (!empty($param['vorname'])) {
                    $data['vorname'] = $param['vorname'];
                } else {
                    $data['vorname'] = $row['vorname'];
                }
                if (!empty($param['nachname'])) {
                    $data['nachname'] = $param['nachname'];
                } else {
                    $data['nachname'] = $row['nachname'];
                }

                if (!empty($param['adresse'])) {
                    $data['adresse'] = $param['adresse'];
                } else {
                    $data['adresse'] = $row['adresse'];
                }

                if (!empty($param['plz'])) {
                    $data['plz'] = $param['plz'];
                } else {
                    $data['plz'] = $row['plz'];
                }

                if (!empty($param['ort'])) {
                    $data['ort'] = $param['ort'];
                } else {
                    $data['ort'] = $row['ort'];
                }
                if (!empty($param['land'])) {
                    $data['land'] = $param['land'];
                } else {
                    $data['land'] = $row['land'];
                }
                // Email-Validierung
                if (!empty($param['email']) && filter_var($this->test_input($param["email"]), FILTER_VALIDATE_EMAIL)) {
                    $data['email'] = $param['email'];
                } else {
                    $data['email'] = $row['email'];
                }
                if (!empty($param['username'])) {
                    $data['username'] = $param['username'];
                } else {
                    $data['username'] = $row['username'];
                }
                if (!empty($param['pw'])) {
                    if (strlen(trim($param['pw'])) == 0 || strlen(trim($param['pw'])) < 8) {
                        $data['error'] = "Passwort muss mindestens 8 Zeichen lang sein!";
                        $stmt->close();
                        return $data;
                    } else {
                        $data['pw'] = password_hash($param['pw'], PASSWORD_DEFAULT);
                    }
                } else {
                    $data['pw'] = $row['password'];
                }
            }
        } else {
            $data['error'] = "Fehler bei der Abfrage!";
            return $data;
        }
        $stmt->close();
        // Heir wird nur der username aus der Datenbank gefiltert
        $inputUsername = $param['username'];
        $actualUsername = $param['actualusername'];
        $sql2 = 'SELECT username FROM users WHERE `username` = ?';
        $stmt2 = $this->dh->db_obj->prepare($sql2);
        $stmt2->bind_param("s", $inputUsername);
        $stmt2->execute();
        $result2 = $stmt2->get_result();

        // wenn deer neue Username bereits in der Datenbank drinnen ist, dann erscheint die Meldung, weil der Username uniqe sein muss
        if ($result2->num_rows == 1 && $result2->fetch_assoc()['username'] != $actualUsername) {
            $data['error'] = "Der Username muss unique sein.";
            return $data;
        } else {
            // ansonsten werden die Einträge in der Datenbank geupdatet
            $sqlUpdate = 'UPDATE `users` SET  `land` = ?, `vorname` = ?, `nachname` = ?, `adresse` = ?, `plz` = ?, `ort` = ?, `email` = ?, `password` = ?, `username` = ? 
            WHERE `username` = ?';

            $stmtUpdate = $this->dh->db_obj->prepare($sqlUpdate);
            $stmtUpdate->bind_param(
                'ssssssssss',
                $data['land'],
                $data['vorname'],
                $data['nachname'],
                $data['adresse'],
                $data['plz'],
                $data['ort'],
                $data['email'],
                $data['pw'],
                $data['username'],
                $actualUsername
            );
            // Der neue Cookie wird gesetzt
            if ($stmtUpdate->execute() && $stmtUpdate->affected_rows > 0) {
                if (isset($_COOKIE['rememberCheck']) && $_COOKIE['rememberCheck']) {
                    // 30-Tage Cookie
                    setcookie('rememberCheck', true, time() + (86400 * 30), '/');
                    setcookie('username', $data['username'], time() + (86400 * 30), '/');
                    setcookie('admin', $_COOKIE['admin'], time() + (86400 * 30), '/');
                } else {
                    // 1-Stune Cookie
                    setcookie('rememberCheck', true, time() + 3600, '/');
                    setcookie('username', $data['username'], time() + 3600, '/');
                    setcookie('admin', $_COOKIE['admin'], time() + 3600, '/');
                }
                $data['success'] = 'Daten erfolgreich aktualisisert';
            } else {
                $data['error'] = 'Daten bereits aktuell!';
            }
            $stmtUpdate->close();
        }
        $stmt2->close();
        return $data;
    }
    public function logoutUser()
    { // wenn der user sich ausloggen will
        $result = array();
        // die session $SESSION['username'] wird destroyet
        if (isset($_SESSION['username'])) {
            session_destroy();
            // wir ziehen die Zeit vom cookie ab und somit läuft der cookie ab
            if (isset($_COOKIE['rememberCheck'])) {
                setcookie('rememberCheck', '', time() - 3600, '/');
            }
            if (isset($_COOKIE['username'])) {
                setcookie('username', '', time() - 3600, '/');
            }
            if (isset($_COOKIE['admin'])) {
                setcookie('admin', '', time() - 3600, '/');
            }
            //logedIn wird auf false gesetzt
            $result['loggedIn'] = false;
        }
        return $result;
    }

    private function test_input($data)
    {
        //zur Datenvalidierung
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
}
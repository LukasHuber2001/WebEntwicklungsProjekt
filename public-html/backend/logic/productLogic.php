<?php
class productLogic
{
    private $dh;

    public function __construct($dh)
    {
        $this->dh = $dh;
    }

    public function loadAllProducts()
    {
        $result = array();

        if (!$this->dh->checkConnection()) {
            $result["error"] = "Versuchen Sie es später erneut!";
            return $result;
        }

        $stmt = $this->dh->db_obj->prepare("SELECT * FROM `artikel`");
        if ($stmt->execute()) {
            $queryResult = $stmt->get_result();
            while ($row = $queryResult->fetch_assoc()) {
                array_push($result, $row);
            }
        } else {
            $result["error"] = "Versuchen Sie es später erneut!";
        }

        $stmt->close();
        return $result;
    }

    public function searchProducts($param)
    {
        $result = array();
        $searchTerm = '%' . $param['query'] . '%';
    
        if (!$this->dh->checkConnection()) {
            $result["error"] = "Versuchen Sie es später erneut!";
            return $result;
        }
    
        $stmt = $this->dh->db_obj->prepare("SELECT * FROM `artikel` WHERE `name` LIKE ?");
        $stmt->bind_param("s", $searchTerm);
    
        if ($stmt->execute()) {
            $queryResult = $stmt->get_result();
            
            while ($row = $queryResult->fetch_assoc()) {
                $result[] = $row; // Append each row to $result array
            }
        } else {
            $result["error"] = "Versuchen Sie es später erneut!";
        }
    
        $stmt->close();
        
        // If no products were found, return an empty array
        if (empty($result)) {
            return json_encode([]); // Return an empty JSON array
        } else {
            return json_encode($result); // Return JSON-encoded result array
        }
    }
    

    public function loadProductByID($param)
    {
        $result = array();

        if (!$this->dh->checkConnection()) {
            $result["error"] = "Versuchen Sie es später erneut!";
            return $result;
        }

        $stmt = $this->dh->db_obj->prepare("SELECT * FROM `artikel` WHERE `art_num` = ?");
        $stmt->bind_param("i", $param);

        if ($stmt->execute()) {
            $queryResult = $stmt->get_result();
            $row = $queryResult->fetch_assoc();
            if ($row) {
                $result["success"] = true;
                $result["data"] = $row;
            } else {
                $result["success"] = false;
                $result["error"] = "Produkt nicht gefunden";
            }
        } else {
            $result["error"] = "Versuchen Sie es später erneut!";
        }

        $stmt->close();
        return $result;
    }
}

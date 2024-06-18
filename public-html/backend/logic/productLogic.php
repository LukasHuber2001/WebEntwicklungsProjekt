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
        //prepare the SQL statement to select all products
        $stmt = $this->dh->db_obj->prepare("SELECT * FROM `artikel`");
        // Execute the statement and fetch results if successful
        if ($stmt->execute()) {
            $queryResult = $stmt->get_result();
            while ($row = $queryResult->fetch_assoc()) {
                array_push($result, $row);
            }
        } else {
            // Set an error message if the query fails
            $result["error"] = "Versuchen Sie es später erneut!";
        }

        $stmt->close();
        return $result;
    }

    public function searchProducts($param)
    {
        // Prepare the search term with wildcards for a LIKE query
        $result = array();
        $searchTerm = '%' . $param['query'] . '%';
    
        if (!$this->dh->checkConnection()) {
            $result["error"] = "Versuchen Sie es später erneut!";
            return $result;
        }
        // Prepare the SQL statement to search products by name
        $stmt = $this->dh->db_obj->prepare("SELECT * FROM `artikel` WHERE `name` LIKE ?");
        $stmt->bind_param("s", $searchTerm);

        // Execute the statement and fetch results if successful
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

        // Prepare the SQL statement to select a product by ID
        $stmt = $this->dh->db_obj->prepare("SELECT * FROM `artikel` WHERE `art_num` = ?");
        $stmt->bind_param("i", $param);

        // Execute the statement and fetch the result if successful
        if ($stmt->execute()) {
            $queryResult = $stmt->get_result();
            $row = $queryResult->fetch_assoc();
            // Set success to true and add the product data to the result
            if ($row) {
                $result["success"] = true;
                $result["data"] = $row;
            } else {
                // Set success to false and add an error message if the product is not found
                $result["success"] = false;
                $result["error"] = "Produkt nicht gefunden";
            }
        } else {
            // Set an error message if the query fails
            $result["error"] = "Versuchen Sie es später erneut!";
        }

        $stmt->close();
        return $result;
    }
}

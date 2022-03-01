<?php
    include("dbconfig.php");

    //database connection
    $con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname) or die("Could not connect to the database.");

    $getInventory = "select inv_id, name from Inventory";

    $result = mysqli_query($con, $getInventory);

    if($result)
    {
        if (mysqli_num_rows($result)>0)
        {
            $inventoryArray = array();
            while($row=mysqli_fetch_array($result))
            {
                $inventoryArray[] = $row;
            }
            echo json_encode($inventoryArray);
        }
    }
?>
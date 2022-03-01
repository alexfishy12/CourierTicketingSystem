<?php
    include("dbconfig.php");

    //database connection
    $con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname) or die("Could not connect to the database.");

    //insert statement
    $sql = "insert into Tickets (c_id, inv_id, inv_quantity, create_time, status) values (?, ?, ?, ?, ?);";

    $c_id;
    $itemName = $_POST['itemName'];
    $quantity = $_POST['quantity'];
    $username = $_POST['username'];
    $status = "Open";

    $sqlAccountInfo = "select * from Customers where user_name=?";

    //get account information
    $sqlAccountInfo = "select c_id from Customers where user_name=?";
    if ($stmt = $con->prepare($sqlAccountInfo))
    {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result)
        {
            if (mysqli_num_rows($result) > 0)
            {
                while($row=mysqli_fetch_array($result))
                {
                    $c_id = $row['c_id'];
                }
            }
            else
            {
                echo "Failed to retrieve customer information.";
            }
        }
    }
?>
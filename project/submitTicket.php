<?php
    include("dbconfig.php");

    //database connection
    $con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname) or die("Could not connect to the database.");

    //variable initialization
    $c_id;
    $inv_id = $_POST['inv_id'];
    $quantity = $_POST['quantity'];
    $username = $_POST['username'];
    $status = "Open";
    
    //get account information (customer id)
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
                
                //insert statement which uses c_id and post variables to submit ticket
                $submitTicket = "insert into Tickets (c_id, inv_id, inv_quantity, emp_id, create_time, status) values (?, ?, ?, 1, NOW(), ?);";
                if ($stmt2 = $con->prepare($submitTicket))
                {
                    $stmt2->bind_param("iiis", $c_id, $inv_id, $quantity, $status);
                    if($stmt2->execute())
                    {
                        echo "Ticket submitted.";
                    }
                    else
                    {
                        echo $stmt2->error;
                    }
                }
                else
                {
                    echo "broken 1";
                    echo mysqli_error($con);
                }
            }
            else
            {
                echo "Failed to retrieve customer information.";
            }
        }
        else
        {
            echo "broken 2";
            echo mysqli_error($con);
        }
    }
    else
    {
        echo "broken 3";
        echo mysqli_error($con);
    }
?>
<?php
    include("dbconfig.php");

    //database connection
    $con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname) or die("Could not connect to the database.");

    $userType = $_POST['userType'];
    $userID    = $_POST['userID'];

    //sql statement
    $getTickets;
    if ($userType == "C")
    {
        $getTickets = "select t_id, i.name as itemName, t.inv_quantity, t.create_time, t.status, CONCAT(c.first_name, ' ', c.last_name) as customerName, c.city, c.state, CONCAT(e.first_name, ' ', e.last_name) as employeeName, t.last_location from Tickets t left join Inventory i on t.inv_id=i.inv_id left join Customers c on t.c_id=c.c_id left join Employees e on t.emp_id=e.emp_id where t.c_id=?";
    }
    elseif($userType == "E")
    {
        $getTickets = "select t_id, i.name as itemName, t.inv_quantity, t.create_time, t.status, CONCAT(c.first_name, ' ', c.last_name) as customerName, c.city, c.state, CONCAT(e.first_name, ' ', e.last_name) as employeeName, t.last_location from Tickets t left join Inventory i on t.inv_id=i.inv_id left join Customers c on t.c_id=c.c_id left join Employees e on t.emp_id=e.emp_id where t.emp_id=?";
    }

    if ($stmt = $con->prepare($getTickets))
    {
        //-> is a pointer to methods and properties of an object
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result)
        {
            if (mysqli_num_rows($result)>0)
            {
                $ticketArray = array();
                while($row=mysqli_fetch_array($result))
                {
                    $ticketArray[] = $row;
                }
                echo json_encode($ticketArray);
            }
            else
            {
                echo json_encode("ERROR:This user has no tickets.");
            }
        }
        else
        {
            echo json_encode("ERROR:" . mysqli_error($con));
        }
    }
    else
    {
        echo json_encode($con->error);
    }
?>
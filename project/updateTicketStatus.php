<?php
    include("dbconfig.php");

    //database connection
    $con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname) or die("Could not connect to the database.");

    //variable initialization
    $t_id   = $_POST['t_id'];
    $status = $_POST['status'];
    
    //get ticket information using ticketID
    $sqlTicketInfo = "select * from Tickets t left join Customers c on t.c_id=c.c_id where t_id=?";
    if ($stmt = $con->prepare($sqlTicketInfo))
    {
        $stmt->bind_param("s", $t_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result)
        {
            if (mysqli_num_rows($result) > 0)
            {
                $street;
                $city;
                $state;
                $lastLocation;
                $c_id;
                while($row=mysqli_fetch_array($result))
                {
                    //delivery address
                    $street = $row['street'];
                    $city   = $row['city'];
                    $state  = $row['state'];

                    $lastLocation = $row['last_location'];
                }

                $dateResult = mysqli_query($con, "select NOW() as date;");
                $now;
                while($row=mysqli_fetch_array($dateResult))
                {
                    $now = $row['date'];
                }

                $event;
                $stmt2;
                //update statement which updates ticket status
                if ($status == "In Transit")
                {
                    $event = "Picked up from ".$lastLocation;
                    $submitTicket = "update Tickets set status=? where t_id=?";
                    if ($stmt2 = $con->prepare($submitTicket))
                    {
                        $stmt2->bind_param("si", $status, $t_id);
                    }
                    else
                    {
                        echo mysqli_error($con);
                    }
                }
                else if ($status == "Delivered")
                {
                    $event = "Delivered to ".$street.", ".$city.", ".$state;
                    $deliveryLocation = $street. ", ". $city.", ".$state;
                    $submitTicket = "update Tickets set status=?, last_location=? where t_id=?";
                    if ($stmt2 = $con->prepare($submitTicket))
                    {
                        $stmt2->bind_param("ssi", $status, $deliveryLocation, $t_id);
                    }
                    else
                    {
                        echo mysqli_error($con);
                    }
                }
                else if ($status == "Delivery Cancelled")
                {
                    $event = "Delivery cancelled. Returned to " . $lastLocation;
                    $submitTicket = "update Tickets set status=?, last_location=?, emp_id=? where t_id=?";
                    if ($stmt2 = $con->prepare($submitTicket))
                    {
                        $newStatus = "Open";
                        $stmt2->bind_param("ssii", $newStatus, $lastLocation, 1, $t_id);
                    }
                    else
                    {
                        echo mysqli_error($con);
                    }
                }
                if($stmt2->execute())
                {   
                    $stmt4;
                    //adds event to ticketstatushistory table according to what event occurred
                    if ($status == "In Transit")
                    {
                        $lastLocationArray = explode(', ', $lastLocation);
                        $lastStreet = $lastLocationArray[0];
                        $lastCity = $lastLocationArray[1];
                        $lastState = $lastLocationArray[2];
                        echo $lastStreet." ".$lastCity." ".$lastState;

                        $sqlTicketStatusHistory = "insert into TicketStatusHistory(t_id, timestamp, event, city, state) values (?, '$now', ?, ?, ?);";
                        if ($stmt4 = $con->prepare($sqlTicketStatusHistory))
                        {
                            $stmt4->bind_param("isss", $t_id, $event, $lastCity, $lastState);
                        }
                    }
                    else if($status == "Delivered")
                    {
                        $sqlTicketStatusHistory = "insert into TicketStatusHistory(t_id, timestamp, event, city, state) values (?, '$now', ?, ?, ?);";
                        if ($stmt4 = $con->prepare($sqlTicketStatusHistory))
                        {
                            $stmt4->bind_param("isss", $t_id, $event, $city, $state);
                        }
                    }
                    else if ($status == "Delivery Cancelled")
                    {
                        $lastLocationArray = explode(', ', $lastLocation);
                        $lastStreet = $lastLocationArray[0];
                        $lastCity = $lastLocationArray[1];
                        $lastState = $lastLocationArray[2];
                        echo $lastStreet." ".$lastCity." ".$lastState;

                        $sqlTicketStatusHistory = "insert into TicketStatusHistory(t_id, timestamp, event, city, state) values (?, '$now', ?, ?, ?);";
                        if ($stmt4 = $con->prepare($sqlTicketStatusHistory))
                        {
                            $stmt4->bind_param("isss", $t_id, $event, $lastCity, $lastState);
                        }
                    }
                    if($stmt4->execute())
                    {
                        echo "Ticket updated.";
                    }
                    else
                    {
                        echo $stmt4->error;
                    }
                }
                else
                {
                    echo $stmt2->error;
                }
            }
            else
            {
                echo "Failed to retrieve ticket information.";
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
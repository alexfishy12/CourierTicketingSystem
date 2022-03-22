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

                $dateResult = mysqli_query($con, "select NOW() as date;");
                $now;
                while($row=mysqli_fetch_array($dateResult))
                {
                    $now = $row['date'];
                }
                
                $fLocation;
                $fCity;
                $fState;
                $fLatitude;
                $fLongitude;
                $resultItemFacility = mysqli_query($con, "select city, state, latitude, longitude, CONCAT(f.city, ', ', f.state) as location from Facility f left join Inventory i on f.f_id=i.f_id where i.inv_id='$inv_id'");
                while($row=mysqli_fetch_array($resultItemFacility))
                {
                    $fLocation = $row['location'];
                    $fCity = $row['city'];
                    $fState = $row['state'];
                    $fLatitude = $row['latitude'];
                    $fLongitude = $row['longitude'];
                }
                //insert statement which uses c_id and post variables to submit ticket
                $submitTicket = "insert into Tickets (c_id, inv_id, inv_quantity, emp_id, create_time, status, last_location) values (?, ?, ?, 1, '$now', ?, ?);";
                if ($stmt2 = $con->prepare($submitTicket))
                {
                    $stmt2->bind_param("iiiss", $c_id, $inv_id, $quantity, $status, $fLocation);
                    if($stmt2->execute())
                    {
                        $getTicketID = "select t_id from Tickets where c_id=? order by t_id desc limit 1";
                        if($stmt3 = $con->prepare($getTicketID))
                        {
                            $stmt3->bind_param("i", $c_id);
                            if($stmt3->execute())
                            {
                                $result2 = $stmt3->get_result();
                                $t_id;
                                while ($row=mysqli_fetch_array($result2))
                                {
                                    $t_id = $row['t_id'];
                                }

                                $sqlTicketStatusHistory = "insert into TicketStatusHistory(t_id, timestamp, event, city, state) values (?, '$now', 'Ticket Submitted', ?, ?);";
                                if ($stmt4 = $con->prepare($sqlTicketStatusHistory))
                                {
                                    $stmt4->bind_param("iss", $t_id, $fCity, $fState);
                                    if($stmt4->execute())
                                    {
                                        echo "Ticket submitted.";
                                    }
                                    else
                                    {
                                        echo $stmt4->error;
                                    }
                                }
                                else
                                {
                                    echo mysqli_error($con);
                                }
                            }
                            else
                            {
                                echo $stmt3->error;
                            }
                        }
                        else
                        {
                            echo mysqli_error($con);
                        }
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
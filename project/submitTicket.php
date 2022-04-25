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

                //get facility info where item is stored
                $resultItemFacility = mysqli_query($con, "select city, state, CONCAT(f.street, ', ', f.city, ', ', f.state) as location, f.f_id from Facility f left join Inventory i on f.f_id=i.f_id where i.inv_id='$inv_id'");
                while($row=mysqli_fetch_array($resultItemFacility))
                {
                    $fLocation = $row['location'];
                    $fid    = $row['f_id'];
                    $fCity = $row['city'];
                    $fState = $row['state'];
                }

                //get employees assigned to facility that contains the requested item
                $emp_ids = array();
                $facilityEmployees = mysqli_query($con, "select emp_id from Employees where f_id='$fid' and not emp_id='1'");
                while($row=mysqli_fetch_array($facilityEmployees))
                {
                    $emp_ids[] = $row['emp_id'];
                }

                //pick an employee at random (from those that work at the facility with the requested item)
                $emp_id = array_rand($emp_ids, 1);

                //set emp_id to demo employee emp_id (5) if customer c_id is demo customer c_id (19)
                if ($c_id == 19)
                {
                    $emp_id = 5;
                }

                //insert statement which uses c_id and post variables to submit ticket
                $submitTicket = "insert into Tickets (c_id, inv_id, inv_quantity, emp_id, create_time, status, last_location) values (?, ?, ?, $emp_id, '$now', ?, ?);";
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
<?php
    include("dbconfig.php");

    //database connection
    $con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname) or die("Could not connect to the database.");

    $userType = $_POST['userType'];
    $userID    = $_POST['userID'];

    //sql statement
    $getTicketHistory;
    if ($userType == "C")
    {
        $getTicketHistory = "select s.s_id, s.t_id, s.timestamp, s.event, CONCAT(s.city, ', ', s.state) as location from TicketStatusHistory s left join Tickets t on t.t_id=s.t_id where t.c_id=?";
    }
    elseif($userType == "E")
    {
        $getTicketHistory = "select s.s_id, s.t_id, s.timestamp, s.event, CONCAT(s.city, ', ', s.state) as location from TicketStatusHistory s left join Tickets t on t.t_id=s.t_id where t.emp_id=?";
    }

    if ($stmt = $con->prepare($getTicketHistory))
    {
        //-> is a pointer to methods and properties of an object
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result)
        {
            if (mysqli_num_rows($result)>0)
            {
                $ticketStatusArray = array();
                while($row=mysqli_fetch_array($result))
                {
                    $ticketStatusArray[] = $row;
                }
                echo json_encode($ticketStatusArray);
            }
            else
            {
                echo json_encode("ERROR:This user has no ticket history.");
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
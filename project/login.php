<?php
    include("dbconfig.php");

    $username = $_POST["username"];
    $password = $_POST["password"];
    if ($username == NULL || $username == "" || $password == NULL || $password == "")
    {
        echo "Username or password left blank.";
        die();
    }

    //connects to database
    $con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname) or die("Could not connect to the database.");

    $checkLogin = "select user_name from Customers where user_name=?;";
    $username = $_POST['username'];

    if($stmt = $con->prepare($checkLogin))
    {
        //-> is a pointer to methods and properties of an object
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result)
        {
            if (mysqli_num_rows($result) > 0)
            {
                //username matches, now execute check password
                $checkPassword = "select * from Customers where user_name=? and password=?;";
                $password = $_POST['password'];

                if ($stmt = $con->prepare($checkPassword))
                {
                    //-> is a pointer to methods and properties of an object
                    $stmt->bind_param("ss", $username, $password);
                    $stmt->execute();
                    $result = $stmt->get_result();

                    if ($result)
                    {
                        if(mysqli_num_rows($result) > 0)
                        {
                            $fname;
                            $lname;
                            while ($row = mysqli_fetch_array($result))
                            {
                                $fname = $row['first_name'];
                                $lname = $row['last_name'];
                                $c_id  = $row['c_id'];
                            }
                            echo "$fname,$lname,$c_id";                        
                        }
                        else
                        {
                            echo "ERROR:Username exists, but password is incorrect.";
                        }
                    }
                    else
                    {
                        echo "ERROR:" . mysqli_error($con);
                    }
                }
            }
            else
            {
                //username does not match
                echo "ERROR:Username does not exist.";
            }
        }
        else
        {
            echo "ERROR:" . mysqli_error($con);
        }
    }
    else
    {
        echo "ERROR:" . mysqli_error($con);
    }

    $stmt->close();
    $con->close();
?>
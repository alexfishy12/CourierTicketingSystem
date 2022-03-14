<?php
    include("dbconfig.php");

    //database connection
    $con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname) or die("Could not connect to the database.");

    //insert statement
    $sql = "insert into Customers (user_name, first_name, last_name, email, password, street, state, city, zipcode, date_time) values (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());";

    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $address = $_POST['address'];
    $city = $_POST['city'];
    $state = $_POST['state'];
    $zipcode = $_POST['zipcode'];

    //check if username already exists
    $checkUsername = "select user_name from Customers where user_name=?";
    if ($stmt = $con->prepare($checkUsername))
    {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result)
        {
            if (mysqli_num_rows($result) > 0)
            {
                echo "ERROR:Username already exists.";
            }
            else
            {
                //if statement is successfully prepared
                if($stmt = $con->prepare($sql))
                {
                    //-> is a pointer to methods and properties of an object
                    $stmt->bind_param("sssssssss", $username, $fname, $lname, $email, $password, $address, $state, $city, $zipcode);
                    $stmt->execute();
                    $result = $stmt->get_result();

                    
                    $result2 = mysqli_query($con, "select c_id from Customers where user_name='$username'");
                    if ($result2)
                    {
                        while($row=mysqli_fetch_array($result2))
                        {
                            $userID = $row['c_id'];
                            echo $userID;
                        }
                    }
                    else
                    {
                        echo mysqli_error($con);
                    }
                }
                else
                {
                    echo "ERROR:". mysqli_error($con);
                }
            }
        }
    }
?>
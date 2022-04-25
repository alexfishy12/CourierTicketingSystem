var isChecked = null;

$(document).ready(function(){
    $("#signIn").submit(function(e){
        e.preventDefault();
        getFormDetails();
    });
});

function getFormDetails(){
    const username = $("#username").val();
    const password = $("#password").val();

    if (username == "")
    {
        $("#message").text("Username left blank.");
    }
    else if (password == "")
    {
        $("#message").text("Password left blank.");
    }
    else
    {
        checkLogin(username, password).done(function(response){
            if (response.includes("ERROR"))
            {
                console.log(response);
                $('#message').show();
                $('#message').text(response);
            }
            else
            {
                response = response.split(',');
                
                //expiration for cookie
                const d = new Date();
                d.setTime(d.getTime() + (60*60*1000));
                let expiration = d.toLocaleString();
    
                //set full name cookie
                const fullName = response[0] + " " + response[1];
                document.cookie = "fullName=" + fullName + "; expires=" + expiration + ";path=/";
    
                //welcome message
                $('#container').html("<h1 class='display-5'>Welcome, "+ fullName + ".</h1>");
                
                // set username cookie
                document.cookie = "username=" + username + "; expires=" + expiration + ";path=/";
                
                // set userType cookie
                document.cookie = "userType=" + isChecked + "; expires=" + expiration + ";path=/";

                // set user id cookie
                const userID = response[2];
                document.cookie = "userID=" + userID + "; expires=" + expiration + ";path=/";

                if(isChecked == "C"){    
                    sleep(2000).then(() => goHomeC());
                }else if(isChecked == "E"){
                    if(userID == 1)
                    {
                        sleep(2000).then(() => goHomeA());
                    }
                    else
                    {
                        sleep(2000).then(() => goHomeE());
                    }
                }
            }
        });
    }
}

function checkEmp(){
    isChecked = "E";
    $("#emp").attr("class", "col btn-dark btn-lg");
    $("#cust").attr("class", "col btn-muted btn-lg");
    console.log(isChecked);
}

function checkCust(){
    isChecked = "C";
    $("#cust").attr("class", "col btn-dark btn-lg");
    $("#emp").attr("class", "col btn-muted btn-lg");
    console.log(isChecked);
}

function checkLogin(username, password){
   if (isChecked == "C"){
        console.log('checkLogin function executing...');
        //use jQuery PLEASE    
        return $.ajax({
            url: 'login.php',
            dataType: 'text',
            type: 'POST',
            data: {username: username, password: password},
            success: function (response, status) {
                console.log('AJAX Success.');
                return response;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('AJAX Error:' + textStatus);
                return "Error " . textStatus;
            }
        });
    }
    else if (isChecked == "E"){
        console.log('checkLogin function executing...');
        //use jQuery PLEASE    
        return $.ajax({
            url: 'loginE.php',
            dataType: 'text',
            type: 'POST',
            data: {username: username, password: password},
            success: function (response, status) {
                console.log('AJAX Success.');
                return response;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('AJAX Error:' + textStatus);
                return "Error " . textStatus;
            }
        });
    }
    else{
        $('#message').text("Please select Employee or Customer.");
    }
}

function goHomeA()
{
    window.location.href = "admin/index.html";
}

function goHomeC()
{
    window.location.href = "customerHome.html";
}

function goHomeE()
{
    window.location.href = "employeeHome.html";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
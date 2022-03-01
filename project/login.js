$(document).ready(function(){
    $("#signIn").submit(function(e){
        e.preventDefault();
        getFormDetails();
    });
});

function getFormDetails(){
    const username = $("#username").val();
    const password = $("#password").val();

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
            sleep(2000).then(() => goHome());
        }
    });;
}

function checkLogin(username, password){
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

function goHome()
{
    window.location.replace("http://localhost/CPS4961/customerHome.html");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
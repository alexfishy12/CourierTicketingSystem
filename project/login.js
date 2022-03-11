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

            if(isChecked == "C"){


            sleep(2000).then(() => goHomeC());
            }else if(isChecked == "E"){

                sleep(2000).then(() => goHomeE());

            }
        }
    });;
}


function checkEmp(){
    isChecked = "E";

console.log(isChecked);


}
function checkCust(){
    isChecked = "C";
    
    console.log(isChecked);
    
    
    }




function checkLogin(username, password){
    //if(isChecked == "null"){
    //    alert("Please select an option!")

   // } else 
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
}else if (isChecked == "E"){
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


}else{
    alert("please select a employee or customer!!")
}
}
function goHomeC()
{
    window.location.replace("http://localhost/CPS4961/customerHome.html");
}

function goHomeE()
{
    window.location.replace("http://localhost/CPS4961/employeeHome.html");
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
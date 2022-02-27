$(document).ready(function(){
    $("#createAccount").submit(function(e){
        e.preventDefault();
        getFormDetails();
    });
});

function getFormDetails(){
    const fName = $("#fName").val();
    const lName = $("#lName").val();
    const email = $("#email").val();
    const username = $("#username").val();
    const password = $("#password").val();
    const address = $("#address").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const zipcode = $("#zipcode").val();

    createAccount(fName, lName, email, username, password, address, city, state, zipcode);
}

function createAccount(fn, ln, e, u, p, a, c, s, z){
    console.log('createAccount function executing...');
    //use jQuery PLEASE    
    return $.ajax({
        url: 'createUser.php',
        dataType: 'text',
        type: 'POST',
        data: {fname: fn, lname: ln, email: e, username: u, password: p, address: a, city: c, state: s, zipcode: z},
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
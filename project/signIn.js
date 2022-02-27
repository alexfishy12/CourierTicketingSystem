$(document).ready(function(){
    $("#signIn").submit(function(e){
        e.preventDefault();
        signIn();
    });
});

function signIn()
{
    window.location.replace("http://localhost/CPS4961/customerHome.html");
}
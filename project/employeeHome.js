const username = getCookie('username');
const fullName = getCookie('fullName');
const userType = getCookie('userType');
const userID   = getCookie('userID');
var inventory;

$(document).ready(function(){
    if (username == "")
    {
        $('body').html("You must be logged in to view this page.");
    }
    else
    {
        $("#welcome").text("Welcome, " + fullName);
    }

    generateList(userType, userID);
});

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i <ca.length; i++) {
      	let c = ca[i];
      	while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
    return "";
}
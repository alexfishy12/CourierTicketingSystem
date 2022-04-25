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

//gets ticket update from button click
function getTicketUpdate(t_id){
    console.log("Button for ticket " + t_id + " pressed.");
    var status = $("#updateTicket" + t_id).val();
    console.log("Status for ticket " + t_id + " is " + status);

    
    updateTicketStatus(t_id, status).done(function(response){
        console.log(response);
        reloadTIcket(t_id);
    });
}

function cancelDelivery(t_id){
    console.log("Cancel Delivery requested for ticket #: " + t_id);
    var status = $("#cancelDelivery" + t_id).val();
    console.log("Status for ticket #: " + t_id + " is: " + status);

    updateTicketStatus(t_id, status).done(function(response){
        console.log(response);
        reloadTIcket(t_id);
    })
}

//changes status of ticket in database and creates a status history event
function updateTicketStatus(t_id, status){
    return $.ajax({
        url: 'updateTicketStatus.php',
        dataType: 'text',
        type: 'POST',
        data: {t_id, status},
        success: function (response, status) {
            console.log('AJAX Success.');
            console.log(status);
            return response;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('AJAX Error:' + textStatus);
            return "Error " . textStatus;
        }
    });
}


//gets form details from ticket update
function getUpdateTicketFormDetails(){

}

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
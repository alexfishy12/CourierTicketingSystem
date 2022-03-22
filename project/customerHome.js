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

    getInventory().done(function(response){
        inventory = response;
        console.log(response);
        populateItemOptions();
    });

    generateList(userType, userID);
    
    $("#createTicket").submit(function(e){
        e.preventDefault();
        getFormDetails();
        $("#createTicketModal").modal('hide');
        $("#createTicket").trigger('reset');
    });
});

function populateItemOptions()
{
    jQuery.each(inventory, function(){
        $("#itemName").append("<option value='" + this.inv_id + "'>"+this.name+"</option>");
        console.log(this.inv_id + " is " + this.name);
    });
}

function getFormDetails()
{
    var inv_id = $("#itemName").val();
    var quantity = $("#quantity").val();

    submitTicket(inv_id, quantity).done(function(response){
        console.log(response);
        if(response.includes("ERROR"))
        {
            $("#submitMessage").text(response);
        }
        else
        {
            generateList(userType, userID);
            $("#submitMessage").text("Ticket submitted!");
        }
    });
}

function submitTicket(inv_id, quantity){
    console.log('submitTicket function executing...');
    console.log('username: ' +username + " inv_id: " + inv_id + " quantity: " + quantity);
    //use jQuery PLEASE    
    return $.ajax({
        url: 'submitTicket.php',
        dataType: 'text',
        type: 'POST',
        data: {inv_id: inv_id, quantity: quantity, username: username},
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

function getInventory(){
    console.log('getInventory function executing...');
    //use jQuery PLEASE    
    return $.ajax({
        url: 'getInventoryItems.php',
        dataType: 'json',
        type: 'get',
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
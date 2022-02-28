const username = getCookie('username');
const fullName = getCookie('fullName');

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
        console.log(response);
    });

    $("#createTicket").submit(function(e){
        e.preventDefault();
        getFormDetails();
    });
});

function getFormDetails()
{
    const itemName = $("#itemName");
    const quantity = $("#quantity");

    submitTicket(itemName, quantity).done(function(response){
        if(response.includes("ERROR"))
        {
            $("#submitMessage").text(response);
        }
    });
}

function submitTicket(itemName, quantity){
    console.log('submitTicket function executing...');
    console.log('username: ' +username + " itemName: " + itemName + " quantity: " + quantity);
    //use jQuery PLEASE    
    return $.ajax({
        url: 'submitTicket.php',
        dataType: 'text',
        type: 'POST',
        data: {itemName: itemName, quantity: quantity, username: username},
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
function generateList(userType, userID)
{
    console.log(userType + " ID: " + userID);
    getTickets(userType, userID).done(function(ticketsResponse){
        getTicketStatus(userType, userID).done(function(ticketStatusResponse){
            console.log(ticketsResponse);
            if (ticketsResponse.includes("ERROR"))
            {
                ticketsResponse = ticketsResponse.split(":");
                $("#list").text(ticketsResponse[1]);
            }
            else
            {
                if (ticketStatusResponse.includes("ERROR"))
                {
                    ticketStatusResponse = ticketStatusResponse.split(":");
                    alert("ERROR: " + ticketStatusResponse[1]);
                }
                console.log(ticketsResponse);
                console.log(ticketStatusResponse);
        
                $("#list").html("<div class='accordion px-0' id='ticketList'></div>");
                const tickets = ticketsResponse;
                var count = 0;
                var openCount = 0;
                var closedCount = 0;
                jQuery.each(tickets, function(){
                    $("#ticketList").append("<div class='accordion-item px-0'>" +
                            "<h2 class='accordion-header row row-cols-5 text-center my-0' id='heading" + this.t_id +"'>" + 
                            "<button class='accordion-button collapsed dropdown-toggle py-2 px-0 border border-3 border-border-start-2 border-end-2 border-top-0 border-bottom-2' type='button' data-bs-toggle='collapse' data-bs-target='#collapse" + this.t_id +"' aria-expanded='false' aria-controls='collapse" + count + "'>" +
                                "<div class='col border border-2 border-end-5 border-top-0 border-bottom-0 border-start-0 text-center'>" + this.t_id + "</div>" +
                                "<div class='col border border-2 border-end-5 border-top-0 border-bottom-0 border-start-0 text-center'>" + this.itemName + "</div>" +
                                "<div class='col border border-2 border-end-5 border-top-0 border-bottom-0 border-start-0 text-center'>" + this.create_time + "</div>" +
                                "<div class='col border border-2 border-end-5 border-top-0 border-bottom-0 border-start-0 text-center'>" + this.status + "</div>" +
                                "<div class='col text-center'>" + this.city + ", " + this.state + "</div>" +
                            "</button></h2>" +
                            "<div id='collapse" + this.t_id + "' class='accordion-collapse collapse' aria-labelledby='heading" + this.t_id + "' data-bs-parent='#ticketList'>" +
                                "<div class='accordion-body'>" + 
                                    "<div class='row' id='employeeFunctions" + this.t_id + "'>" +
                                    "</div><br>" +
                                    "<div class='row'>" + 
                                        "<div class='col'>" + 
                                             //"<svg id='my_dataviz' width='440' height='300'></svg> +"
                                             "<div id='map'></div>" +
                                        "</div>" + 
                                        "<div class='col'>" +
                                            "<div class='row row-cols-2'>" + 
                                                "<div class='col border border-2'><strong>Ticket ID</strong></div>" + 
                                                "<div class='col border border-2'>" + this.t_id + "</div>" +
                                                "<div class='col border border-2'><strong>Item Name</strong></div>" +
                                                "<div class='col border border-2'>" + this.itemName + "</div>" + 
                                                "<div class='col border border-2'><strong>Quantity</strong></div>" + 
                                                "<div class='col border border-2'>" + this.inv_quantity + "</div>" + 
                                                "<div class='col border border-2'><strong>Submission Date</strong></div>" + 
                                                "<div class='col border border-2'>" + this.create_time + "</div>" + 
                                                "<div class='col border border-2'><strong>Submitted by</strong></div>" + 
                                                "<div class='col border border-2'>" + this.customerName + "</div>" + 
                                                "<div class='col border border-2'><strong>Last Recorded Location</strong></div>" + 
                                                "<div class='col border border-2'>" + this.last_location + "</div>" + 
                                                "<div class='col border border-2'><strong>Status</strong></div>" +
                                                "<div class='col border border-2'>" + this.status + "</div>" + 
                                            "</div><br>" +
                                            "<b>History</b >" +
                                            "<div class='row row-cols-3'>" +
                                                "<div class='col border border-2'><strong>Date</strong></div>" +
                                                "<div class='col border border-2'><strong>Event</strong></div>" +
                                                "<div class='col border border-2'><strong>Location</strong></div>" +
                                            "</div>" +
                                            "<div id='" + this.t_id + "history'></div>" +
                                        "</div>" +
                                    "</div>");
                                $("#ticketList").append("</div>" +
                            "</div>" +
                    "</div>");
                    var ticketID = this.t_id;
                    var historyDiv = this.t_id + "history";
                    jQuery.each(ticketStatusResponse, function(){
                        if(this.t_id == ticketID)
                        {
                            $("#" + historyDiv).append("<div class='row' row-cols-3>" +
                                "<div class='col border border-2'>" + this.timestamp + "</div>" +
                                "<div class='col border border-2'>" + this.event + "</div>" +
                                "<div class='col border border-2'>" + this.location + "</div>" +
                                "</div>"
                            );
                        }
                    });
                    count++;
                    if (this.status == "Open" ||this.status == "In Transit")
                    {
                        openCount++;
                    }
                    else
                    {
                        closedCount++;
                    }

                    //if employee is logged in, show update buttons
                    if (userType == "E")
                    {
                        $("#employeeFunctions" + this.t_id).append("" +
                            "<div class='col'>" +
                                "<form id='updateTicketForm'>" +
                                    "<input type='hidden' name='status' value='Picked Up'>" +
                                    "<div class='row row-cols-2'>" +
                                        "<div class='col'>" +
                                            "<div class='justify-content-center d-flex align-items-center' id='status" + this.t_id + "'>" +
                                                "Ticket Status: At " + this.last_location +
                                            "</div>" +
                                        "</div>" +
                                        "<div class='col' id='updateButtonCol" + this.t_id + "'>" +
                                            "<button class='btn btn-primary' type='button' onclick='getTicketUpdate(" + this.t_id + ")' id='updateTicket" + this.t_id + "' value='test'>Update Status</button>" +
                                        "</div>" +
                                    "</div>" +
                                "</form>" +
                            "</div><br>"
                        );

                        if (this.status == "Open" || this.status == "Awaiting Delivery")
                        {
                            $("#status" + this.t_id).attr('class', 'col border rounded bg-primary text-light p-1');
                            $("#status" + this.t_id).html("Ticket Status: At " + this.last_location);

                            $("#updateTicket" + this.t_id).attr('class', 'btn btn-primary');
                            $("#updateTicket" + this.t_id).html("Picked up from " + this.last_location);
                            $("#updateTicket" + this.t_id).attr('value', 'In Transit');
                        }
                        else if (this.status == "In Transit")
                        {
                            $("#status" + this.t_id).attr('class', 'col border rounded bg-warning text-dark p-1');
                            $("#status" + this.t_id).html("Ticket Status: In Transit");

                            $("#updateTicket" + this.t_id).attr('class', 'btn btn-success');
                            $("#updateTicket" + this.t_id).html("Dropped off to " + this.city + ", " + this.state);
                            $("#updateTicket" + this.t_id).attr('value', 'Delivered');
                        }
                        else if (this.status == "Delivered")
                        {
                            $("#status" + this.t_id).attr('class', 'col border rounded bg-success text-light p-1');
                            $("#status" + this.t_id).html("Ticket Status: Delivered");

                            $("#updateButtonCol" +this.t_id).html("");
                        }
                    }
                    //generateMap();
                    var mapDest = this.city + ", " + this.state;
                    initMap();
                });
                $("#allTicketsCount").text(count);
                $("#openTicketsCount").text(openCount);
                $("#closedTicketsCount").text(closedCount);
            }
        });
    });
}

function getTickets(userType, userID)
{
    console.log('getTickets function executing... userType: ' + userType + ' userID: ' + userID);
    //use jQuery PLEASE    
    return $.ajax({
        url: 'getTickets.php',
        dataType: 'json',
        type: 'POST',
        data: {userType: userType, userID: userID},
        success: function (response, status) {
            console.log('AJAX Success.');
            return response;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('AJAX Error:' + textStatus + "\nThrown Error: " + errorThrown + "\nResponse: " + XMLHttpRequest.responseText);
            return "Error " . textStatus;
        }
    });
}

function getTicketStatus(userType, userID)
{
    console.log('getTicketStatus function executing... userType: ' + userType + ' userID: ' + userID);
    //use jQuery PLEASE    
    return $.ajax({
        url: 'getTicketHistory.php',
        dataType: 'json',
        type: 'POST',
        data: {userType: userType, userID: userID},
        success: function (response, status) {
            console.log('AJAX Success.');
            return response;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('AJAX Error:' + textStatus + "\nThrown Error: " + errorThrown + "\nResponse: " + XMLHttpRequest.responseText);
            return "Error " . textStatus;
        }
    });
}
/*
function generateMap(){
    // The svg
    const svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
    // Map and projection
    const projection = d3.geoMercator()
        .scale(85)
        .translate([width/2, height/2*1.3])
    
    // Create data: coordinates of start and end //long then lat
    const link = {type: "LineString", coordinates: [[-76.843438, 38.849834], [-72.906602, 41.990464]]} // Change these data to see ho the great circle reacts
    
    // A path generator
    const path = d3.geoPath()
        .projection(projection)
    
    // Load world shape
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( function(data){
    
        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
                .attr("fill", "#b8b8b8")
                .attr("d", path)
                .style("stroke", "#fff")
                .style("stroke-width", 0)
    
        // Add the path
        svg.append("path")
          .attr("d", path(link))
          .style("fill", "none")
          .style("stroke", "orange")
          .style("stroke-width", 7)
    })
} */


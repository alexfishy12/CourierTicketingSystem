var start = "montvale, nj";
var end = "newark, nj";

function setLocations(origin, destination){
    start = origin;
    end = destination;
}

function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    //console.log("From initMAP   "+t_id)
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 },
    });

    directionsRenderer.setMap(map);
  
    calculateAndDisplayRoute(directionsService, directionsRenderer);

    const onChangeHandler = function(){
      calculateAndDisplayRoute(directionsService, directionsRenderer);
      console.log('onChangeHandler working...');
    }

    $(".accordion-collapse").on("show.bs.collapse", function(){
      var locationsElem = $(this).find( "div[name='locations']")[0];
      
      console.log($(locationsElem).text());
      var locations = $(locationsElem).text();

      locations = locations.split(';');
      console.log("start: " + locations[0] + "\nend: " + locations[1]);
      start = locations[0];
      end = locations[1];
      onChangeHandler();
    });
  }
  
  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService
    .route({
      origin: {
        query: start,
      },
      destination: {
        query: end,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
      console.log("setting directions to " + end);
    })
    .catch((e) => window.alert("Directions request failed due to " + e));
    console.log("calculating and displaying route");
  }
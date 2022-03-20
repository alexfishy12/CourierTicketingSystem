
function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    //console.log("From initMAP   "+t_id)
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 },

    });
  
    directionsRenderer.setMap(map);
  
    const onChangeHandler = function () {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    };
  
    //document.getElementById("start").addEventListener("change", onChangeHandler);
    //document.getElementById("end").addEventListener("change", onChangeHandler);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  }
  
  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService
      .route({
        origin: {
          //query: document.getElementById("start").value,
          query: 'newark, nj',
        },
        destination: {
            query: 'union, nj',
          //query: document.getElementById("end").value,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }
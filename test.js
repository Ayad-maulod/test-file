var userLatLng; // Declare userLatLng as a global variable
var userMarker;
var map;
    function initMap() {
        var mapOptions = {
            zoom: 15,
            center: userLatLng,
            
            // mapTypeId: google.maps.MapTypeId.ROADMAP,

            // styles: [
            //     {
            //         "elementType": "geometry",
            //         "stylers": [{ "color": "#242f3e" }]
            //     },
            //     {
            //         featureType: "road",
            //         elementType: "geometry",
            //         stylers: [{ lightness: 100 },{ visibility: "simplified" }]
            //     },
            //     {
            //         "elementType": "labels.text.stroke",
            //         "stylers": [{ "color": "#242f3e" }
            //         ]
            //     },
            //     {
            //         "elementType": "labels.text.fill",
            //         "stylers": [{ "color": "#746855" }
            //         ]
            //     },
            //     {
            //         "featureType": "administrative.locality",
            //         "elementType": "labels.text.fill",
            //         "stylers": [{ "color": "#d59563" }
            //         ]
            //     },
            //     // Add more style rules as needed
            // ]
        
        };
        
    
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
        var watchId = navigator.geolocation.watchPosition(function (position) {
            userLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
for(var i =0;i<1;i++){

}
map.setCenter(userLatLng);











            if (userMarker) {
                userMarker.setPosition(userLatLng);
                updateMarkerIcon(position.coords);
            } else {
                userMarker = new google.maps.Marker({
                    position: userLatLng,
                    map: map,
                    title: 'Your Location',
                    icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 5,
                        rotation: position.coords.heading }
                });
    
                google.maps.event.addListener(userMarker, 'click', function () {
                    alert('Your Location clicked!');
                });
    
                if (google.maps.places) {
                    searchNearbyHospitals(map, userLatLng);
                } else {
                    console.error('PlacesService is not available.');
                }
            }
        }, function () {
            alert('Error: The Geolocation service failed.');
        }
        );

        var customMapType = new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                // Example using Stamen Terrain tiles
                return "http://tile.stamen.com/terrain/" + zoom +
                    "/" + coord.x + "/" + coord.y + ".png";
            },
            tileSize: new google.maps.Size(256, 256),
            name: "Custom Map Type",
            maxZoom: 18,
        });
        
        
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.overlayMapTypes.insertAt(0, customMapType);
        


    }     //initmap close parentheses
    

// updating marker rotation   incomplete
function updateMarkerIcon(heading) {
        if (userMarker) {
            userMarker.setIcon({
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 5,
                rotation: heading
                
            });
            console.log(userMarker)
        }
}

var resulttest;
//finding nearby hospitals
function searchNearbyHospitals(map, location) {

        var request = {
            location: location,
            radius:1000,
            query: 'hospital emergency'
        };
    
        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, processResults);
        function processResults(results, status, pagination) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createHospitalMarker(map, results[i]);
                    
                    resulttest=results[i].name;
                    console.log(resulttest)
                    // let selectedplace=document.getElementById("selectedPlace").innerHTML=results[i]
                        
                }
    
                // Check if there are more results and retrieve them
                if (pagination.hasNextPage) {
                    pagination.nextPage();
                }
            } else {
                console.error('Error in PlacesService request: ' + status);
            }
        }



}
// Declare clickedPlaceCoordinates as a global variable
var clickedPlaceCoordinates;

// selecting the hospitals by marking its location
function createHospitalMarker(map, place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        icon: {
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/hospitals.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    // Add a click event listener for the marker to capture the clicked coordinates
    google.maps.event.addListener(marker, 'click', function () {
        // Update the global clickedPlaceCoordinates variable with the marker's position
        clickedPlaceCoordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
  
        document.getElementById("selectedPlace").innerHTML = place.name;

        // Optionally, you can perform additional actions or UI updates based on the click event
        console.log('Clicked coordinates:', clickedPlaceCoordinates);
        // console.log(resulttest)
    });




    var currentRoadLine = null;


    function createRoadLine(map, destination) {
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
        });
    
        if (currentRoadLine) {
            currentRoadLine.setMap(null);
        }
    
       
        var request = {
            origin: userLatLng,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
        };
    
        // console.log('Directions Request:', request); // Log the request object
    
        directionsService.route(request, function (response, status) {
            // console.log('Directions Response:', response); // Log the response object
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                currentRoadLine = directionsDisplay;

    
            } else {
                console.error('Error in DirectionsService request: ' + status);
            }
        });}
    
    

    // Add an event listener for the button to create a road line
    document.getElementById('createRoadLineButton').addEventListener('click', function () {
        // Check if the user has clicked on the map before creating the road line
        if (clickedPlaceCoordinates) {
            
            createRoadLine(map, clickedPlaceCoordinates);
            console.log(clickedPlaceCoordinates)
        } else {
            console.log('Please click on the map to set the destination.')
        }
    });








}

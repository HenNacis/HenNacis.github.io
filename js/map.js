var fbStat;
var pos;
var markers = [];
var map;
var infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    //34.072687,-118.214563
    //Corn Man - 2338 Workman St, Los Angeles, CA 90031
    center: {lat: 34.072687, lng: -118.214563},
    zoom: 18
  });
  infoWindow = new google.maps.InfoWindow;

  getUserLocation(map);

  addMapMarkers(dbMarkers);
}

function getUserLocation(gMap){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        //34.0002065,-117.5783486
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Your Location.');
      infoWindow.open(gMap);
      gMap.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, gMap.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, gMap.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed. Make sure you allow geolocation' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(gMap);
  }
}

var modal = document.getElementById('myModal');
var butttons = document.getElementsByClassName('modalBtn');
modal.style.display = "block";
modal.style.backgroundColor = "#ff000028";
spotContent.style.display = "none";
pointsContent.style.display = "none";
aboutContent.style.display = "none";
aboutContent2.style.display = "block";
for(var i=0; i<butttons.length; i++){
  butttons[i].onclick = function(){
    showModal(this);
  }
}
var navBtns = document.getElementsByClassName('modalBtn');

function showModal(event){
  modal.style.display = "block";
  var id = event.id;
  console.log("on."+id);
  if(id === 'spotModalBtn'){
    pointsContent.style.display = "none";
    aboutContent.style.display = "none";
    spotContent.style.display = "block";
    initMiniMap();
  }else if(id === 'rankModalBtn'){
    spotContent.style.display = "none";
    aboutContent.style.display = "none";
    pointsContent.style.display = "block";
    showUsers();
  }else if(id === 'aboutModalBtn'){
    spotContent.style.display = "none";
    pointsContent.style.display = "none";
    aboutContent.style.display = "block";
  }
}

function showUsers(){
  //console.log("User Rankings");
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        var users = JSON.parse(xhr.response);
        var items = `<tr><th>User</th><th>Points</th></tr>`;
        //console.log(users);
        users.forEach(user => {
          items += `<tr><td>${user.username}</td><td>${user.points}</td></tr>`;
        });
        document.getElementById("usersTable").innerHTML = items;
      }
  }
  xhr.open('GET', '/rankUsers', true);
  xhr.send(null);
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  console.log("span click");
  modal.style.display = "none";
  spotContent.style.display = "none";
  pointsContent.style.display = "none";
  aboutContent.style.display = "none";
}

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   console.log("window click");
//   modal.style.display = "none";
// }

function initMiniMap(){
  var miniMap = new google.maps.Map(document.getElementById('miniMap'), {
    center: pos,
    zoom: 18
  });

  //getUserLocation(miniMap);

  var circle = new google.maps.Circle({
    map: miniMap,
    center: pos,
    radius: 25,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
  });
  circle.setOptions({clickable:false});
  var marker = new google.maps.Marker({
      map: miniMap
  });
  google.maps.event.addListener(miniMap, 'click', function(event){
    //alert(circle.getCenter());
    console.log("ClickPos: ");
    console.log(event.latLng.toJSON());
    if(google.maps.geometry.spherical.computeDistanceBetween(event.latLng, circle.getCenter()) <= 25){
      marker.setPosition(event.latLng);
      document.getElementById('locLat').value = marker.getPosition().lat();
      document.getElementById('locLng').value = marker.getPosition().lng(); 
      console.log("MarkerPos: \n"+marker.getPosition().lat() + ", " + marker.getPosition().lng());  
      FB.getLoginStatus(function(response) {
        if(response.status === 'connected'){
          console.log(response.authResponse.userID);
          document.getElementById('id').value = parseInt(response.authResponse.userID,10);  
        }
        // else{
        //   console.log(response.status);
        //   document.getElementById('id').value = 1;  
        // }
      });
    }else{
      alert("Place marker within radius.");
    }
  });
}
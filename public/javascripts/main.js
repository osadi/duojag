window.onload=function(){
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(pos) {
  var latitude = pos.coords.latitude;
  var longitude = pos.coords.longitude;
  console.log(latitude);
  console.log(longitude);
}

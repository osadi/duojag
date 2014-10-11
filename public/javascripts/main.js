$(function() {
    // generate unique user id
    var userId = Math.random().toString(16).substring(2,15);
    var socket = io.connect("/");
    var connects = {};
    var myPosition = {};

    console.log(userId);

    socket.on("load:coords", function(data) {


        console.log(data);

        //connects[data.id] = data;
        //connects[data.id].updated = $.now(); // shorthand for (new Date).getTime()

        //var distance = distanceCaclulator(myPosition, data.coords[0]);
        //console.log('Distance in km:' + distance);
        //console.log();

        // TODO: Kolla hur man håller koll på vilka som redan finns. Om Socket.io kan det eller om det behövs ex redis
    });

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function(data){console.log(data)});
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }

    function showPosition(pos) {
        var latitude  = pos.coords.latitude;
        var longitude = pos.coords.longitude;
        var acr       = pos.coords.accuracy;

        var sentData = {
            userId: userId,
            coords: {
                lat: latitude,
                lng: longitude,
                acr: acr
            }
        }

        myPosition = {
            lat: latitude,
            lng: longitude
        }

        console.log(latitude);
        console.log(longitude);
        socket.emit("send:coords", sentData);
    }

});
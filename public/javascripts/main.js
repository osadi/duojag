$(function() {
    // generate unique user id
    var userId = Math.random().toString(16).substring(2,15);
    var socket = io.connect("/");
    var connects = {};
    var myPosition = {};

    console.log(userId);

    socket.on("load:coords", function(data) {
        // remember users id to show marker only once

        connects[data.id] = data;
        connects[data.id].updated = $.now(); // shorthand for (new Date).getTime()

        var distance = distanceCaclulator(myPosition, data.coords[0]);
        console.log('Distance in km:' + distance);

        // TODO: Kolla hur man håller koll på vilka som redan finns. Om Socket.io kan det eller om det behövs ex redis
    });

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function(data){console.log(data)});
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }

    var distanceCaclulator = function (pos1, pos2) {
        var anglePI = Math.PI / 180;
        var radianLat1 = pos1.lat * anglePI; // (angle / 180) * Math.PI;
        var radianLng1 = pos1.lng * anglePI;
        var radianLat2 = pos2.lat * anglePI;
        var radianLng2 = pos2.lng * anglePI;

        // calculate great-circle distance
        var distance = Math.acos(Math.sin(radianLat1) * Math.sin(radianLat2) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.cos(radianLng1 - radianLng2));

        // distance in human-readable format:
        // earth's radius in km = ~6371
        console.log('Dist:' + distance);
        return 6371 * distance;
    }

    function showPosition(pos) {
        var latitude  = pos.coords.latitude;
        var longitude = pos.coords.longitude;
        var acr       = pos.coords.accuracy;

        var sentData = {
            id: userId,
            coords: [{
                lat: latitude,
                lng: longitude,
                acr: acr
            }]
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
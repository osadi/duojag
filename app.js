var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = module.exports.app = express();
var server = require('http').createServer(app);

var io = require('socket.io')(server);

server.listen(3000);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Currently connected users
var currentUsers = {};
var numUsers     = 0;
var threshold    = 1000;

// listen for incoming connections from client
io.on('connection', function (socket) {
    var addedUser = false;

    // start listening for coords
    socket.on('send:coords', function (currentUser) {

        // Loop through all users. If match, do chat.
        var temp = {
            lat: 57.680545,
            lng: 11.928406
        };

        for (var user in currentUsers) {
            var distance = getDistanceFromLatLonInMeters(currentUser.coords, temp);
            if (distance < threshold) {
                // Someone is close enough
                console.log(distance);
            }
        }
        // Add user to available users list
        socket.userId = currentUser.userId;
        currentUsers[currentUser.userId] = currentUser;
        ++numUsers;
        addedUser = true;


        // broadcast your coordinates to everyone except you
        //socket.broadcast.emit('load:coords', currentUsers);
        io.emit('load:coords', currentUsers);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        // remove the username from global currentUsers list
        if (addedUser) {
            delete currentUsers[socket.userId];
            --numUsers;

            console.log('User left');
            socket.broadcast.emit('load:coords', currentUsers);
        }
    });
});

function getDistanceFromLatLonInMeters(pos1, pos2) {
    var R = 6371000; // Radius of the earth in m
    var lat1 = pos1.lat;
    var lng1 = pos1.lng;
    var lat2 = pos2.lat;
    var lng2 = pos2.lng;

    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lng2-lng1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
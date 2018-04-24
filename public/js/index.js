var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');

});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(newMessage) {
    console.log('new message', newMessage);
    var li = $('<li></li>');
    li.text(`${newMessage.from}: ${newMessage.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function(locationObj) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');

    // prevent html injection by using theses methods rather than adding into the string right away
    li.text(locationObj.from + ': ');
    a.attr('href', locationObj.url);
    li.append(a);
    $('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, function() {
        
    });
    
});

var locationButton = $('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    }, function() {
        alert('Unable to fetch location.');
    }, {maximumAge:60000, timeout:5000, enableHighAccuracy:true})
});
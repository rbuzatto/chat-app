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

    var messageTextBox = $('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val('');
    });
    
});

var locationButton = $('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    }, function() {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location.');
    }, {maximumAge:60000, timeout:5000, enableHighAccuracy:true})
});
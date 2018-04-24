var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');

});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(newMessage) {
    var formattedTime = moment(newMessage.createdAt).format('h:mm a');
    // var li = $('<li></li>');
    // li.text(`${newMessage.from} ${formattedTime}: ${newMessage.text}`);

    // $('#messages').append(li);

    var template = $('#message-template').html(); //return a markup 
    var html = Mustache.render(template, {
        text: newMessage.text,
        from: newMessage.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
});

socket.on('newLocationMessage', function(locationObj) {
    var formattedTime = moment(locationObj.createdAt).format('h:mm a');
    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My current location</a>');

    // prevent html injection by using theses methods rather than adding into the string right away
    // li.text(locationObj.from + ' ' + formattedTime + ': ');
    // a.attr('href', locationObj.url);
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        from: locationObj.from,
        createdAt: formattedTime,
        url: locationObj.url
    });
    // li.append(a);
    $('#messages').append(html);
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
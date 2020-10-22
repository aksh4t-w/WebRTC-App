const socket = io.connect('/')

// socket.emit('join-chat-room', ROOM_ID)

let message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

message.addEventListener('keypress', () => {
    socket.emit('typing', handle.value);
});

btn.addEventListener('click', () => {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = '';
});

socket.on('typing', data => {
    feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
});

socket.on('chat', data => {
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    feedback.innerHTML = '';
});

message.addEventListener('keyup', (event) => {
    if(event.key == 'Enter'){
        event.preventDefault();
        document.getElementById('send').click();
    }
})
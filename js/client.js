const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".messagecontainer")
var audio = new Audio('message-notification-sound.mp3');

//append function
const append = (message,position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message')
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){  // sound on receiving message
    audio.play();
    }
}

form.addEventListener('submit', (e) =>{  //e is the submit event object
    e.preventDefault(); // isse page reload nhi hoga dubara
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send' , message);
    messageInput.value = ''; // message send hone ke baad chat container blank ho jayega
})

const name =prompt("Enter your name to join");
//emitting(firing) an event to socket with the same name defined in scoket(server file)
socket.emit('new-user-joined',name);


socket.on('user-joined' , name=>{
    append(`${name} joined the chat`,'right')
})

socket.on('receive' , data=>{
    append(`${data.name}: ${data.message}`,'left')
})


socket.on('leftChat' , name=>{
    append(`${name}: left the chat`,'left')
})
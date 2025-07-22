//node server which will handle socket.io connections

const io=require("socket.io")(8000,{

    cors: {
        origin: "*",  // allow all origins
        methods: ["GET", "POST"]
    }
})

const users={};

io.on('connection' , socket =>{   //This sets up an event listener for new client connections.
     console.log(" New socket connected:", socket.id); //give id to every user because there can be many people with same name
     socket.on('new-user-joined',name =>{  //This sets up a custom event listener for the connected socket (It's listening for a user-joined event that is emitted from the client side )
        console.log("new user",name);
        users[socket.id] = name;  //jese hi new-user-joined event milega ye name ko append kr dega users m
        socket.broadcast.emit('user-joined',name)  //Only other users will receive this message. The sender (the new user) will not see it
    });


     //socket.on('eventName', data)
    socket.on('send', message =>{
         console.log("Message received:", message, "from", users[socket.id]);
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]}) //agar recieve kr rhe ho toh 'message' aur 'user' milega
    });

    socket.on('disconnect', message =>{
         console.log("Message received:", message, "from", users[socket.id]);
        socket.broadcast.emit('leftChat', users[socket.id]) //chat leave 
        delete users[socket.id];
    });
})

console.log("Socket server running on port 8000");

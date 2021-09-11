const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});

app.get('/', (req, res) => {
    res.send('Hello World');
})

io.on('connection', (socket) => {
    console.log('Socket is active to be connected');

    socket.on("chat", (payload) => {
        io.emit("chat", payload);
    })
})

// app.listen(5000, () => console.log(`Server is listening at port 5000`))
server.listen(5000, () => console.log(`Server is listening at port 5000`))
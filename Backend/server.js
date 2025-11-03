const http = require('http');
const app = require('./app');

const normalizePort = val =>{
    const port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }else if (port >= 0){
        return port;
    }else {
        return false;
    }
};
//process.env.PORT will take the dynamic port injected by Node and use it if it differs from 4000
const port = normalizePort(process.env.PORT || 4000);
app.set('port', port);

const errorHandler = error =>{
    if(error.syscall !== 'listen'){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
    switch (error.code){
        case 'EACCES':
            console.error (bind + 'requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + 'is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};


const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () =>{
    const address = server.address();
    //since the address is an object, it doesn't qualify as a string, therefore the bind will show as a port

    //typeof assesses the type of data that it's accompanying, in this case the server's address, to determine what type of data it is
        //since it is a type of object and not a string, the log will display the port number
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// Catching Uncaught Exception Error
process.on('unCaughtException', err => {
    console.log('Caught Exception');
    console.log(err.name, err.message);
    process.exit(1);
})
const app = require('./app');
dotenv.config({path:'./config.env'});
const db = 'mongodb+srv://pawandarji98:pawan773384@cluster0.pvxtu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology: true 
}).then(()=>{
    console.log('connected to server!');
});

const port = process.env.PORT ||5000;

const server = app.listen(port , () => {
    console.log(`App listening on port ${port}`)
});

// Error handler for bad request
process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection ! Shutting down.........');
    console.log( err.message);
    server.close( () => {
        process.exit(1);
    });
});
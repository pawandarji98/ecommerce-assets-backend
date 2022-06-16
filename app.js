const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const globalErrorHandler = require('./controllers/error-controller');
const AppError = require('./utils/app-error');
const fileRouter = require('./routes/files-upload-router');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin:'http://localhost:8100'
}));

app.use(express.static(`${__dirname}/assets`));
app.use(helmet());
app.use(compression());
app.use((req , res,  next) => {
    req.date = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
    res.status(201).json({
        status:'success',
        data: {
            message:'server running perfectly'
        }
    });
});

app.use('/api/v1/file' , fileRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);
module.exports = app;
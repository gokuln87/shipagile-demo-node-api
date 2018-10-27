const express = require('express');
const shipmentRouter = require('./routes/shipments');
const deliveryRouter = require('./routes/deliveries');
const config = require('./environment');

const app = express();

app.use(express.json());

app.use('/shipments', shipmentRouter);
app.use('/deliveries', deliveryRouter);

app.use((req, res, next) => {
    let error = new Error(`Route ${req.originalUrl} is not handled`);
    error.statusCode = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.set('Content-Type', 'application/json');
    res.status(err.statusCode || 500);
    res.json({ 'message': err.message });
});

app.listen(config.port, () => {
    console.log(`Node server started on port ${config.port} in ${config.envName} environment!`);
});



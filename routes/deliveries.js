const router = require('express').Router();
const _delivery = require('../lib/deliveries');

router.get('/', (req, res, next) => {

});

router.post('/', (req, res, next) => {
    let delivery = {};
    delivery.deliveryId = req.body.deliveryId;
    delivery.createdOn = req.body.createdOn;
    delivery.createdBy = req.body.createdBy;
    delivery.picked = req.body.picked;
    delivery.packed = req.body.packed;
    delivery.pgi = req.body.pgi;
    delivery.salesOrder = req.body.salesOrder;
    delivery.lineItems = req.body.lineItems;

    let parcelPromise = delivery.lineItems.map(item => _delivery.carrierApi.createParcelObject(item));
    Promise.all(parcelPromise)
        .then(result => {
            result.forEach((element, index) => {
                delivery.lineItems[index].parcelId = element.object_id;
            });
            return delivery;
        }).then(result => {
            _delivery.create(result)
                .then(result => {
                    res.set('Content-Type', 'application/json');
                    res.status(201).json(result);
                }, err => {
                    let error = new Error(err);
                    error.statusCode = 500;
                    next(error);
                });
        }).catch(err => {
            let error = new Error(err);
            error.statusCode = 500;
            next(error);
        });
});

router.delete('/', (req, res, next) => {

});

module.exports = router;

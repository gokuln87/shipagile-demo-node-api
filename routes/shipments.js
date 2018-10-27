const router = require('express').Router();
const _shipment = require('../lib/shipments');
const _delivery = require('../lib/deliveries');

router.get('/', (req, res, next) => {

});

router.post('/', (req, res, next) => {
    let shipment = {};
    shipment.shipmentId = req.body.shipmentId;
    shipment.createdOn = req.body.createdOn;
    shipment.createdBy = req.body.createdBy;
    shipment.status = req.body.status;
    shipment.planShipDate = req.body.planShipDate;
    shipment.deliveryDate = req.body.deliveryDate;
    shipment.estimatedRate = req.body.estimatedRate;
    shipment.lineItems = req.body.lineItems;
    shipment.selectedCarrier = req.body.selectedCarrier;
    shipment.carrierImage = req.body.carrierImage;
    shipment.rates = [];

    let shipFrom = {};
    shipFrom.id = req.body.shippingPoint;
    shipFrom.name = req.body.shippingPointDesc;
    shipFrom.address = req.body.shippingPointAddress;

    let shipTo = {};
    shipTo.id = req.body.soldTo;
    shipTo.name = req.body.soldToName;
    shipTo.address = req.body.soldToAddress;

    let promiseArray = [];
    promiseArray.push(_shipment.carrierApi.createAddressObject(shipFrom.address));
    promiseArray.push(_shipment.carrierApi.createAddressObject(shipTo.address));

    Promise.all(promiseArray)
        .then(result => {
            shipFrom.addressObjectId = result[0].object_id;
            shipTo.addressObjectId = result[1].object_id;
            shipment.shipFrom = shipFrom;
            shipment.shipTo = shipTo;
            return shipment;
        }).then(shipment => {
            let promiseArray = shipment.lineItems.map(item => _delivery.getDelivery(item.deliveryId));
            Promise.all(promiseArray)
                .then(docSnaps => {
                    docSnaps.forEach((docSnap, index) => {
                        if (docSnap.exists) {
                            shipment.lineItems[index].parcels = docSnap.data().lineItems.map(item => item.parcelId);
                        }
                    });
                    return shipment;
                }).then(shipment => {
                    return _shipment.carrierApi.createShipment(shipment);
                }).then(carrierShipmentObject => {
                    shipment.shipmentObjectId = carrierShipmentObject.object_id;
                    shipment.carrierStatus = carrierShipmentObject.status;
                    return shipment;
                }).then(shipment => {
                    return _shipment.carrierApi.getRatesTest(shipment.shipmentObjectId);
                }).then(rates => {
                    shipment.rates = rates.results.map((rate) => {
                        let rateObject = {};
                        rateObject.rateCreated = rate.object_created;
                        rateObject.rateObjectId = rate.object_id;
                        rateObject.amount = rate.amount;
                        rateObject.currency = rate.currency;
                        rateObject.amountLocal = rate.amount;
                        rateObject.currencyLocal = rate.amount_local;
                        rateObject.provider = rate.provider;
                        rateObject.providerImageS = rate.provider_image_75;
                        rateObject.providerImageL = rate.provider_image_75;
                        rateObject.serviceLevel = {};
                        rateObject.serviceLevel.name = rate.servicelevel.name;
                        rateObject.serviceLevel.token = rate.servicelevel.token;
                        rateObject.estimatedDays = rate.estimated_days;
                        rateObject.durationTerms = rate.duration_terms;
                        rateObject.carrierAccount = rate.carrier_account;
                        return rateObject;
                    });
                    return shipment;
                }).then(shipment => {
                    return _shipment.create(shipment);
                }).then(shipment => {
                    res.set('Content-Type', 'application/json');
                    res.status(201).json(shipment);
                }, err => {
                    let error = new Error(err);
                    error.statusCode = 500;
                    next(error);
                }).catch(err => {
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

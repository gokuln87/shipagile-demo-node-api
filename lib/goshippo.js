const config = require('../environment');
const shippo = require('shippo')(config.shippoApiToken);
const mocker = require('./mock-data');

let api = {};

api.createAddressObject = address => {
    return shippo.address.create({
        "name": address.name,
        "company": address.company,
        "street1": address.street1,
        "city": address.city,
        "state": address.state,
        "zip": address.zip,
        "country": address.country
    });
}

///* TEST *///
api.createAddressObjectTest = address => {
    return new Promise(resolve => resolve('37757d40c06e49fbae8afba5b1b2d535'));
}

api.createParcelObject = parcel => {
    return shippo.parcel.create({
        "length": parcel.length,
        "width": parcel.width,
        "height": parcel.height,
        "distance_unit": parcel.distanceUnit,
        "weight": parcel.weight,
        "mass_unit": parcel.massUnit,
    });
}

api.createShipment = shipment => {
    let parcelArray = [];

    shipment.lineItems.forEach((item) => {
        item.parcels.forEach(parcel => parcelArray.push(parcel));
    });

    return shippo.shipment.create({
        "address_from": shipment.shipFrom.addressObjectId,
        "address_to": shipment.shipTo.addressObjectId,
        "parcels": parcelArray,
        "shipment_date" : shipment.planShipDate,
        "async": true
    });
}

///* TEST *///
api.createShipmentTest = shipment => {
    return new Promise(resolve => {
        resolve({
            "object_id": "bf8c32f55c13453693c3507b02f9ee7c"
        });
    });
}

api.getRates = id => {
    return shippo.shipment.rates(id);
}

///*Test*///
api.getRatesTest = id => {
    return mocker.read('goShippo-rates-1');
}

module.exports = api;




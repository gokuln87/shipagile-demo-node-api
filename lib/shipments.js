const carrierApi = require('./goshippo');
const db = require('./firestore-init');

let shipment = {};

shipment.carrierApi = carrierApi;

shipment.create = (data) => {
    return db.collection('shipments').doc(data.shipmentId).set(data);
}

//* TEST *//
shipment.createTest = (data) => {
    console.log("final shipment data before save " + data);
    return new Promise(resolve => resolve('Test Success'));
}

shipment.delete = (id) => {

}

shipment.getList = () => {

}

module.exports = shipment;



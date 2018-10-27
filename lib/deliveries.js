const carrierApi = require('./goshippo');
const db = require('./firestore-init');

let delivery = {};

delivery.carrierApi = carrierApi;

delivery.create = (data) => {
    return db.collection('deliveries').doc(data.deliveryId).set(data);
}

delivery.delete = id => {

}

delivery.getList = () => {

}

delivery.getDelivery = id => {
    return db.collection('deliveries').doc(id).get();
}

module.exports = delivery;
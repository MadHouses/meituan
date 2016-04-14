# meituan

api client for meituan waimai open platform

## install 

    npm install meituan --save

## usage

    var MEITUAN = require('meituan');

    let mt = new MEITUAN(your_app_id, your_app_secret);
    
    const path = '/api/v1/order/confirm';
    const params = {order_id: '123'};
    
    mt.get(path, params)
        .then(body => console.log(body))
        .catch(err => console.log(err));
        
## test

    npm run test
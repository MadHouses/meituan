# meituan

api client for meituan waimai open platform

## install 

    npm install meituan --save

## usage

    var Meituan = require('meituan');

    let mt = new Meituan(your_app_id, your_app_secret);
    
    const path = '/api/v1/order/confirm';
    const params = {order_id: '123'};
    
    mt.get(path, params)
        .then(body => console.log(body))
        .catch(err => console.log(err));
        
## signature validate

    mt.validateSign(yourUrl, params)    // return true or false
    
## config

    new Meituan(your_app_id, your_app_secret, [config]);
    
    // or you can 
    
    mt.config(config);
    
#### configuration

| attribute    | description   | default  |
| -------------|:-------------:| -----:   |
| debug        | 是否线下测试    | false    |

## test

    npm run test
var api = require('./src/api');

var instance = api.getInstance({hostname: 'localhost', version: '5.0', port: 8080});
var instance2 = api.getInstance();
//var instance4 = api.getInstance({hostname: 'localhost', version: '4.0', port: 8080});

var instance3 = api.getInstance({hostname: 'localhost', version: '4.0', port: 8080}, true);

instance.login('new@user.attask', 'user').then(function(data){
    instance.search('proj', {percentComplete: 0, percentComplete_Mod: 'gt'}).then(console.log, console.error);
    //instance2.search('task', null, ['*']).then(console.log, console.error);
    //instance.logout().then(console.log, console.error);
    instance2.get('proj', '5461f8e3000006d43674695aff4cdf52').then(console.log, console.error);
    //instance.post('task', {name: 'API Task', projectID: '5461f8e3000006d43674695aff4cdf52'}).then(console.log, console.error);
}, console.error);

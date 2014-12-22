var api = require('./src/api');

api = new api('localhost', '5.0');
api.login('new@user.attask', 'user').then(function(/*data*/){
    api.get();
}, console.error);
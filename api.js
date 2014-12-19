var http = require('http'),
    path_module = require('path'),
    queryString = require('querystring');

class API {

    constructor () {
        this.httpOptions = {
            hostname: 'localhost',
            port: 8080,
            path: '/attask/api',
            method: 'GET'
        };
    }

    request(path, params = {}, fields = [], method = this.httpOptions.method) {
        return new Promise(function(resolve, reject){
            let options = {};
            Object.assign(options, this.httpOptions);
            options.method = method;
            options.path = path_module.join(this.httpOptions.path, path);

            if (fields.length !== 0) {
                Object.assign(params | {}, {fields: fields.join()});
            }
            options.path += '?' + queryString.stringify(params);

            let req = http.request(options, function(res) {
                let body = '';
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    let data = JSON.parse(body).data;
                    resolve(data);
                });
            });
            req.on('error', e => reject(e.message));
            req.end();
        }.bind(this));
    }

    login(username, password) {
        return new Promise( (resolve/*, reject*/) => {
            this.request('login', {username, password}).then((data) => {
                this.httpOptions.headers = {sessionID: data.sessionID};
                resolve(data);
            });
        });
    }

    get () {
        this.request('user/search', null, ['name']).then( data => console.log(data))
    }
}

let api = new API();
api.login('new@user.attask', 'user').then(function(data){
    api.get();
}, err => console.log(err));

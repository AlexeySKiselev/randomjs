/**
 * Created by Alexey S. Kiselev
 */

var fs = require('fs');

function RandomJS(){
    var self = this;
    this.random = {};
    this.distribution = {};
    fs.readdirSync('./core/random').forEach(function(file) {
        Object.defineProperty(self.random, file.substr(0,file.length-3),{
            __proto__: null,
            get: function(){
                return require('./core/random/' + file);
            }
        });
        Object.defineProperty(self.distribution, file.substr(0,file.length-3),{
            __proto__: null,
            get: function(){
                return require('./core/distribution/' + file);
            }
        });
    });
}

RandomJS.prototype.help = function(){
    var help = require('./core/help');
    console.log('Available Distribution methods:');
    Object.keys(help).forEach(function(method){
        console.log(method + ': ' + help[method]);
    });
};

module.exports = new RandomJS();

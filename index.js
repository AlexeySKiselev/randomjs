/**
 * Created by Alexey S. Kiselev
 */
// @flow

let fs = require('fs');

class RandomJS {
    constructor(): void {
        this.random = {};
        this.distribution = {};
        fs.readdirSync(__dirname + '/core/random').forEach((file: string): void => {
            /**
             *  Add a "random" method which contains different distribution methods
             *  @return float number correspond to distribution
             */
            Object.defineProperty(this.random, file.slice(0,-3),{
                __proto__: null,
                get: () => {
                    return require(__dirname + '/core/random/' + file);
                }
            });
            /**
             * Add a "distribution" method which contains different distribution methods
             *  @return array contains float numbers correspond to distribution
             */
            Object.defineProperty(this.distribution, file.slice(0,-3),{
                __proto__: null,
                get: () => {
                    return require(__dirname + '/core/distribution/' + file);
                }
            });
        });
    }

    help(): void {
        let help = require('./core/help');
        console.log('Available Distribution methods:');
        Object.keys(help).forEach((method: string): void => {
            console.log(method + ': ' + help[method]);
        });
    }
}

module.exports = new RandomJS();

// TODO: Create a check-values external function
// TODO: Generators
// TODO: Analysis
// TODO: Regression
// TODO: Prediction
// TODO: Shuffle
// TODO: Promise-like functions
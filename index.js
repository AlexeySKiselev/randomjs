// @flow
/**
 * Created by Alexey S. Kiselev
 */


import fs from 'fs';
import Factory from './core/factory';

class RandomJS {
    constructor(): void {
        /*this.random = {};
        this.distribution = {};
        fs.readdirSync(__dirname + '/core/random').forEach((file: string): void => {
            /!**
             *  Add a "random" method which contains different distribution methods
             *  @return float number correspond to distribution
             *!/
            Object.defineProperty(this.random, file.slice(0,-3),{
                __proto__: null,
                get: () => {
                    return require(__dirname + '/core/random/' + file);
                }
            });
            /!**
             * Add a "distribution" method which contains different distribution methods
             *  @return array contains float numbers correspond to distribution
             *!/
            Object.defineProperty(this.distribution, file.slice(0,-3),{
                __proto__: null,
                get: () => {
                    return require(__dirname + '/core/distribution/' + file);
                }
            });
        });*/
        fs.readdirSync(__dirname + '/core/methods').forEach((file: string): void => {
            /**
             *  Add a "random" method which contains different distribution methods
             *  Uses a factory pattern for creating instances of distributions classes
             *  @returns Object corresponds to distribution
             */
            Object.defineProperty(this, file.slice(0,-3),{
                __proto__: null,
                get: () => {
                    return (...params): Factory => {
                        return new Factory(file, ...params);
                    };
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
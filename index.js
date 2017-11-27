// @flow
/**
 * Created by Alexey S. Kiselev
 */

import fs from 'fs';
import Factory from './core/factory';

class RandomJS {
    constructor(): void {
        fs.readdirSync(__dirname + '/core/methods').forEach((file: string) => {
            /**
             *  Add a "random" method which contains different distribution methods
             *  Uses a factory pattern for creating instances of distributions classes
             *  @returns Object corresponds to distribution
             */
            Object.defineProperty(this, file.slice(0,-3),{
                __proto__: null,
                get: () => {
                    return (...params) => {
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
// TODO: Games
// @flow
/**
 * Created by Alexey S. Kiselev
 */

import fs from 'fs';
import Factory from './core/factory';
import AnalyzerFactory from './core/analyzerFactory';
import type { RandomArray } from './core/types';

class RandomJS {
    analyze: any;

    constructor(): void {
        this.analyze = null;

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

        /**
         * Add random array analyser
         * This method is long in constructor and short in methods
         * TODO: implement method short in constructor and long in methods
         * Use Analyzer factory to create method
         */
        Object.defineProperty(this, 'analyze', ({
            __proto__: null,
            value: (randomArray: RandomArray) => {
                return new AnalyzerFactory(randomArray);
            }
        }: Object));
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
// TODO: Pseudorandom generator
// TODO: Singletons
// TODO: add Proxy to random generators
// @flow
/**
 * Random distribution analyzer
 * Also uses AnalyzerFactory to create methods
 * Created by Alexey S. Kiselev
 */

import fs from 'fs';
import { IAnalyzerMethods } from './interfaces';

class AnalyzerFactory implements IAnalyzerMethods {
    /**
     * Main randomArray variable to work with
     * All methods will access this variable
     */
    randomArray: IAnalyzerMethods.randomArray;

    /**
     * Main object with public methods
     */
    publicMethods: IAnalyzerMethods.publicMethods;

    /**
     * Main object with public properties
     */
    publicProperties: IAnalyzerMethods.publicProperties;

    /**
     * Classic constructor
     * But in this method I am going to assign randomArray property
     * Also I am going to check type of array: if not - throw Error
     * @param randomArray<number> - input array
     * @returns {Proxy}
     */
    constructor(randomArray: Array<number>): Proxy<Promise> {
        this.randomArray = randomArray;
        this.publicMethods = {};
        this.publicProperties = {};

        /**
         * Traverse over analyzer folder, get classes from this folder
         * Copy all method (stored in "export" list of the class) to AnalyzerFactory class
         * In this case all logic will be stored in analyzer-folder classes
         * But in AnalyzerFactory class will be only representation
         * Classes constructors will receive only randomArray,
         * for extending functionality uses class inheritance
         */

        fs.readdirSync(__dirname + '/core/analyzer').forEach((file: string) => {
            let Methods: IAnalyzerMethods = require(__dirname + '/core/analyzer/' + file),
                methods: IAnalyzerMethods = new Methods(this.randomArray);
            Object.keys(methods.publicMethods).map((method: string) => {
                /**
                 * If different classes contain the same public methods
                 * Throw "Methods conflict error"
                 */
                if(this.publicMethods[method]){
                    throw new Error('Analyzer: Methods conflict');
                }
                this.publicMethods[method] = 1;

                /**
                 * If method is NOT function
                 * Store this method in publicProperties object
                 * I don't need to check methods conflict, because I did it earlier
                 */
                if(typeof methods[method] !== 'function'){
                    this.publicProperties[method] = methods[method];
                }

                Object.defineProperty(this, method, {
                    __proto__: null,
                    get: () => {
                        if(typeof methods[method] === 'function'){
                            return (...args) => {
                                return methods[method](...args);
                            };
                        }
                        return methods[method];
                    }
                });
            });
        });

        /**
         * I return Proxy, because I need to return object contains all calculated values
         * For this purpose create Proxy. If I call method - return method
         * Else (where I call class as a function) - return object with all calculated values
         * TODO: check this implementation in browser
         */
        return new Proxy(this, {
            get: (obj, method) => {
                /**
                 * If input is not array:
                 * @returns rejected Promise with error
                 */

                if(!Array.isArray(this.randomArray)) {
                    return () => {
                        return Promise.reject('Input must be an Array!');
                    };
                }

                /**
                 * If method is in class methods:
                 * @returns: resolved Promise with evaluated method
                 */
                if(method in obj) {
                    return () => {
                        return Promise.resolve(obj[method]());
                    };
                } else if(typeof method !== 'string'){
                    /**
                     * If we call class as a function (randomjs.analyze(<random_array>)):
                     * @returns resolved Promise with object contains all methods
                     */
                    return () => {
                        return Promise.resolve(obj.publicProperties);
                    };
                } else {
                    /**
                     * If there no method in methods, but we call some method:
                     * @returns rejected Promise with error
                     */
                    return () => {
                        return Promise.reject('No such method in analyzer');
                    };
                }
            }
        });
    }

    getArray() {
        return this.randomArray;
    }
}

export default AnalyzerFactory;

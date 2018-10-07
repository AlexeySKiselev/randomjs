// @flow
/**
 * Random distribution analyzer
 * Long processes in constructor, short processes in methods and properties
 * Also uses AnalyzerFactory to create methods
 * Created by Alexey S. Kiselev
 */

import fs from 'fs';
import { IAnalyzerMethods, IAnalyzerSingleton } from './interfaces';
import type {RandomArray, AnalyzerPublicMethods, AnalyzerPublicProperties} from './types';

class AnalyzerFactory implements IAnalyzerMethods {
    /**
     * Main randomArray variable to work with
     * All methods will access this variable
     */
    randomArray: RandomArray;

    /**
     * Main object with public methods
     */
    publicMethods: AnalyzerPublicMethods;

    /**
     * Main object with public properties
     */
    publicProperties: AnalyzerPublicProperties;

    /**
     * Promise array for imported classes
     * @private
     */
    _importedClasses: Array<Promise<IAnalyzerMethods>>;

    /**
     * Object for sync access to analyzer's properties and functions
     * @private
     */
    _methodsTypes: {
        [string]: string
    };

    /**
     * Classic constructor
     * But in this method I am going to assign randomArray property
     * Also I am going to check type of array: if not - throw Error
     * @param randomArray<number> - input array
     * @param options - options for analyzer methods
     * @returns {Proxy}
     */
    constructor(randomArray: RandomArray, options?: { [string]: any }): any {
        this.randomArray = randomArray;
        this.publicMethods = {};
        this.publicProperties = {};
        this._importedClasses = [];
        this._methodsTypes = {};

        /**
         * Traverse over analyzer folder, get classes from this folder
         * Copy all method (stored in "export" list of the class) to AnalyzerFactory class
         * In this case all logic will be stored in analyzer-folder classes
         * But in AnalyzerFactory class will be only representation
         * Classes constructors will receive only randomArray,
         * For extending functionality uses class inheritance
         * I created Promises for all imported classes, then store these promises to array
         * I need it to achieve asynchronously access to methods
         * Then I evaluate Promise.all to wait all promises
         * !!! Important !!! In this implementation all long processes must be stored in constructor
         * TODO: Implement light version, where all long calculations must be in particular method
         */

        fs.readdirSync(__dirname + '/core/analyzer').forEach((file: string) => {
            let Methods: IAnalyzerSingleton = require(__dirname + '/core/analyzer/' + file),
                methodsClass: Promise<IAnalyzerMethods> = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        /**
                         * If input is not array:
                         * @returns rejected Promise with error
                         */
                        if(!Array.isArray(this.randomArray)) {
                            reject('Input must be an Array!');
                        } else if(randomArray.length < 3) {
                            reject('Analyzer.Common: input randomArray is too small, that is no reason to analyze');
                        } else  {
                            resolve(Methods.getInstance(this.randomArray, options));
                        }
                    }, 0);
                });

            // Write properties and function to object for sync checking type of method
            for(let prop in Methods.publicMethods) {
                this._methodsTypes[prop] = 'property';
            }
            for(let prop in Methods.publicFunctions) {
                this._methodsTypes[prop] = 'function';
            }
            this._importedClasses.push(methodsClass);
        });

        /**
         * Create an Promise object, which will wait all imported promise classes
         * Then add properties and methods to analyzer
         * Then return a list of public properties and methods object
         */
        const PromiseMethods: Promise<any> = Promise.all(this._importedClasses)
            .then((methods: Array<IAnalyzerMethods>) => {
                /**
                 * Add methods to Factory and publicMethods
                 */
                methods.forEach((methodsClass: AnalyzerPublicProperties) => {
                    // Define Analyzer properties
                    Object.keys(methodsClass.constructor.publicMethods).forEach((classMethod: string) => {
                        /**
                         * If different classes contain the same public methods
                         * Throw "Methods conflict error"
                         */
                        if(this.publicMethods[classMethod]){
                            throw new Error('Analyzer: Methods conflict');
                        }
                        this.publicMethods[classMethod] = 1;

                        /**
                         * If method is NOT function
                         * Store this method in publicProperties object
                         * I don't need to check methods conflict, because I did it earlier
                         */
                        if(typeof methodsClass[classMethod] !== 'function'){
                            this.publicProperties[classMethod] = methodsClass[classMethod];
                        }

                        /**
                         * Assign particular properties and methods to Analyzer
                         */
                        Object.defineProperty(this, classMethod, {
                            __proto__: null,
                            get: () => {
                                if(typeof methodsClass[classMethod] === 'function'){
                                    return (...args) => {
                                        return methodsClass[classMethod](...args);
                                    };
                                }
                                return this.publicProperties[classMethod];
                            }
                        });
                    });
                    // Define Analyzer functions
                    Object.keys(methodsClass.constructor.publicFunctions).forEach((classFunction: string) => {
                        /**
                         * If different classes contain the same public methods
                         * Throw "Methods conflict error"
                         */
                        if(this.publicMethods[classFunction]){
                            throw new Error('Analyzer: Methods conflict');
                        }

                        /**
                         * If method is function
                         * Store this method in publicProperties object
                         * I don't need to check methods conflict, because I did it earlier
                         */
                        if(typeof methodsClass[classFunction] === 'function'){
                            this.publicProperties[classFunction] = methodsClass[classFunction];
                        }

                        /**
                         * Assign particular functions to Analyzer
                         */
                        Object.defineProperty(this, classFunction, {
                            __proto__: null,
                            value: (...args) => {
                                return methodsClass[classFunction](...args);
                            }
                        });
                    });
                });
                return this.publicProperties;
            })
            .catch((err) => {
                return Promise.reject(err);
            });

        /**
         * I return Proxy, because I need to return object contains all calculated values
         * For this purpose create Proxy. If I call method - return method
         * Else (where I call class as a function) - return object with all calculated values
         * TODO: check this implementation in browser
         */
        return new Proxy(PromiseMethods, {
            get: (obj: Promise<any>, method: any): any => {
                /**
                 * If method is in class methods:
                 * Excluding functions
                 * @returns: resolved Promise with evaluated method
                 */
                if(method === 'then') {
                    return (cb: Function) => {
                        return obj.then((res: any) => {
                            let result = {};
                            for(let m in res){
                                if(typeof res[m] !== 'function'){
                                    result[m] = res[m];
                                }
                            }
                            return cb.call(obj, result);
                        });
                    };
                } else if(method === 'catch') {
                    return PromiseMethods.catch.bind(obj);
                } else if(typeof method !== 'string') {
                    /**
                     * If we call class as a function (randomjs.analyze(<random_array>)):
                     * @returns resolved Promise with object contains all methods
                     */
                    return PromiseMethods
                        .then((res): any => {
                            return res;
                        });
                } else if(method in this._methodsTypes) {
                    if(this._methodsTypes[method] === 'function'){
                        return (...args) => {
                            return obj.then((res: any) => {
                                return Promise.resolve(res[method](...args));
                            });
                        };
                    } else {
                        return obj.then((res: any) => {
                            return Promise.resolve(res[method]);
                        });
                    }
                } else {
                    return Promise.reject('No such method in Analyzer');
                }
            }
        });
    }
}

export default AnalyzerFactory;

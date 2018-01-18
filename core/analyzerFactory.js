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
     * Classic constructor
     * But in this method I am going to assign randomArray property
     * Also I am going to check type of array: if not - throw Error
     * @param randomArray<number> - input array
     * @returns {Proxy}
     */
    constructor(randomArray: Array<number>): void {
        this.randomArray = randomArray;
        this.publicMethods = {};
        this.publicProperties = {};
        this._importedClasses = [];

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
                methodsClass: Promise<IAnalyzerMethods> = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(Methods.getInstance(this.randomArray));
                    }, 0);
                });

            this._importedClasses.push(methodsClass);
        });

        /**
         * After calculating all parameters evaluate .then method from Promise
         */
        Promise.all(this._importedClasses)
            .then((methods: Array<IAnalyzerMethods>) => {
                /**
                 * Add methods to Factory and publicMethods
                 */
                methods.forEach((methodsClass: AnalyzerPublicProperties) => {
                    Object.keys(methodsClass.publicMethods).forEach((method: string) => {
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
                        if(typeof methodsClass[method] !== 'function'){
                            this.publicProperties[method] = methodsClass[method];
                        }

                        /**
                         * Assign particular properties and methods to Analyzer
                         */
                        Object.defineProperty(this, method, {
                            __proto__: null,
                            get: () => {
                                if(typeof methodsClass[method] === 'function'){
                                    return (...args) => {
                                        return methodsClass[method](...args);
                                    };
                                }
                                return this.publicProperties[method];
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
                    get: (obj: AnalyzerPublicMethods, method: string): any => {
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
                            return Promise.resolve(obj[method]);
                        } else if(method === 'then') {
                            return (cb) => {
                                let promiseAnalyzer = Promise.resolve(obj.publicProperties);
                                return promiseAnalyzer.then.bind(promiseAnalyzer, cb);
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
            });
    }

    getArray() {
        return this.randomArray;
    }
}

export default AnalyzerFactory;

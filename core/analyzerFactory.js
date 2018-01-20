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
    constructor(randomArray: Array<number>): any {
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
                    Object.keys(methodsClass.publicMethods).forEach((classMethod: string) => {
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
                });
                return this.publicProperties;
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
                 * If input is not array:
                 * @returns rejected Promise with error
                 */
                if(!Array.isArray(this.randomArray)) {
                    return Promise.reject('Input must be an Array!');
                }

                /**
                 * If method is in class methods:
                 * @returns: resolved Promise with evaluated method
                 */
                if(method === 'then') {
                    return PromiseMethods.then.bind(obj);
                } else if(typeof method !== 'string') {
                    /**
                     * If we call class as a function (randomjs.analyze(<random_array>)):
                     * @returns resolved Promise with object contains all methods
                     */
                    return PromiseMethods
                        .then((res): any => {
                            return res;
                        });
                } else {
                    return PromiseMethods
                        .then((res): any => {
                            return new Promise((resolve, reject) => {
                                if(method in res) {
                                    /**
                                     * If method is in class methods:
                                     * @returns: resolved Promise with evaluated method
                                     */
                                    resolve(res[method]);
                                } else {
                                    /**
                                     * If there no method in methods, but we call some method:
                                     * @returns rejected Promise with error
                                     */
                                    reject('No such method in analyzer');
                                }
                            });
                        });
                }
            }
        });
    }
}

export default AnalyzerFactory;

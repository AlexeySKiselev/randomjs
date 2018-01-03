// @flow
/**
 * Decorators for different purposes
 * Created by Alexey S. Kiselev
 */

import { IAnalyzerMethods } from './interfaces';

/**
 * Decorator for making method public for AnalyzerFactory
 * I this decorator I am going to check publicMethods property
 * If this object does not exist - create empty object
 * Then add name of public method to this object via propertyKey value
 * In class add @PublicMethod string before every public method
 */
export let AnalyzerPublicMethod = (target: IAnalyzerMethods, propertyKey: string): void => {
    if(!target.publicMethods){
        target.publicMethods = {};
    }
    target.publicMethods[propertyKey] = 1;
};

export let AnalyzerSingleton = (Target: IAnalyzerMethods) => {
    /**
     * Create instance object initially assigned to null
     */
    Target._instance = null;

    /**
     * Add static method getInstance to target
     * Instead of using "new" keyword I use getInstance method
     */
    Object.assign(Target, {
        getInstance: (...args: any): IAnalyzerMethods => {
            /**
             * If instance haven't created - create it with arguments
             * If instance created - update params via calling constructor without creating new object
             * In total returns instance
             */
            if(!Target._instance) {
                Target._instance = new Target(...args);
            } else {
                Target._instance.constructor.apply(Target._instance, args);
            }

            return Target._instance;
        }
    });
};

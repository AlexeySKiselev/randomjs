// @flow
/**
 * Decorators for different purposes
 * Created by Alexey S. Kiselev
 */

import { IAnalyzerMethods } from './interfaces';
import type { AnalyzerPublicProperties } from './types';

/**
 * Decorator for making method public for AnalyzerFactory
 * I this decorator I am going to check publicMethods property
 * If this object does not exist - create empty object
 * Then add name of public method to this object via propertyKey value
 * In class add @PublicMethod string before every public method
 */
export const AnalyzerPublicMethod = (Target: { [property: string ]: AnalyzerPublicProperties }, propertyKey: string): void => {
    if(!Target.constructor.publicMethods){
        Target.constructor.publicMethods = {};
    }
    Target.constructor.publicMethods[propertyKey] = 1;
};

export const AnalyzerPublicFunction = (Target: { [property: string ]: AnalyzerPublicProperties }, propertyKey: string): void => {
    if(!Target.constructor.publicFunctions){
        Target.constructor.publicFunctions = {};
    }
    Target.constructor.publicFunctions[propertyKey] = 1;
};

export const AnalyzerSingleton = (Target: any): void => {
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

export function Singleton<T>(Target: any): void {
    /**
     * Create instance object initially assigned to null
     */
    Target._instance = null;

    /**
     * Add static method getInstance to target
     * Instead of using "new" keyword I use getInstance method
     */
    Object.defineProperty(Target, 'getInstance', {
        value: (...args: any): T => {
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
}

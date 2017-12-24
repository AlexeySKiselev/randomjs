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
export let PublicMethod = (target: IAnalyzerMethods, propertyKey: string): void => {
    if(!target.publicMethods){
        target.publicMethods = {};
    }
    target.publicMethods[propertyKey] = 1;
};

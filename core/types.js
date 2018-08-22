// @flow
/**
 * Project types
 * Created by Alexey S. Kiselev
 */

/**
 * Random Array type
 */
export type RandomArray = Array<number>;

/**
 * Random Array of numbers or string
 */
export type RandomArrayNumberString<T> = Array<T>;

/**
 * Random Array or String type
 */
export type RandomArrayString<T> = RandomArrayNumberString<T> | string;

/**
 * Random Array or string type or Object
 */
export type RandomArrayStringObject<T> = RandomArrayString<T> | Object;

/**
 * Analyzer public methods
 */
export type AnalyzerPublicMethods = { [method: string]: number | boolean };

/**
 * Analyzer Public properties
 */
export type AnalyzerPublicProperties = { [property: string]: any };

/**
 * In-method error type
 */
export type MethodError = { error: string | boolean };

/**
 * Analyzer PDF type
 */
export type AnalyzerPDF = {
    values: RandomArray,
    probabilities: RandomArray
};

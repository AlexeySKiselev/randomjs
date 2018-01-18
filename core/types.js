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

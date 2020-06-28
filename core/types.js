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

/**
 * Sample options
 */
export type SampleOptions = {
    shuffle: ?boolean
};

export type KFoldOptions = {
    type: 'list' | 'set',
    derange: ?boolean
}

export type HashOptions = {
    algorithm: string
}

/**
 * Percentile input
 */
export type PercentileInput<T> = Array<T> | T;

/**
 * Number or string type
 */
export type NumberString = number | string;

/**
 * Array<number> or number
 */
export type RandomArrayNumber = RandomArray | number;

/**
 * kfold crossvalidation 
 */
export type KFoldCrossValidationItem = {
    id: number,
    test: RandomArrayStringObject<any>,
    data: RandomArrayStringObject<any>
};

export type KFoldCrossValidation = Array<KFoldCrossValidationItem>;

export type SmoothData = RandomArray | {
    smoothData: RandomArray,
    diff: {[string]: any}
};

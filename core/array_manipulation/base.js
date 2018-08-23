// @flow
/**
 * Array manipulation base class
 * Created by Alexey S. Kiselev
 */

class ArrayManipulation {
    /**
     * Validate input
     * @param input: any
     * @param allowObjects: boolean - allow objects checking
     * @private
     */
    _validateInput(input: any, allowObjects: boolean = true): void {
        if(typeof input === 'string' || Array.isArray(input)) {
            if(input.length === 0) {
                throw new TypeError('Sample: input length must be greater then zero');
            }
        } else if(typeof input === 'object' && allowObjects) {
            if(Object.keys(input).length === 0) {
                throw new TypeError('Sample: input object must have at least one key');
            }
        } else if(allowObjects) {
            throw new TypeError('Sample: input must be array, string or object');
        } else
            throw new TypeError('Sample: input must be array or string');
    }
}

export default ArrayManipulation;

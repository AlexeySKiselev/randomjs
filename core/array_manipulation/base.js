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
        if(Array.isArray(input) || typeof input === 'string') {
            if(input.length === 0) {
                throw new TypeError('Input length must be greater then zero');
            }
        } else if(allowObjects && typeof input === 'object') {
            if(Object.keys(input).length === 0) {
                throw new TypeError('Input object must have at least one key');
            }
        } else if(allowObjects) {
            throw new TypeError('Input must be array, string or object');
        } else
            throw new TypeError('Input must be array or string');
    }
}

export default ArrayManipulation;

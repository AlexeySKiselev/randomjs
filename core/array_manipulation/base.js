// @flow
/**
 * Array manipulation base class
 * Created by Alexey S. Kiselev
 */

class ArrayManipulation {
    /**
     * Validate input
     * @param input: any
     * @private
     */
    _validateInput(input: any): void {
        if(typeof input === 'string' || Array.isArray(input)) {
            if(input.length === 0) {
                throw new Error('Sample: input length must be greater then zero');
            }
        } else if(typeof input === 'object') {
            if(Object.keys(input).length === 0) {
                throw new Error('Sample: input object must have at least one key');
            }
        } else
            throw new Error('Sample: input must be array, string or object');
    }
}

export default ArrayManipulation;

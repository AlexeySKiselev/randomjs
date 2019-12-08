// @flow
/**
 * Hash proxy
 * Creates hash using different hash algorithms
 * Created by Alexey S. Kiselev
 */

import type { NumberString, RandomArrayNumber } from '../../types';
import type { IHash, IHashProxy } from '../../interfaces';

import Murmur3Hash from './murmur3';

const DEFAULT_HASH_FUNCTION = 'murmur';

class HashProxy implements IHashProxy {

    _hashFunctions: {[string]: IHash};
    _allowedHashFunctions: {[string]: IHash};

    constructor() {
        this._hashFunctions = {
            'murmur': new Murmur3Hash()
        };

        this._allowedHashFunctions = {
            'default': Murmur3Hash,
            'murmur': Murmur3Hash
        };

        this._currentHashFunctionName = DEFAULT_HASH_FUNCTION;
        this._currentHashFunction = this._hashFunctions[DEFAULT_HASH_FUNCTION];
    }

    /**
     * A list of allowed hash functions
     * @returns {Array<string>} a list of hash functions
     */
    listHashFunctions(): Array<string> {
        return Object.keys(this._allowedHashFunctions);
    }

    /**
     * Current hash function name
     * @returns {string} name of current hash function
     */
    get hashFunctionName(): string {
        return this._currentHashFunctionName;
    }

    /**
     * Default hash function name
     * @returns {string} name of default hash function
     */
    getDefaultHashFunctionName(): string {
        return DEFAULT_HASH_FUNCTION;
    }

    /**
     * Sets hash algorithm
     * @param {string} name - name from allowed hash functions list
     */
    setHashFunction(name: string = DEFAULT_HASH_FUNCTION): void {
        if (this._currentHashFunctionName === name || !this._allowedHashFunctions[name]) {
            return;
        }

        if (!this._hashFunctions[name]) {
            this._hashFunctions[name] = new this._allowedHashFunctions[name]();
        }
        this._currentHashFunctionName = name;
        this._currentHashFunction = this._hashFunctions[name];
    }

    /**
     * Return simple hash number
     * @param {NumberString} data
     * @param {number} seed
     * @returns {number} hash number
     * @private
     */
    _hashNumber(data: NumberString, seed: number): number {
        return this._currentHashFunction.hash(data, seed || 0);
    }

    /**
     * Return array of hash numbers
     * @param {NumberString} data
     * @param {Array<number>} seed - array of seed numbers
     * @return {Array<number>}
     * @private
     */
    _hashArray(data: NumberString, seed: Array<number>): Array<number> {
        const res: Array<number> = [];
        for (let i = 0; i < seed.length; i += 1) {
            res[i] = this._hashNumber(data, seed[i]);
        }

        return res;
    }

    /**
     * Hash
     * @param {NumberString} data - data to hash
     * @param {RandomArrayNumber} seed
     * @returns {RandomArrayNumber} hash, can return array of hashes for different seeds
     */
    hash(data: NumberString, seed: RandomArrayNumber): RandomArrayNumber {
        if (Array.isArray(seed)) {
            return this._hashArray(data, seed);
        }
        return this._hashNumber(data, seed);
    }
}

export default HashProxy;

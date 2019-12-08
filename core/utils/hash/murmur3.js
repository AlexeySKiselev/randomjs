// @flow
/**
 * Fast hashing murmur3 algorithm
 * Austin Appleby algorithm
 * https://en.wikipedia.org/wiki/MurmurHash
 */

import type { NumberString } from '../../types';
import type { IHash } from '../../interfaces';

class Murmur3Hash implements IHash {

    constructor() {}

    /**
     * Calculates hash
     * @param {NumberString} data
     * @param {number} seed
     * @returns {number}
     */
    hash(data: NumberString, seed: number = 0): number {
        if (typeof data === 'string') {
            return this._hashFromString(data, data.length, seed);
        } else if (typeof data === 'number') {
            const s: string = data.toString();
            return this._hashFromString(s, s.length, seed);
        }
        throw new Error('You should point data as number or string');
    }

    _mul32(m: number, n: number): number {
        const nlo: number = n & 0xffff;
        const nhi: number = n - nlo;
        return ((nhi * m | 0) + (nlo * m | 0)) | 0;
    }

    _hashFromString(data: string, len: number, seed: number): number {
        let c1: number = 0xcc9e2d51,
            c2: number = 0x1b873593,
            h1: number = seed,
            roundedEnd: number = len & ~0x1,
            k1: number;

        for (let i = 0; i < roundedEnd; i += 2) {
            k1 = data.charCodeAt(i) | (data.charCodeAt(i + 1) << 16);

            k1 = this._mul32(k1, c1);
            k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17);
            k1 = this._mul32(k1, c2);

            h1 ^= k1;
            h1 = ((h1 & 0x7ffff) << 13) | (h1 >>> 19);
            h1 = (h1 * 5 + 0xe6546b64) | 0;
        }

        if (len % 2 === 1) {
            k1 = data.charCodeAt(roundedEnd);
            k1 = this._mul32(k1, c1);
            k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17);
            k1 = this._mul32(k1, c2);
            h1 ^= k1;
        }

        h1 ^= (len << 1);
        h1 ^= h1 >>> 16;
        h1  = this._mul32(h1, 0x85ebca6b);
        h1 ^= h1 >>> 13;
        h1  = this._mul32(h1, 0xc2b2ae35);
        h1 ^= h1 >>> 16;

        return h1;
    }
}

export default Murmur3Hash;

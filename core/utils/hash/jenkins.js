// @flow
/**
 * Jenkins algorithm
 * https://en.wikipedia.org/wiki/Jenkins_hash_function
 * Created by Alexey S. Kiselev
 */

import type { NumberString } from '../../types';
import type { IHash } from '../../interfaces';

class JenkinsHash implements IHash {
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

    _hashFromString(data: string, len: number, seed: number = 0): number {
        let a, b, c, offset = 0, length = len;
        a = b = c = (0xdeadbeef + (len << 2) + seed) | 0;

        while(length > 3) {
            a = (a + data.charCodeAt(offset)) | 0;
            b = (b + data.charCodeAt(offset + 1)) | 0;
            c = (c + data.charCodeAt(offset + 2)) | 0;

            // mixing
            a = (a - c) | 0;  a ^= this._rotate(c, 4);  c = (c + b) | 0;
            b = (b - a) | 0;  b ^= this._rotate(a, 6);  a = (a + c) | 0;
            c = (c - b) | 0;  c ^= this._rotate(b, 8);  b = (b + a) | 0;
            a = (a - c) | 0;  a ^= this._rotate(c,16);  c = (c + b) | 0;
            b = (b - a) | 0;  b ^= this._rotate(a,19);  a = (a + c) | 0;
            c = (c - b) | 0;  c ^= this._rotate(b, 4);  b = (b + a) | 0;

            length -= 3;
            offset += 3;
        }

        switch(length) {
        case 3: c = (c + data.charCodeAt(offset + 2)) | 0;
        // eslint-disable-next-line
        case 2: b = (b + data.charCodeAt(offset + 1)) | 0;
        // eslint-disable-next-line
        case 1: a = (a + data.charCodeAt(offset)) | 0;

            // final mixing
            c ^= b; c = (c - this._rotate(b,14)) | 0;
            a ^= c; a = (a - this._rotate(c,11)) | 0;
            b ^= a; b = (b - this._rotate(a,25)) | 0;
            c ^= b; c = (c - this._rotate(b,16)) | 0;
            a ^= c; a = (a - this._rotate(c, 4)) | 0;
            b ^= a; b = (b - this._rotate(a,14)) | 0;
            c ^= b; c = (c - this._rotate(b,24)) | 0;
        // eslint-disable-next-line
        case 0: break;
        }

        // return the result
        return c;
    }

    _rotate(v: number, k: number): number {
        return (v << k) | (v >>> (32 - k));
    }
}

export default JenkinsHash;

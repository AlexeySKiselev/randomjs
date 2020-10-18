// @flow
/**
 * Base58 encoding
 * https://en.wikipedia.org/wiki/Base58
 * Created by Alexey S. Kiselev
 */

import type {IEncoder} from '../../interfaces';
import CommonEncoder from './commonEncoder';

const ALLOWED_ALPHABETS: {[string]: string} = {
    'bitcoin-base58': '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    'flickr-base58': '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
    'ripple-base58': 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'
};
const ALPHABET_LENGTH: number = 58;

class CommonBase58 extends CommonEncoder implements IEncoder {

    _alphabet: string;
    _codesMap: {[string]: number};

    constructor(alphabet: string) {
        super();
        this.setAlphabet(alphabet);
        this._createCodesMap();
    }

    setAlphabet(alphabet: string): void {
        if (!ALLOWED_ALPHABETS[alphabet]) {
            throw new Error(`Base58 encoder: alphabet ${alphabet} is not allowed`);
        }
        this._alphabet = ALLOWED_ALPHABETS[alphabet];
    }

    _createCodesMap(): void {
        this._codesMap = {};
        for (let i = 0; i < this._alphabet.length; i += 1) {
            this._codesMap[this._alphabet[i]] = i;
        }
    }

    _getCodesMap(): {[string]: number} {
        return this._codesMap;
    }

    encodeFromByteArray(bytes: Array<number>): string {
        const indexes: Array<any> = [0];
        let carry: number;
        for (let i = 0; i < bytes.length; i += 1) {
            carry = (indexes[0] << 8) + bytes[i];
            indexes[0] = carry % ALPHABET_LENGTH;
            carry = Math.floor(carry / ALPHABET_LENGTH);

            for (let j = 1; j < indexes.length; j += 1) {
                carry += indexes[j] << 8;
                indexes[j] = carry % ALPHABET_LENGTH;
                carry = Math.floor(carry / ALPHABET_LENGTH);
            }

            while (carry > 0) {
                indexes.push(carry % ALPHABET_LENGTH);
                carry = Math.floor(carry / ALPHABET_LENGTH);
            }
        }

        // leading zeros
        for (let i = 0; bytes[i] === 0 && i < bytes.length - 1; i += 1) {
            indexes.push(0);
        }

        // reverse indexes and build the string
        let temp_letter: string;
        for (let i = 0, j = indexes.length - 1; i <= j; i += 1, j -= 1) {
            temp_letter = this._alphabet[indexes[i]];
            indexes[i] = this._alphabet[indexes[j]];
            indexes[j] = temp_letter;
        }
        return indexes.join('');
    }

    decodeToByteArray(str: string): Array<number> {
        const res: Array<number> = [0];
        let letterIndex: number;
        let carry: number;

        for (let i = 0; i < str.length; i += 1) {
            if (!this._getCodesMap()[str[i]]) {
                if (str[i] !== this._alphabet[0]) {
                    throw new Error('Base58 decode: invalid input');
                }
            }
            letterIndex = this._getCodesMap()[str[i]];

            carry = res[0] * ALPHABET_LENGTH + letterIndex;
            res[0] = carry & 0xFF;
            carry >>= 8;

            for (let j = 1; j < res.length; j += 1) {
                carry += res[j] * ALPHABET_LENGTH;
                res[j] = carry & 0xFF;
                carry >>= 8;
            }

            while (carry > 0) {
                res.push(carry & 0xFF);
                carry >>= 8;
            }
        }

        // leading zeros
        for (let i = 0; str[i] === this._alphabet[0] && i < str.length - 1; i += 1) {
            res.push(0);
        }

        return res.reverse();
    }
}

class BitcoinBase58 extends CommonBase58 {
    constructor() {
        super('bitcoin-base58');
    }
}

class FlickrBase58 extends CommonBase58 {
    constructor() {
        super('flickr-base58');
    }
}

class RippleBase58 extends CommonBase58 {
    constructor() {
        super('ripple-base58');
    }
}

export {
    BitcoinBase58,
    FlickrBase58,
    RippleBase58
};

// @flow
/**
 * shortuuid UID generator
 * Encoded UUID transformed to Flickr base58 alphabet
 * Created by Alexey S. Kiselev
 */

import type {IUIDGenerator} from '../../../interfaces';
import RandomUuidGenerator from './uuid';

const HEX_ALPHABET_INDEX_MAP: {[string]: number} = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'a': 10,
    'b': 11,
    'c': 12,
    'd': 13,
    'e': 14,
    'f': 15
};
const FLICKR_ALPHABET: string = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const FLICKR_ALPHABET_LENGTH: number = FLICKR_ALPHABET.length;
const EXPECTED_LENGTH: number = 22;

class RandomShortUuidGenerator extends RandomUuidGenerator implements IUIDGenerator {

    constructor() {
        super();
    }

    generateRandom(): string {
        return this._getShortUuid(super.generateRandom());
    }

    generateNext(): string {
        return this._getShortUuid(super.generateNext());
    }

    _getShortUuid(uid: string): string {
        let res: string = '';
        const indexMap: {[number]: number} = {};
        let j: number = 0;
        for (let i = 0; i < uid.length; i += 1) {
            if (uid[i] !== '-') {
                indexMap[j] = HEX_ALPHABET_INDEX_MAP[uid[i]];
                j += 1;
            }
        }

        let div: number, newLength: number;
        let length: number = Object.keys(indexMap).length;
        do {
            div = 0;
            newLength = 0;
            for (let i = 0; i < length; i += 1) {
                div = div * 16 + indexMap[i];
                if (div >= FLICKR_ALPHABET_LENGTH) {
                    indexMap[newLength++] = parseInt(div / FLICKR_ALPHABET_LENGTH, 10);
                    div = div % FLICKR_ALPHABET_LENGTH;
                } else if (newLength > 0) {
                    indexMap[newLength++] = 0;
                }
            }
            length = newLength;
            res = FLICKR_ALPHABET[div] + res;
        } while (newLength !== 0);

        let startPaddingRes: string = '';
        for (let i = 0; i < Math.max(EXPECTED_LENGTH - res.length, 0); i += 1) {
            startPaddingRes += FLICKR_ALPHABET[0];
        }
        return startPaddingRes + res;
    }
}

export default RandomShortUuidGenerator;

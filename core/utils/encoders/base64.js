// @flow
/**
 * Base64 encoding
 * https://en.wikipedia.org/wiki/Base64
 * Created by Alexey S. Kiselev
 */

import type {IEncoder} from '../../interfaces';
import CommonEncoder from './commonEncoder';

const ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const ALPHABET_INDEX_MAP: {[string]: number} = ALPHABET
    .split('')
    .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
const PADDING: string = '=';
const DOUBLE_PADDING: string = '==';

class Base64 extends CommonEncoder implements IEncoder {

    constructor() {
        super();
    }

    encodeFromByteArray(bytes: Array<number>): string {
        const bytesLength: number = bytes.length;
        if (bytesLength === 0) {
            return '';
        }

        const sizeMod3: number = bytesLength % 3;
        const div3Size: number = bytesLength - sizeMod3;
        let temp: number;
        const res: Array<string> = [];
        for (let i = 0; i < div3Size; i += 3) {
            temp = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            res.push(ALPHABET.charAt(temp >> 18));
            res.push(ALPHABET.charAt((temp >> 12) & 0x3F));
            res.push(ALPHABET.charAt((temp >> 6) & 0x3F));
            res.push(ALPHABET.charAt(temp & 0x3F));
        }

        if (sizeMod3 === 1) {
            temp = bytes[bytesLength - 1] << 16;
            res.push(ALPHABET.charAt(temp >> 18) + ALPHABET.charAt((temp >> 12) & 0x3F)
                + DOUBLE_PADDING);
        } else if (sizeMod3 === 2) {
            temp = bytes[bytesLength - 2] << 16 | bytes[bytesLength - 1] << 8;
            res.push(ALPHABET.charAt(temp >> 18) + ALPHABET.charAt((temp >> 12) & 0x3F)
                + ALPHABET.charAt((temp >> 6) & 0x3F) + PADDING);
        }

        return res.join('');
    }

    decodeToByteArray(str: string): Array<number> {
        let strlength: number = str.length;
        if (strlength === 0) {
            return [];
        }
        if (strlength % 4 !== 0) {
            throw new Error('Base64 decode: wrong input');
        }

        let paddingSymbols: number = 0;
        if (str.charAt(strlength - 1) === PADDING) {
            paddingSymbols = 1;
            if (str.charAt(strlength - 2) === PADDING) {
                paddingSymbols = 2;
            }
            strlength -= 4;
        }

        const res: Array<number> = [];
        let temp: number;
        for (let i = 0; i < strlength; i += 4) {
            temp = (ALPHABET_INDEX_MAP[str[i]] << 18) | (ALPHABET_INDEX_MAP[str[i + 1]] << 12)
            | (ALPHABET_INDEX_MAP[str[i + 2]] << 6) | ALPHABET_INDEX_MAP[str[i + 3]];
            res.push(temp >> 16);
            res.push((temp >> 8) & 0xFF);
            res.push(temp & 0xFF);
        }

        if (paddingSymbols === 1) {
            temp = (ALPHABET_INDEX_MAP[str[strlength]] << 18) | (ALPHABET_INDEX_MAP[str[strlength + 1]] << 12)
                | (ALPHABET_INDEX_MAP[str[strlength + 2]] << 6);
            res.push(temp >> 16);
            res.push((temp >> 8) & 0xFF);
        } else if (paddingSymbols === 2) {
            temp = (ALPHABET_INDEX_MAP[str[strlength]] << 18) | (ALPHABET_INDEX_MAP[str[strlength + 1]] << 12);
            res.push(temp >> 16);
        }

        return res;
    }
}

const base64: IEncoder = new Base64(); // need because of multiple usage

export default base64;

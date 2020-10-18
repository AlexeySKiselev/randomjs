// @flow
/**
 * Base62 encoding
 * https://en.wikipedia.org/wiki/Base62
 * https://www.codeproject.com/Articles/1076295/Base-Encode
 * Created by Alexey S. Kiselev
 */

import type {IEncoder} from '../../interfaces';
import CommonEncoder from './commonEncoder';

const CODES: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CODES_INDEX_MAP: {[string]: number} = CODES
    .split('')
    .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
const CODE_FLAG: string = '9';
const SPECIAL_CODE_MAP: {[string]: number} = {'A': 61, 'B': 62, 'C': 63};

class Base62 extends CommonEncoder implements IEncoder {

    constructor() {
        super();
    }

    encodeFromByteArray(bytes: Array<number>): string {
        let res: string = '';
        let b: number;

        // Iterate with 3 bytes as a group
        for (let i = 0; i < bytes.length; i += 3) {
            // #1 char
            b = (bytes[i] & 0xFC) >> 2;
            if (b < 61) {
                res += CODES[b];
            } else {
                res += CODE_FLAG + CODES[b - 61];
            }

            b = (bytes[i] & 0x03) << 4;
            if (i + 1 < bytes.length) {
                // #2 char
                b |= (bytes[i + 1] & 0xF0) >> 4;
                if (b < 61) {
                    res += CODES[b];
                } else {
                    res += CODE_FLAG + CODES[b - 61];
                }

                b = (bytes[i + 1] & 0x0F) << 2;
                if (i + 2 < bytes.length) {
                    // #3 char
                    b |= (bytes[i + 2] & 0xC0) >> 6;
                    if (b < 61) {
                        res += CODES[b];
                    } else {
                        res += CODE_FLAG + CODES[b - 61];
                    }

                    // #4 char
                    b = bytes[i + 2] & 0x3F;
                    if (b < 61) {
                        res += CODES[b];
                    } else {
                        res += CODE_FLAG + CODES[b - 61];
                    }
                } else {
                    // #3 char, last char
                    if (b < 61) {
                        res += CODES[b];
                    } else {
                        res += CODE_FLAG + CODES[b - 61];
                    }
                }
            } else {
                // #2 char, last char
                if (b < 61) {
                    res += CODES[b];
                } else {
                    res += CODE_FLAG + CODES[b - 61];
                }
            }
        }

        return res;
    }

    decodeToByteArray(str: string): Array<number> {
        // Map for special code followed by CODE_FLAG '9' and its code index
        const decodedBytes: Array<number> = [];
        const strLength: number = str.length;
        // 6 bits bytes
        const unit: Array<number> = [0, 0, 0, 0];
        // char counter
        let n: number = 0;
        // unit counter
        let m: number = 0;
        // regular char
        let char1: string;
        // special char
        let char2: string;
        let b: number;

        while (n < strLength) {
            char1 = str[n];
            if (char1 !== CODE_FLAG) {
                // regular code
                unit[m] = CODES_INDEX_MAP[char1];
                m += 1;
                n += 1;
            } else {
                n += 1;
                if (n < strLength) {
                    char2 = str[n];
                    if (char2 !== CODE_FLAG) {
                        // special code index 61, 62, 63
                        unit[m] = SPECIAL_CODE_MAP[char2];
                        m++;
                        n++;
                    }
                }
            }
            // Add regular bytes with 3 bytes group composed from 4 units with 6 bits
            if (m === 4) {
                b = (unit[0] << 2) | (unit[1] >> 4);
                decodedBytes.push(b);
                b = ((unit[1] & 0x0F) << 4) | (unit[2] >> 2);
                decodedBytes.push(b);
                b = ((unit[2] & 0x03) << 6) | unit[3];
                decodedBytes.push(b);

                m = 0;
            }
        }

        // Add tail bytes group less than 4 units
        if (m !== 0) {
            if (m === 1) {
                b = (unit[0] << 2);
                decodedBytes.push(b);
            } else if (m === 2) {
                b = (unit[0] << 2) | (unit[1] >> 4);
                decodedBytes.push(b);
            } else if (m === 3) {
                b = (unit[0] << 2) | (unit[1] >> 4);
                decodedBytes.push(b);
                b = ((unit[1] & 0x0F) << 4) | (unit[2] >> 2);
                decodedBytes.push(b);
            }
        }
        return decodedBytes;
    }
}

const base62: IEncoder = new Base62(); // need because of multiple usage

export default base62;

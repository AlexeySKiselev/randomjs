// @flow
/**
 * Base32 encoding
 * https://en.wikipedia.org/wiki/Base32
 * Created by Alexey S. Kiselev
 */

import type {IEncoder} from '../../interfaces';
import CommonEncoder from './commonEncoder';

const ALLOWED_TYPES: {[string]: string} = {
    'base32': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', // RFC 4648
    'base32Hex': '0123456789ABCDEFGHIJKLMNOPQRSTUV', // RFC 4648
    'z-base-32': 'ybndrfg8ejkmcpqxot1uwisza345h769',
    'crockford-base32': '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
};
const PADDING: string = '=';
const NO_PADDING: string = '';

class CommonBase32 extends CommonEncoder implements IEncoder {

    _alphabet: string;
    _codesMap: {[string]: number}

    constructor(alphabet: string) {
        super();
        this.setAlphabet(alphabet);
        this._createCodesMap();
    }

    setAlphabet(alphabet: string): void {
        if (!ALLOWED_TYPES[alphabet]) {
            throw new Error(`Base32 encoder: alphabet ${alphabet} is not allowed`);
        }
        this._alphabet = ALLOWED_TYPES[alphabet];
    }

    /**
     *
     * @param bytes {Array<number>} - [<0-255>,]
     */
    encodeFromByteArray(bytes: Array<number>): string {
        let res: string = '';
        let i: number = 0;
        let index: number = 0;
        let currByte: number;
        let nextByte: number = 0;
        let digit: number = 0;
        const resLength: number = Math.ceil(bytes.length / 5) * 8;

        while (i < bytes.length) {
            currByte = bytes[i];
            if (index > 3) {
                nextByte = ((i + 1) < bytes.length) ? bytes[i + 1] : 0;

                digit = currByte & (0xFF >> index);
                index = (index + 5) % 8;
                digit <<= index;
                digit |= nextByte >> (8 - index);
                i += 1;
            } else {
                digit = (currByte >> (8 - (index + 5))) & 0x1F;
                index = (index + 5) % 8;
                if (index === 0) {
                    i += 1;
                }
            }
            res += this._alphabet[digit];
        }

        if (this._getPadding() !== NO_PADDING) {
            while (res.length < resLength) {
                res += this._getPadding();
            }
            return res;
        }

        return res;
    }

    decodeToByteArray(str: string): Array<number> {
        const res: Array<number> = [];
        const maxResLength: number = Math.ceil(str.length / 8) * 5;
        let char: string;
        let digit: number;
        let tempDigit: number;
        let index: number = 0;
        let offset: number = 0;

        for (let i = 0; i < str.length; i += 1) {
            char = str[i];
            if (!this._getCodesMap()[char] && this._getCodesMap()[char] !== 0) {
                if (this._getPadding() !== NO_PADDING && char === this._getPadding()) {
                    break;
                }
                throw new Error('Base32 decode: invalid input');
            }

            digit = this._getCodesMap()[char];

            if (index <= 3) {
                index = (index + 5) % 8;
                if (index === 0) {
                    res[offset] |= digit;
                    offset += 1;
                    if (offset >= maxResLength) {
                        break;
                    }
                } else {
                    res[offset] |= (digit << (8 - index)) & 0xFF;
                }
            } else {
                index = (index + 5) % 8;
                res[offset] |= (digit >> index);
                offset += 1;

                if (offset >= maxResLength) {
                    break;
                }
                tempDigit = res[offset] | (digit << (8 - index)) & 0xFF;
                if (tempDigit !== 0x00) {
                    res[offset] = tempDigit;
                }
            }
        }

        return res;
    }

    _getPadding(): string {
        return NO_PADDING;
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
}

class Base32 extends CommonBase32 implements IEncoder {

    constructor() {
        super('base32');
    }

    _getPadding(): string {
        return PADDING;
    }
}

class Base32Hex extends CommonBase32 implements IEncoder {

    _paddingSymbol: string; // need it for xid generator

    constructor(noPadding: boolean = false) {
        super('base32Hex');
        this._paddingSymbol = (noPadding) ? NO_PADDING : PADDING;
    }

    _getPadding(): string {
        return this._paddingSymbol;
    }
}

class ZBase32 extends CommonBase32 implements IEncoder {

    constructor() {
        super('z-base-32');
    }
}

class CrockfordBase32 extends CommonBase32 implements IEncoder {

    constructor() {
        super('crockford-base32');
    }
}

export {
    Base32,
    Base32Hex,
    ZBase32,
    CrockfordBase32
};

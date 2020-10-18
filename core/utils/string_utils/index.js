// @flow
/**
 * Random string utils
 * Created by Alexey S. Kiselev
 */

import prng from '../../prng/prngProxy';
import type {RandomArray} from '../../types';
import type {IUIDGenerator} from '../../interfaces';

const Binomial = require('../../methods/binomial');
const binomial = new Binomial(1, 1);
const UIDGenerators: {[string]: IUIDGenerator} = require('./uid');
const randomBitStringHelper = require('./randomBitStringHelper');

const NUMERIC_LETTERS: string = '0123456789';
const ALPHABETIC_LETTERS: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHANUMERIC_LETTERS: string = ALPHABETIC_LETTERS + NUMERIC_LETTERS;
const HEX_LETTERS: string = '0123456789abcdef';
let ASCII_LETTERS: string = '';

// populate Ascii letters
for (let i = 32; i < 127; i += 1) {
    ASCII_LETTERS += String.fromCharCode(i);
}

class RandomStringUtils {

    /**
     * Generates random string from the set of given characters
     * @param {string} chars - characters to pick for random string
     * @param {number} length - the length of random string
     * @public
     */
    static random(chars: string, length: number): string {
        const randoms: RandomArray = (prng.random(length): any);
        const charsLength: number = chars.length;
        let res: string = '';
        for (let i = 0; i < length; i += 1) {
            res += chars[Math.floor(randoms[i] * charsLength)];
        }
        return res;
    }

    /**
     * Generates random string from the set of given characters
     * @param {string} chars - characters to pick for random string
     * @param {number} length - the length of random string
     * @public
     */
    static next(chars: string, length: number): string {
        const charsLength: number = chars.length;
        let res: string = '';
        for (let i = 0; i < length; i += 1) {
            res += chars[Math.floor(prng.next() * charsLength)];
        }
        return res;
    }

    /**
     * Generates random string from the set of HEX characters - 0123456789abcdef
     * @param {number} length - the length of random string
     * @public
     */
    static randomHex(length: number): string {
        return RandomStringUtils.random(HEX_LETTERS, length);
    }

    /**
     * Generates random string from the set of HEX characters - 0123456789abcdef
     * @param {number} length - the length of random string
     * @public
     */
    static nextHex(length: number): string {
        return RandomStringUtils.next(HEX_LETTERS, length);
    }

    /**
     * Generates random string from the set of Latin alphabetic characters (a-z, A-Z)
     * @param {number} length - the length of random string
     * @public
     */
    static randomAlphabetic(length: number): string {
        return RandomStringUtils.random(ALPHABETIC_LETTERS, length);
    }

    /**
     * Generates random string from the set of Latin alphabetic characters (a-z, A-Z)
     * @param {number} length - the length of random string
     * @public
     */
    static nextAlphabetic(length: number): string {
        return RandomStringUtils.next(ALPHABETIC_LETTERS, length);
    }

    /**
     * Generates random string from the set of characters whose ASCII value is between 32 and 126 (inclusive)
     * @param {number} length - the length of random string
     * @public
     */
    static randomAscii(length: number): string {
        return RandomStringUtils.random(ASCII_LETTERS, length);
    }

    /**
     * Generates random string from the set of characters whose ASCII value is between 32 and 126 (inclusive)
     * @param {number} length - the length of random string
     * @public
     */
    static nextAscii(length: number): string {
        return RandomStringUtils.next(ASCII_LETTERS, length);
    }

    /**
     * Generates random string from the set of Latin alphabetic characters (a-z, A-Z) and the digits 0-9
     * @param {number} length - the length of random string
     * @public
     */
    static randomAlphanumeric(length: number): string {
        return RandomStringUtils.random(ALPHANUMERIC_LETTERS, length);
    }

    /**
     * Generates random string from the set of Latin alphabetic characters (a-z, A-Z) and the digits 0-9
     * @param {number} length - the length of random string
     * @public
     */
    static nextAlphanumeric(length: number): string {
        return RandomStringUtils.next(ALPHANUMERIC_LETTERS, length);
    }

    /**
     * Generates random string from the set of numeric characters
     * @param {number} length - the length of random string
     * @public
     */
    static randomNumeric(length: number): string {
        return RandomStringUtils.random(NUMERIC_LETTERS, length);
    }

    /**
     * Generates random string from the set of numeric characters
     * @param {number} length - the length of random string
     * @public
     */
    static nextNumeric(length: number): string {
        return RandomStringUtils.next(NUMERIC_LETTERS, length);
    }

    /**
     * Generates random bit string consist of "1" or "0"
     * @param {number} p - probability that each bit will be "1", default is 0.5
     * @param {number} length
     */
    static randomBitString(length: number, p: number = 0.5): string {
        binomial.refresh(length, p);
        if (binomial.isError().error) {
            throw new Error(binomial.isError().error);
        }
        return randomBitStringHelper(length, p, binomial.random());
    }

    /**
     * Generates random bit string consist of "1" or "0"
     * @param {number} p - probability that each bit will be "1", default is 0.5
     * @param {number} length
     */
    static nextBitString(length: number, p: number = 0.5): string {
        binomial.refresh(length, p);
        if (binomial.isError().error) {
            throw new Error(binomial.isError().error);
        }
        return randomBitStringHelper(length, p, binomial.next());
    }

    /**
     * Generates different types of UIDs
     * @param {string} type - type of UID
     * @returns {string}
     */
    static randomUID(type: string): string {
        if (!UIDGenerators[type]) {
            throw new Error(`Not allowed UID generator "${type}"`);
        }
        return UIDGenerators[type].generateRandom();
    }

    /**
     * Generates different types of UIDs
     * @param {string} type - type of UID
     * @returns {string}
     */
    static nextUID(type: string): string {
        if (!UIDGenerators[type]) {
            throw new Error(`Not allowed UID generator "${type}"`);
        }
        return UIDGenerators[type].generateNext();
    }
}

module.exports = RandomStringUtils;

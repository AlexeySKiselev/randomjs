// @flow
/**
 * uuid UID generator
 * https://en.wikipedia.org/wiki/Universally_unique_identifier
 * RFC 4122
 * Created by Alexey S. Kiselev
 */

import type {IUIDGenerator} from '../../../interfaces';
import type {RandomArray} from '../../../types';
import prng from '../../../prng/prngProxy';

class RandomUuidGenerator implements IUIDGenerator {

    constructor() {}

    generateRandom(): string {
        return this._getUuid((prng.random(23): any));
    }

    generateNext(): string {
        const randoms: RandomArray = [];
        for (let i = 0; i < 23; i += 1) {
            randoms[i] = (prng.next(): any);
        }
        return this._getUuid(randoms);
    }

    /**
     * randoms should be length of 23
     * @param {RandomArray} randoms
     * @returns {string}
     * @private
     */
    _getUuid(randoms: RandomArray): string {
        let res: string = this._createUnixTimestampString();

        // ********-xxxx
        res += Math.floor(randoms[0] * 0xF).toString(16) +
            Math.floor(randoms[1] * 0xF).toString(16) +
            Math.floor(randoms[2] * 0xF).toString(16) +
            Math.floor(randoms[3] * 0xF).toString(16) + '-';

        // ********-****-4xxx
        res += '4' + Math.floor(randoms[4] * 0xF).toString(16) +
            Math.floor(randoms[5] * 0xF).toString(16) +
            Math.floor(randoms[6] * 0xF).toString(16) + '-';

        // ********-****-****-yxxx
        res += ((Math.floor(randoms[7] * 0xF) & 0x3) | 0x8).toString(16) +
            Math.floor(randoms[8] * 0xF).toString(16) +
            Math.floor(randoms[9] * 0xF).toString(16) +
            Math.floor(randoms[10] * 0xF).toString(16) + '-';
        // ********-****-****-****-xxxxxxxxxxxx
        res += Math.floor(randoms[11] * 0xF).toString(16) +
            Math.floor(randoms[12] * 0xF).toString(16) +
            Math.floor(randoms[13] * 0xF).toString(16) +
            Math.floor(randoms[14] * 0xF).toString(16) +
            Math.floor(randoms[15] * 0xF).toString(16) +
            Math.floor(randoms[16] * 0xF).toString(16) +
            Math.floor(randoms[17] * 0xF).toString(16) +
            Math.floor(randoms[18] * 0xF).toString(16) +
            Math.floor(randoms[19] * 0xF).toString(16) +
            Math.floor(randoms[20] * 0xF).toString(16) +
            Math.floor(randoms[21] * 0xF).toString(16) +
            Math.floor(randoms[22] * 0xF).toString(16);
        return res;
    }

    /**
     * Generates random time in millis, then converts it <32 low bits>-<16 high bits> string
     * @private
     */
    _createUnixTimestampString(): string {
        let ts = Date.now();
        return (ts % 0xFFFFFFFF).toString(16) + '-';
    }
}

export default RandomUuidGenerator;

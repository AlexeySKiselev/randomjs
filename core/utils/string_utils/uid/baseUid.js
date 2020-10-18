// @flow
/**
 * Common class for all uid generators
 * Created by Alexey S. Kiselev
 */
import type {RandomArray} from '../../../types';

const TIMESTAMP_SIZE: number = 4;
const UNIX_TIMESTAMP_SIZE: number = 8;
const EPOCH: number = 1400000000;

class BaseUid {

    constructor() {}

    getTimestampSize(): number {
        return TIMESTAMP_SIZE;
    }

    /**
     * Generates random time, then converts it to array of 4 bytes
     * @returns {RandomArray}
     * @private
     */
    _createTimestampBytesArray(): RandomArray {
        const res = [];
        // TODO: fix it after 2038-01-19T03:14:07+00:00
        let ts = Math.floor(Date.now() / 1000) - EPOCH;
        for (let i = 0; i < TIMESTAMP_SIZE; i += 1) {
            res[TIMESTAMP_SIZE - 1 - i] = (ts & 0xFF);
            ts >>= 8;
        }

        return res;
    }

    /**
     * Generates random time in millis, then converts it to array of 8 bytes
     * @returns {RandomArray}
     * @private
     */
    _createUnixTimestampBytesArray(alphabet: string, modulo: number): string {
        let res = '';
        let ts = Date.now();
        for (let i = 0; i < UNIX_TIMESTAMP_SIZE; i += 1) {
            res = alphabet[ts % modulo] + res;
            ts = Math.floor(ts / modulo);
        }

        return res;
    }
}

export default BaseUid;

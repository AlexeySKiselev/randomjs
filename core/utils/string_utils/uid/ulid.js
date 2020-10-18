// @flow
/**
 * ulid UID generator
 * 6 bytes of time (milliseconds) + 8 random bytes
 * Created by Alexey S. Kiselev
 */

import type {IUIDGenerator, IEncoder} from '../../../interfaces';
import type {RandomArray} from '../../../types';
import prng from '../../../prng/prngProxy';
import {CrockfordBase32} from '../../encoders/base32';

const crockfordBase32: IEncoder = new CrockfordBase32();
const PAYLOAD_SIZE: number = 8;
const MODULO: number = 256;

class RandomUlidGenerator implements IUIDGenerator {

    constructor() {}

    generateRandom(): string {
        return crockfordBase32.encodeFromByteArray(this._getRandomByteArray((prng.random(PAYLOAD_SIZE): any)));
    }

    generateNext(): string {
        const randoms: RandomArray = [];
        for (let i = 0; i < PAYLOAD_SIZE; i += 1) {
            randoms[i] = (prng.next(): any);
        }
        return crockfordBase32.encodeFromByteArray(this._getRandomByteArray(randoms));
    }

    /**
     * Generates random time in millis, then converts it to array of 8 bytes
     * @returns {RandomArray}
     * @private
     */
    _createUnixTimestampBytesArray(): Array<number> {
        const res: Array<number> = [];
        let ts = Date.now();
        for (let i = 0; i < 6; i += 1) {
            res[5 - i] = ts % MODULO;
            ts = Math.floor(ts / MODULO);
        }

        return res;
    }

    _getRandomByteArray(randoms: RandomArray): RandomArray {
        const res: Array<number> = this._createUnixTimestampBytesArray();

        for (let i = 0; i < PAYLOAD_SIZE; i += 1) {
            res[6 + i] = Math.floor(randoms[i] * MODULO);
        }

        return res;
    }
}

export default RandomUlidGenerator;

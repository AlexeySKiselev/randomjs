// @flow
/**
 * betterguid UID generator
 * 8 bytes of time (milliseconds) + 9 random bytes
 * Created by Alexey S. Kiselev
 */

import type {IUIDGenerator} from '../../../interfaces';
import type {RandomArray} from '../../../types';
import BaseUid from './baseUid';
import prng from '../../../prng/prngProxy';

const CODES: string = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
const MODULO: number = CODES.length;
const PAYLOAD_SIZE: number = 9;

class RandomBetterGuidGenerator extends BaseUid implements IUIDGenerator {

    constructor() {
        super();
    }

    generateRandom(): string {
        return this._getRandomString((prng.random(PAYLOAD_SIZE): any));
    }

    generateNext(): string {
        const randoms: RandomArray = [];
        for (let i = 0; i < PAYLOAD_SIZE; i += 1) {
            randoms[i] = (prng.next(): any);
        }
        return this._getRandomString(randoms);
    }

    _getRandomString(randoms: RandomArray): string {
        let res: string = this._createUnixTimestampBytesArray(CODES, MODULO);
        for (let i = 0; i < PAYLOAD_SIZE; i += 1) {
            res += CODES[Math.floor(randoms[i] * MODULO)];
        }

        return res;
    }
}

export default RandomBetterGuidGenerator;

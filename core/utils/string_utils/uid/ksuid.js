// @flow
/**
 * ksuid UID generator
 * Created by Alexey S. Kiselev
 */

import prng from '../../../prng/prngProxy';
import BaseUid from './baseUid';
import base62 from '../../encoders/base62';
import type {IUIDGenerator} from '../../../interfaces';
import type {RandomArray} from '../../../types';

const PAYLOAD_SIZE: number = 16;
const MAX_ENCODED_SIZE: number = 27;

class RandomKsuidGenerator extends BaseUid implements IUIDGenerator {

    codes: string;
    codeFlag: string;
    payloadSize: number;
    tsSize: number;

    constructor() {
        super();
        this.tsSize = this.getTimestampSize();
    }

    generateRandom(): string {
        let res: string = base62.encodeFromByteArray(this._randomBytesArray());
        if (res.length > MAX_ENCODED_SIZE) {
            return res.substring(0, MAX_ENCODED_SIZE);
        }
        return res;
    }

    generateNext(): string {
        let res: string = base62.encodeFromByteArray(this._nextBytesArray());
        if (res.length > MAX_ENCODED_SIZE) {
            return res.substring(0, MAX_ENCODED_SIZE);
        }
        return res;
    }

    _randomBytesArray(): RandomArray {
        const res: RandomArray = this._createTimestampBytesArray();
        const randoms: RandomArray = (prng.random(PAYLOAD_SIZE): any);
        for (let i = 0; i < PAYLOAD_SIZE; i += 1) {
            res[this.tsSize + i] = Math.floor(randoms[i] * 256);
        }

        return res;
    }

    _nextBytesArray(): RandomArray {
        const res: RandomArray = this._createTimestampBytesArray();
        for (let i = 0; i < PAYLOAD_SIZE; i += 1) {
            res[this.tsSize + i] = Math.floor(prng.next() * 256);
        }

        return res;
    }
}

export default RandomKsuidGenerator;

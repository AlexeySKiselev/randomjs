// @flow
/**
 * sno UID generator
 * Created by Alexey S. Kiselev
 */

import type {IUIDGenerator, IEncoder} from '../../../interfaces';
import prng from '../../../prng/prngProxy';
import {Base32Hex} from '../../encoders/base32';

const MAX_SEQUENCE_VALUE: number = 0xFFFF;
// use meta and partition random values
const MAX_META_PARTITION_VALUE: number = 0xFFFFFF;
const base32Hex: IEncoder = new Base32Hex(true);

class RandomSnoGenerator implements IUIDGenerator {

    sequence: number;

    constructor() {
        this.sequence = 0;
    }

    generateRandom(): string {
        return this._getSno((prng.random(): any));
    }

    generateNext(): string {
        return this._getSno((prng.next(): any));
    }

    _getSno(random: number): string {
        const resBytes: Array<number> = this._convertTimestampToBytesArray();
        let rand: number = Math.floor(random * MAX_META_PARTITION_VALUE);

        // generates rand as bytes array
        for (let i = 0; i < 3; i += 1) {
            resBytes[7 - i] = rand % 256;
            rand = Math.floor(rand / 256);
        }

        this.sequence = (this.sequence + 1) & MAX_SEQUENCE_VALUE;
        let seq: number = this.sequence | 0;

        for (let i = 0; i < 2; i += 1) {
            resBytes[9 - i] = seq % 256;
            seq = Math.floor(seq / 256);
        }

        return base32Hex.encodeFromByteArray(resBytes);
    }

    /**
     * @returns {string}
     * @private
     */
    _convertTimestampToBytesArray(): Array<number> {
        const res: Array<number> = [];
        let ts = Math.floor(Date.now() / 4);
        for (let i = 0; i < 5; i += 1) {
            res[4 - i] = ts % 256;
            ts = Math.floor(ts / 256);
        }

        return res;
    }
}

export default RandomSnoGenerator;

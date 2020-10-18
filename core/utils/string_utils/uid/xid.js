// @flow
/**
 * xid UID generator
 * 4 bytes of time (seconds) + 3 byte machine id + 2 byte process id + 3 bytes random
 * for browser version will use random values
 * Created by Alexey S. Kiselev
 */

import type {IUIDGenerator, IHash, IEncoder} from '../../../interfaces';
import type {RandomArray} from '../../../types';
import prng from '../../../prng/prngProxy';
import Murmur3Hash from '../../hash/murmur3';
import BaseUid from './baseUid';
import {Base32Hex} from '../../encoders/base32';

const MAX_RANDOM1_VALUE: number = 0xFFFFFF;
const MAX_RANDOM2_VALUE: number = 0xFFFF;
const MAX_RANDOM3_VALUE: number = 0xFFFFFF;
const isRunningInNode: boolean = typeof process !== 'undefined'
    && process.versions != null && process.versions.node != null;
const murmur3Hash: IHash = new Murmur3Hash();
const base32Hex: IEncoder = new Base32Hex(true);

class RandomXidGenerator extends BaseUid implements IUIDGenerator {

    random1: number;
    random2: number;
    need_random1: boolean;
    need_random2: boolean;
    tsSize: number;

    constructor() {
        super();
        this.tsSize = this.getTimestampSize();
        this.need_random1 = true;
        this.need_random2 = true;
        if (isRunningInNode) {
            const os = require('os');
            if (os.hostname().length > 0) {
                this.need_random1 = false;
                this.random1 = murmur3Hash.hash((os.hostname(): any), 0) & MAX_RANDOM1_VALUE;
            }
            this.need_random2 = false;
            this.random2 = process.pid & MAX_RANDOM2_VALUE;
        }
    }

    generateRandom(): string {
        return base32Hex.encodeFromByteArray(this._randomBytesArray());
    }

    generateNext(): string {
        return base32Hex.encodeFromByteArray(this._nextBytesArray());
    }

    _randomBytesArray(): RandomArray {
        return this._getBytesArray((prng.random(3): any));
    }

    _nextBytesArray(): RandomArray {
        const randoms: RandomArray = [];
        for (let i = 0; i < 3; i += 1) {
            randoms[i] = (prng.next(): any);
        }
        return this._getBytesArray(randoms);
    }

    _getBytesArray(randoms: RandomArray): RandomArray {
        const res: RandomArray = this._createTimestampBytesArray();
        if (this.need_random1) {
            this.random1 = Math.floor(randoms[0] * MAX_RANDOM1_VALUE);
        }
        res[this.tsSize] = this.random1 >> 16;
        res[this.tsSize + 1] = (this.random1 >> 8) & 0xFF;
        res[this.tsSize + 2] = this.random1 & 0xFF;

        if (this.need_random2) {
            this.random2 = Math.floor(randoms[1] * MAX_RANDOM2_VALUE);
        }
        res[this.tsSize + 3] = this.random2 >> 8;
        res[this.tsSize + 4] = this.random2 & 0xFF;

        let random3: number = Math.floor(randoms[2] * MAX_RANDOM3_VALUE);
        res[this.tsSize + 5] = random3 >> 16;
        res[this.tsSize + 6] = (random3 >> 8) & 0xFF;
        res[this.tsSize + 7] = random3 & 0xFF;

        return res;
    }
}

export default RandomXidGenerator;

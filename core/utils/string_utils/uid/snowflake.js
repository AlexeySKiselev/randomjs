// @flow
/**
 * snowflake UID generator - 41 bits of time in millis + 10 bit machine id + 12 sequence
 * highest bit is always 0
 * Created by Alexey S. Kiselev
 */

import type {IUIDGenerator, IHash} from '../../../interfaces';
import prng from '../../../prng/prngProxy';
import Murmur3Hash from '../../hash/murmur3';

const murmur3Hash: IHash = new Murmur3Hash();
const isRunningInNode: boolean = typeof process !== 'undefined'
    && process.versions != null && process.versions.node != null;

const MAX_RANDOM1_VALUE: number = 0x3FF;
const LEADING_ZEROS: Array<string> = ['', '0', '00', '000', '0000', '00000', '000000',
    '0000000', '00000000', '000000000', '0000000000'];
const EXPECTED_RIGHT_SIZE: number = 10;

class RandomSnowflakeGenerator implements IUIDGenerator {

    random1: number;
    need_random1: boolean;
    sequence: number;

    constructor() {
        this.need_random1 = true;
        this.sequence = 0;

        if (isRunningInNode) {
            const os = require('os');
            if (os.hostname().length > 0) {
                this.need_random1 = false;
                this.random1 = murmur3Hash.hash((os.hostname(): any), 0) & MAX_RANDOM1_VALUE;
            }
        }
    }

    generateRandom(): string {
        this._generateRandom1IfNeeded((prng.random(): any));
        return this._getSnowflake();
    }

    generateNext(): string {
        this._generateRandom1IfNeeded((prng.next(): any));
        return this._getSnowflake();
    }

    _generateRandom1IfNeeded(random: number): void {
        if (this.need_random1) {
            this.random1 = Math.floor(random * MAX_RANDOM1_VALUE);
        }
    }

    _getSnowflake(): string {
        const res: {left: string, right: number} = this._getTimestampData();
        let right: number = res.right;
        right |= (this.random1 << 12);
        this.sequence = (this.sequence + 1) & 0xFFF;
        right |= this.sequence;
        const rightAsString: string = right.toString();
        return res.left + LEADING_ZEROS[EXPECTED_RIGHT_SIZE - rightAsString.length] + rightAsString;
    }

    _getTimestampData(): {left: string, right: number} {
        let left: number = 0;
        let right: number;
        let ts = Date.now();

        right = ts % 3;
        ts = Math.floor(ts / 3);
        right |= ((ts % 256) & 0x7F) << 2;
        ts = Math.floor(ts / 256);
        right <<= 22;

        for (let i = 0; i < 4; i += 1) {
            left = (ts % 256) << (8 * i);
            ts = Math.floor(ts / 256);
        }
        left &= 0x7FFFFFFF;

        return {
            left: left.toString(),
            right
        };
    }
}

export default RandomSnowflakeGenerator;

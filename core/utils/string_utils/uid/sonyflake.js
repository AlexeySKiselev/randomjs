// @flow
/**
 * sonyflake UID generator - ~6 bytes of time (10 ms) + 1 byte sequence + 2 bytes machine id
 * Created by Alexey S. Kiselev
 */

import type {IUIDGenerator, IHash} from '../../../interfaces';
import prng from '../../../prng/prngProxy';
import Murmur3Hash from '../../hash/murmur3';

const murmur3Hash: IHash = new Murmur3Hash();
const isRunningInNode: boolean = typeof process !== 'undefined'
    && process.versions != null && process.versions.node != null;
const MAX_RANDOM1_VALUE: number = 0xFFFF;
const MAX_SEQUENCE_VALUE: number = 0xFF;
const SONYFLAKE_TIMEUNIT: number = 10;
const SONYFLAKE_START_TIME: number = 1409529600000;
const SONYFLAKE_OVERFLOW_VALUE: number = 549755813887;

class RandomSonyflakeGenerator implements IUIDGenerator {

    random1: number;
    need_random1: boolean;
    startTime: number;
    elapsedTime: number;
    sequence: number;

    constructor() {
        this.sequence = 0;
        this.startTime = this._toSonyflakeTime(SONYFLAKE_START_TIME);
        this.elapsedTime = 0;
        this.need_random1 = true;
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
        return this._getSonyflake();
    }

    generateNext(): string {
        this._generateRandom1IfNeeded((prng.next(): any));
        return this._getSonyflake();
    }

    _getSonyflake(): string {
        let current: number = this._currentElapsedTime(this.startTime);
        if (this.elapsedTime < current) {
            this.elapsedTime = current;
            this.sequence = 0;
        } else {
            this.sequence = (this.sequence + 1) & MAX_SEQUENCE_VALUE;
            if (this.sequence === 0) {
                this.elapsedTime += 1;
            }
        }

        if (this.elapsedTime > SONYFLAKE_OVERFLOW_VALUE) {
            throw new Error('Sonyflake UID: time overflow');
        }

        let res: string = this._convertTimestampToString();
        res += this._sequenceToString(this.sequence);

        res += this._decToHex((this.random1 >> 8) & 0xFF);
        res += this._decToHex(this.random1 & 0xFF);
        return res;
    }

    /**
     * @returns {string}
     * @private
     */
    _convertTimestampToString(): string {
        let res: string = '';
        let ts = this.elapsedTime;
        for (let i = 0; i < 5; i += 1) {
            res = this._decToHex(ts % 256) + res;
            ts = Math.floor(ts / 256);
        }

        return res;
    }

    _generateRandom1IfNeeded(random: number): void {
        if (this.need_random1) {
            this.random1 = Math.floor(random * MAX_RANDOM1_VALUE);
        }
    }

    _toSonyflakeTime(utcTime: number): number {
        return Math.floor(utcTime / SONYFLAKE_TIMEUNIT);
    }

    _currentElapsedTime(startTime: number): number {
        return this._toSonyflakeTime(Date.now()) - startTime;
    }

    _decToHex(dec: number): string {
        if (dec < 16) {
            return '0' + dec.toString(16);
        }
        return dec.toString(16);
    }

    _sequenceToString(sequence: number): string {
        if (sequence < 10) {
            return '00' + sequence.toString();
        }
        if (sequence < 100) {
            return '0' + sequence.toString();
        }
        return sequence.toString();
    }
}

export default RandomSonyflakeGenerator;

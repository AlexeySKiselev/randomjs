// @flow
/**
 * Roulette wheel algorithm using stochastic acceptance
 * "Roulette-wheel selection via stochastic acceptance, A. Lipowski, D. Lipowska" (https://arxiv.org/pdf/1109.3627.pdf)
 * Returns index of element due to its weight
 * Does not mutate weights array
 * Created by Alexey S. Kiselev
 */

import type {IRouletteWheel, IPRNGProxy} from '../interfaces';
import type {NumberString} from '../types';

import {PRNGProxy, DEFAULT_GENERATOR} from '../prng/prngProxy';

class RouletteWheel implements IRouletteWheel {

    _weights: Array<number>;
    _w_length: number;
    _w_max: number;
    _prng: IPRNGProxy;

    constructor(weights: Array<number>, options: {[string]: any} = {}) {
        this._validate(weights);
        this._w_max = this._getMaxWeight(weights);
        this._weights = weights; // does not mutate original weights array, it is safe
        this._w_length = weights.length;
        this._prng = new PRNGProxy();
        if (this._isDefined(options.seed)) {
            this.seed(options.seed);
        }
        this.setPrng(this._isDefined(options.prng) ? options.prng : DEFAULT_GENERATOR, true);
    }

    /**
     * Check whether option is defined
     * @param {any} option
     * @private
     */
    _isDefined(option: any): boolean {
        return option !== null && typeof option !== 'undefined';
    }

    /**
     * Validate weight array
     * @param {any} weights
     * @private
     */
    _validate(weights: any): void {
        if (!Array.isArray(weights)) {
            throw new Error('RouletteWheel: weights must be array');
        }
        if (weights.length < 1) {
            throw new Error('RouletteWheel: weights array must contain at least one element');
        }
        for (let i = 0; i < weights.length; i += 1) {
            if (typeof weights[i] !== 'number' || weights[i] <= 0) {
                throw new Error('RouletteWheel: weights must be a positive numbers');
            }
        }
    }

    /**
     * Calculates max weight
     * @param {Array<number>} weights
     * @private
     */
    _getMaxWeight(weights: Array<number>): number {
        let _max: number = -Infinity;
        for (let i = 0; i < weights.length; i += 1) {
            if (weights[i] > _max) {
                _max = weights[i];
            }
        }
        return _max;
    }

    /**
     * Return random index of weights array
     * @private
     */
    _getRandomWeightIndex(): number {
        return Math.floor(this._prng.next() * this._w_length);
    }

    /**
     * In case of using seeded PRNG reset prng to initial state
     * @public
     */
    reset(): void {
        this._prng.random();
    }

    /**
     * Set seed value for local PRNG
     * @param {NumberString} seed_value
     * @public
     */
    seed(seed_value: ?NumberString): void {
        this._prng.seed(seed_value);
    }

    /**
     * Set local PRNG algorithm
     * @param {string} prng_name
     * @param {boolean} reset - whether reset PRNG state for new one or not
     * @public
     */
    setPrng(prng_name: string, reset?: boolean = false): void {
        this._prng.set_prng(prng_name);
        if (reset) {
            this.reset();
        }
    }

    /**
     * Select random element due to weights
     * @public
     */
    // $FlowFixMe - will be always accepted as weights are validated, number will ba always returned
    select(): number {
        /* eslint-disable no-constant-condition */
        while (true) {
            const _index = this._getRandomWeightIndex();
            if (this._prng.next() < (this._weights[_index] / this._w_max) ) {
                return _index;
            }
        }
    }
}

export default RouletteWheel;

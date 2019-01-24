// @flow
/**
 * PRNG proxy
 * Creates PRN generators or Math.random by default
 */

import type { NumberString, RandomArrayNumber } from '../types';
import type { IPRNG, IPRNGProxy } from '../interfaces';

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import DefaultPRNG from './DefaultPRNG';

const DEFAULT_GENERATOR = 'tuchei';

class PRNGProxy implements IPRNGProxy {

    _generators: {[string]: IPRNG};
    _allowed_generators: {[string]: any};
    _current_generator_name: string;
    _current_generator: IPRNG;
    _seed: ?NumberString;
    _modulo: number;

    constructor() {
        this._modulo = BasicPRNG.modulo;
        this._seed = undefined;
        this._allowed_generators = {
            'default': DefaultPRNG,
            'tuchei': TucheiPRNG
        };

        this._generators = {
            'default': new DefaultPRNG()
        };

        this._current_generator_name = 'default';
        this._current_generator = this._generators['default'];
    }

    /**
     * A list of allowed generators
     * @returns {Array<string>} a list of generators
     */
    static get generators(): Array<string> {
        return [
            'default',
            'tychei'
        ];
    }

    /**
     * Current PRNG name
     * @returns {string} name of current PRNG
     */
    get prng_name(): string {
        return this._current_generator_name;
    }

    /**
     * Random method
     * @returns random number in range [0, 1)
     */
    random(n: number = 1): RandomArrayNumber {
        return this._current_generator.random(n);
    }

    /**
     * Returns random integer [0, 2^32)
     * @returns {number}
     */
    randomInt(n: number = 1): RandomArrayNumber {
        return this._current_generator.randomInt(n);
    }

    /**
     * Seed for reproducible results
     * If seed does not passed - assign random seed
     * @param {NumberString} seed_value
     */
    seed(seed_value: ?NumberString): void {
        if (typeof seed_value === 'number' && seed_value < 0) {
            seed_value += this._modulo - 1;
        }
        this._seed = seed_value;
        this._current_generator.seed(this._seed);
    }

    /**
     * Sets PRNG generator
     * @param {string} prng_name: name of generator on initialization
     */
    set_prng(prng_name: string = 'default'): void {
        if (this._allowed_generators[prng_name]) {
            if (!this._generators[prng_name]) {
                this._generators[prng_name] = new this._allowed_generators[prng_name]();
            }
            this._current_generator_name = prng_name;
            this._current_generator = this._generators[prng_name];
            this._current_generator.seed(this._seed);
        }
    }
}

const prng_proxy = new PRNGProxy();

const prng = (prng_name: string = 'default'): IPRNGProxy => {
    prng_proxy.set_prng(prng_name);
    return prng_proxy;
};

export default prng(DEFAULT_GENERATOR);

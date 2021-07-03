// @flow
/**
 * PRNG proxy
 * Creates PRN generators or Math.random by default
 * Created by Alexey S. Kiselev
 */

import type { NumberString, RandomArrayNumber } from '../types';
import type { IPRNG, IPRNGProxy } from '../interfaces';

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import DefaultPRNG from './DefaultPRNG';
import XorshiftPRNG from './XorshiftPRNG';
import KissPRNG from './KissPRNG';
import ParkMillerPRNG from './ParkMillerPRNG';
import CoveyouPRNG from './CoveyouPRNG';
import Knuthran2PRNG from './Knuthran2PRNG';
import R250PRNG from './R250PRNG';
import Mrg5PRNG from './Mrg5PRNG';
import Gfsr4PRNG from './Gfsr4PRNG';
import Dx1597PRNG from './Dx1597PRNG';
import Tt800PRNG from './Tt800PRNG';
import XorwowPRNG from './XorwowPRNG';
import MarsenneTwisterPRNG from './MarsenneTwisterPRNG';
import PhiloxPRNG from './PhiloxPRNG';
import Taus113PRNG from './Taus113PRNG';
import Swb2712PRNG from './Swb2712PRNG';

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
        /*
        On machine: Ubuntu 18.04 x64, Intel® Core™ i7-6600U CPU @ 2.60GHz × 4
        Tested on 400M .next() operations
        default: 4712 ms, 85M per sec
        tuchei: 1550 ms, 258M per sec
        xorshift: 1538 ms, 260M per sec
        kiss: 3616 ms, 110M per sec
        parkmiller: 6814 ms, 58M per sec
        coveyou: 238704 ms, 1.7M per sec
        knuthran2: 117532 ms, 3.4M per sec
        r250: 1575 ms, 254M per sec
        mrg5: 112347 ms, 3.6M per sec
        gfsr4: 2890 ms, 138M per sec
        dx1597: 50161ms, 8M per sec
        tt800: 10434 ms, 38M per sec
        xorwow: 3093 ms, 130M per sec
        mt19937: 6250 ms, 64M per sec
        philox: 36008 ms, 11.1M per sec
        taus113: 1290ms, 310M per sec
        swb2712: 3520ms, 113M per sec
         */
        this._allowed_generators = {
            'default': DefaultPRNG,
            'tuchei': TucheiPRNG,
            'xorshift': XorshiftPRNG,
            'kiss': KissPRNG,
            'parkmiller': ParkMillerPRNG,
            'coveyou': CoveyouPRNG,
            'knuthran2': Knuthran2PRNG,
            'r250': R250PRNG,
            'mrg5': Mrg5PRNG,
            'gfsr4': Gfsr4PRNG,
            'dx1597': Dx1597PRNG,
            'tt800': Tt800PRNG,
            'xorwow': XorwowPRNG,
            'mt19937': MarsenneTwisterPRNG,
            'philox': PhiloxPRNG,
            'taus113': Taus113PRNG,
            'swb2712': Swb2712PRNG
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
    get generators(): Array<string> {
        return Object.keys(this._allowed_generators);
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
    random(n: ?number = 0): RandomArrayNumber {
        return this._current_generator.random(n);
    }

    /**
     * Next method
     * @returns {number} only single random value
     */
    next(): number {
        return this._current_generator.next();
    }

    nextInt(): number {
        return this._current_generator.nextInt();
    }

    /**
     * Returns random integer [0, 2^32)
     * @returns {number}
     */
    randomInt(n: ?number = 0): RandomArrayNumber {
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
        if (!this._allowed_generators[prng_name]) {
            throw new Error(`PRNG ${prng_name} is not allowed`);
        }

        // if current generator is the same - do nothing
        if (this._current_generator_name === prng_name) {
            return;
        }

        if (!this._generators[prng_name]) {
            this._generators[prng_name] = new this._allowed_generators[prng_name]();
        }
        this._current_generator_name = prng_name;
        this._current_generator = this._generators[prng_name];
        this._current_generator.seed(this._seed);
    }
}

const prng_proxy: IPRNGProxy = new PRNGProxy();

const prng: (string) => IPRNGProxy = (prng_name: string = 'default'): IPRNGProxy => {
    prng_proxy.set_prng(prng_name);
    return prng_proxy;
};

export {
    PRNGProxy,
    DEFAULT_GENERATOR
};
export default prng(DEFAULT_GENERATOR);

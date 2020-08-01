// @flow
/**
 * Generates random color
 * Created by Alexey S. Kiselev
 */

import {IRandomColor} from '../interfaces';
import {Singleton} from '../decorators';
import prng from '../prng/prngProxy';

@Singleton
class RandomColor implements IRandomColor {

    _saturation: number;
    _goldenRatioConjugate: number;
    _hMap: {[number]: Array<number>}; // v t p q
    _transformMap: {[string]: Function};

    constructor(saturation: number) {
        this.setSaturation(saturation);

        this._goldenRatioConjugate = 0.618033988749895;
        this._hMap = {
            // $FlowFixMe
            0: [0, 1, 2],
            // $FlowFixMe
            1: [3, 0, 2],
            // $FlowFixMe
            2: [2, 0, 1],
            // $FlowFixMe
            3: [2, 3, 0],
            // $FlowFixMe
            4: [1, 2, 0],
            // $FlowFixMe
            5: [0, 2, 3]
        }; // v t p q
        this._transformMap = {
            'rgb': this._transformRGB,
            'hex': this._transformHex.bind(this)
        };
    }

    /**
     * Returns allowed types of transformations
     * @returns {{hex: boolean, rgb: boolean}}
     */
    static getTypes(): {[string]: boolean} {
        return {
            'rgb': true,
            'hex': true
        };
    }

    /**
     * @returns {number}
     * @public
     */
    getSaturation(): number {
        return this._saturation;
    }

    /**
     * @param {number} saturation
     * @public
     */
    setSaturation(saturation: number): void {
        this._validateSaturation(Number(saturation));
        this._saturation = Number(saturation);
    }

    /**
     * Validates saturation
     * @param {number} saturation
     * @private
     */
    _validateSaturation(saturation: number): void {
        if (!((saturation || saturation === 0) && saturation >= 0 && saturation <= 1)) {
            throw new Error('RandomColor: saturation must be in 0 <= saturation <= 1 range');
        }
    }

    /**
     * Converts HSV to RGB
     * @param h
     * @param s
     * @param v
     * @private
     */
    _hsvToRgb(h: number, s: number, v: number): Array<number> {
        const hInt = Math.floor(h * 6);
        const f = h * 6 - hInt;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        return this._rgbFromVtpq(this._hMap[hInt], [v, t, p, q]);
    }

    /**
     * @returns {Array<number>}
     * @private
     */
    _rgbFromVtpq(rgbMap: Array<number>, vtpq: Array<number>): Array<number> {
        return [Math.floor(vtpq[rgbMap[0]] * 256), Math.floor(vtpq[rgbMap[1]] * 256), Math.floor( vtpq[rgbMap[2]] * 256)];
    }

    /**
     * Generates random color
     * @returns {Array<number>} rgb array
     * @private
     */
    _randomColor(): Array<number> {
        return this._hsvToRgb(this._randomH((prng.random(): any)), this._saturation, this._getRandomV());
    }

    /**
     * Generates random color or array of colors
     * Output depends on type
     * @param {string} type
     * @param {number} n
     * @public
     */
    randomColor(type: string, n?: number = -1): any {
        if (n <= 0) {
            return (this._transform(type): any)(this._randomColor());
        }
        prng.random();
        const res: Array<any> = [];
        for (let i = 0; i < n; i += 1) {
            res[i] = this.nextColor(type);
        }
        return res;
    }

    /**
     * Generates random color
     * @returns {Array<number>} rgb array
     * @private
     */
    _nextColor(): Array<number> {
        return this._hsvToRgb(this._randomH((prng.next(): any)), this._saturation, this._getRandomV());
    }

    _getRandomV(): number {
        return 0.7 + 0.3 * (prng.next(): any);
    }

    /**
     * Generates random color or array of colors
     * Output depends on type
     * @param {string} type
     * @public
     */
    nextColor(type: string): any {
        return (this._transform(type): any)(this._nextColor());
    }

    /**
     * Returns random hue value
     * @param {number} rand
     * @returns {number}
     * @private
     */
    _randomH(rand: number): number {
        const _h = rand + this._goldenRatioConjugate;
        return _h % 1;
    }

    /**
     * Transforms RGB array due to type
     * @param {string} type
     * @private
     */
    _transform(type: string): {[string]: Function} {
        return this._transformMap[type];
    }

    _transformRGB(rgb: Array<number>): Array<number> {
        return rgb;
    }

    _transformHex(rgb: Array<number>): string {
        return '#' + this._componentToHex(rgb[0]) + this._componentToHex(rgb[1]) + this._componentToHex(rgb[2]);
    }

    _componentToHex(c: number): string {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
}

export default RandomColor;

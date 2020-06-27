// @flow
/**
 * Moving average algorithm
 * options contain: weights ([0.125, 0.25, 0.25, 0.25, 0.125]), centerIndex: 3, policy: '2x4-MA'
 * Created by Alexey S. Kiselev
 */

import type {RandomArray} from '../../types';
import type {ISmooth} from '../../interfaces';

type MASmoothData = {
    minDataLength: number,
    weights: Array<number>,
    centerIndex: number
};
const FLOAT_SUM = 10000;
const DEFAULT_MA_POLICY = '2x4-MA';

class MovingAverage implements ISmooth {

    _defaultWeights: Array<number>;
    _policies: {[string]: MASmoothData};

    constructor() {
        this._defaultWeights = [0.125, 0.25, 0.25, 0.25, 0.125];
        this._policies = {
            '2x4-MA': {
                minDataLength: 5,
                weights: [0.125, 0.25, 0.25, 0.25, 0.125],
                centerIndex: 2
            },
            '2x12-MA': {
                minDataLength: 13,
                weights: [1/24, 1/12, 1/12, 1/12, 1/12, 1/12, 1/12, 1/12, 1/12, 1/12, 1/12, 1/12, 1/24],
                centerIndex: 6
            },
            '2x8-MA': {
                minDataLength: 9,
                weights: [1/16, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8, 1/16],
                centerIndex: 4
            },
            '3x3-MA': {
                minDataLength: 5,
                weights: [1/9, 2/9, 1/3, 2/9, 1/9],
                centerIndex: 2
            },
            '3x5-MA': {
                minDataLength: 7,
                weights: [1/15, 2/15, 1/5, 1/5, 1/5, 2/15, 1/15],
                centerIndex: 3
            },
            '3-MA': {
                minDataLength: 3,
                weights: [1/3, 1/3, 1/3],
                centerIndex: 1
            },
            '5-MA': {
                minDataLength: 5,
                weights: [1/5, 1/5, 1/5, 1/5, 1/5],
                centerIndex: 2
            },
            'H5-MA': {
                minDataLength: 5,
                weights: [-0.073, 0.294, 0.558, 0.294, -0.073],
                centerIndex: 2
            },
            'H9-MA': {
                minDataLength: 9,
                weights: [-0.041, -0.01, 0.119, 0.267, 0.33, 0.267, 0.119, -0.01, -0.041],
                centerIndex: 4
            },
            'H13-MA': {
                minDataLength: 13,
                weights: [-0.019, -0.028, 0, 0.066, 0.147, 0.214, 0.240, 0.214, 0.147, 0.066, 0, -0.028, -0.019],
                centerIndex: 6
            },
            'H23-MA': {
                minDataLength: 23,
                weights: [-0.004, -0.011, -0.016, -0.015, -0.005, 0.013, 0.039, 0.068, 0.097, 0.122, 0.138, 0.148,
                    0.138, 0.122, 0.097, 0.068, 0.039, 0.013, -0.005, -0.015, -0.016, -0.011, -0.004],
                centerIndex: 11
            },
            'S15-MA': {
                minDataLength: 15,
                weights: [-0.009, -0.019, -0.016, 0.009, 0.066, 0.144, 0.209, 0.231, 0.209, 0.144, 0.066, 0.009, -0.016, -0.019, -0.009],
                centerIndex: 7
            },
            'S21-MA': {
                minDataLength: 21,
                weights: [-0.003, -0.009, -0.014, -0.014, -0.006, 0.017, 0.051, 0.037, 0.134, 0.163, 0.171,
                    0.163, 0.134, 0.037, 0.051, 0.017, -0.006, -0.014, -0.014, -0.009, -0.003],
                centerIndex: 10
            }
        };
    }

    /**
     * Smooth data
     * @param {RandomArray} data
     * @param {{[string]: any}} options
     */
    smooth(data: RandomArray, options: ?{[string]: any} = {}): RandomArray {
        const smoothData: MASmoothData = this._getSmoothData(options || {});
        if (smoothData.minDataLength > data.length) {
            throw new Error(`Smooth (Moving Average): data size must NOT be less then ${smoothData.minDataLength}, given ${data.length}`);
        }

        // Smoothing implementation
        const result: RandomArray = [];
        const weights = smoothData.weights;
        const ci = smoothData.centerIndex;
        const leftStartIndex: number = smoothData.centerIndex;
        const rightEndIndex: number = data.length - 1 - (smoothData.weights.length - 1 - smoothData.centerIndex);
        let subResult;

        // Left edge case
        for(let i = 0; i < leftStartIndex; i += 1) {
            subResult = 0;
            for(let j = 0; j < weights.length; j += 1) {
                if (i + j - ci < 0) {
                    subResult += data[Math.abs(i + j - ci) - 1] * weights[j];
                } else {
                    subResult += data[i + j - ci] * weights[j];
                }
            }
            result[i] = subResult;
        }

        // Centered smooth - leftStartIndex <= i <= rightEndIndex
        for(let i = leftStartIndex; i <= rightEndIndex; i += 1) {
            subResult = 0;
            for(let j = 0; j < weights.length; j += 1) {
                subResult += data[i + j - ci] * weights[j];
            }
            result[i] = subResult;
        }

        // Right edge case
        for(let i = rightEndIndex + 1; i < data.length; i += 1) {
            subResult = 0;
            for(let j = 0; j < weights.length; j += 1) {
                if (i + j - ci >= data.length) {
                    subResult += data[2 * data.length - (i + j - ci + 1)] * weights[j];
                } else {
                    subResult += data[i + j - ci] * weights[j];
                }
            }
            result[i] = subResult;
        }

        return result;
    }

    /**
     * Construct weights and other data from options
     * @param {{[string]: any}} options
     * @private
     */
    _getSmoothData(options: {[string]: any}): MASmoothData {
        // priority for policies
        if (this._isDefined(options.policy)) {
            if (!this._policies[options.policy]) {
                throw new Error(`Smooth (Moving Average): policy ${options.policy} not allowed`);
            }
            return this._policies[options.policy];
        }
        // second priority for weights
        if (this._isDefined(options.weights)) {
            this._checkWeightsSum(options.weights);
            if (this._isDefined(options.centerIndex)) {
                this._checkCenterIndex(options.weights, options.centerIndex);
                return {
                    minDataLength: options.weights.length,
                    weights: options.weights,
                    centerIndex: options.centerIndex
                };
            } else {
                return this._constructSmoothDataFromWeights(options.weights);
            }
        }

        // third priority for order
        if (this._isDefined(options.order)) {
            this._checkOrder(options.order);
            // construct weights from order
            const tempWeights: Array<number> = [];
            const tempOrder: number = Math.floor(Number(options.order));
            for (let i = 0; i < tempOrder; i += 1) {
                tempWeights[i] = 1 / tempOrder;
            }
            if (options.centered) {
                return this._constructSmoothDataFromWeights(tempWeights);
            }
            return {
                minDataLength: tempOrder,
                weights: tempWeights,
                centerIndex: Math.floor(tempOrder / 2)
            };
        }

        return this._policies[DEFAULT_MA_POLICY];
    }

    /**
     * Constructs smooth data from weights
     * @param {Array<number>} weights
     * @returns {MASmoothData}
     * @private
     */
    _constructSmoothDataFromWeights(weights: Array<number>): MASmoothData {
        if (weights.length % 2 === 1) {
            return {
                weights,
                minDataLength: weights.length,
                centerIndex: Math.floor(weights.length / 2)
            };
        }
        // Extend weights with centered weight equals to 0
        const extendedWeights: Array<number> = [];
        for (let i = 0; i < weights.length / 2; i += 1) {
            extendedWeights[i] = weights[i];
        }
        extendedWeights[weights.length / 2] = 0;
        for (let i = weights.length / 2; i < weights.length; i += 1) {
            extendedWeights[i + 1] = weights[i];
        }

        return {
            weights: extendedWeights,
            minDataLength: extendedWeights.length,
            centerIndex: weights.length / 2
        };
    }

    /**
     * Checks whether options has field
     * @param {number} field
     * @returns {boolean}
     * @private
     */
    _isDefined(field: ?number): boolean {
        return typeof field !== 'undefined' && field !== null;
    }

    /**
     * Checks whether the order is good
     * @param {any} order
     * @private
     */
    _checkOrder(order: any): void {
        if (!Number(order) || Math.floor(Number(order)) < 2) {
            throw new Error('Smooth (Moving Average): options.order must be an positive integer number > 1');
        }
    }

    /**
     * Checks whether options.centerIndex is good
     * @param {Array<number>} weights
     * @param {any} centerIndex
     * @private
     */
    _checkCenterIndex(weights: Array<number>, centerIndex: any): void {
        if (Number(centerIndex) === 0) {
            return;
        }
        if (!Number(centerIndex)) {
            throw new Error('Smooth (Moving Average): options.centerIndex must be an integer number');
        }
        const centerIndexAsNumber: number = Math.floor(Number(centerIndex));
        if (centerIndexAsNumber < 0 || centerIndexAsNumber >= weights.length) {
            throw new Error('Smooth (Moving Average): options.centerIndex must be 0 <= centerIndex < options.weights.length');
        }
    }

    /**
     * Checks whether sum of weights equals one (1.0001 is not OK, but 1.00001 is OK)
     * @param {any} weights
     * @private
     */
    _checkWeightsSum(weights: any): void {
        if (!Array.isArray(weights)) {
            throw new Error('Smooth (Moving Average): options.weights must be an array');
        }
        let sum = 0;
        for (let i = 0; i < weights.length; i += 1) {
            sum += weights[i];
        }
        if (Math.round(sum * FLOAT_SUM) !== FLOAT_SUM) {
            throw new Error(`Smooth(Moving Average): sum of weights must be 1, given ${sum}`);
        }
    }

    /**
     * @returns {string}
     */
    getName(): string {
        return 'Moving Average';
    }

}

export default MovingAverage;

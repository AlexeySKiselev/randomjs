// @flow
/**
 * Data smoothing proxy
 * Created by Alexey S. Kiselev
 */

import type { IAnalyzerSingleton, ISmooth, ISmoothProxy } from '../../interfaces';
import type { RandomArray, SmoothData } from '../../types';

import MovingAverage from './movingAverage';

const AnalyzerMethods: {[string]: IAnalyzerSingleton} = require('../../analyzer');
const DEFAULT_SMOOTH_ALGORITHM = 'moving_average';

class SmoothProxy implements ISmoothProxy {

    _allowedSmoothAlgorithms: {[string]: any};
    _smoothAlgorithms: {[string]: ISmooth};
    _currentSmoothAlgorithm: ISmooth;
    _currentSmoothAlgorithmName: string;

    constructor() {
        this._allowedSmoothAlgorithms = {
            'moving_average': MovingAverage
        };
        this._smoothAlgorithms = {};
        this.setSmoothAlgorithm(DEFAULT_SMOOTH_ALGORITHM);
    }

    /**
     * Apply smoothing using different algorithms and parameters
     * @param {RandomArray} data
     * @param {{[string]: any}} options
     * @returns {RandomArray}
     */
    smoothSync(data: RandomArray, options: ?{[string]: any} = {}): SmoothData {
        if (options && options.algorithm) {
            this.setSmoothAlgorithm(options.algorithm);
        }

        if (options && options.diff) {
            const smoothData: RandomArray = this._currentSmoothAlgorithm.smooth(data, options);
            return {
                smoothData,
                diff: this._constructDiff(data, smoothData)
            };
        }

        return this._currentSmoothAlgorithm.smooth(data, options);
    }

    smooth(data: RandomArray, options: ?{[string]: any} = {}): Promise<SmoothData> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve(this.smoothSync(data, options));
                } catch (e) {
                    reject(e.message);
                }
            }, 0);
        });
    }

    /**
     * Sets algorithm
     * @param {string} name
     */
    setSmoothAlgorithm(name: string): void {
        if (!this._allowedSmoothAlgorithms[name]) {
            throw new Error(`Smooth: algorithm ${name} is not allowed`);
        }

        if (!this._smoothAlgorithms[name]) {
            this._smoothAlgorithms[name] = new this._allowedSmoothAlgorithms[name]();
        }

        this._currentSmoothAlgorithmName = name;
        this._currentSmoothAlgorithm = this._smoothAlgorithms[name];
    }

    /**
     * Returns current algorithm name
     * @returns {string}
     */
    getAlgorithmName(): string {
        return this._currentSmoothAlgorithm.getName();
    }

    /**
     * Returns a list of allowed algorithms
     * @returns {Array<string>}
     */
    listSmoothAlgorithms(): Array<string> {
        return Object.keys(this._allowedSmoothAlgorithms);
    }

    /**
     * Returns default smooth algorithm name
     * @returns {string}
     */
    getDefaultAlgorithmName(): string {
        return DEFAULT_SMOOTH_ALGORITHM;
    }

    /**
     * Construct diff data and analyze it
     * @param {RandomArray} initialData
     * @param {RandomArray} smoothData
     * @returns {{[string]: any}}
     * @private
     */
    _constructDiff(initialData: RandomArray, smoothData: RandomArray): {[string]: any} {
        const diffData = [];
        for (let i = 0; i < initialData.length; i += 1) {
            diffData[i] = initialData[i] - smoothData[i];
        }

        // analyze diff
        const result: {[string]: any} = {
            diffData
        };

        Object.keys(AnalyzerMethods).forEach((mKey: string) => {
            const methodsClass = AnalyzerMethods[mKey].getInstance(diffData, {
                pdf: 20 // TODO: add it to smooth params
            });
            for (let prop: any in methodsClass.constructor.publicMethods) {
                result[prop] = methodsClass[prop];
            }
        });

        return result;
    }
}

export default SmoothProxy;

// @flow
/**
 * Data smoothing using different algorithms
 * Created by Alexey S. Kiselev
 */

import type {ISmoothProxy} from '../../interfaces';
import SmoothProxy from './smoothProxy';

const smoothProxy: ISmoothProxy = new SmoothProxy();
const defaultSmoothAlgorithmName: string = smoothProxy.getDefaultAlgorithmName();

const smooth: Function<ISmoothProxy> = (name: string): ISmoothProxy  => {
    smoothProxy.setSmoothAlgorithm(name || defaultSmoothAlgorithmName);
    return smoothProxy;
};

export default smooth(defaultSmoothAlgorithmName);

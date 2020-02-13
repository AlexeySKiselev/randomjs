// @flow
/**
 * Returns a hash map of all analyzer methods
 * Created by Alexey S. Kiselev
 */

import { IAnalyzerSingleton } from '../interfaces';

const Common: IAnalyzerSingleton = require('./common');
const Percentiles: IAnalyzerSingleton = require('./percentiles');
const AnalyzerMethodsMapper: {[string]: IAnalyzerSingleton} = {
    Common,
    Percentiles
};

module.exports = AnalyzerMethodsMapper;

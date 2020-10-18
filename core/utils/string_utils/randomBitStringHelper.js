// @flow
/**
 * Helper for randomBitString
 * Using Binomial-Shuffle algorithm
 * https://arxiv.org/pdf/1808.05009.pdf
 * Created by Alexey S. Kiselev
 */

import prng from '../../prng/prngProxy';

module.exports = (length: number, p: number = 0.5, binomialM: number): string => {
    if (p === 1) {
        let _res = '';
        for (let i = 0; i < length; i += 1) {
            _res += '1';
        }
        return _res;
    }

    let res: Array<number> = [];
    for (let i = 0; i < length; i += 1) {
        res[i] = 0;
    }

    let k: number, t: number;
    for (let i = length - binomialM; i < length; i += 1) {
        k = Math.floor(prng.next() * i);
        t = length - 1 - k;
        if (res[t] === 0) {
            res[t] = 1;
        } else {
            res[length - 1 - i] = 1;
        }
    }

    return res.join('');
};

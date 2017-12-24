// @flow
/**
 * Common methods
 * Created by Alexey S. Kiselev
 */

import { IAnalyzerMethods} from '../interfaces';
import { PublicMethod } from '../decorators';

class Common {
    randomArray: IAnalyzerMethods.randomArray;

    constructor(randomArray: Array<number>) {
        this.randomArray = randomArray;
    }

    @PublicMethod
    get max() {
        return this.prodTen();
    }

    @PublicMethod
    get min() {
        return this.randomArray[1];
    }

    sortRandom() {
        return this.randomArray;
    }

    prodTen() {
        return 10 * this.randomArray[0];
    }

    @PublicMethod
    get average() {
        return (this.max + this.min) / 2;
    }
}

module.exports = Common;

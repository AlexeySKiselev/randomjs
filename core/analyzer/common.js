// @flow
/**
 * Common methods
 * Created by Alexey S. Kiselev
 */

import { IAnalyzerMethods} from '../interfaces';
import { AnalyzerPublicMethod } from '../decorators';

class Common {
    randomArray: IAnalyzerMethods.randomArray;

    constructor(randomArray: Array<number>) {
        this.randomArray = randomArray;
    }

    @AnalyzerPublicMethod
    get max() {
        return this.prodTen();
    }

    @AnalyzerPublicMethod
    get min() {
        return this.randomArray[1];
    }

    sortRandom() {
        return this.randomArray;
    }

    prodTen() {
        return 10 * this.randomArray[0];
    }

    @AnalyzerPublicMethod
    get average() {
        return (this.max + this.min) / 2;
    }
}

module.exports = Common;

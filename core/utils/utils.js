// @flow
/**
 * Class for additional functions (Gamma, Digamma, ...)
 * Created by Alexey S. Kiselev
 */

class Utils {
    /**
     * Gamma function
     * Calculate function using polynomial approach
     * https://en.wikipedia.org/wiki/Gamma_function
     * @param z<number> - for this project purpose z > 0 and real value
     * @returns {number}
     */
    static gamma(z: number): number {
        if(z <= 0)
            throw new Error('Argument of Gamma function must be positive');
        let coefs: Array<number> = [
            57.1562356658629235,
            -59.5979603554754912,
            14.1360979747417471,
            -0.491913816097620199,
            0.339946499848118887E-4,
            0.465236289270485756E-4,
            -0.983744753048795646E-4,
            0.158088703224912494E-3,
            -0.210264441724104883E-3,
            0.217439618115212643E-3,
            -0.164318106536763890E-3,
            0.844182239838527433E-4,
            -0.261908384015814087E-4,
            0.368991826595316234E-5
        ];
        let denominator: number = z,
            series: number = 0.999999999999997092,
            temp: number = z + 5.24218750000000000;
        temp = (z + 0.5) * Math.log(temp) - temp;

        for(let i: number = 0; i < 14; i += 1){
            series += coefs[i] / ++denominator;
        }

        return Math.exp(temp + Math.log(2.5066282746310005*series/z));
    }

    /**
     * Digamma function
     * https://en.wikipedia.org/wiki/Digamma_function
     * Calculate function using polynomial approach
     * @param z: number, z > 0
     * @returns {number}
     */
    static digamma(z: number): number {
        if(z <= 0)
            throw new Error('Argument of Digamma function must be positive');
        let coefs: Array<number> = [
            0,
            -1/2,
            -1/12,
            0,
            1/120,
            0,
            -1/252,
            0,
            1/240,
            0,
            -5/660,
            0,
            691/32760,
            0,
            -1/12
        ],
            result: number = Math.log(z);
        for(let i: number = 0; i < 15; i += 1){
            result += coefs[i] / Math.pow(z, i);
        }
        return result;
    }
}

module.exports = Utils;

// TODO: implement Beta function

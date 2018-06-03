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
        if(z < 0.5) {
            return Utils.digamma(1 - z) + Math.PI * Math.cos(Math.PI * (1 -z)) / Math.sin(Math.PI * (1 - z));
        }
        return Math.log(z + 0.4849142940227510) - 1 / (z * 1.0271785180163817);
    }

    /**
     * Error function
     * https://en.wikipedia.org/wiki/Error_function
     * Use Maclaurin series approximation
     * @param z: number
     * @returns {number}
     */
    static erf(z: number): number {
        let series: number = z,
            factorial = 1;

        if(z >= 3) {
            return 1;
        }

        if(z <= -3) {
            return -1;
        }

        for(let i = 1; i <= 26; i += 1) {
            factorial *= i;
            series += Math.pow(-1, i) * Math.pow(z, 2 * i + 1) / (factorial * (2 * i + 1));
        }
        return 2 * series / Math.sqrt(Math.PI);
    }
}

module.exports = Utils;

// TODO: implement Beta function

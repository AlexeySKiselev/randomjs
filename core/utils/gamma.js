// @flow
/**
 * Gamma function
 * Created by Alexey S. Kiselev
 */

function gamma(z: number): number {
    if(z <= 0) throw new Error('Argument of Gamma function must be positive');
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
    temp = (z + 0.5)*Math.log(temp) - temp;

    for(let i: number = 0; i < 14; i += 1){
        series += coefs[i] / ++denominator;
    }

    return Math.exp(temp + Math.log(2.5066282746310005*series/z));
}

module.exports = gamma;

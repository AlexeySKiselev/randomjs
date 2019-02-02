/**
 * Test Build Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let unirand = require('../lib');

unirand.seed('unirand');
console.log(unirand.normal(1.5, 2).toString());
console.log(unirand.poisson(12).toString());
console.log(unirand.triangular(1, 3, 2).toString());

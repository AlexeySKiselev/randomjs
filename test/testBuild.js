/**
 * Test Build Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let unirand = require('../lib');

unirand.seed('unirand');
console.log(unirand.normal(1.5, 2).random());
console.log(unirand.normal(1, 2).random());
console.log(unirand.normal(1, 2).random());

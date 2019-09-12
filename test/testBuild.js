/**
 * Test Build Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let unirand = require('../lib');

unirand.seed();
console.log(unirand.laplace(1, 2).distributionSync(4));

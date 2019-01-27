/**
 * Test Build Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let prng = require('../lib/prng/prngProxy').default,
    R = require('../lib/methods/negativebinomial'),
    r = new R(3, 0.6);

prng.seed();
console.log(r.random());
console.log(r.random());
console.log(r.distribution(10));
console.log(r.distribution(10));






/**
 * Test Build Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let Tuchei = require('../lib/prng/TucheiPRNG').default;
let tuchei = new Tuchei();
let hash = require('../lib/utils/hash').default;
console.log(hash('hello, world', 100000));

tuchei.seed('Hello world');
console.log(tuchei.random(2));
tuchei.seed(12345678);
console.log(tuchei.random(2));

let main = require('../lib');
console.log(main.prng.prng_name);
main.seed('Nika');
console.log(main.random());




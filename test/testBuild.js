/**
 * Test Build Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let Tuchei = require('../lib/prng/TucheiPRNG').default;
let tuchei = new Tuchei();
let hash = require('../lib/utils/hash').default;
let epsilon = 0.00000001;
console.log(Math.sqrt(-2 * Math.log(1 - epsilon)));






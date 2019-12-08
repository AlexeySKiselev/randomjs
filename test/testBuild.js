/**
 * Test Build
 * I am using it for tests only
 * Created by Alexey S. Kiselev
 */

const unirand = require('../lib/');

console.log(unirand.hash('unirand'));
console.log(unirand.hash('unirand', [0, 1, 2, 3]));
console.log(unirand.hash('unirand', 200));

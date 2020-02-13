/**
 * Test Build
 * I am using it for tests only
 * Created by Alexey S. Kiselev
 */

const unirand = require('../lib/');

let data = [2, 6, 9, 4, 6, 7, 3, 2, 4, 7];

let res = unirand.smoothSync(data, {diff: true});
console.log(res);

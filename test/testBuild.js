/**
 * Test Built Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let randomjs = require('../lib');

console.log('Normal random number');
console.log(randomjs.normal(3, 3).variance);
console.log(randomjs.normal(2, 2).variance);
console.log('Analyzer');
let analyzer = randomjs.analyze([1, 5, 3, 4, 6, 7, 8, 10, 11, 12, 9, 4, 3]);
//console.log(analyzer);
console.log('Sync');

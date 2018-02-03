/**
 * Test Built Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let randomjs = require('../lib');

console.log('Normal random number');
console.log(randomjs.normal(3, 3).variance);
console.log(randomjs.normal(2, 2).variance);
console.log('Analyzer');
let analyzer = randomjs.analyze([1, 4, 5, 9, 6, 4, 2, 6, 2, 10, 11, 8, 7, 12, 1, 1, 8, 6, 4, 5, 9]);//[1, 5, 3, 4, 6, 7, 8, 10, 11, 12, 9, 4, 3, 5, 9, 12, 1, 1, 3, 4, 6, 2, 8]);
//console.log(analyzer);
analyzer.skewness.then(res => {
    console.log('Result', res);
})
    .catch((err) => {
        console.error('Error', err);
    });
console.log('Sync');

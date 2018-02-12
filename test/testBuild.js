/**
 * Test Built Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let randomjs = require('../lib');

console.log('Normal random number');
console.log(randomjs.normal(3, 3).variance);
console.log(randomjs.normal(2, 2).variance);
console.log('Analyzer');
let analyzer = randomjs.analyze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);//[1, 5, 3, 4, 6, 7, 8, 10, 11, 12, 9, 4, 3, 5, 9, 12, 1, 1, 3, 4, 6, 2, 8]);
//console.log(analyzer);
analyzer.median.then(res => {
    console.log(res);
})
    .catch((err) => {
        console.error('Error', err);
    });
console.log('Sync');
console.log(Math.log(19))


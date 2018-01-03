/**
 * Test Built Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

import randomjs from '../lib';

console.log('Normal random number');
console.log(randomjs.normal(3, 3).variance);
console.log(randomjs.normal(2, 2).variance);
console.log('Analyzer');
console.log(randomjs.analyze([3, 4]));
console.log(randomjs.analyze([5, 6]));
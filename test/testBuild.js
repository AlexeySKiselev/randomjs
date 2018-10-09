/**
 * Test Built Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let sample = require('../lib');
sample.analyze([1, 4, 5, 9, 6, 4, 20, 2, 6, 2, 10, 11, 12, 6, 8, 7, 1, 1, 9, 6, 4, 5, 9]).then((r) => {console.log('test', r);});

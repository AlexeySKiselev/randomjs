/**
 * Test Built Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let randomjs = require('../lib'),
    strand = randomjs.sample({1:2, 3:4, 5:6, 7:8, 9:10, 11:12, 13:14}, 5, false);

console.log(strand);


/**
 * Test Built Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let randomjs = require('../lib'),
    strand = randomjs.sample(() => {
        return 1;
    }, 5);

console.log(strand);


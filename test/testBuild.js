/**
 * Test Build Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let unirand = require('../lib');

unirand.seed(12345);
console.log(unirand.random());
console.log(unirand.next());
console.log(unirand.next());
//unirand.seed();
console.log(unirand.normal(3, 3).randomSync());
console.log(unirand.normal(3, 3).nextSync());
console.log(unirand.normal(3, 3).nextSync());
console.log(unirand.normal(3, 3).nextSync());
console.log(unirand.normal(3, 3).nextSync());


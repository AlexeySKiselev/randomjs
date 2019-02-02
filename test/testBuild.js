/**
 * Test Build Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let unirand = require('../lib');

unirand.seed();
console.log(unirand.negativebinomial(3, 0.6).randomSync());
console.log(unirand.negativebinomial(3, 0.6).nextSync());
console.log(unirand.negativebinomial(3, 0.6).nextSync());
//unirand.seed();
console.log(unirand.negativebinomial(3, 0.6).randomSync());
console.log(unirand.negativebinomial(3, 0.6).nextSync());
console.log(unirand.negativebinomial(3, 0.6).nextSync());

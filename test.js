/** Tests
 * Created by Alexey on 24.08.2017.
 */

let randomjs = require('./lib/index');

console.log('Uniform Distribution:', randomjs.random.uniform(1, 2));
console.log('Normal Distribution:', randomjs.random.normal(0, 1));

/**
 * Test Build Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let unirand = require('../lib');

unirand.seed();
console.log(unirand.kfold([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, {
    derange: true,
    type: 'crossvalidation'
}));

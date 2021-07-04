/**
 * Test for index
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha');

chai.should();

const methods = ['analyze', 'utils', 'stringutils', 'sample', 'kfold', 'shuffle', 'derange', 'chance', 'winsorize',
    'hash', 'smooth', 'smoothSync', 'seed', 'random', 'next', 'randomInt', 'nextInt',
    'randomInRange', 'nextInRange', 'newRouletteWheel', 'newPrng', 'randomColor', 'nextColor', 'encoder', 'uid']; // check prng separately

describe('Index', () => {
    it('unirand should have all supported methods', () => {
        const unirand = require('../lib');

        for (let m of methods) {
            expect(unirand).to.have.property(m);
            expect(unirand).to.respondsTo(m);
        }

        expect(unirand).to.have.property('prng');
    });
});

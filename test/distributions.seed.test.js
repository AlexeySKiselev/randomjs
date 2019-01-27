/**
 * Tests for distributions with seed
 * As PRNG was tested, seeded generator generates uniform distribution [0, 1)
 * Distributions also tested for PRNG without seed
 * Created by Alexey S. Kiselev
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    prng = require('../lib/prng/prngProxy').default;

chai.should();

const compareDistributions = (distA, distB, accuracy = 0.000001) => {
    expect(distA.length).to.be.equal(distB.length);
    for(let i = 0; i < distA.length; i += 1) {
        expect(distA[i]).to.be.closeTo(distB[i], accuracy);
    }

};

describe('Random distributions with seed', () => {
    describe('Uniform distribution (a = 1, b = 4)', () => {
        const Uniform = require('../lib/methods/uniform');
        it('should return same value each time', () => {
            const uniform = new Uniform(1, 4);
            prng.seed('first uniform seed test');
            const uniformFirst = uniform.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(uniform.random()).to.be.closeTo(uniformFirst, 0.000001);
            }
            prng.seed('second uniform seed test');
            const uniformSecond = uniform.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(uniform.random()).to.be.closeTo(uniformSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const uniform = new Uniform(1, 4);
            prng.seed('first uniform seed test');
            const uniformFirst = uniform.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(uniform.distribution(10000), uniformFirst);
            }
            prng.seed('second uniform seed test');
            const uniformSecond = uniform.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(uniform.distribution(10000), uniformSecond);
            }
            done();
        });
    });
    describe('Normal distribution (mu = 1, sigma = 2)', () => {
        const Normal = require('../lib/methods/normal');
        it('should return same value each time', () => {
            const normal = new Normal(1, 2);
            prng.seed('first normal seed test');
            const normalFirst = normal.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(normal.random()).to.be.closeTo(normalFirst, 0.000001);
            }
            prng.seed('second normal seed test');
            const normalSecond = normal.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(normal.random()).to.be.closeTo(normalSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const normal = new Normal(1, 2);
            prng.seed('first normal seed test');
            const normalFirst = normal.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(normal.distribution(10000), normalFirst);
            }
            prng.seed('second normal seed test');
            const normalSecond = normal.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(normal.distribution(10000), normalSecond);
            }
            done();
        });
    });
    describe('Bernoulli distribution (p = 0.6)', () => {
        const Bernoulli = require('../lib/methods/bernoulli');
        it('should return same value each time', () => {
            const bernoulli = new Bernoulli(0.6);
            prng.seed('first bernoulli seed test');
            const bernoulliFirst = bernoulli.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(bernoulli.random()).to.be.closeTo(bernoulliFirst, 0.000001);
            }
            prng.seed('second bernoulli seed test');
            const bernoulliSecond = bernoulli.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(bernoulli.random()).to.be.closeTo(bernoulliSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const bernoulli = new Bernoulli(0.6);
            prng.seed('first bernoulli seed test');
            const bernoulliFirst = bernoulli.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(bernoulli.distribution(10000), bernoulliFirst);
            }
            prng.seed('second bernoulli seed test');
            const bernoulliSecond = bernoulli.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(bernoulli.distribution(10000), bernoulliSecond);
            }
            done();
        });
    });
    describe('Beta distribution (alpha = 2, beta = 5)', () => {
        const Beta = require('../lib/methods/beta');
        it('should return same value each time', () => {
            const beta = new Beta(2, 5);
            prng.seed('first beta seed test');
            const betaFirst = beta.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(beta.random()).to.be.closeTo(betaFirst, 0.000001);
            }
            prng.seed('second beta seed test');
            const betaSecond = beta.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(beta.random()).to.be.closeTo(betaSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const beta = new Beta(2, 5);
            prng.seed('first beta seed test');
            const betaFirst = beta.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(beta.distribution(10000), betaFirst);
            }
            prng.seed('second beta seed test');
            const betaSecond = beta.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(beta.distribution(10000), betaSecond);
            }
            done();
        });
    });
    describe('Beta Prime distribution (alpha = 2, beta = 3)', () => {
        const BetaPrime = require('../lib/methods/betaprime');
        it('should return same value each time', () => {
            const betaprime = new BetaPrime(2, 3);
            prng.seed('first betaprime seed test');
            const betaprimeFirst = betaprime.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(betaprime.random()).to.be.closeTo(betaprimeFirst, 0.000001);
            }
            prng.seed('second betaprime seed test');
            const betaprimeSecond = betaprime.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(betaprime.random()).to.be.closeTo(betaprimeSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const betaprime = new BetaPrime(2, 3);
            prng.seed('first betaprime seed test');
            const betaprimeFirst = betaprime.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(betaprime.distribution(10000), betaprimeFirst);
            }
            prng.seed('second betaprime seed test');
            const betaprimeSecond = betaprime.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(betaprime.distribution(10000), betaprimeSecond);
            }
            done();
        });
    });
    describe('Binomial distribution (p = 0.7, n = 20)', () => {
        const Binomial = require('../lib/methods/binomial');
        it('should return same value each time', () => {
            const binomial = new Binomial(20, 0.7);
            prng.seed('first binomial seed test');
            const binomialFirst = binomial.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(binomial.random()).to.be.closeTo(binomialFirst, 0.000001);
            }
            prng.seed('second binomial seed test');
            const binomialSecond = binomial.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(binomial.random()).to.be.closeTo(binomialSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const binomial = new Binomial(20, 0.7);
            prng.seed('first binomial seed test');
            const binomialFirst = binomial.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(binomial.distribution(10000), binomialFirst);
            }
            prng.seed('second binomial seed test');
            const binomialSecond = binomial.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(binomial.distribution(10000), binomialSecond);
            }
            done();
        });
    });
    describe('Cauchy distribution (x = 1, gamma = 1)', () => {
        const Cauchy = require('../lib/methods/cauchy');
        it('should return same value each time', () => {
            const cauchy = new Cauchy(1, 1);
            prng.seed('first cauchy seed test');
            const cauchyFirst = cauchy.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(cauchy.random()).to.be.closeTo(cauchyFirst, 0.000001);
            }
            prng.seed('second cauchy seed test');
            const cauchySecond = cauchy.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(cauchy.random()).to.be.closeTo(cauchySecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const cauchy = new Cauchy(1, 1);
            prng.seed('first cauchy seed test');
            const cauchyFirst = cauchy.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(cauchy.distribution(10000), cauchyFirst);
            }
            prng.seed('second cauchy seed test');
            const cauchySecond = cauchy.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(cauchy.distribution(10000), cauchySecond);
            }
            done();
        });
    });
    describe('Chi distribution (k = 2)', () => {
        const Chi = require('../lib/methods/chi');
        it('should return same value each time', () => {
            const chi = new Chi(2);
            prng.seed('first chi seed test');
            const chiFirst = chi.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(chi.random()).to.be.closeTo(chiFirst, 0.000001);
            }
            prng.seed('second chi seed test');
            const chiSecond = chi.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(chi.random()).to.be.closeTo(chiSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const chi = new Chi(2);
            prng.seed('first chi seed test');
            const chiFirst = chi.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(chi.distribution(10000), chiFirst);
            }
            prng.seed('second chi seed test');
            const chiSecond = chi.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(chi.distribution(10000), chiSecond);
            }
            done();
        });
    });
    describe('Chi Square distribution (k = 2)', () => {
        const ChiSquare = require('../lib/methods/chisquare');
        it('should return same value each time', () => {
            const chisquare = new ChiSquare(2);
            prng.seed('first chisquare seed test');
            const chisquareFirst = chisquare.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(chisquare.random()).to.be.closeTo(chisquareFirst, 0.000001);
            }
            prng.seed('second chisquare seed test');
            const chisquareSecond = chisquare.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(chisquare.random()).to.be.closeTo(chisquareSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const chisquare = new ChiSquare(2);
            prng.seed('first chisquare seed test');
            const chisquareFirst = chisquare.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(chisquare.distribution(10000), chisquareFirst);
            }
            prng.seed('second chisquare seed test');
            const chisquareSecond = chisquare.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(chisquare.distribution(10000), chisquareSecond);
            }
            done();
        });
    });
    describe('Erlang distribution (k = 2, mu = 2)', () => {
        const Erlang = require('../lib/methods/erlang');
        it('should return same value each time', () => {
            const erlang = new Erlang(2, 2);
            prng.seed('first erlang seed test');
            const erlangFirst = erlang.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(erlang.random()).to.be.closeTo(erlangFirst, 0.000001);
            }
            prng.seed('second erlang seed test');
            const erlangSecond = erlang.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(erlang.random()).to.be.closeTo(erlangSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const erlang = new Erlang(2, 2);
            prng.seed('first erlang seed test');
            const erlangFirst = erlang.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(erlang.distribution(10000), erlangFirst);
            }
            prng.seed('second erlang seed test');
            const erlangSecond = erlang.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(erlang.distribution(10000), erlangSecond);
            }
            done();
        });
    });
    describe('Gamma distribution (alpha = 2, beta = 0.5)', () => {
        const Gamma = require('../lib/methods/gamma');
        it('should return same value each time', () => {
            const gamma = new Gamma(2, 0.5);
            prng.seed('first gamma seed test');
            const gammaFirst = gamma.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(gamma.random()).to.be.closeTo(gammaFirst, 0.000001);
            }
            prng.seed('second gamma seed test');
            const gammaSecond = gamma.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(gamma.random()).to.be.closeTo(gammaSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const gamma = new Gamma(2, 0.5);
            prng.seed('first gamma seed test');
            const gammaFirst = gamma.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(gamma.distribution(10000), gammaFirst);
            }
            prng.seed('second gamma seed test');
            const gammaSecond = gamma.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(gamma.distribution(10000), gammaSecond);
            }
            done();
        });
    });
    describe('Geometric distribution (p = 0.6)', () => {
        const Geometric = require('../lib/methods/geometric');
        it('should return same value each time', () => {
            const geometric = new Geometric(0.6);
            prng.seed('first geometric seed test');
            const geometricFirst = geometric.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(geometric.random()).to.be.closeTo(geometricFirst, 0.000001);
            }
            prng.seed('second geometric seed test');
            const geometricSecond = geometric.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(geometric.random()).to.be.closeTo(geometricSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const geometric = new Geometric(0.6);
            prng.seed('first geometric seed test');
            const geometricFirst = geometric.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(geometric.distribution(10000), geometricFirst);
            }
            prng.seed('second geometric seed test');
            const geometricSecond = geometric.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(geometric.distribution(10000), geometricSecond);
            }
            done();
        });
    });
    describe('Negative Binomial distribution (r = 3, p = 0.6)', () => {
        const NegativeBinomial = require('../lib/methods/negativebinomial');
        it('should return same value each time', () => {
            const negativebinomial = new NegativeBinomial(3, 0.6);
            prng.seed('first negativebinomial seed test');
            const negativebinomialFirst = negativebinomial.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(negativebinomial.random()).to.be.closeTo(negativebinomialFirst, 0.000001);
            }
            prng.seed('second negativebinomial seed test');
            const negativebinomialSecond = negativebinomial.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(negativebinomial.random()).to.be.closeTo(negativebinomialSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const negativebinomial = new NegativeBinomial(3, 0.6);
            prng.seed('first negativebinomial seed test');
            const negativebinomialFirst = negativebinomial.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(negativebinomial.distribution(10000), negativebinomialFirst);
            }
            prng.seed('second negativebinomial seed test');
            const negativebinomialSecond = negativebinomial.distribution(10000);
            for(let i = 0; i < 20; i += 1) {
                compareDistributions(negativebinomial.distribution(10000), negativebinomialSecond);
            }
            done();
        });
    });
});

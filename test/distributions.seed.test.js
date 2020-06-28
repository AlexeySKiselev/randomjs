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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(uniform.distribution(10000), uniformFirst);
            }
            prng.seed('second uniform seed test');
            const uniformSecond = uniform.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(normal.distribution(10000), normalFirst);
            }
            prng.seed('second normal seed test');
            const normalSecond = normal.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(bernoulli.distribution(10000), bernoulliFirst);
            }
            prng.seed('second bernoulli seed test');
            const bernoulliSecond = bernoulli.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(beta.distribution(10000), betaFirst);
            }
            prng.seed('second beta seed test');
            const betaSecond = beta.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(betaprime.distribution(10000), betaprimeFirst);
            }
            prng.seed('second betaprime seed test');
            const betaprimeSecond = betaprime.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(binomial.distribution(10000), binomialFirst);
            }
            prng.seed('second binomial seed test');
            const binomialSecond = binomial.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(cauchy.distribution(10000), cauchyFirst);
            }
            prng.seed('second cauchy seed test');
            const cauchySecond = cauchy.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(chi.distribution(10000), chiFirst);
            }
            prng.seed('second chi seed test');
            const chiSecond = chi.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(chisquare.distribution(10000), chisquareFirst);
            }
            prng.seed('second chisquare seed test');
            const chisquareSecond = chisquare.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(chisquare.distribution(10000), chisquareSecond);
            }
            done();
        });
    });
    describe('Compertz distribution (nu = 0.7, b = 2)', () => {
        const Compertz = require('../lib/methods/compertz');
        it('should return same value each time', () => {
            const compertz = new Compertz(0.7, 2);
            prng.seed('first compertz seed test');
            const compertzFirst = compertz.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(compertz.random()).to.be.closeTo(compertzFirst, 0.000001);
            }
            prng.seed('second compertz seed test');
            const compertzSecond = compertz.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(compertz.random()).to.be.closeTo(compertzSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const compertz = new Compertz(0.7, 2);
            prng.seed('first compertz seed test');
            const compertzFirst = compertz.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(compertz.distribution(10000), compertzFirst);
            }
            prng.seed('second compertz seed test');
            const compertzSecond = compertz.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(compertz.distribution(10000), compertzSecond);
            }
            done();
        });
    });
    describe('Delaporte distribution (alpha = 1, beta = 2, lambda = 3)', () => {
        const Delaporte = require('../lib/methods/delaporte');
        it('should return same value each time', () => {
            const delaporte = new Delaporte(1, 2, 3);
            prng.seed('first delaporte seed test');
            const delaporteFirst = delaporte.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(delaporte.random()).to.be.closeTo(delaporteFirst, 0.000001);
            }
            prng.seed('second delaporte seed test');
            const delaporteSecond = delaporte.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(delaporte.random()).to.be.closeTo(delaporteSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const delaporte = new Delaporte(1, 2, 3);
            prng.seed('first delaporte seed test');
            const delaporteFirst = delaporte.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(delaporte.distribution(10000), delaporteFirst);
            }
            prng.seed('second delaporte seed test');
            const delaporteSecond = delaporte.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(delaporte.distribution(10000), delaporteSecond);
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(erlang.distribution(10000), erlangFirst);
            }
            prng.seed('second erlang seed test');
            const erlangSecond = erlang.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(gamma.distribution(10000), gammaFirst);
            }
            prng.seed('second gamma seed test');
            const gammaSecond = gamma.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(geometric.distribution(10000), geometricFirst);
            }
            prng.seed('second geometric seed test');
            const geometricSecond = geometric.distribution(10000);
            for(let i = 0; i < 10; i += 1) {
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
            const negativebinomialFirst = negativebinomial.distribution(2000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(negativebinomial.distribution(2000), negativebinomialFirst);
            }
            prng.seed('second negativebinomial seed test');
            const negativebinomialSecond = negativebinomial.distribution(2000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(negativebinomial.distribution(2000), negativebinomialSecond);
            }
            done();
        });
    });
    describe('Poisson distribution (lambda = 4)', () => {
        const Poisson = require('../lib/methods/poisson');
        it('should return same value each time', () => {
            const poisson = new Poisson(4);
            prng.seed('first poisson seed test');
            const poissonFirst = poisson.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(poisson.random()).to.be.closeTo(poissonFirst, 0.000001);
            }
            prng.seed('second poisson seed test');
            const poissonSecond = poisson.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(poisson.random()).to.be.closeTo(poissonSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const poisson = new Poisson(4);
            prng.seed('first poisson seed test');
            const poissonFirst = poisson.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(poisson.distribution(5000), poissonFirst);
            }
            prng.seed('second poisson seed test');
            const poissonSecond = poisson.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(poisson.distribution(5000), poissonSecond);
            }
            done();
        });
    });
    describe('Exponential distribution (lambda = 1)', () => {
        const Exponential = require('../lib/methods/exponential');
        it('should return same value each time', () => {
            const exponential = new Exponential(1);
            prng.seed('first exponential seed test');
            const exponentialFirst = exponential.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(exponential.random()).to.be.closeTo(exponentialFirst, 0.000001);
            }
            prng.seed('second exponential seed test');
            const exponentialSecond = exponential.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(exponential.random()).to.be.closeTo(exponentialSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const exponential = new Exponential(1);
            prng.seed('first exponential seed test');
            const exponentialFirst = exponential.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(exponential.distribution(5000), exponentialFirst);
            }
            prng.seed('second exponential seed test');
            const exponentialSecond = exponential.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(exponential.distribution(5000), exponentialSecond);
            }
            done();
        });
    });
    describe('Extreme Value (Gumbel-type) distribution (mu = 0, sigma = 1)', () => {
        const Extremevalue = require('../lib/methods/extremevalue');
        it('should return same value each time', () => {
            const extremevalue = new Extremevalue(0, 1);
            prng.seed('first extremevalue seed test');
            const extremevalueFirst = extremevalue.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(extremevalue.random()).to.be.closeTo(extremevalueFirst, 0.000001);
            }
            prng.seed('second extremevalue seed test');
            const extremevalueSecond = extremevalue.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(extremevalue.random()).to.be.closeTo(extremevalueSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const extremevalue = new Extremevalue(0, 1);
            prng.seed('first extremevalue seed test');
            const extremevalueFirst = extremevalue.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(extremevalue.distribution(5000), extremevalueFirst);
            }
            prng.seed('second extremevalue seed test');
            const extremevalueSecond = extremevalue.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(extremevalue.distribution(5000), extremevalueSecond);
            }
            done();
        });
    });
    describe('Laplace distribution (mu = 0, b = 2)', () => {
        const Laplace = require('../lib/methods/laplace');
        it('should return same value each time', () => {
            const laplace = new Laplace(0, 2);
            prng.seed('first laplace seed test');
            const laplaceFirst = laplace.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(laplace.random()).to.be.closeTo(laplaceFirst, 0.000001);
            }
            prng.seed('second laplace seed test');
            const laplaceSecond = laplace.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(laplace.random()).to.be.closeTo(laplaceSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const laplace = new Laplace(0, 2);
            prng.seed('first laplace seed test');
            const laplaceFirst = laplace.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(laplace.distribution(5000), laplaceFirst);
            }
            prng.seed('second laplace seed test');
            const laplaceSecond = laplace.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(laplace.distribution(5000), laplaceSecond);
            }
            done();
        });
    });
    describe('Logistic distribution (mu = 5, s = 2)', () => {
        const Logistic = require('../lib/methods/logistic');
        it('should return same value each time', () => {
            const logistic = new Logistic(5, 2);
            prng.seed('first logistic seed test');
            const logisticFirst = logistic.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(logistic.random()).to.be.closeTo(logisticFirst, 0.000001);
            }
            prng.seed('second logistic seed test');
            const logisticSecond = logistic.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(logistic.random()).to.be.closeTo(logisticSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const logistic = new Logistic(5, 2);
            prng.seed('first logistic seed test');
            const logisticFirst = logistic.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(logistic.distribution(5000), logisticFirst);
            }
            prng.seed('second logistic seed test');
            const logisticSecond = logistic.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(logistic.distribution(5000), logisticSecond);
            }
            done();
        });
    });
    describe('Lognormal distribution (mu = 0, sigma = 1)', () => {
        const Lognormal = require('../lib/methods/lognormal');
        it('should return same value each time', () => {
            const lognormal = new Lognormal(0, 1);
            prng.seed('first lognormal seed test');
            const lognormalFirst = lognormal.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(lognormal.random()).to.be.closeTo(lognormalFirst, 0.000001);
            }
            prng.seed('second lognormal seed test');
            const lognormalSecond = lognormal.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(lognormal.random()).to.be.closeTo(lognormalSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const lognormal = new Lognormal(0, 1);
            prng.seed('first lognormal seed test');
            const lognormalFirst = lognormal.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(lognormal.distribution(5000), lognormalFirst);
            }
            prng.seed('second lognormal seed test');
            const lognormalSecond = lognormal.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(lognormal.distribution(5000), lognormalSecond);
            }
            done();
        });
    });
    describe('Pareto distribution (xm = 1, alpha = 4)', () => {
        const Pareto = require('../lib/methods/pareto');
        it('should return same value each time', () => {
            const pareto = new Pareto(1, 4);
            prng.seed('first pareto seed test');
            const paretoFirst = pareto.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(pareto.random()).to.be.closeTo(paretoFirst, 0.000001);
            }
            prng.seed('second pareto seed test');
            const paretoSecond = pareto.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(pareto.random()).to.be.closeTo(paretoSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const pareto = new Pareto(1, 4);
            prng.seed('first pareto seed test');
            const paretoFirst = pareto.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(pareto.distribution(5000), paretoFirst);
            }
            prng.seed('second pareto seed test');
            const paretoSecond = pareto.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(pareto.distribution(5000), paretoSecond);
            }
            done();
        });
    });
    describe('Rayleigh distribution (sigma = 1)', () => {
        const Rayleigh = require('../lib/methods/rayleigh');
        it('should return same value each time', () => {
            const rayleigh = new Rayleigh(1);
            prng.seed('first rayleigh seed test');
            const rayleighFirst = rayleigh.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(rayleigh.random()).to.be.closeTo(rayleighFirst, 0.000001);
            }
            prng.seed('second rayleigh seed test');
            const rayleighSecond = rayleigh.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(rayleigh.random()).to.be.closeTo(rayleighSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const rayleigh = new Rayleigh(1);
            prng.seed('first rayleigh seed test');
            const rayleighFirst = rayleigh.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(rayleigh.distribution(5000), rayleighFirst);
            }
            prng.seed('second rayleigh seed test');
            const rayleighSecond = rayleigh.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(rayleigh.distribution(5000), rayleighSecond);
            }
            done();
        });
    });
    describe('Student\'s t-distribution (v = 6)', () => {
        const Student = require('../lib/methods/student');
        it('should return same value each time', () => {
            const student = new Student(6);
            prng.seed('first student seed test');
            const studentFirst = student.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(student.random()).to.be.closeTo(studentFirst, 0.000001);
            }
            prng.seed('second student seed test');
            const studentSecond = student.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(student.random()).to.be.closeTo(studentSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const student = new Student(6);
            prng.seed('first student seed test');
            const studentFirst = student.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(student.distribution(5000), studentFirst);
            }
            prng.seed('second student seed test');
            const studentSecond = student.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(student.distribution(5000), studentSecond);
            }
            done();
        });
    });
    describe('Triangular distribution (a = 1, b = 3, c = 2)', () => {
        const Triangular = require('../lib/methods/triangular');
        it('should return same value each time', () => {
            const triangular = new Triangular(1, 3, 2);
            prng.seed('first triangular seed test');
            const triangularFirst = triangular.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(triangular.random()).to.be.closeTo(triangularFirst, 0.000001);
            }
            prng.seed('second triangular seed test');
            const triangularSecond = triangular.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(triangular.random()).to.be.closeTo(triangularSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const triangular = new Triangular(1, 3, 2);
            prng.seed('first triangular seed test');
            const triangularFirst = triangular.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(triangular.distribution(5000), triangularFirst);
            }
            prng.seed('second triangular seed test');
            const triangularSecond = triangular.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(triangular.distribution(5000), triangularSecond);
            }
            done();
        });
    });
    describe('Weibull distribution (lambda = 1, k = 1.5)', () => {
        const Weibull = require('../lib/methods/weibull');
        it('should return same value each time', () => {
            const weibull = new Weibull(1.5, 1);
            prng.seed('first weibull seed test');
            const weibullFirst = weibull.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(weibull.random()).to.be.closeTo(weibullFirst, 0.000001);
            }
            prng.seed('second weibull seed test');
            const weibullSecond = weibull.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(weibull.random()).to.be.closeTo(weibullSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const weibull = new Weibull(1.5, 1);
            prng.seed('first weibull seed test');
            const weibullFirst = weibull.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(weibull.distribution(5000), weibullFirst);
            }
            prng.seed('second weibull seed test');
            const weibullSecond = weibull.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(weibull.distribution(5000), weibullSecond);
            }
            done();
        });
    });
    describe('Bates distribution (n = 10, a = 0, b = 1)', () => {
        const Bates = require('../lib/methods/bates');
        it('should return same value each time', () => {
            const bates = new Bates(10, 0, 1);
            prng.seed('first bates seed test');
            const batesFirst = bates.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(bates.random()).to.be.closeTo(batesFirst, 0.000001);
            }
            prng.seed('second bates seed test');
            const batesSecond = bates.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(bates.random()).to.be.closeTo(batesSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const bates = new Bates(10, 0, 1);
            prng.seed('first bates seed test');
            const batesFirst = bates.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(bates.distribution(5000), batesFirst);
            }
            prng.seed('second bates seed test');
            const batesSecond = bates.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(bates.distribution(5000), batesSecond);
            }
            done();
        });
    });
    describe('Irwin-Hall distribution (n = 8)', () => {
        const Irwinhall = require('../lib/methods/irwinhall');
        it('should return same value each time', () => {
            const irwinhall = new Irwinhall(8);
            prng.seed('first irwinhall seed test');
            const irwinhallFirst = irwinhall.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(irwinhall.random()).to.be.closeTo(irwinhallFirst, 0.000001);
            }
            prng.seed('second irwinhall seed test');
            const irwinhallSecond = irwinhall.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(irwinhall.random()).to.be.closeTo(irwinhallSecond, 0.000001);
            }
        });
        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const irwinhall = new Irwinhall(8);
            prng.seed('first irwinhall seed test');
            const irwinhallFirst = irwinhall.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(irwinhall.distribution(5000), irwinhallFirst);
            }
            prng.seed('second irwinhall seed test');
            const irwinhallSecond = irwinhall.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(irwinhall.distribution(5000), irwinhallSecond);
            }
            done();
        });
    });
    describe('Zipf distribution (alpha = 0.5, shape = 20)', () => {
        const Zipf = require('../lib/methods/zipf');
        it('should return same value each time', () => {
            const zipf = new Zipf(0.5, 20);
            prng.seed('first zipf seed test');
            const zipfFirst = zipf.random();
            for (let i = 0; i < 1000; i += 1) {
                expect(zipf.random()).to.be.closeTo(zipfFirst, 0.000001);
            }
            prng.seed('second zipf seed test');
            const zipfSecond = zipf.random();
            for(let i = 0; i < 1000; i += 1) {
                expect(zipf.random()).to.be.closeTo(zipfSecond, 0.000001);
            }
        });

        it('should return same distribution each time', function(done) {
            this.timeout(480000);
            const zipf = new Zipf(0.5, 20);
            prng.seed('first zipf seed test');
            const zipfFirst = zipf.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(zipf.distribution(5000), zipfFirst);
            }
            prng.seed('second zipf seed test');
            const zipfSecond = zipf.distribution(5000);
            for(let i = 0; i < 10; i += 1) {
                compareDistributions(zipf.distribution(5000), zipfSecond);
            }
            done();
        });
    });
});

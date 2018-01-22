/** Tests
 * For Visualization uses "d3node-barchart" package
 * Created by Alexey on 24.08.2017.
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha');

chai.should();

// TODO: after implementation analyser add more test for each distribution for comparing real parameters with expected ones

// Random distributions
describe('Random distributions', () => {
    // Uniform distribution
    describe('Uniform distribution',() => {
        let Uniform = require('../lib/methods/uniform');
        it('requires two numerical arguments', () => {
            let zeroParams = () => {
                let uniform = new Uniform();
                if(uniform.isError().error)
                    throw new Error(uniform.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let uniform = new Uniform(1);
                if(uniform.isError().error)
                    throw new Error(uniform.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let uniform = new Uniform('a', 'b');
                if(uniform.isError().error)
                    throw new Error(uniform.isError().error);
            };
            badParams.should.throw(Error);

            let goodParams = () => {
                let uniform = new Uniform(0, 1);
                if(uniform.isError().error)
                    throw new Error(uniform.isError().error);
            };
            goodParams.should.not.throw(Error);
        });
        it('should have mean value for min = 1 and max = 3 equals to 2',() => {
            let uniform = new Uniform(1, 3);
            expect(uniform.mean).to.be.a('number');
            uniform.mean.should.equal(2);
        });
        it('should have mean value for initial min = 1 and max = 3 equals to 3 after .refresh(2, 4) method',() => {
            let uniform = new Uniform(1, 3);
            uniform.refresh(2, 4);
            uniform.mean.should.equal(3);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let uniform = new Uniform(1, 5);
            expect(uniform).to.have.property('random');
            expect(uniform).to.respondsTo('random');
            expect(uniform).to.have.property('distribution');
            expect(uniform).to.respondsTo('distribution');
            expect(uniform).to.have.property('refresh');
            expect(uniform).to.respondsTo('refresh');
            expect(uniform).to.have.property('isError');
            expect(uniform).to.respondsTo('isError');
        });
        it('should return different values each time and these values should be 1 <= <values> <= 5', () => {
            let uniform = new Uniform(1, 5),
                value1 = uniform.random();
            expect(uniform.random()).to.be.a('number');
            expect(uniform.random()).to.be.within(1, 5);
            uniform.random().should.not.equal(value1);
        });
        it('should generate an array with random values between 1 and 5 with length of 500', () => {
            let uniform = new Uniform(1, 5),
                randomArray = uniform.distribution(500),
                min = 6,
                max = 0,
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(rand < min) {
                    min = rand;
                }
                if(rand > max) {
                    max = rand;
                }
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
            expect(min).to.be.at.least(1);
            expect(max).to.be.at.most(5);
        });
    });

    // Normal Distribution
    describe('Normal distribution', () => {
        let Normal = require('../lib/methods/normal');
        it('requires two numerical arguments', () => {
            let zeroParams = () => {
                let normal = new Normal();
                if(normal.isError().error)
                    throw new Error(normal.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let normal = new Normal(1);
                if(normal.isError().error)
                    throw new Error(normal.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let normal = new Normal('a', 'b');
                if(normal.isError().error)
                    throw new Error(normal.isError().error);
            };
            badParams.should.throw(Error);

            let goodParams = () => {
                let normal = new Normal(1.5, 2);
                if(normal.isError().error)
                    throw new Error(normal.isError().error);
            };
            goodParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let normal = new Normal(1, 2);
            expect(normal).to.have.property('random');
            expect(normal).to.respondsTo('random');
            expect(normal).to.have.property('distribution');
            expect(normal).to.respondsTo('distribution');
            expect(normal).to.have.property('refresh');
            expect(normal).to.respondsTo('refresh');
            expect(normal).to.have.property('isError');
            expect(normal).to.respondsTo('isError');
        });
        it('should have mean value for mu = 1.5 and sigma = 2 equals to mu',() => {
            let normal = new Normal(1.5, 3);
            expect(normal.mean).to.be.a('number');
            normal.mean.should.equal(1.5);
        });
        it('should have mean value for initial mu = 1.5 and sigma = 2 equals to 2.5 after .refresh(2.5, 4) method',() => {
            let normal = new Normal(1.5, 2);
            normal.mean.should.equal(1.5);
            normal.sigma.should.equal(2);
            normal.refresh(2.5, 4);
            normal.mean.should.equal(2.5);
            normal.sigma.should.equal(4);
        });
        it('should return different values each time', () => {
            let normal = new Normal(1.5, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = normal.random();
                expect(normal.random()).to.be.a('number');
                normal.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values between 1 and 5 with length of 500', () => {
            let normal = new Normal(1.5, 2),
                randomArray = normal.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(300);
        });
    });

    // Bernoulli distribution
    describe('Bernoulli distribution', () => {
        let Bernoulli = require('../lib/methods/bernoulli');
        it('requires one numerical argument', () => {
            let zeroParams = () => {
                let bernoulli = new Bernoulli();
                if(bernoulli.isError().error)
                    throw new Error(bernoulli.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let bernoulli = new Bernoulli(0.5);
                if(bernoulli.isError().error)
                    throw new Error(bernoulli.isError().error);
            };
            oneParam.should.not.throw(Error);

            let badParams = () => {
                let bernoulli = new Bernoulli('a');
                if(bernoulli.isError().error)
                    throw new Error(bernoulli.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsBigger = () => {
                let bernoulli = new Bernoulli(2);
                if(bernoulli.isError().error)
                    throw new Error(bernoulli.isError().error);
            };
            incorrectParamsBigger.should.throw(Error);

            let incorrectParamsSmaller = () => {
                let bernoulli = new Bernoulli(-1);
                if(bernoulli.isError().error)
                    throw new Error(bernoulli.isError().error);
            };
            incorrectParamsSmaller.should.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let bernoulli = new Bernoulli(0.5);
            expect(bernoulli).to.have.property('random');
            expect(bernoulli).to.respondsTo('random');
            expect(bernoulli).to.have.property('distribution');
            expect(bernoulli).to.respondsTo('distribution');
            expect(bernoulli).to.have.property('refresh');
            expect(bernoulli).to.respondsTo('refresh');
            expect(bernoulli).to.have.property('isError');
            expect(bernoulli).to.respondsTo('isError');
        });
        it('should have mean value for p = 0.5 equals to p',() => {
            let bernoulli = new Bernoulli(0.5);
            expect(bernoulli.mean).to.be.a('number');
            bernoulli.mean.should.equal(0.5);
        });
        it('should have mean value for initial p = 0.5 equals to 0.7 after .refresh(0.7) method',() => {
            let bernoulli = new Bernoulli(0.5);
            bernoulli.mean.should.equal(0.5);
            bernoulli.refresh(0.7);
            bernoulli.mean.should.equal(0.7);
        });
        it('should return few different values with 20 experiments', () => {
            let bernoulli = new Bernoulli(0.6),
                value1,
                countRandoms = {};
            for(let i = 0; i < 20; i += 1){
                value1 = bernoulli.random();
                expect(bernoulli.random()).to.be.a('number');
                countRandoms[value1] = 1;
            }
            expect(Object.keys(countRandoms).length).to.be.at.least(2);
        });
        it('should generate an array with random values with length of 500', () => {
            let bernoulli = new Bernoulli(0.5),
                randomArray = bernoulli.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.9;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(3);
        });
        it('should generate only integer values', () => {
            let bernoulli = new Bernoulli(0.4),
                randomArray = bernoulli.distribution(100),
                correct = true;
            for(let rand of randomArray) {
                if(parseInt(rand) !== rand){
                    correct = false;
                    break;
                }
            }
            expect(correct).to.be.equal(true);
        });
    });

    // Beta distribution
    describe('Beta distribution', () => {
        let Beta = require('../lib/methods/beta');
        it('requires two numerical arguments with alpha > 0 and beta > 0', () => {
            let zeroParams = () => {
                let beta = new Beta();
                if(beta.isError().error)
                    throw new Error(beta.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let beta = new Beta(0.5);
                if(beta.isError().error)
                    throw new Error(beta.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let beta = new Beta('a', 'b');
                if(beta.isError().error)
                    throw new Error(beta.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let beta = new Beta(-1, 1);
                if(beta.isError().error)
                    throw new Error(beta.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsLess2 = () => {
                let beta = new Beta(1, -1);
                if(beta.isError().error)
                    throw new Error(beta.isError().error);
            };
            badParamsLess2.should.throw(Error);

            let twoParams =  () => {
                let beta = new Beta(0.5, 1);
                if(beta.isError().error)
                    throw new Error(beta.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let beta = new Beta(0.5, 1);
            expect(beta).to.have.property('random');
            expect(beta).to.respondsTo('random');
            expect(beta).to.have.property('distribution');
            expect(beta).to.respondsTo('distribution');
            expect(beta).to.have.property('refresh');
            expect(beta).to.respondsTo('refresh');
            expect(beta).to.have.property('isError');
            expect(beta).to.respondsTo('isError');
        });
        it('should have values for initial alpha = 1 and beta = 1 equals to alpha = 2 and beta = 3 after .refresh(2, 3) method',() => {
            let beta = new Beta(1, 1);
            beta.alpha.should.equal(1);
            beta.beta.should.equal(1);
            beta.refresh(2, 3);
            beta.alpha.should.equal(2);
            beta.beta.should.equal(3);
        });
        it('should have mean value for alpha = 1 and beta = 1 equals to 0.5, but for alpha = 1 and beta = 3 equals to 0.25',() => {
            let beta = new Beta(1, 1);
            expect(beta.mean).to.be.a('number');
            beta.mean.should.equal(0.5);
            beta.refresh(1, 3);
            expect(beta.mean).to.be.a('number');
            beta.mean.should.equal(0.25);
        });
        it('should return different values each time', () => {
            let beta = new Beta(1, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = beta.random();
                expect(beta.random()).to.be.a('number');
                beta.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let beta = new Beta(1, 2),
                randomArray = beta.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Beta Prime distribution
    describe('Beta Prime distribution', () => {
        let BetaPrime = require('../lib/methods/betaprime');
        it('requires two numerical arguments with alpha > 0 and beta > 0', () => {
            let zeroParams = () => {
                let betaPrime = new BetaPrime();
                if(betaPrime.isError().error)
                    throw new Error(betaPrime.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let betaPrime = new BetaPrime(0.5);
                if(betaPrime.isError().error)
                    throw new Error(betaPrime.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let betaPrime = new BetaPrime('a', 'b');
                if(betaPrime.isError().error)
                    throw new Error(betaPrime.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let betaPrime = new BetaPrime(-1, 1);
                if(betaPrime.isError().error)
                    throw new Error(betaPrime.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsLess2 = () => {
                let betaPrime = new BetaPrime(1, -1);
                if(betaPrime.isError().error)
                    throw new Error(betaPrime.isError().error);
            };
            badParamsLess2.should.throw(Error);

            let twoParams =  () => {
                let betaPrime = new BetaPrime(0.5, 1);
                if(betaPrime.isError().error)
                    throw new Error(betaPrime.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let betaPrime = new BetaPrime(0.5, 1);
            expect(betaPrime).to.have.property('random');
            expect(betaPrime).to.respondsTo('random');
            expect(betaPrime).to.have.property('distribution');
            expect(betaPrime).to.respondsTo('distribution');
            expect(betaPrime).to.have.property('refresh');
            expect(betaPrime).to.respondsTo('refresh');
            expect(betaPrime).to.have.property('isError');
            expect(betaPrime).to.respondsTo('isError');
        });
        it('should have values for initial alpha = 1 and beta = 1 equals to alpha = 2 and beta = 3 after .refresh(2, 3) method',() => {
            let betaPrime = new BetaPrime(1, 1);
            betaPrime.alpha.should.equal(1);
            betaPrime.beta.should.equal(1);
            betaPrime.refresh(2, 3);
            betaPrime.alpha.should.equal(2);
            betaPrime.beta.should.equal(3);
        });
        it('should have mean value for alpha = 1 and beta = 2 equals to 1, but for beta = 3 equals to 0.5, for beta = 0.5 equals to Infinity',() => {
            let betaPrime = new BetaPrime(1, 2);
            expect(betaPrime.mean).to.be.a('number');
            betaPrime.mean.should.equal(1);
            betaPrime.refresh(1, 3);
            expect(betaPrime.mean).to.be.a('number');
            betaPrime.mean.should.equal(0.5);
            betaPrime.refresh(1, 0.5);
            expect(betaPrime.mean).to.be.a('number');
            betaPrime.mean.should.equal(Infinity);
        });
        it('should return different values each time', () => {
            let betaPrime = new BetaPrime(1, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = betaPrime.random();
                expect(betaPrime.random()).to.be.a('number');
                betaPrime.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let betaPrime = new BetaPrime(1, 2),
                randomArray = betaPrime.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Binomial distribution
    describe('Binomial distribution', () => {
        let Binomial = require('../lib/methods/binomial');
        it('requires two numerical arguments with n > 0 and 0 <= p <= 1', () => {
            let zeroParams = () => {
                let binomial = new Binomial();
                if(binomial.isError().error)
                    throw new Error(binomial.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let binomial = new Binomial(0.5);
                if(binomial.isError().error)
                    throw new Error(binomial.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let binomial = new Binomial('a', 'b');
                if(binomial.isError().error)
                    throw new Error(binomial.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let binomial = new Binomial(-1, 0.5);
                if(binomial.isError().error)
                    throw new Error(binomial.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsLess2 = () => {
                let binomial = new Binomial(1, -1);
                if(binomial.isError().error)
                    throw new Error(binomial.isError().error);
            };
            badParamsLess2.should.throw(Error);

            let badParamsGreat = () => {
                let binomial = new Binomial(2, 2);
                if(binomial.isError().error)
                    throw new Error(binomial.isError().error);
            };
            badParamsGreat.should.throw(Error);

            let twoParams =  () => {
                let binomial = new Binomial(2, 0.5);
                if(binomial.isError().error)
                    throw new Error(binomial.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let binomial = new Binomial(2, 0.5);
            expect(binomial).to.have.property('random');
            expect(binomial).to.respondsTo('random');
            expect(binomial).to.have.property('distribution');
            expect(binomial).to.respondsTo('distribution');
            expect(binomial).to.have.property('refresh');
            expect(binomial).to.respondsTo('refresh');
            expect(binomial).to.have.property('isError');
            expect(binomial).to.respondsTo('isError');
        });
        it('should have values for initial alpha = 1 and beta = 1 equals to alpha = 2 and beta = 3 after .refresh(2, 3) method',() => {
            let binomial = new Binomial(1, 0.5);
            binomial.trials.should.equal(1);
            binomial.successProb.should.equal(0.5);
            binomial.refresh(2, 0.7);
            binomial.trials.should.equal(2);
            binomial.successProb.should.equal(0.7);
        });
        it('should have mean value for n = 1 and p = 0.5 equals to 0.5, but for n = 3 and p = 0.6 equals to 1.8',() => {
            let binomial = new Binomial(1, 0.5);
            expect(binomial.mean).to.be.a('number');
            binomial.mean.should.equal(0.5);
            binomial.refresh(3, 0.6);
            expect(binomial.mean).to.be.a('number');
            expect(binomial.mean).to.be.closeTo(1.8, 0.005);
        });
        it('should return few different values with 10 experiments', () => {
            let binomial = new Binomial(2, 0.6),
                value1,
                countRandoms = {};
            for(let i = 0; i < 10; i += 1){
                value1 = binomial.random();
                expect(binomial.random()).to.be.a('number');
                countRandoms[value1] = 1;
            }
            expect(Object.keys(countRandoms).length).to.be.at.least(2);
        });
        it('should generate an array with random values with length of 500', () => {
            let binomial = new Binomial(1, 0.5),
                randomArray = binomial.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.9;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(3);
        });
        it('should generate only integer values', () => {
            let binomial = new Binomial(2, 0.4),
                randomArray = binomial.distribution(100),
                correct = true;
            for(let rand of randomArray) {
                if(parseInt(rand) !== rand){
                    correct = false;
                    break;
                }
            }
            expect(correct).to.be.equal(true);
        });
    });

    // Cauchy distribution
    describe('Cauchy distribution', () => {
        let Cauchy = require('../lib/methods/cauchy');
        it('requires two numerical arguments with gamma > 0', () => {
            let zeroParams = () => {
                let cauchy = new Cauchy();
                if(cauchy.isError().error)
                    throw new Error(cauchy.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let cauchy = new Cauchy(0.5);
                if(cauchy.isError().error)
                    throw new Error(cauchy.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let cauchy = new Cauchy('a', 'b');
                if(cauchy.isError().error)
                    throw new Error(cauchy.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let cauchy = new Cauchy(1, -1);
                if(cauchy.isError().error)
                    throw new Error(cauchy.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsGammaToZero = () => {
                let cauchy = new Cauchy(1, 0);
                if(cauchy.isError().error)
                    throw new Error(cauchy.isError().error);
            };
            badParamsGammaToZero.should.throw(Error);

            let twoParams =  () => {
                let cauchy = new Cauchy(2, 0.5);
                if(cauchy.isError().error)
                    throw new Error(cauchy.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let cauchy = new Cauchy(2, 0.5);
            expect(cauchy).to.have.property('random');
            expect(cauchy).to.respondsTo('random');
            expect(cauchy).to.have.property('distribution');
            expect(cauchy).to.respondsTo('distribution');
            expect(cauchy).to.have.property('refresh');
            expect(cauchy).to.respondsTo('refresh');
            expect(cauchy).to.have.property('isError');
            expect(cauchy).to.respondsTo('isError');
        });
        it('should have values for initial x = 1 and gamma = 2 equals to x = 2 and gamma = 3 after .refresh(2, 3) method',() => {
            let cauchy = new Cauchy(1, 2);
            cauchy.location.should.equal(1);
            cauchy.scale.should.equal(2);
            cauchy.refresh(2, 3);
            cauchy.location.should.equal(2);
            cauchy.scale.should.equal(3);
        });
        it('should return different values each time', () => {
            let cauchy = new Cauchy(1, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = cauchy.random();
                expect(cauchy.random()).to.be.a('number');
                cauchy.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let cauchy = new Cauchy(1, 2),
                randomArray = cauchy.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(300);
        });
    });

    // Chi distribution
    describe('Chi distribution', () => {
        let Chi = require('../lib/methods/chi');
        it('requires one numerical argument with k > 0', () => {
            let zeroParams = () => {
                let chi = new Chi();
                if(chi.isError().error)
                    throw new Error(chi.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let chi = new Chi(0.5);
                if(chi.isError().error)
                    throw new Error(chi.isError().error);
            };
            oneParam.should.not.throw(Error);

            let badParams = () => {
                let chi = new Chi('a');
                if(chi.isError().error)
                    throw new Error(chi.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let chi = new Chi(-1);
                if(chi.isError().error)
                    throw new Error(chi.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsKToZero = () => {
                let chi = new Chi(0);
                if(chi.isError().error)
                    throw new Error(chi.isError().error);
            };
            badParamsKToZero.should.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let chi = new Chi(2);
            expect(chi).to.have.property('random');
            expect(chi).to.respondsTo('random');
            expect(chi).to.have.property('distribution');
            expect(chi).to.respondsTo('distribution');
            expect(chi).to.have.property('refresh');
            expect(chi).to.respondsTo('refresh');
            expect(chi).to.have.property('isError');
            expect(chi).to.respondsTo('isError');
        });
        it('should have value for initial k = 1 equals to k = 2 after .refresh(2) method',() => {
            let chi = new Chi(1);
            chi.degrees.should.equal(1);
            chi.refresh(2);
            chi.degrees.should.equal(2);
        });
        it('should return different values each time', () => {
            let chi = new Chi(2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = chi.random();
                expect(chi.random()).to.be.a('number');
                chi.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let chi = new Chi(2),
                randomArray = chi.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(300);
        });
    });

    // Chi Square distribution
    describe('Chi Square distribution', () => {
        let ChiSquare = require('../lib/methods/chisquare');
        it('requires one numerical argument with k > 0', () => {
            let zeroParams = () => {
                let chiSquare = new ChiSquare();
                if(chiSquare.isError().error)
                    throw new Error(chiSquare.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let chiSquare = new ChiSquare(0.5);
                if(chiSquare.isError().error)
                    throw new Error(chiSquare.isError().error);
            };
            oneParam.should.not.throw(Error);

            let badParams = () => {
                let chiSquare = new ChiSquare('a');
                if(chiSquare.isError().error)
                    throw new Error(chiSquare.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let chiSquare = new ChiSquare(-1);
                if(chiSquare.isError().error)
                    throw new Error(chiSquare.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsKToZero = () => {
                let chiSquare = new ChiSquare(0);
                if(chiSquare.isError().error)
                    throw new Error(chiSquare.isError().error);
            };
            badParamsKToZero.should.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let chiSquare = new ChiSquare(2);
            expect(chiSquare).to.have.property('random');
            expect(chiSquare).to.respondsTo('random');
            expect(chiSquare).to.have.property('distribution');
            expect(chiSquare).to.respondsTo('distribution');
            expect(chiSquare).to.have.property('refresh');
            expect(chiSquare).to.respondsTo('refresh');
            expect(chiSquare).to.have.property('isError');
            expect(chiSquare).to.respondsTo('isError');
        });
        it('should have value for initial k = 1 equals to k = 2 after .refresh(2) method',() => {
            let chiSquare = new ChiSquare(1);
            chiSquare.degrees.should.equal(1);
            chiSquare.refresh(2);
            chiSquare.degrees.should.equal(2);
        });
        it('should return different values each time', () => {
            let chiSquare = new ChiSquare(2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = chiSquare.random();
                expect(chiSquare.random()).to.be.a('number');
                chiSquare.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let chiSquare = new ChiSquare(2),
                randomArray = chiSquare.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(300);
        });
    });

    // Erlang distribution
    describe('Erlang distribution', () => {
        let Erlang = require('../lib/methods/erlang');
        it('requires two numerical arguments with mu > 0 and k > 0', () => {
            let zeroParams = () => {
                let erlang = new Erlang();
                if(erlang.isError().error)
                    throw new Error(erlang.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let erlang = new Erlang(0.5);
                if(erlang.isError().error)
                    throw new Error(erlang.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let erlang = new Erlang('a', 'b');
                if(erlang.isError().error)
                    throw new Error(erlang.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let erlang = new Erlang(1, -1);
                if(erlang.isError().error)
                    throw new Error(erlang.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsGammaToZero = () => {
                let erlang = new Erlang(1, 0);
                if(erlang.isError().error)
                    throw new Error(erlang.isError().error);
            };
            badParamsGammaToZero.should.throw(Error);

            let badParamsLess2 = () => {
                let erlang = new Erlang(-1, 1);
                if(erlang.isError().error)
                    throw new Error(erlang.isError().error);
            };
            badParamsLess2.should.throw(Error);

            let badParamsGammaToZero2 = () => {
                let erlang = new Erlang(0, 1);
                if(erlang.isError().error)
                    throw new Error(erlang.isError().error);
            };
            badParamsGammaToZero2.should.throw(Error);

            let twoParams =  () => {
                let erlang = new Erlang(2, 0.5);
                if(erlang.isError().error)
                    throw new Error(erlang.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let erlang = new Erlang(2, 2);
            expect(erlang).to.have.property('random');
            expect(erlang).to.respondsTo('random');
            expect(erlang).to.have.property('distribution');
            expect(erlang).to.respondsTo('distribution');
            expect(erlang).to.have.property('refresh');
            expect(erlang).to.respondsTo('refresh');
            expect(erlang).to.have.property('isError');
            expect(erlang).to.respondsTo('isError');
        });
        it('should have values for initial mu = 1 and k = 1 equals to mu = 2 and k = 3 after .refresh(3, 2) method',() => {
            let erlang = new Erlang(1, 1);
            erlang.shape.should.equal(1);
            erlang.scale.should.equal(1);
            erlang.refresh(3, 2);
            erlang.shape.should.equal(3);
            erlang.scale.should.equal(2);
        });
        it('should have mean value for mu = 1 and k = 0.5 equals to 0.5, but for mu = 3 and k = 0.6 equals to 1.8',() => {
            let erlang = new Erlang(0.5, 1);
            expect(erlang.mean).to.be.a('number');
            erlang.mean.should.equal(0.5);
            erlang.refresh(0.6, 3);
            expect(erlang.mean).to.be.a('number');
            expect(erlang.mean).to.be.closeTo(1.8, 0.005);
        });
        it('should return different values each time', () => {
            let erlang = new Erlang(3, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = erlang.random();
                expect(erlang.random()).to.be.a('number');
                erlang.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let erlang = new Erlang(3, 2),
                randomArray = erlang.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(300);
        });
    });

    // Gamma distribution
    describe('Gamma distribution', () => {
        let Gamma = require('../lib/methods/gamma');
        it('requires two numerical arguments with alpha > 0 and beta > 0', () => {
            let zeroParams = () => {
                let gamma = new Gamma();
                if(gamma.isError().error)
                    throw new Error(gamma.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let gamma = new Gamma(0.5);
                if(gamma.isError().error)
                    throw new Error(gamma.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let gamma = new Gamma('a', 'b');
                if(gamma.isError().error)
                    throw new Error(gamma.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let gamma = new Gamma(1, -1);
                if(gamma.isError().error)
                    throw new Error(gamma.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsGammaToZero = () => {
                let gamma = new Gamma(1, 0);
                if(gamma.isError().error)
                    throw new Error(gamma.isError().error);
            };
            badParamsGammaToZero.should.throw(Error);

            let badParamsLess2 = () => {
                let gamma = new Gamma(-1, 1);
                if(gamma.isError().error)
                    throw new Error(gamma.isError().error);
            };
            badParamsLess2.should.throw(Error);

            let badParamsGammaToZero2 = () => {
                let gamma = new Gamma(0, 1);
                if(gamma.isError().error)
                    throw new Error(gamma.isError().error);
            };
            badParamsGammaToZero2.should.throw(Error);

            let twoParams =  () => {
                let gamma = new Gamma(2, 0.5);
                if(gamma.isError().error)
                    throw new Error(gamma.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let gamma = new Gamma(2, 2);
            expect(gamma).to.have.property('random');
            expect(gamma).to.respondsTo('random');
            expect(gamma).to.have.property('distribution');
            expect(gamma).to.respondsTo('distribution');
            expect(gamma).to.have.property('refresh');
            expect(gamma).to.respondsTo('refresh');
            expect(gamma).to.have.property('isError');
            expect(gamma).to.respondsTo('isError');
        });
        it('should have values for initial alpha = 1 and beta = 1 equals to alpha = 2 and beta = 3 after .refresh(2, 3) method',() => {
            let gamma = new Gamma(1, 1);
            gamma.alpha.should.equal(1);
            gamma.beta.should.equal(1);
            gamma.refresh(2, 3);
            gamma.alpha.should.equal(2);
            gamma.beta.should.equal(3);
        });
        it('should have mean value for alpha = 1 and beta = 0.5 equals to 2, but for alpha = 3 and beta = 2 equals to 1.5',() => {
            let gamma = new Gamma(1, 0.5);
            expect(gamma.mean).to.be.a('number');
            expect(gamma.mean).to.be.closeTo(2, 0.005);
            gamma.refresh(3, 2);
            expect(gamma.mean).to.be.a('number');
            expect(gamma.mean).to.be.closeTo(1.5, 0.005);
        });
        it('should return different values each time', () => {
            let gamma = new Gamma(3, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = gamma.random();
                expect(gamma.random()).to.be.a('number');
                gamma.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let gamma = new Gamma(3, 2),
                randomArray = gamma.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(300);
        });
    });

    // Geometric distribution
    describe('Geometric distribution', () => {
        let Geometric = require('../lib/methods/geometric');
        it('requires one numerical argument with 0 <= p <= 1', () => {
            let zeroParams = () => {
                let geometric = new Geometric();
                if(geometric.isError().error)
                    throw new Error(geometric.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let geometric = new Geometric(0.5);
                if(geometric.isError().error)
                    throw new Error(geometric.isError().error);
            };
            oneParam.should.not.throw(Error);

            let badParams = () => {
                let geometric = new Geometric('a');
                if(geometric.isError().error)
                    throw new Error(geometric.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let geometric = new Geometric(-1);
                if(geometric.isError().error)
                    throw new Error(geometric.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsGreat = () => {
                let geometric = new Geometric(1.1);
                if(geometric.isError().error)
                    throw new Error(geometric.isError().error);
            };
            badParamsGreat.should.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let geometric = new Geometric(0.6);
            expect(geometric).to.have.property('random');
            expect(geometric).to.respondsTo('random');
            expect(geometric).to.have.property('distribution');
            expect(geometric).to.respondsTo('distribution');
            expect(geometric).to.have.property('refresh');
            expect(geometric).to.respondsTo('refresh');
            expect(geometric).to.have.property('isError');
            expect(geometric).to.respondsTo('isError');
        });
        it('should have value for initial p = 0.6 equals to p = 0.7 after .refresh(0.7) method',() => {
            let geometric = new Geometric(0.6);
            geometric.successProb.should.equal(0.6);
            geometric.refresh(0.7);
            geometric.successProb.should.equal(0.7);
        });
        it('should have mean value for p = 0.6 equals to 1.66666..., but for p = 0.4 equals to 2.5',() => {
            let geometric = new Geometric(0.6);
            expect(geometric.mean).to.be.a('number');
            expect(geometric.mean).to.be.closeTo(1.666, 0.002);
            geometric.refresh(0.4);
            expect(geometric.mean).to.be.a('number');
            expect(geometric.mean).to.be.closeTo(2.5, 0.002);
        });
        it('should return few different values with 10 experiments', () => {
            let geometric = new Geometric(0.6),
                value1,
                countRandoms = {};
            for(let i = 0; i < 10; i += 1){
                value1 = geometric.random();
                expect(geometric.random()).to.be.a('number');
                countRandoms[value1] = 1;
            }
            expect(Object.keys(countRandoms).length).to.be.at.least(2);
        });
        it('should generate an array with random values with length of 500', () => {
            let geometric = new Geometric(0.6),
                randomArray = geometric.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.9;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(3);
        });
        it('should generate only integer values', () => {
            let geometric = new Geometric(0.4),
                randomArray = geometric.distribution(100),
                correct = true;
            for(let rand of randomArray) {
                if(parseInt(rand) !== rand){
                    correct = false;
                    break;
                }
            }
            expect(correct).to.be.equal(true);
        });
    });

    // Negative Binomial distribution
    describe('Negative Binomial distribution', () => {
        let NegativeBinomial = require('../lib/methods/negativebinomial');
        it('requires two numerical arguments with n > 0 and 0 <= p <= 1', () => {
            let zeroParams = () => {
                let negativeBinomial = new NegativeBinomial();
                if(negativeBinomial.isError().error)
                    throw new Error(negativeBinomial.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let negativeBinomial = new NegativeBinomial(0.5);
                if(negativeBinomial.isError().error)
                    throw new Error(negativeBinomial.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let negativeBinomial = new NegativeBinomial('a', 'b');
                if(negativeBinomial.isError().error)
                    throw new Error(negativeBinomial.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let negativeBinomial = new NegativeBinomial(-1, 0.5);
                if(negativeBinomial.isError().error)
                    throw new Error(negativeBinomial.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsLess2 = () => {
                let negativeBinomial = new NegativeBinomial(1, -1);
                if(negativeBinomial.isError().error)
                    throw new Error(negativeBinomial.isError().error);
            };
            badParamsLess2.should.throw(Error);

            let badParamsGreat = () => {
                let negativeBinomial = new NegativeBinomial(2, 2);
                if(negativeBinomial.isError().error)
                    throw new Error(negativeBinomial.isError().error);
            };
            badParamsGreat.should.throw(Error);

            let twoParams =  () => {
                let negativeBinomial = new NegativeBinomial(2, 0.5);
                if(negativeBinomial.isError().error)
                    throw new Error(negativeBinomial.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let negativeBinomial = new NegativeBinomial(2, 0.6);
            expect(negativeBinomial).to.have.property('random');
            expect(negativeBinomial).to.respondsTo('random');
            expect(negativeBinomial).to.have.property('distribution');
            expect(negativeBinomial).to.respondsTo('distribution');
            expect(negativeBinomial).to.have.property('refresh');
            expect(negativeBinomial).to.respondsTo('refresh');
            expect(negativeBinomial).to.have.property('isError');
            expect(negativeBinomial).to.respondsTo('isError');
        });
        it('should have values for initial r = 1 and p = 0.6 equals to r = 2 and p = 0.7 after .refresh(2, 0.7) method',() => {
            let negativeBinomial = new NegativeBinomial(1, 0.6);
            negativeBinomial.numberFailures.should.equal(1);
            negativeBinomial.successProb.should.equal(0.6);
            negativeBinomial.refresh(2, 0.7);
            negativeBinomial.numberFailures.should.equal(2);
            negativeBinomial.successProb.should.equal(0.7);
        });
        it('should have mean value for r = 1 and p = 0.6 equals to 1.5, but for r = 2 and p = 0.4 equals to 1.33333...',() => {
            let negativeBinomial = new NegativeBinomial(1, 0.6);
            expect(negativeBinomial.mean).to.be.a('number');
            expect(negativeBinomial.mean).to.be.closeTo(1.5, 0.002);
            negativeBinomial.refresh(2, 0.4);
            expect(negativeBinomial.mean).to.be.a('number');
            expect(negativeBinomial.mean).to.be.closeTo(1.333, 0.002);
        });
        it('should return few different values with 10 experiments', () => {
            let negativeBinomial = new NegativeBinomial(2, 0.6),
                value1,
                countRandoms = {};
            for(let i = 0; i < 10; i += 1){
                value1 = negativeBinomial.random();
                expect(negativeBinomial.random()).to.be.a('number');
                countRandoms[value1] = 1;
            }
            expect(Object.keys(countRandoms).length).to.be.at.least(2);
        });
        it('should generate an array with random values with length of 500', () => {
            let negativeBinomial = new NegativeBinomial(1, 0.5),
                randomArray = negativeBinomial.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.9;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(3);
        });
        it('should generate only integer values', () => {
            let negativeBinomial = new NegativeBinomial(2, 0.4),
                randomArray = negativeBinomial.distribution(100),
                correct = true;
            for(let rand of randomArray) {
                if(parseInt(rand) !== rand){
                    correct = false;
                    break;
                }
            }
            expect(correct).to.be.equal(true);
        });
    });

    // Poisson distribution
    describe('Poisson distribution', () => {
        let Poisson = require('../lib/methods/poisson');
        it('requires one numerical argument with lambda > 0', () => {
            let zeroParams = () => {
                let poisson = new Poisson();
                if(poisson.isError().error)
                    throw new Error(poisson.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let poisson = new Poisson(0.5);
                if(poisson.isError().error)
                    throw new Error(poisson.isError().error);
            };
            oneParam.should.not.throw(Error);

            let badParams = () => {
                let poisson = new Poisson('a');
                if(poisson.isError().error)
                    throw new Error(poisson.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess1 = () => {
                let poisson = new Poisson(-1);
                if(poisson.isError().error)
                    throw new Error(poisson.isError().error);
            };
            badParamsLess1.should.throw(Error);

            let badParamsLambdaToZero = () => {
                let poisson = new Poisson(0);
                if(poisson.isError().error)
                    throw new Error(poisson.isError().error);
            };
            badParamsLambdaToZero.should.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let poisson = new Poisson(2);
            expect(poisson).to.have.property('random');
            expect(poisson).to.respondsTo('random');
            expect(poisson).to.have.property('distribution');
            expect(poisson).to.respondsTo('distribution');
            expect(poisson).to.have.property('refresh');
            expect(poisson).to.respondsTo('refresh');
            expect(poisson).to.have.property('isError');
            expect(poisson).to.respondsTo('isError');
        });
        it('should have value for initial lambda = 1 equals to lambda = 2 after .refresh(2) method',() => {
            let poisson = new Poisson(1);
            poisson.lambda.should.equal(1);
            poisson.refresh(2);
            poisson.lambda.should.equal(2);
        });
        it('should have mean value equals to lambda',() => {
            let poisson = new Poisson(1);
            expect(poisson.mean).to.be.a('number');
            expect(poisson.mean).to.be.closeTo(1, 0.002);
            poisson.refresh(2);
            expect(poisson.mean).to.be.a('number');
            expect(poisson.mean).to.be.closeTo(2, 0.002);
        });
        it('should return few different values with 10 experiments', () => {
            let poisson = new Poisson(2),
                value1,
                countRandoms = {};
            for(let i = 0; i < 10; i += 1){
                value1 = poisson.random();
                expect(poisson.random()).to.be.a('number');
                countRandoms[value1] = 1;
            }
            expect(Object.keys(countRandoms).length).to.be.at.least(2);
        });
        it('should generate an array with random values with length of 500', () => {
            let poisson = new Poisson(2),
                randomArray = poisson.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.9;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(3);
        });
        it('should generate only integer values', () => {
            let poisson = new Poisson(2),
                randomArray = poisson.distribution(100),
                correct = true;
            for(let rand of randomArray) {
                if(parseInt(rand) !== rand){
                    correct = false;
                    break;
                }
            }
            expect(correct).to.be.equal(true);
        });
    });

    // Exponential distribution
    describe('Exponential distribution', () => {
        let Exponential = require('../lib/methods/exponential');
        it('requires one numerical argument', () => {
            let zeroParams = () => {
                let exponential = new Exponential();
                if(exponential.isError().error)
                    throw new Error(exponential.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let exponential = new Exponential(0.5);
                if(exponential.isError().error)
                    throw new Error(exponential.isError().error);
            };
            oneParam.should.not.throw(Error);

            let badParams = () => {
                let exponential = new Exponential('a');
                if(exponential.isError().error)
                    throw new Error(exponential.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmaller = () => {
                let exponential = new Exponential(-1);
                if(exponential.isError().error)
                    throw new Error(exponential.isError().error);
            };
            incorrectParamsSmaller.should.throw(Error);

            let incorrectParamsLambdaToZero = () => {
                let exponential = new Exponential(0);
                if(exponential.isError().error)
                    throw new Error(exponential.isError().error);
            };
            incorrectParamsLambdaToZero.should.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let exponential = new Exponential(1);
            expect(exponential).to.have.property('random');
            expect(exponential).to.respondsTo('random');
            expect(exponential).to.have.property('distribution');
            expect(exponential).to.respondsTo('distribution');
            expect(exponential).to.have.property('refresh');
            expect(exponential).to.respondsTo('refresh');
            expect(exponential).to.have.property('isError');
            expect(exponential).to.respondsTo('isError');
        });
        it('should have "lambda" value for initial lambda = 0.5 equals to 1 after .refresh(1) method',() => {
            let exponential = new Exponential(0.5);
            exponential.lambda.should.equal(0.5);
            exponential.refresh(1);
            exponential.lambda.should.equal(1);
        });
        it('should have mean value equals to 1 / lambda',() => {
            let exponential = new Exponential(0.4);
            expect(exponential.mean).to.be.a('number');
            expect(exponential.mean).to.be.closeTo(2.5, 0.001);
            exponential.refresh(3);
            expect(exponential.mean).to.be.a('number');
            expect(exponential.mean).to.be.closeTo(0.333, 0.001);
        });
        it('should return different values each time', () => {
            let exponential = new Exponential(3),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = exponential.random();
                expect(exponential.random()).to.be.a('number');
                exponential.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let exponential = new Exponential(3),
                randomArray = exponential.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Extreme Value (Gumbel-type) distribution
    describe('Extreme Value (Gumbel-type) distribution', () => {
        let ExtremeValue = require('../lib/methods/extremevalue');
        it('requires two numerical arguments with sigma > 0', () => {
            let zeroParams = () => {
                let extremevalue = new ExtremeValue();
                if(extremevalue.isError().error)
                    throw new Error(extremevalue.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let extremevalue = new ExtremeValue(0.5);
                if(extremevalue.isError().error)
                    throw new Error(extremevalue.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let extremevalue = new ExtremeValue('a', 'b');
                if(extremevalue.isError().error)
                    throw new Error(extremevalue.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmaller = () => {
                let extremevalue = new ExtremeValue(1, -1);
                if(extremevalue.isError().error)
                    throw new Error(extremevalue.isError().error);
            };
            incorrectParamsSmaller.should.throw(Error);

            let incorrectParamsLambdaToZero = () => {
                let extremevalue = new ExtremeValue(1, 0);
                if(extremevalue.isError().error)
                    throw new Error(extremevalue.isError().error);
            };
            incorrectParamsLambdaToZero.should.throw(Error);

            let twoParams = () => {
                let extremevalue = new ExtremeValue(1, 1);
                if(extremevalue.isError().error)
                    throw new Error(extremevalue.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let extremevalue = new ExtremeValue(1, 1);
            expect(extremevalue).to.have.property('random');
            expect(extremevalue).to.respondsTo('random');
            expect(extremevalue).to.have.property('distribution');
            expect(extremevalue).to.respondsTo('distribution');
            expect(extremevalue).to.have.property('refresh');
            expect(extremevalue).to.respondsTo('refresh');
            expect(extremevalue).to.have.property('isError');
            expect(extremevalue).to.respondsTo('isError');
        });
        it('should have "mu" and "sigma" values for initial mu = 0.5 and sigma = 0.5 equals to 1 and 1 after .refresh(1, 1) method',() => {
            let extremevalue = new ExtremeValue(0.5, 0.5);
            extremevalue.mu.should.equal(0.5);
            extremevalue.sigma.should.equal(0.5);
            extremevalue.refresh(1, 1);
            extremevalue.mu.should.equal(1);
            extremevalue.sigma.should.equal(1);
        });
        it('should return different values each time', () => {
            let extremevalue = new ExtremeValue(3, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = extremevalue.random();
                expect(extremevalue.random()).to.be.a('number');
                extremevalue.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let extremevalue = new ExtremeValue(3, 2),
                randomArray = extremevalue.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Laplace distribution
    describe('Laplace distribution', () => {
        let Laplace = require('../lib/methods/laplace');
        it('requires two numerical arguments with scale > 0', () => {
            let zeroParams = () => {
                let laplace = new Laplace();
                if(laplace.isError().error)
                    throw new Error(laplace.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let laplace = new Laplace(0.5);
                if(laplace.isError().error)
                    throw new Error(laplace.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let laplace = new Laplace('a', 'b');
                if(laplace.isError().error)
                    throw new Error(laplace.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmaller = () => {
                let laplace = new Laplace(1, -1);
                if(laplace.isError().error)
                    throw new Error(laplace.isError().error);
            };
            incorrectParamsSmaller.should.throw(Error);

            let incorrectParamsLambdaToZero = () => {
                let laplace = new Laplace(1, 0);
                if(laplace.isError().error)
                    throw new Error(laplace.isError().error);
            };
            incorrectParamsLambdaToZero.should.throw(Error);

            let twoParams = () => {
                let laplace = new Laplace(1, 1);
                if(laplace.isError().error)
                    throw new Error(laplace.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let laplace = new Laplace(1, 1);
            expect(laplace).to.have.property('random');
            expect(laplace).to.respondsTo('random');
            expect(laplace).to.have.property('distribution');
            expect(laplace).to.respondsTo('distribution');
            expect(laplace).to.have.property('refresh');
            expect(laplace).to.respondsTo('refresh');
            expect(laplace).to.have.property('isError');
            expect(laplace).to.respondsTo('isError');
        });
        it('should have "mu" and "scale" values for initial mu = 0.5 and scale = 0.5 equals to 1 and 1 after .refresh(1, 1) method',() => {
            let laplace = new Laplace(0.5, 0.5);
            laplace.location.should.equal(0.5);
            laplace.scale.should.equal(0.5);
            laplace.refresh(1, 1);
            laplace.location.should.equal(1);
            laplace.scale.should.equal(1);
        });
        it('should have mean, mode, median values equals to mu',() => {
            let laplace = new Laplace(0.4, 1);
            expect(laplace.mean).to.be.a('number');
            expect(laplace.mean).to.be.closeTo(0.4, 0.001);
            expect(laplace.mode).to.be.a('number');
            expect(laplace.mode).to.be.closeTo(0.4, 0.001);
            expect(laplace.median).to.be.a('number');
            expect(laplace.median).to.be.closeTo(0.4, 0.001);
            laplace.refresh(1, 2);
            expect(laplace.mean).to.be.a('number');
            expect(laplace.mean).to.be.closeTo(1.0, 0.001);
            expect(laplace.mode).to.be.a('number');
            expect(laplace.mode).to.be.closeTo(1.0, 0.001);
            expect(laplace.median).to.be.a('number');
            expect(laplace.median).to.be.closeTo(1.0, 0.001);
        });
        it('should return different values each time', () => {
            let laplace = new Laplace(3, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = laplace.random();
                expect(laplace.random()).to.be.a('number');
                laplace.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let laplace = new Laplace(3, 2),
                randomArray = laplace.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Logistic distribution
    describe('Logistic distribution', () => {
        let Logistic = require('../lib/methods/logistic');
        it('requires two numerical arguments with scale > 0', () => {
            let zeroParams = () => {
                let logistic = new Logistic();
                if(logistic.isError().error)
                    throw new Error(logistic.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let logistic = new Logistic(0.5);
                if(logistic.isError().error)
                    throw new Error(logistic.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let logistic = new Logistic('a', 'b');
                if(logistic.isError().error)
                    throw new Error(logistic.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmaller = () => {
                let logistic = new Logistic(1, -1);
                if(logistic.isError().error)
                    throw new Error(logistic.isError().error);
            };
            incorrectParamsSmaller.should.throw(Error);

            let incorrectParamsLambdaToZero = () => {
                let logistic = new Logistic(1, 0);
                if(logistic.isError().error)
                    throw new Error(logistic.isError().error);
            };
            incorrectParamsLambdaToZero.should.throw(Error);

            let twoParams = () => {
                let logistic = new Logistic(1, 1);
                if(logistic.isError().error)
                    throw new Error(logistic.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let logistic = new Logistic(1, 1);
            expect(logistic).to.have.property('random');
            expect(logistic).to.respondsTo('random');
            expect(logistic).to.have.property('distribution');
            expect(logistic).to.respondsTo('distribution');
            expect(logistic).to.have.property('refresh');
            expect(logistic).to.respondsTo('refresh');
            expect(logistic).to.have.property('isError');
            expect(logistic).to.respondsTo('isError');
        });
        it('should have "mu" and "scale" values for initial mu = 0.5 and scale = 0.5 equals to 1 and 1 after .refresh(1, 1) method',() => {
            let logistic = new Logistic(0.5, 0.5);
            logistic.location.should.equal(0.5);
            logistic.scale.should.equal(0.5);
            logistic.refresh(1, 1);
            logistic.location.should.equal(1);
            logistic.scale.should.equal(1);
        });
        it('should have mean, mode, median values equals to mu',() => {
            let logistic = new Logistic(0.4, 1);
            expect(logistic.mean).to.be.a('number');
            expect(logistic.mean).to.be.closeTo(0.4, 0.001);
            expect(logistic.mode).to.be.a('number');
            expect(logistic.mode).to.be.closeTo(0.4, 0.001);
            expect(logistic.median).to.be.a('number');
            expect(logistic.median).to.be.closeTo(0.4, 0.001);
            logistic.refresh(1, 2);
            expect(logistic.mean).to.be.a('number');
            expect(logistic.mean).to.be.closeTo(1.0, 0.001);
            expect(logistic.mode).to.be.a('number');
            expect(logistic.mode).to.be.closeTo(1.0, 0.001);
            expect(logistic.median).to.be.a('number');
            expect(logistic.median).to.be.closeTo(1.0, 0.001);
        });
        it('should return different values each time', () => {
            let logistic = new Logistic(3, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = logistic.random();
                expect(logistic.random()).to.be.a('number');
                logistic.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let logistic = new Logistic(3, 2),
                randomArray = logistic.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Lognormal distribution
    describe('Lognormal distribution', () => {
        let Lognormal = require('../lib/methods/lognormal');
        it('requires two numerical arguments with sigma > 0', () => {
            let zeroParams = () => {
                let lognormal = new Lognormal();
                if(lognormal.isError().error)
                    throw new Error(lognormal.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let lognormal = new Lognormal(0.5);
                if(lognormal.isError().error)
                    throw new Error(lognormal.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let lognormal = new Lognormal('a', 'b');
                if(lognormal.isError().error)
                    throw new Error(lognormal.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmaller = () => {
                let lognormal = new Lognormal(1, -1);
                if(lognormal.isError().error)
                    throw new Error(lognormal.isError().error);
            };
            incorrectParamsSmaller.should.throw(Error);

            let incorrectParamsLambdaToZero = () => {
                let lognormal = new Lognormal(1, 0);
                if(lognormal.isError().error)
                    throw new Error(lognormal.isError().error);
            };
            incorrectParamsLambdaToZero.should.throw(Error);

            let twoParams = () => {
                let lognormal = new Lognormal(1, 1);
                if(lognormal.isError().error)
                    throw new Error(lognormal.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let lognormal = new Lognormal(1, 1);
            expect(lognormal).to.have.property('random');
            expect(lognormal).to.respondsTo('random');
            expect(lognormal).to.have.property('distribution');
            expect(lognormal).to.respondsTo('distribution');
            expect(lognormal).to.have.property('refresh');
            expect(lognormal).to.respondsTo('refresh');
            expect(lognormal).to.have.property('isError');
            expect(lognormal).to.respondsTo('isError');
        });
        it('should have "mu" and "sigma" values for initial mu = 0.5 and sigma = 0.5 equals to 1 and 1 after .refresh(1, 1) method',() => {
            let lognormal = new Lognormal(0.5, 0.5);
            lognormal.mu.should.equal(0.5);
            lognormal.sigma.should.equal(0.5);
            lognormal.refresh(1, 1);
            lognormal.mu.should.equal(1);
            lognormal.sigma.should.equal(1);
        });
        it('should return different values each time', () => {
            let lognormal = new Lognormal(3, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = lognormal.random();
                expect(lognormal.random()).to.be.a('number');
                lognormal.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let lognormal = new Lognormal(3, 2),
                randomArray = lognormal.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Pareto distribution
    describe('Pareto distribution', () => {
        let Pareto = require('../lib/methods/pareto');
        it('requires two numerical arguments with scale > 0 and shape > 0', () => {
            let zeroParams = () => {
                let pareto = new Pareto();
                if(pareto.isError().error)
                    throw new Error(pareto.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let pareto = new Pareto(0.5);
                if(pareto.isError().error)
                    throw new Error(pareto.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let pareto = new Pareto('a', 'b');
                if(pareto.isError().error)
                    throw new Error(pareto.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmaller = () => {
                let pareto = new Pareto(1, -1);
                if(pareto.isError().error)
                    throw new Error(pareto.isError().error);
            };
            incorrectParamsSmaller.should.throw(Error);

            let incorrectParamsLambdaToZero = () => {
                let pareto = new Pareto(1, 0);
                if(pareto.isError().error)
                    throw new Error(pareto.isError().error);
            };
            incorrectParamsLambdaToZero.should.throw(Error);

            let incorrectParamsSmaller2 = () => {
                let pareto = new Pareto(-1, 1);
                if(pareto.isError().error)
                    throw new Error(pareto.isError().error);
            };
            incorrectParamsSmaller2.should.throw(Error);

            let incorrectParamsLambdaToZero2 = () => {
                let pareto = new Pareto(0, 1);
                if(pareto.isError().error)
                    throw new Error(pareto.isError().error);
            };
            incorrectParamsLambdaToZero2.should.throw(Error);

            let twoParams = () => {
                let pareto = new Pareto(1, 1);
                if(pareto.isError().error)
                    throw new Error(pareto.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let pareto = new Pareto(1, 1);
            expect(pareto).to.have.property('random');
            expect(pareto).to.respondsTo('random');
            expect(pareto).to.have.property('distribution');
            expect(pareto).to.respondsTo('distribution');
            expect(pareto).to.have.property('refresh');
            expect(pareto).to.respondsTo('refresh');
            expect(pareto).to.have.property('isError');
            expect(pareto).to.respondsTo('isError');
        });
        it('should have "xm" and "alpha" values for initial xm = 0.5 and alpha = 0.5 equals to 1 and 1 after .refresh(1, 1) method',() => {
            let pareto = new Pareto(0.5, 0.5);
            pareto.xm.should.equal(0.5);
            pareto.alpha.should.equal(0.5);
            pareto.refresh(1, 1);
            pareto.xm.should.equal(1);
            pareto.alpha.should.equal(1);
        });
        it('should return different values each time', () => {
            let pareto = new Pareto(3, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = pareto.random();
                expect(pareto.random()).to.be.a('number');
                pareto.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let pareto = new Pareto(3, 2),
                randomArray = pareto.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Rayleigh distribution
    describe('Rayleigh distribution', () => {
        let Rayleigh = require('../lib/methods/rayleigh');
        it('requires one numerical argument with scale > 0', () => {
            let zeroParams = () => {
                let rayleigh = new Rayleigh();
                if(rayleigh.isError().error)
                    throw new Error(rayleigh.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let rayleigh = new Rayleigh(0.5);
                if(rayleigh.isError().error)
                    throw new Error(rayleigh.isError().error);
            };
            oneParam.should.not.throw(Error);

            let badParams = () => {
                let rayleigh = new Rayleigh('a');
                if(rayleigh.isError().error)
                    throw new Error(rayleigh.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmaller = () => {
                let rayleigh = new Rayleigh(-1);
                if(rayleigh.isError().error)
                    throw new Error(rayleigh.isError().error);
            };
            incorrectParamsSmaller.should.throw(Error);

            let incorrectParamsSigmaToZero = () => {
                let rayleigh = new Rayleigh(0);
                if(rayleigh.isError().error)
                    throw new Error(rayleigh.isError().error);
            };
            incorrectParamsSigmaToZero.should.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let rayleigh = new Rayleigh(1);
            expect(rayleigh).to.have.property('random');
            expect(rayleigh).to.respondsTo('random');
            expect(rayleigh).to.have.property('distribution');
            expect(rayleigh).to.respondsTo('distribution');
            expect(rayleigh).to.have.property('refresh');
            expect(rayleigh).to.respondsTo('refresh');
            expect(rayleigh).to.have.property('isError');
            expect(rayleigh).to.respondsTo('isError');
        });
        it('should have "sigma" value for initial sigma = 0.5 equals to 1 after .refresh(1) method',() => {
            let rayleigh = new Rayleigh(0.5);
            rayleigh.sigma.should.equal(0.5);
            rayleigh.refresh(1);
            rayleigh.sigma.should.equal(1);
        });
        it('should return different values each time', () => {
            let rayleigh = new Rayleigh(1),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = rayleigh.random();
                expect(rayleigh.random()).to.be.a('number');
                rayleigh.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let rayleigh = new Rayleigh(2),
                randomArray = rayleigh.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Student's t-distribution
    describe('Student\'s t-distribution', () => {
        let Student = require('../lib/methods/student');
        it('requires one numerical argument with degrees of freedom > 0', () => {
            let zeroParams = () => {
                let student = new Student();
                if(student.isError().error)
                    throw new Error(student.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let student = new Student(0.5);
                if(student.isError().error)
                    throw new Error(student.isError().error);
            };
            oneParam.should.not.throw(Error);

            let badParams = () => {
                let student = new Student('a');
                if(student.isError().error)
                    throw new Error(student.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmaller = () => {
                let student = new Student(-1);
                if(student.isError().error)
                    throw new Error(student.isError().error);
            };
            incorrectParamsSmaller.should.throw(Error);

            let incorrectParamsVToZero = () => {
                let student = new Student(0);
                if(student.isError().error)
                    throw new Error(student.isError().error);
            };
            incorrectParamsVToZero.should.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let student = new Student(1);
            expect(student).to.have.property('random');
            expect(student).to.respondsTo('random');
            expect(student).to.have.property('distribution');
            expect(student).to.respondsTo('distribution');
            expect(student).to.have.property('refresh');
            expect(student).to.respondsTo('refresh');
            expect(student).to.have.property('isError');
            expect(student).to.respondsTo('isError');
        });
        it('should have "v" (degrees of freedom) value for initial v = 0.5 equals to 1 after .refresh(1) method',() => {
            let student = new Student(0.5);
            student.degrees.should.equal(0.5);
            student.refresh(1);
            student.degrees.should.equal(1);
        });
        it('should return different values each time', () => {
            let student = new Student(1),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = student.random();
                expect(student.random()).to.be.a('number');
                student.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let student = new Student(2),
                randomArray = student.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Triangular distribution
    describe('Triangular distribution', () => {
        let Triangular = require('../lib/methods/triangular');
        it('requires three numerical arguments with a any, b > a and a <= c <= b', () => {
            let zeroParams = () => {
                let triangular = new Triangular();
                if(triangular.isError().error)
                    throw new Error(triangular.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let triangular = new Triangular(0.5);
                if(triangular.isError().error)
                    throw new Error(triangular.isError().error);
            };
            oneParam.should.throw(Error);

            let twoParams =  () => {
                let triangular = new Triangular(0.5, 2);
                if(triangular.isError().error)
                    throw new Error(triangular.isError().error);
            };
            twoParams.should.throw(Error);

            let badParams = () => {
                let triangular = new Triangular('a', 'b', 'c');
                if(triangular.isError().error)
                    throw new Error(triangular.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmallerB = () => {
                let triangular = new Triangular(1, 0.5, 1);
                if(triangular.isError().error)
                    throw new Error(triangular.isError().error);
            };
            incorrectParamsSmallerB.should.throw(Error);

            let incorrectParamsSmallerCA = () => {
                let triangular = new Triangular(1, 2, 0.5);
                if(triangular.isError().error)
                    throw new Error(triangular.isError().error);
            };
            incorrectParamsSmallerCA.should.throw(Error);

            let incorrectParamsGreaterCB = () => {
                let triangular = new Triangular(1, 2, 2.5);
                if(triangular.isError().error)
                    throw new Error(triangular.isError().error);
            };
            incorrectParamsGreaterCB.should.throw(Error);

            let threeParams = () => {
                let triangular = new Triangular(1, 2, 1.5);
                if(triangular.isError().error)
                    throw new Error(triangular.isError().error);
            };
            threeParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let triangular = new Triangular(1, 3, 2);
            expect(triangular).to.have.property('random');
            expect(triangular).to.respondsTo('random');
            expect(triangular).to.have.property('distribution');
            expect(triangular).to.respondsTo('distribution');
            expect(triangular).to.have.property('refresh');
            expect(triangular).to.respondsTo('refresh');
            expect(triangular).to.have.property('isError');
            expect(triangular).to.respondsTo('isError');
        });
        it('should have "v" (degrees of freedom) value for initial v = 0.5 equals to 1 after .refresh(1) method',() => {
            let triangular = new Triangular(1, 3, 2);
            triangular.a.should.equal(1);
            triangular.b.should.equal(3);
            triangular.c.should.equal(2);
            triangular.refresh(2, 4, 3);
            triangular.a.should.equal(2);
            triangular.b.should.equal(4);
            triangular.c.should.equal(3);
        });
        it('should return different values each time', () => {
            let triangular = new Triangular(1, 3, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = triangular.random();
                expect(triangular.random()).to.be.a('number');
                triangular.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let triangular = new Triangular(1, 3, 2),
                randomArray = triangular.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });

    // Weibull distribution
    describe('Weibull distribution', () => {
        let Weibull = require('../lib/methods/weibull');
        it('requires two numerical arguments with k > 0 and lambda > 0', () => {
            let zeroParams = () => {
                let weibull = new Weibull();
                if(weibull.isError().error)
                    throw new Error(weibull.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let weibull = new Weibull(0.5);
                if(weibull.isError().error)
                    throw new Error(weibull.isError().error);
            };
            oneParam.should.throw(Error);

            let twoParams =  () => {
                let weibull = new Weibull(0.5, 2);
                if(weibull.isError().error)
                    throw new Error(weibull.isError().error);
            };
            twoParams.should.not.throw(Error);

            let badParams = () => {
                let weibull = new Weibull('a', 'b');
                if(weibull.isError().error)
                    throw new Error(weibull.isError().error);
            };
            badParams.should.throw(Error);

            let incorrectParamsSmaller1 = () => {
                let weibull = new Weibull(1, -1);
                if(weibull.isError().error)
                    throw new Error(weibull.isError().error);
            };
            incorrectParamsSmaller1.should.throw(Error);

            let incorrectParamsSmaller2 = () => {
                let weibull = new Weibull(-1, 1);
                if(weibull.isError().error)
                    throw new Error(weibull.isError().error);
            };
            incorrectParamsSmaller2.should.throw(Error);

            let incorrectParamsZero1 = () => {
                let weibull = new Weibull(1, 0);
                if(weibull.isError().error)
                    throw new Error(weibull.isError().error);
            };
            incorrectParamsZero1.should.throw(Error);

            let incorrectParamsZero2 = () => {
                let weibull = new Weibull(0, 1);
                if(weibull.isError().error)
                    throw new Error(weibull.isError().error);
            };
            incorrectParamsZero2.should.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let weibull = new Weibull(1, 2);
            expect(weibull).to.have.property('random');
            expect(weibull).to.respondsTo('random');
            expect(weibull).to.have.property('distribution');
            expect(weibull).to.respondsTo('distribution');
            expect(weibull).to.have.property('refresh');
            expect(weibull).to.respondsTo('refresh');
            expect(weibull).to.have.property('isError');
            expect(weibull).to.respondsTo('isError');
        });
        it('should have "k" and "lambda" values for initial k = 0.5 and lambda = 1 equals to 1 and 2 after .refresh(1, 2) method',() => {
            let weibull = new Weibull(0.5, 1);
            weibull.k.should.equal(0.5);
            weibull.lambda.should.equal(1);
            weibull.refresh(1, 2);
            weibull.k.should.equal(1);
            weibull.lambda.should.equal(2);
        });
        it('should return different values each time', () => {
            let weibull = new Weibull(1, 2),
                value1;
            for(let i = 0; i < 10; i += 1){
                value1 = weibull.random();
                expect(weibull.random()).to.be.a('number');
                weibull.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let weibull = new Weibull(1, 2),
                randomArray = weibull.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.2;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) > delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(500);
            expect(countDiffs).to.be.at.least(200);
        });
    });
});

// Analyzer
describe('Analyzer', () => {
    describe('Imported Common class', () => {
        let Common = require('../lib/analyzer/common');
        it('should be a Singleton', () => {
            let methods1 = Common.getInstance([1, 2, 3]),
                methods2 = Common.getInstance([4, 5, 6]),
                methods3 = new Common([1, 2, 3]),
                methods4 = new Common([4, 5, 6]);
            expect(methods1).to.equal(methods2);
            expect(methods3).to.not.equal(methods4);
        });
        it('should has "publicMethods" property for instances', () => {
            let common = Common.getInstance([1, 2, 3]),
                common2 = new Common([4, 5, 6]);
            expect(common).to.have.property('publicMethods');
            expect(common2).to.have.property('publicMethods');
        });
        it('should receive for input data only array', () => {
            let receiveNotArray = () => {
                Common.getInstance(3);
            };
            receiveNotArray.should.throw(Error);

            let receiveArray = () => {
                Common.getInstance([1, 2, 3]);
            };
            receiveArray.should.not.throw(Error);
        });
    });
});

// Utils
describe('Utils', () => {
    let Utils = require('../lib/utils/utils'),
        methods = Object.getOwnPropertyNames(Utils);

    it('should has static method "gamma"', () => {
        expect(methods).to.include.members(['gamma']);
    });
    it('should has static method "digamma"', () => {
        expect(methods).to.include.members(['digamma']);
    });

    // Gamma function
    describe('Gamma function', () => {
        it('should return 1 for Gamma(1)', () => {
            expect(Utils.gamma(1)).to.be.a('number');
            expect(Utils.gamma(1)).to.be.closeTo(1, 0.00001);
        });
        it('should be "n-1" times bigger then previous Gamma(n-1)', () => {
            for(let i = 1; i < 10; i += 1) {
                expect(Utils.gamma(i)).to.be.a('number');
                expect(Utils.gamma(i+1)).to.be.closeTo(i * Utils.gamma(i), 0.00001);
            }
        });
        it('should return sqrt(PI)+-0.00001 for non-integer 0.5 value', () => {
            expect(Utils.gamma(0.5)).to.be.a('number');
            expect(Utils.gamma(0.5)).to.be.closeTo(Math.sqrt(Math.PI), 0.00001);
        });
        it('should return 0.886227+-0.00001 for Gamma(1.5)', () => {
            expect(Utils.gamma(1.5)).to.be.a('number');
            expect(Utils.gamma(1.5)).to.be.closeTo(0.886227, 0.00001);
        });
        it('should return 3.323351+-0.00001 for Gamma(3.5)', () => {
            expect(Utils.gamma(3.5)).to.be.a('number');
            expect(Utils.gamma(3.5)).to.be.closeTo(3.323351, 0.00001);
        });
        it('should return 0.902745+-0.00001 for Gamma(5/3)', () => {
            expect(Utils.gamma(5 / 3)).to.be.a('number');
            expect(Utils.gamma(5 / 3)).to.be.closeTo(0.902745, 0.00001);
        });
        it('should return 2.678939+-0.00001 for Gamma(1/3)', () => {
            expect(Utils.gamma(1 / 3)).to.be.a('number');
            expect(Utils.gamma(1 / 3)).to.be.closeTo(2.678939, 0.00001);
        });
        it('should return 2593.566177+-0.00001 for Gamma(23/3)', () => {
            expect(Utils.gamma(23 / 3)).to.be.a('number');
            expect(Utils.gamma(23 / 3)).to.be.closeTo(2593.566177, 0.00001);
        });
        it('should satisfy Euler reflection formula for z = 0.4 and z = 0.6', () => {
            expect(Utils.gamma(0.4)).to.be.a('number');
            expect(Utils.gamma(0.6)).to.be.a('number');
            expect(Utils.gamma(0.4) * Utils.gamma(0.6)).to.be.closeTo(Math.PI / Math.sin(Math.PI * 0.4), 0.00001);
            expect(Utils.gamma(0.4) * Utils.gamma(0.6)).to.be.closeTo(Math.PI / Math.sin(Math.PI * 0.6), 0.00001);
        });
        it('should satisfy duplication formula', () => {
            let z = 0.4;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Utils.gamma(z) * Utils.gamma(z + 0.5)).to.be.closeTo(Math.pow(2, 1 - 2 * z) * Math.sqrt(Math.PI) * Utils.gamma(2 * z), 0.00001);
            z = 0.9;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Utils.gamma(z) * Utils.gamma(z + 0.5)).to.be.closeTo(Math.pow(2, 1 - 2 * z) * Math.sqrt(Math.PI) * Utils.gamma(2 * z), 0.00001);
            z = 1.1;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Utils.gamma(z) * Utils.gamma(z + 0.5)).to.be.closeTo(Math.pow(2, 1 - 2 * z) * Math.sqrt(Math.PI) * Utils.gamma(2 * z), 0.00001);
            z = 2;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Utils.gamma(z) * Utils.gamma(z + 0.5)).to.be.closeTo(Math.pow(2, 1 - 2 * z) * Math.sqrt(Math.PI) * Utils.gamma(2 * z), 0.00001);
        });
        it('should satisfy log equation', () => {
            let z = 0.4;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Math.log(Utils.gamma(z))).to.be.closeTo(Math.log(Utils.gamma(z + 1)) - Math.log(z), 0.0001);
            z = 0.8;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Math.log(Utils.gamma(z))).to.be.closeTo(Math.log(Utils.gamma(z + 1)) - Math.log(z), 0.0001);
            z = 1;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Math.log(Utils.gamma(z))).to.be.closeTo(Math.log(Utils.gamma(z + 1)) - Math.log(z), 0.0001);
            z = 1.5;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Math.log(Utils.gamma(z))).to.be.closeTo(Math.log(Utils.gamma(z + 1)) - Math.log(z), 0.0001);
        });
        it('should receive only positive values', () => {
            let badParam = () => {
                let gamma = Utils.gamma(-1);
                return gamma;
            };
            badParam.should.throw(Error);
        });
    });

    // Digamma function
    describe('Digamma function', () => {
        it('should be equal minus Euler\'s constant +-0.002 for argument 1', () => {
            expect(Utils.digamma(1)).to.be.a('number');
            expect(Utils.digamma(1)).to.be.closeTo(-0.5772156649, 0.002);
        });
        it('should be equal -1.96351002602+-0.002 for argument 1/2', () => {
            expect(Utils.digamma(1/2)).to.be.a('number');
            expect(Utils.digamma(1/2)).to.be.closeTo(-1.96351002602, 0.002);
        });
        it('should be equal -3.132033780019273+-0.002 for argument 1/3', () => {
            expect(Utils.digamma(1/3)).to.be.a('number');
            expect(Utils.digamma(1/3)).to.be.closeTo(-3.132033780019273, 0.002);
        });
        it('should be equal -6.332127505373381+-0.002 for argument 1/6', () => {
            expect(Utils.digamma(1/6)).to.be.a('number');
            expect(Utils.digamma(1/6)).to.be.closeTo(-6.332127505373381, 0.002);
        });
        it('should be on "1 / (n-1)" bigger then previous Digamma(n-1)', () => {
            for(let i = 1; i < 10; i += 1) {
                expect(Utils.digamma(i)).to.be.a('number');
                expect(Utils.digamma(i+1)).to.be.closeTo(Utils.digamma(i) + 1/i, 0.01);
            }
        });
        it('for sum of Digamma of values < 1 from 1/m to 1 should returns -m(<Euler constant> + ln(m))', () => {
            let digammaSum = 0,
                m = 10;
            for(let i = 1; i <= m; i += 1 ) {
                digammaSum += Utils.digamma(i / m);
            }
            expect(digammaSum).to.be.a('number');
            expect(digammaSum).to.be.closeTo(-m * (0.5772156649 + Math.log(m)), 0.01);
        });
        it('for sum of (Digamma of values < 1 from 1/(m-1) to 1)*sin(2Pirk)/n should returns Pi(2k - m)/ 2 for every k from 1 to m-1', () => {
            let m = 10,
                digammaSum;
            for(let k = 1; k <= m-1; k+= 1) {
                digammaSum = 0;
                for(let i = 1; i <= m-1; i += 1) {
                    digammaSum += Utils.digamma(i / m) * Math.sin(2 * Math.PI * i * k / m);
                }

                expect(digammaSum).to.be.a('number');
                expect(digammaSum).to.be.closeTo(Math.PI * (2 * k - m) / 2, 0.01);
            }
        });
        it('should receive only positive values', () => {
            let badParam = () => {
                let digamma = Utils.digamma(-1);
                return digamma;
            };
            badParam.should.throw(Error);
        });
    });
});

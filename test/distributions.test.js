/**
 * Tests for distributions
 * Created by Alexey S. Kiselev
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it, beforeEach, before} = require('mocha'),
    prng = require('../lib/prng/prngProxy').default;

chai.should();
prng.seed();

// Calculate mean value of array
function meanValue(arr) {
    let res = 0;
    for(let i = 0; i < arr.length; i += 1) {
        res += arr[i];
    }
    return res / arr.length;
}

describe('Random distributions without seed', () => {
    beforeEach(() => {
        prng.seed();
    });
    before(() => {
        prng.seed();
    });

    // Uniform distribution
    describe('Uniform distribution',() => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Uniform = require('../lib/methods/uniform'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
        it('requires numerical arguments', () => {
            let zeroParams = () => {
                let uniform = new Uniform();
                if(uniform.isError().error)
                    throw new Error(uniform.isError().error);
            };
            zeroParams.should.not.throw(Error);

            let oneParam =  () => {
                let uniform = new Uniform(1);
                if(uniform.isError().error)
                    throw new Error(uniform.isError().error);
            };
            oneParam.should.throw(Error);

            let oneParam2 =  () => {
                let uniform = new Uniform(-1);
                if(uniform.isError().error)
                    throw new Error(uniform.isError().error);
            };
            oneParam2.should.not.throw(Error);

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
            prng.seed();
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
        describe('With real generated data (a = 1, b = 4)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let uniform = new Uniform(1, 4),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            prng.seed();
            for(let i = 0; i < 20; i += 1) {
                distribution = uniform.distribution(300000);
                analyzer = Common.getInstance(distribution),
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has minimum value close to 1', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(1, 0.01);
            });
            it('should has maximum value close to 4', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.closeTo(4, 0.01);
            });
            it('should has mean value close to 2.5', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(uniform.mean, 0.01);
            });
            it('should has median value close to 2.5', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(uniform.median, 0.02);
            });
            it('should has variance value close to 9/12', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(uniform.variance, 0.02);
            });
            it('should has skewness value close to 0', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(uniform.skewness, 0.02);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(uniform.entropy, 0.02);
            });
            it('should has correct ext. kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(uniform.kurtosis, 0.02);
            });
            it('should has pdf array with 200 values and sum equals to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    probSum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.values.length).to.be.equal(200);
                for(let i = 0; i < 199; i += 1) {
                    expect(analyzer.pdf.probabilities[i]).to.be.closeTo(1 / analyzer.pdf.probabilities.length, 0.002);
                    probSum += analyzer.pdf.probabilities[i];
                }
                expect(probSum).to.be.closeTo(1, 0.002);
            });
            it('should has cdf array with 200 values and last value equals to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.002);
            });
        });
    });

    // Normal Distribution
    describe('Normal distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Normal = require('../lib/methods/normal'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (mu = 1, sigma = 2)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let normal = new Normal(1, 2),
                distribution,
                mu = 1,
                sigma = 2,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            prng.seed();
            for(let i = 0; i < 20; i += 1) {
                distribution = normal.distribution(300000);
                analyzer = Common.getInstance(distribution),
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has minimum value less then mu - 3*sigma', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.at.most(mu - 3*sigma);
            });
            it('should has maximum value greater then mu + 3*sigma', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(mu + 3*sigma);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(normal.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(normal.median, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(normal.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(normal.skewness, 0.02);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(normal.entropy, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(normal.kurtosis, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.004);
            });
            it('should has sum of pdf from mu-sigma to mu+sigma close to 0.68', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                for(let i in analyzer.pdf.values) {
                    if((analyzer.pdf.values[i] >= mu - sigma) && (analyzer.pdf.values[i] <= mu + sigma)) {
                        sum += analyzer.pdf.probabilities[i];
                    }
                }
                expect(sum).to.be.closeTo(0.68, 0.02);
            });
            it('should has sum of pdf from mu-2sigma to mu+2sigma close to 0.95', () => {
                let normalAnalyzer = Common.getInstance(distribution),
                    sum = 0;
                for(let i in normalAnalyzer.pdf.values) {
                    if((normalAnalyzer.pdf.values[i] >= mu - 2 * sigma) && (normalAnalyzer.pdf.values[i] <= mu + 2 * sigma)) {
                        sum += normalAnalyzer.pdf.probabilities[i];
                    }
                }
                expect(sum).to.be.closeTo(0.95, 0.01);
            });
            it('should has sum of pdf from mu-3sigma to mu+3sigma close to 0.98', () => {
                let normalAnalyzer = Common.getInstance(distribution),
                    sum = 0;
                for(let i in normalAnalyzer.pdf.values) {
                    if((normalAnalyzer.pdf.values[i] >= mu - 3 * sigma) && (normalAnalyzer.pdf.values[i] <= mu + 3 * sigma)) {
                        sum += normalAnalyzer.pdf.probabilities[i];
                    }
                }
                expect(sum).to.be.closeTo(0.98, 0.02);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let normalAnalyzer = Common.getInstance(distribution);
                expect(normalAnalyzer.cdf.probabilities).to.be.an('array');
                expect(normalAnalyzer.cdf.probabilities[0]).to.be.a('number');
                expect(normalAnalyzer.cdf.values).to.be.an('array');
                expect(normalAnalyzer.cdf.values[0]).to.be.a('number');
                expect(normalAnalyzer.cdf.probabilities.length).to.be.equal(200);
                expect(normalAnalyzer.cdf.values.length).to.be.equal(200);
                expect(normalAnalyzer.cdf.values.length).to.be.equal(normalAnalyzer.pdf.probabilities.length);
                expect(normalAnalyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Bernoulli distribution
    describe('Bernoulli distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Bernoulli = require('../lib/methods/bernoulli'),
            Common = require('../lib/analyzer/common');
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
            prng.seed();
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
        describe('With real generated data (p = 0.6)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let bernoulli = new Bernoulli(0.6),
                distribution,
                analyzer,
                mean = [],
                variance = [],
                skewness = [];

            prng.seed();
            for(let i = 0; i < 20; i += 1) {
                distribution = bernoulli.distribution(300000);
                analyzer = Common.getInstance(distribution);
                mean.push(analyzer.mean);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
            }

            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(bernoulli.mean, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(bernoulli.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(bernoulli.skewness, 0.02);
            });
        });
    });

    // Beta distribution
    describe('Beta distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Beta = require('../lib/methods/beta'),
            Common = require('../lib/analyzer/common');
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
        it('should generate a numerical value for alpha=1 or beta=1', () => {
            const beta = new Beta(1, 1);
            prng.seed();
            for(let i = 0; i < 10000; i += 1){
                expect(beta.random()).to.be.a('number');
            }
            const beta2 = new Beta(1, 2);
            prng.seed();
            for(let i = 0; i < 10000; i += 1){
                expect(beta2.random()).to.be.a('number');
            }
            const beta3 = new Beta(2, 1);
            prng.seed();
            for(let i = 0; i < 10000; i += 1){
                expect(beta3.random()).to.be.a('number');
            }
        });
        it('should return different values each time', () => {
            let beta = new Beta(1, 2),
                value1;
            prng.seed();
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
        describe('With real generated data (alpha = 2, beta = 5)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let beta = new Beta(2, 5),
                distribution,
                analyzer,
                min = [],
                max = [],
                mean = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            prng.seed();
            for(let i = 0; i < 20; i += 1) {
                distribution = beta.distribution(300000);
                analyzer = Common.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to 0', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.02);
            });
            it('should has max value close to 0.94', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.closeTo(0.94, 0.02);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(beta.mean, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(beta.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(beta.skewness, 0.02);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(beta.entropy, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(beta.kurtosis, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let betaAnalyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(betaAnalyzer.pdf.probabilities).to.be.an('array');
                expect(betaAnalyzer.pdf.probabilities[0]).to.be.a('number');
                expect(betaAnalyzer.pdf.values).to.be.an('array');
                expect(betaAnalyzer.pdf.values[0]).to.be.a('number');
                expect(betaAnalyzer.pdf.probabilities.length).to.be.equal(200);
                expect(betaAnalyzer.pdf.values.length).to.be.equal(200);
                expect(betaAnalyzer.pdf.values.length).to.be.equal(betaAnalyzer.pdf.probabilities.length);
                for(let el of betaAnalyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has pdf value close to zero on corners', () => {
                let betaAnalyzer = Common.getInstance(distribution);
                expect(betaAnalyzer.pdf.probabilities).to.be.an('array');
                expect(betaAnalyzer.pdf.probabilities[0]).to.be.a('number');
                expect(betaAnalyzer.pdf.probabilities[0]).to.be.closeTo(0, 0.01);
                expect(betaAnalyzer.pdf.probabilities[199]).to.be.closeTo(0, 0.01);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let betaAnalyzer = Common.getInstance(distribution);
                expect(betaAnalyzer.cdf.probabilities).to.be.an('array');
                expect(betaAnalyzer.cdf.probabilities[0]).to.be.a('number');
                expect(betaAnalyzer.cdf.values).to.be.an('array');
                expect(betaAnalyzer.cdf.values[0]).to.be.a('number');
                expect(betaAnalyzer.cdf.probabilities.length).to.be.equal(200);
                expect(betaAnalyzer.cdf.values.length).to.be.equal(200);
                expect(betaAnalyzer.cdf.values.length).to.be.equal(betaAnalyzer.pdf.probabilities.length);
                expect(betaAnalyzer.cdf.probabilities[0]).to.be.closeTo(0, 0.01);
                expect(betaAnalyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Beta Prime distribution
    describe('Beta Prime distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let BetaPrime = require('../lib/methods/betaprime'),
            Common = require('../lib/analyzer/common');
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
            prng.seed();
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
        describe('With real generated data (alpha = 5, beta = 3)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let betaPrime = new BetaPrime(5, 3),
                distribution,
                analyzer,
                min = [],
                max = [],
                mean = [];

            prng.seed();
            for(let i = 0; i < 20; i += 1) {
                distribution = betaPrime.distribution(300000);
                analyzer = Common.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
            }

            it('should has min value close to 0', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.05);
            });
            it('should has max value at least 5', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(5);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(betaPrime.mean, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let betaAnalyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(betaAnalyzer.pdf.probabilities).to.be.an('array');
                expect(betaAnalyzer.pdf.probabilities[0]).to.be.a('number');
                expect(betaAnalyzer.pdf.values).to.be.an('array');
                expect(betaAnalyzer.pdf.values[0]).to.be.a('number');
                expect(betaAnalyzer.pdf.probabilities.length).to.be.equal(200);
                expect(betaAnalyzer.pdf.values.length).to.be.equal(200);
                expect(betaAnalyzer.pdf.values.length).to.be.equal(betaAnalyzer.pdf.probabilities.length);
                for(let el of betaAnalyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
        });
    });

    // Binomial distribution
    describe('Binomial distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Binomial = require('../lib/methods/binomial'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (p = 0.7, n = 20)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let binomial = new Binomial(20, 0.7),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            prng.seed();
            for(let i = 0; i < 20; i += 1) {
                distribution = binomial.distribution(300000);
                analyzer = Common.getInstance(distribution);
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to ~5', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(5, 1.3);
            });
            it('should has max value close to ~20', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.closeTo(20, 1.3);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(binomial.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(binomial.median, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(binomial.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(binomial.skewness, 0.02);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(binomial.entropy, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(binomial.kurtosis, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has pdf value close to zero on corners', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities[0]).to.be.closeTo(0, 0.01);
                expect(analyzer.pdf.probabilities[199]).to.be.closeTo(0, 0.01);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[0]).to.be.closeTo(0, 0.01);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Compertz distribution
    describe('Compertz distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Compertz = require('../lib/methods/compertz'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
        it('requires two numerical arguments with nu > 0 and b > 0', () => {
            let zeroParams = () => {
                let compertz = new Compertz();
                if(compertz.isError().error)
                    throw new Error(compertz.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let compertz = new Compertz(0.5);
                if(compertz.isError().error)
                    throw new Error(compertz.isError().error);
            };
            oneParam.should.throw(Error);

            let badParams = () => {
                let compertz = new Compertz('a', 'b');
                if(compertz.isError().error)
                    throw new Error(compertz.isError().error);
            };
            badParams.should.throw(Error);

            let badParamsLess0 = () => {
                let compertz = new Compertz(-1, 0.5);
                if(compertz.isError().error)
                    throw new Error(compertz.isError().error);
            };
            badParamsLess0.should.throw(Error);

            let badParamsLess02 = () => {
                let compertz = new Compertz(1, -1);
                if(compertz.isError().error)
                    throw new Error(compertz.isError().error);
            };
            badParamsLess02.should.throw(Error);

            let twoParams =  () => {
                let compertz = new Compertz(2, 0.5);
                if(compertz.isError().error)
                    throw new Error(compertz.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let compertz = new Compertz(2, 0.5);
            expect(compertz).to.have.property('random');
            expect(compertz).to.respondsTo('random');
            expect(compertz).to.have.property('distribution');
            expect(compertz).to.respondsTo('distribution');
            expect(compertz).to.have.property('refresh');
            expect(compertz).to.respondsTo('refresh');
            expect(compertz).to.have.property('isError');
            expect(compertz).to.respondsTo('isError');
        });
        it('should have values for initial nu = 1 and b = 1 equals to nu = 2 and b = 3 after .refresh(2, 3) method',() => {
            let compertz = new Compertz(1, 1);
            compertz.nu.should.equal(1);
            compertz.b.should.equal(1);
            compertz.refresh(2, 3);
            compertz.nu.should.equal(2);
            compertz.b.should.equal(3);
        });
        it('should generate an array with random values with length of 500', () => {
            let compertz = new Compertz(1, 0.5),
                randomArray = compertz.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.01;
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
        describe('With real generated data (nu = 0.7, b = 2)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let compertz = new Compertz(0.7, 2),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                median = [];

            prng.seed();
            for(let i = 0; i < 20; i += 1) {
                distribution = compertz.distribution(300000);
                analyzer = Common.getInstance(distribution);
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                median.push(percentiler.median);
            }

            it('should has min value close to 0', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.002);
            });
            it('should has max value at most 5', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.most(5);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(compertz.median, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution, {
                        pdf: 1000
                    }),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(1000);
                expect(analyzer.pdf.values.length).to.be.equal(1000);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has pdf value close to zero on corners', () => {
                let analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities[0]).to.be.closeTo(0, 0.01);
                expect(analyzer.pdf.probabilities[999]).to.be.closeTo(0, 0.01);
            });
            it('should has cdf array with 1000 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(1000);
                expect(analyzer.cdf.values.length).to.be.equal(1000);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[0]).to.be.closeTo(0, 0.01);
                expect(analyzer.cdf.probabilities[999]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Cauchy distribution
    describe('Cauchy distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Cauchy = require('../lib/methods/cauchy'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (x = 1, gamma = 1)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let cauchy = new Cauchy(1, 1),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                median = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = cauchy.distribution(300000);
                analyzer = Common.getInstance(distribution);
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                median.push(percentiler.median);
            }

            it('should has min value less then -4', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.at.most(-4);
            });
            it('should has max value greater then 6', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(6);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(cauchy.median, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[0]).to.be.closeTo(0, 0.01);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Chi distribution
    describe('Chi distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Chi = require('../lib/methods/chi'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (k = 2)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let chi = new Chi(2),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = chi.distribution(300000);
                analyzer = Common.getInstance(distribution);
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to zero', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.02);
            });
            it('should has max value greater then 3', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(3);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(chi.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(chi.median, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(chi.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(chi.skewness, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(chi.kurtosis, 0.02);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(chi.entropy, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[0]).to.be.closeTo(0, 0.01);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Chi Square distribution
    describe('Chi Square distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let ChiSquare = require('../lib/methods/chisquare'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (k = 2)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let chiSquare = new ChiSquare(2),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = chiSquare.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to zero', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.02);
            });
            it('should has max value greater then 8', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(8);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(chiSquare.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(chiSquare.median, 0.03);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(chiSquare.variance, 0.03);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(chiSquare.skewness, 0.03);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(chiSquare.kurtosis, 0.1);
            });
            it('should has correct entropy value', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.entropy).to.be.a('number');
                expect(analyzer.entropy).to.be.closeTo(chiSquare.entropy, 0.07);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has correct pdf curve', () => {
                let analyzer = Common.getInstance(distribution),
                    first = analyzer.pdf.probabilities[0],
                    second;
                for(let i in analyzer.pdf.probabilities) {
                    if(analyzer.pdf.values[i] >= 3) {
                        second = analyzer.pdf.probabilities[i];
                        break;
                    }
                }
                expect(first / second).to.be.closeTo(5, 1);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Erlang distribution
    describe('Erlang distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Erlang = require('../lib/methods/erlang'),
            Common = require('../lib/analyzer/common');
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
            prng.seed();
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
        describe('With real generated data (k = 2, mu = 2)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let erlang = new Erlang(2, 2),
                distribution,
                analyzer,
                min = [],
                max = [],
                mean = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = erlang.distribution(300000);
                analyzer = Common.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to zero', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.02);
            });
            it('should has max value greater then 12', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(12);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(erlang.mean, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(erlang.variance, 0.03);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(erlang.skewness, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(erlang.kurtosis, 0.04);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(erlang.entropy, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Gamma distribution
    describe('Gamma distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Gamma = require('../lib/methods/gamma'),
            Common = require('../lib/analyzer/common');
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
            prng.seed();
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
        describe('With real generated data (alpha = 2, beta = 0.5)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let gamma = new Gamma(2, 0.5),
                distribution,
                analyzer,
                min = [],
                max = [],
                mean = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = gamma.distribution(300000);
                analyzer = Common.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to zero', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.02);
            });
            it('should has max value greater then 12', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(12);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(gamma.mean, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(gamma.variance, 0.03);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(gamma.skewness, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(gamma.kurtosis, 0.04);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(gamma.entropy, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Geometric distribution
    describe('Geometric distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Geometric = require('../lib/methods/geometric'),
            Common = require('../lib/analyzer/common');
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
            prng.seed();
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
        describe('With real generated data (p = 0.6)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let geometric = new Geometric(0.6),
                distribution,
                analyzer,
                min = [],
                mean = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = geometric.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                min.push(analyzer.min);
                mean.push(analyzer.mean);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value equals to 1', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.equal(1);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(geometric.mean, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(geometric.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(geometric.skewness, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(geometric.kurtosis, 0.075);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(geometric.entropy, 0.03);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has correct pdf curve', () => {
                let analyzer = Common.getInstance(distribution),
                    values = [0.6, 0.24, 0.096],
                    j = 0;
                for(let i of values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        if(analyzer.pdf.probabilities[j] !== 0) {
                            expect(analyzer.pdf.probabilities[j]).to.be.closeTo(i, 0.02);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Negative Binomial distribution
    describe('Negative Binomial distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let NegativeBinomial = require('../lib/methods/negativebinomial'),
            Common = require('../lib/analyzer/common');
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
            negativeBinomial.numberSuccess.should.equal(1);
            negativeBinomial.successProb.should.equal(0.6);
            negativeBinomial.refresh(2, 0.7);
            negativeBinomial.numberSuccess.should.equal(2);
            negativeBinomial.successProb.should.equal(0.7);
        });
        it('should have mean value for r = 1 and p = 0.6 equals to 0.66667, but for r = 2 and p = 0.4 equals to 3',() => {
            let negativeBinomial = new NegativeBinomial(1, 0.6);
            expect(negativeBinomial.mean).to.be.a('number');
            expect(negativeBinomial.mean).to.be.closeTo(0.666667, 0.002);
            negativeBinomial.refresh(2, 0.4);
            expect(negativeBinomial.mean).to.be.a('number');
            expect(negativeBinomial.mean).to.be.closeTo(3, 0.002);
        });
        it('should return few different values with 10 experiments', () => {
            let negativeBinomial = new NegativeBinomial(2, 0.6),
                value1,
                countRandoms = {};
            prng.seed();
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
        describe('With real generated data (r = 3, p = 0.6)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let nbinomial = new NegativeBinomial(3, 0.6),
                distribution,
                analyzer,
                min = [],
                max = [],
                mean = [],
                variance = [],
                skewness = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = nbinomial.distribution(300000);
                analyzer = Common.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value equals to 0', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.equal(0);
            });
            it('should has max value greater then 15', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(15);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(nbinomial.mean, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(nbinomial.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(nbinomial.skewness, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(nbinomial.kurtosis, 0.05);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has correct pdf curve', () => {
                let analyzer = Common.getInstance(distribution),
                    values = [0.216, 0.2592, 0.20736, 0.13824, 0.082944, 0.04644864, 0.024772608],
                    j = 0;
                for(let i of values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        if(analyzer.pdf.probabilities[j] !== 0) {
                            expect(analyzer.pdf.probabilities[j]).to.be.closeTo(i, 0.02);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Poisson distribution
    describe('Poisson distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Poisson = require('../lib/methods/poisson'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (lambda = 4)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let poisson = new Poisson(4),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = poisson.distribution(300000);
                analyzer = Common.getInstance(distribution);
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value equals to 0', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.equal(0);
            });
            it('should has max value greater then 9', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(9);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(poisson.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(poisson.median, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(poisson.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(poisson.skewness, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(poisson.kurtosis, 0.02);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(poisson.entropy, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has correct pdf curve', () => {
                let analyzer = Common.getInstance(distribution),
                    values = [0.01831564, 0.07326256, 0.1465251, 0.1953668, 0.1953668, 0.1562935, 0.1041956, 0.05954036, 0.02977018],
                    j = 0;
                for(let i of values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        if(analyzer.pdf.probabilities[j] !== 0) {
                            expect(analyzer.pdf.probabilities[j]).to.be.closeTo(i, 0.02);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Exponential distribution
    describe('Exponential distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Exponential = require('../lib/methods/exponential'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (lambda = 1)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let exponential = new Exponential(1),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = exponential.distribution(300000);
                analyzer = Common.getInstance(distribution);
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to 0', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.02);
            });
            it('should has max value greater then 4', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(4);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(exponential.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(exponential.median, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(exponential.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(exponential.skewness, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(exponential.kurtosis, 0.1);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(exponential.entropy, 0.05);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has correct pdf curve', () => {
                // Step: 0.5
                let analyzer = Common.getInstance(distribution),
                    values = [1, 0.6065307, 0.3678794, 0.2231302, 0.1353353, 0.082085, 0.04978707, 0.03019738],
                    j = 0;
                for(let i in values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        if(analyzer.pdf.values[j] >= i * 0.5) {
                            expect(analyzer.pdf.probabilities[j] / analyzer.pdf.probabilities[0]).to.be.closeTo(values[i], 0.05);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Extreme Value (Gumbel-type) distribution
    describe('Extreme Value (Gumbel-type) distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let ExtremeValue = require('../lib/methods/extremevalue'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (mu = 0, sigma = 1)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let extremeValue = new ExtremeValue(0, 1),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = extremeValue.distribution(300000);
                analyzer = Common.getInstance(distribution);
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value at most -2', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.at.most(-2);
            });
            it('should has max value greater then 4', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(4);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(extremeValue.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(extremeValue.median, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(extremeValue.variance, 0.02);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(extremeValue.skewness, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(extremeValue.kurtosis, 0.05);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(extremeValue.entropy, 0.02);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has correct cdf curve', () => {
                // Step: 0.5
                let analyzer = Common.getInstance(distribution),
                    values = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
                    j = 0,
                    sum = 0;
                for(let i in values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        sum += analyzer.pdf.probabilities[j];
                        if(analyzer.pdf.values[j] >= values[i]) {
                            expect(sum).to.be.closeTo(Math.exp(-Math.exp(-analyzer.pdf.values[j])), 0.04);
                            expect(analyzer.cdf.probabilities[j]).to.be.closeTo(Math.exp(-Math.exp(-analyzer.pdf.values[j])), 0.04);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Laplace distribution
    describe('Laplace distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Laplace = require('../lib/methods/laplace'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (mu = 0, b = 2)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let laplace = new Laplace(0, 2),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = laplace.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value at most -7', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.at.most(-7);
            });
            it('should has max value greater then 7', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(7);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(laplace.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(laplace.median, 0.02);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(laplace.variance, 0.03);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(laplace.skewness, 0.03);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(laplace.entropy, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(laplace.kurtosis, 0.05);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
            it('should has correct cdf curve', () => {
                // Step: 0.5
                let analyzer = Common.getInstance(distribution, {
                        pdf: 1000
                    }),
                    values = [-8, -7, -6, -5, -4, -3, -2, -1.5, -1, -0.6, -0.3, 0, 0.3, 0.6, 1, 1.5, 2, 3, 4, 5, 6, 7, 8],
                    j = 0,
                    sum = 0;
                for(let i in values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        sum += analyzer.pdf.probabilities[j];
                        if(analyzer.pdf.values[j] >= values[i]) {
                            if(analyzer.pdf.values[j] < 0) {
                                expect(sum).to.be.closeTo(Math.exp(-Math.abs(analyzer.pdf.values[j]) / 2) / 2, 0.06);
                            } else {
                                expect(sum).to.be.closeTo(1 - (Math.exp(-Math.abs(analyzer.pdf.values[j]) / 2)) / 2, 0.06);
                            }
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
        });
    });

    // Logistic distribution
    describe('Logistic distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Logistic = require('../lib/methods/logistic'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (mu = 5, s = 2)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let logistic = new Logistic(5, 2),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = logistic.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value at most -3', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.at.most(-3);
            });
            it('should has max value greater then 13', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(13);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(logistic.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(logistic.median, 0.03);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(logistic.variance, 0.03);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(logistic.skewness, 0.03);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(logistic.entropy, 0.02);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(logistic.kurtosis, 0.03);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
            it('should has correct cdf curve', () => {
                // Step: 0.5
                let analyzer = Common.getInstance(distribution),
                    values = [-5, -4, -3, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    j = 0,
                    sum = 0;
                for(let i in values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        sum += analyzer.pdf.probabilities[j];
                        if(analyzer.pdf.values[j] >= values[i]) {
                            expect(sum).to.be.closeTo(1 / (1 + Math.exp(-(analyzer.pdf.values[j] - 5) / 2)), 0.05);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
        });
    });

    // Lognormal distribution
    describe('Lognormal distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Lognormal = require('../lib/methods/lognormal'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (mu = 0, sigma = 1)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let lognormal = new Lognormal(0, 1),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = lognormal.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
            }

            it('should has min value close to zero', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.02);
            });
            it('should has max value greater then 3', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(3);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(lognormal.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(lognormal.median, 0.03);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(lognormal.variance, 0.05);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(lognormal.entropy, 0.04);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(lognormal.skewness, 0.5);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Pareto distribution
    describe('Pareto distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Pareto = require('../lib/methods/pareto'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (xm = 1, alpha = 4)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let pareto = new Pareto(1, 4),
                distribution,
                analyzer,
                percentiler,
                min = [],
                mean = [],
                median = [],
                variance = [],
                entropy = [];

            for(let i = 0; i < 40; i += 1) {
                distribution = pareto.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 3000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                entropy.push(analyzer.entropy);
            }

            it('should has min value close to 1', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(1, 0.02);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(pareto.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(pareto.median, 0.03);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(pareto.variance, 0.04);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(pareto.entropy, 0.05);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution, {
                        pdf: 1000
                    }),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(1000);
                expect(analyzer.pdf.values.length).to.be.equal(1000);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(1000);
                expect(analyzer.cdf.values.length).to.be.equal(1000);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[999]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Rayleigh distribution
    describe('Rayleigh distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Rayleigh = require('../lib/methods/rayleigh'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (sigma = 1)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let rayleigh = new Rayleigh(1),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = rayleigh.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to zero', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.02);
            });
            it('should has max value greater then 3.2', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(3.2);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(rayleigh.mean, 0.02);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(rayleigh.median, 0.03);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(rayleigh.variance, 0.05);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(rayleigh.entropy, 0.04);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(rayleigh.skewness, 0.04);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(rayleigh.kurtosis, 0.04);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Student's t-distribution
    describe('Student\'s t-distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Student = require('../lib/methods/student'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (v = 6)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let student = new Student(6),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = student.distribution(200000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value less then -5', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.at.most(-5);
            });
            it('should has max value greater then 5', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(5);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(student.mean, 0.03);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(student.median, 0.03);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(student.variance, 0.05);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(student.skewness, 0.05);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
        });
    });

    // Triangular distribution
    describe('Triangular distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Triangular = require('../lib/methods/triangular'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (a = 1, b = 3, c = 2)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let triangular = new Triangular(1, 3, 2),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = triangular.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to a', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(1, 0.03);
            });
            it('should has max value close to b', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.closeTo(3, 0.03);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(triangular.mean, 0.03);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(triangular.median, 0.03);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(triangular.entropy, 0.05);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(triangular.variance, 0.04);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(triangular.skewness, 0.04);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(triangular.kurtosis, 0.04);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
            it('should has correct cdf curve', () => {
                // Step: 0.5
                let analyzer = Common.getInstance(distribution, {
                        pdf: 1000
                    }),
                    values = [1, 2, 3],
                    probs = [0, 0.5, 1],
                    j = 0,
                    sum = 0;
                for(let i in values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        sum += analyzer.pdf.probabilities[j];
                        if(analyzer.pdf.values[j] >= values[i]) {
                            expect(sum).to.be.closeTo(probs[i], 0.03);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
        });
    });

    // Weibull distribution
    describe('Weibull distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Weibull = require('../lib/methods/weibull'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
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
            prng.seed();
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
        describe('With real generated data (lambda = 1, k = 1.5)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let weibull = new Weibull(1.5, 1),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                entropy = [],
                kurtosis = [];

            for(let i = 0; i < 20; i += 1) {
                distribution = weibull.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                entropy.push(analyzer.entropy);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value close to 0', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(0, 0.03);
            });
            it('should has max value greater then 2.5', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(2.5);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(weibull.mean, 0.03);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(weibull.median, 0.04);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(weibull.entropy, 0.05);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(weibull.variance, 0.05);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(weibull.skewness, 0.05);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(weibull.kurtosis, 0.05);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
            it('should has correct cdf curve', () => {
                // Step: 0.5
                let analyzer = Common.getInstance(distribution, {
                        pdf: 1000
                    }),
                    values = [0, 0.25, 0.5, 1, 1.5, 2],
                    probs = [0, 0.1175031, 0.2978115, 0.6321206, 0.8407241, 0.9408943],
                    j = 0,
                    sum = 0;
                for(let i in values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        sum += analyzer.pdf.probabilities[j];
                        if(analyzer.pdf.values[j] >= values[i]) {
                            expect(sum).to.be.closeTo(probs[i], 0.03);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
        });
    });

    // Bates distribution
    describe('Bates distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Bates = require('../lib/methods/bates'),
            Common = require('../lib/analyzer/common');
        it('requires minimum one numerical argument with n >= 1', () => {
            let zeroParams = () => {
                let bates = new Bates();
                if(bates.isError().error)
                    throw new Error(bates.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let bates = new Bates(2);
                if(bates.isError().error)
                    throw new Error(bates.isError().error);
            };
            oneParam.should.not.throw(Error);
        });
        it('requires different "a" and "b" values', () => {
            let equalParams = () => {
                let bates = new Bates(2, 1, 1);
                if(bates.isError().error)
                    throw new Error(bates.isError().error);
            };
            equalParams.should.throw(Error);

            let goodParams =  () => {
                let bates = new Bates(2, 1, 2);
                if(bates.isError().error)
                    throw new Error(bates.isError().error);
            };
            goodParams.should.not.throw(Error);
        });
        it('requires correct "n" value' , () => {
            let badNParam = () => {
                let bates = new Bates(0, 1, 2);
                if(bates.isError().error)
                    throw new Error(bates.isError().error);
            };
            badNParam.should.throw(Error);

            let floatParam = () => {
                let bates = new Bates(2.5, 1, 2);
                if(bates.isError().error)
                    throw new Error(bates.isError().error);
            };
            floatParam.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let bates = new Bates(5, 1, 2);
            expect(bates).to.have.property('random');
            expect(bates).to.respondsTo('random');
            expect(bates).to.have.property('distribution');
            expect(bates).to.respondsTo('distribution');
            expect(bates).to.have.property('refresh');
            expect(bates).to.respondsTo('refresh');
            expect(bates).to.have.property('isError');
            expect(bates).to.respondsTo('isError');
        });
        it('should have "n", "a" and "b" values for initial n = 2 and a = 1, b = 2 equals to 3 and 4, 5 after .refresh(3, 4, 5) method',() => {
            let bates = new Bates(2, 1, 2);
            bates.n.should.equal(2);
            bates.a.should.equal(1);
            bates.b.should.equal(2);
            bates.refresh(3, 4, 5);
            bates.n.should.equal(3);
            bates.a.should.equal(4);
            bates.b.should.equal(5);
        });
        it('should return different values each time', () => {
            let bates = new Bates(5, 1, 2),
                value1;
            prng.seed();
            for(let i = 0; i < 10; i += 1){
                value1 = bates.random();
                expect(bates.random()).to.be.a('number');
                bates.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let bates = new Bates(5, 1, 2),
                randomArray = bates.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.02;
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
        describe('With real generated data (n = 10, a = 0, b = 1)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let bates = new Bates(10, 0, 1),
                distribution,
                analyzer,
                min = [],
                max = [],
                mean = [],
                variance = [],
                skewness = [],
                kurtosis = [];

            for(let i = 0; i < 30; i += 1) {
                distribution = bates.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value at most 0.2', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.at.most(0.2);
            });
            it('should has max value greater then 0.8', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(0.8);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(bates.mean, 0.03);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(bates.variance, 0.05);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(bates.skewness, 0.05);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(bates.kurtosis, 0.05);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
            it('should has correct cdf curve', () => {
                // Step: 0.5
                let analyzer = Common.getInstance(distribution, {
                        pdf: 1000
                    }),
                    values = [0, 0.1, 0.2, 0.5, 0.8, 0.9],
                    probs = [0, 0, 0, 0.5, 1, 1],
                    j = 0,
                    sum = 0;
                for(let i in values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        sum += analyzer.pdf.probabilities[j];
                        if(analyzer.pdf.values[j] >= values[i]) {
                            expect(sum).to.be.closeTo(probs[i], 0.03);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
        });
    });

    // Irwin-Hall distribution
    describe('Irwin-Hall distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let IrwinHall = require('../lib/methods/irwinhall'),
            Common = require('../lib/analyzer/common'),
            Percentile = require('../lib/analyzer/percentiles');
        it('requires one numerical argument with n >= 1', () => {
            let zeroParams = () => {
                let irwinhall = new IrwinHall();
                if(irwinhall.isError().error)
                    throw new Error(irwinhall.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let irwinhall = new IrwinHall(2);
                if(irwinhall.isError().error)
                    throw new Error(irwinhall.isError().error);
            };
            oneParam.should.not.throw(Error);
        });
        it('requires correct "n" value' , () => {
            let badNParam = () => {
                let irwinhall = new IrwinHall(0);
                if(irwinhall.isError().error)
                    throw new Error(irwinhall.isError().error);
            };
            badNParam.should.throw(Error);

            let floatParam = () => {
                let irwinhall = new IrwinHall(2.5);
                if(irwinhall.isError().error)
                    throw new Error(irwinhall.isError().error);
            };
            floatParam.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let irwinhall = new IrwinHall(5);
            expect(irwinhall).to.have.property('random');
            expect(irwinhall).to.respondsTo('random');
            expect(irwinhall).to.have.property('distribution');
            expect(irwinhall).to.respondsTo('distribution');
            expect(irwinhall).to.have.property('refresh');
            expect(irwinhall).to.respondsTo('refresh');
            expect(irwinhall).to.have.property('isError');
            expect(irwinhall).to.respondsTo('isError');
        });
        it('should have "n" value for initial n = 3 equals to 5 after .refresh(5) method',() => {
            let irwinhall = new IrwinHall(3);
            irwinhall.n.should.equal(3);
            irwinhall.refresh(5);
            irwinhall.n.should.equal(5);
        });
        it('should return different values each time', () => {
            let irwinhall = new IrwinHall(5),
                value1;
            prng.seed();
            for(let i = 0; i < 10; i += 1){
                value1 = irwinhall.random();
                expect(irwinhall.random()).to.be.a('number');
                irwinhall.random().should.not.equal(value1);
            }
        });
        it('should generate an array with random values with length of 500', () => {
            let irwinhall = new IrwinHall(5),
                randomArray = irwinhall.distribution(500),
                countDiffs = 0,
                last,
                delta = 0.02;
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
        describe('With real generated data (n = 8)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let irwinhall = new IrwinHall(8),
                distribution,
                analyzer,
                percentiler,
                min = [],
                max = [],
                mean = [],
                median = [],
                variance = [],
                skewness = [],
                kurtosis = [];

            for(let i = 0; i < 30; i += 1) {
                distribution = irwinhall.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                percentiler = Percentile.getInstance(distribution);
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                median.push(percentiler.median);
                variance.push(analyzer.variance);
                skewness.push(analyzer.skewness);
                kurtosis.push(analyzer.kurtosis);
            }

            it('should has min value at most 2', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.at.most(2);
            });
            it('should has max value greater then 7', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.at.least(7);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(irwinhall.mean, 0.03);
            });
            it('should has correct median value', () => {
                expect(percentiler.median).to.be.a('number');
                expect(meanValue(median)).to.be.closeTo(irwinhall.median, 0.03);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(irwinhall.variance, 0.05);
            });
            it('should has correct skewness value', () => {
                expect(analyzer.skewness).to.be.a('number');
                expect(meanValue(skewness)).to.be.closeTo(irwinhall.skewness, 0.05);
            });
            it('should has correct kurtosis value', () => {
                expect(analyzer.kurtosis).to.be.a('number');
                expect(meanValue(kurtosis) - 3).to.be.closeTo(irwinhall.kurtosis, 0.05);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
            it('should has correct cdf curve', () => {
                // Step: 0.5
                let analyzer = Common.getInstance(distribution, {
                        pdf: 1000
                    }),
                    values = [2, 3, 3.5, 4, 4.5, 5, 6],
                    probs = [0.006150794, 0.112624, 0.2735395, 0.5, 0.7264605, 0.887376, 0.9938492],
                    j = 0,
                    sum = 0;
                for(let i in values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        sum += analyzer.pdf.probabilities[j];
                        if(analyzer.pdf.values[j] >= values[i]) {
                            expect(sum).to.be.closeTo(probs[i], 0.03);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
        });
    });

    // Zipf distribution
    describe('Zipf distribution', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Zipf = require('../lib/methods/zipf'),
            Common = require('../lib/analyzer/common');
        it('requires two numerical arguments', () => {
            let zeroParams = () => {
                let zipf = new Zipf();
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            zeroParams.should.throw(Error);

            let oneParam = () => {
                let zipf = new Zipf(2);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            oneParam.should.throw(Error);

            let twoParams = () => {
                let zipf = new Zipf(1, 5);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            twoParams.should.not.throw(Error);
        });
        it('requires correct alpha value' , () => {
            let badAlphaParam = () => {
                let zipf = new Zipf(-1, 4);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            badAlphaParam.should.throw(Error);

            let zeroAlpha = () => {
                let zipf = new Zipf(0, 4);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            zeroAlpha.should.not.throw(Error);

            let floatAlpha = () => {
                let zipf = new Zipf(0.5, 4);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            floatAlpha.should.not.throw(Error);

            let integerAlpha = () => {
                let zipf = new Zipf(1, 4);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            integerAlpha.should.not.throw(Error);

            let biggerIntegerAlpha = () => {
                let zipf = new Zipf(3, 4);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            biggerIntegerAlpha.should.not.throw(Error);
        });
        it('requires correct shape value' , () => {
            let badShapeParam = () => {
                let zipf = new Zipf(1, -4);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            badShapeParam.should.throw(Error);

            let zeroShape = () => {
                let zipf = new Zipf(1, 0);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            zeroShape.should.throw(Error);

            let oneShape = () => {
                let zipf = new Zipf(1, 1);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            oneShape.should.throw(Error);

            let goodShape = () => {
                let zipf = new Zipf(1, 4);
                if(zipf.isError().error)
                    throw new Error(zipf.isError().error);
            };
            goodShape.should.not.throw(Error);
        });
        it('should has methods: .random, .distribution, .refresh, .isError', () => {
            let zipf = new Zipf(1, 5);
            expect(zipf).to.have.property('random');
            expect(zipf).to.respondsTo('random');
            expect(zipf).to.have.property('distribution');
            expect(zipf).to.respondsTo('distribution');
            expect(zipf).to.have.property('refresh');
            expect(zipf).to.respondsTo('refresh');
            expect(zipf).to.have.property('isError');
            expect(zipf).to.respondsTo('isError');
        });
        it('should correctly update params for initial alpha=1, shape=4 .refresh(0.5, 5) method',() => {
            let zipf = new Zipf(1, 4);
            zipf.alpha.should.equal(1);
            zipf.shape.should.equal(4);
            zipf.refresh(0.5, 5);
            zipf.alpha.should.equal(0.5);
            zipf.shape.should.equal(5);
        });
        it('should be able to return different values', () => {
            let zipf = new Zipf(0.2, 10),
                values = {};
            prng.seed();
            for(let i = 0; i < 10; i += 1){
                values[zipf.random()] = 1;
                expect(zipf.random()).to.be.a('number');
            }
            let res = Object.keys(values).length > 1;
            res.should.equal(true);
        });
        it('should generate an array with random values with length of 500', () => {
            let zipf = new Zipf(0.1, 10),
                randomArray = zipf.distribution(100),
                countDiffs = 0,
                last,
                delta = 1;
            // Check all values
            randomArray.map(rand => {
                if(last && Math.abs(rand - last) >= delta){
                    countDiffs += 1;
                }
                last = rand;
            });
            expect(randomArray).to.be.an('array');
            expect(randomArray).to.have.lengthOf(100);
            expect(countDiffs).to.be.at.least(30);
        });
        it('should generate bounded values 1 <= value <= shape', () => {
            let zipf = new Zipf(0.2, 30),
                minValue = Infinity,
                maxValue = -Infinity,
                temp;
            prng.seed();
            for(let i = 0; i < 1000; i += 1){
                temp = zipf.random();
                minValue = Math.min(temp, minValue);
                maxValue = Math.max(temp, maxValue);
                expect(temp).to.be.a('number');
            }
            expect(maxValue).to.be.at.most(30);
            expect(minValue).to.be.at.least(1);
        });
        describe('With real generated data (alpha=0.5, shape=20)', () => {
            beforeEach(() => {
                prng.seed();
            });
            before(() => {
                prng.seed();
            });
            let zipf = new Zipf(0.5, 20),
                distribution,
                analyzer,
                min = [],
                max = [],
                mean = [],
                variance = [],
                entropy = [];

            for(let i = 0; i < 30; i += 1) {
                distribution = zipf.distribution(300000);
                analyzer = Common.getInstance(distribution, {
                    pdf: 1000
                });
                min.push(analyzer.min);
                max.push(analyzer.max);
                mean.push(analyzer.mean);
                variance.push(analyzer.variance);
                entropy.push(analyzer.entropy);
            }

            it('should has min value close to 1', () => {
                expect(analyzer.min).to.be.a('number');
                expect(meanValue(min)).to.be.closeTo(1, 0.5);
            });
            it('should has max value close to shape', () => {
                expect(analyzer.max).to.be.a('number');
                expect(meanValue(max)).to.be.closeTo(20, 0.5);
            });
            it('should has correct mean value', () => {
                expect(analyzer.mean).to.be.a('number');
                expect(meanValue(mean)).to.be.closeTo(zipf.mean, 0.05);
            });
            it('should has correct variance value', () => {
                expect(analyzer.variance).to.be.a('number');
                expect(meanValue(variance)).to.be.closeTo(zipf.variance, 0.05);
            });
            it('should has correct entropy value', () => {
                expect(analyzer.entropy).to.be.a('number');
                expect(meanValue(entropy)).to.be.closeTo(zipf.entropy, 0.05);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let analyzer = Common.getInstance(distribution),
                    sum = 0;
                expect(analyzer.pdf.probabilities).to.be.an('array');
                expect(analyzer.pdf.probabilities[0]).to.be.a('number');
                expect(analyzer.pdf.values).to.be.an('array');
                expect(analyzer.pdf.values[0]).to.be.a('number');
                expect(analyzer.pdf.probabilities.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(200);
                expect(analyzer.pdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                for(let el of analyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.005);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let analyzer = Common.getInstance(distribution);
                expect(analyzer.cdf.probabilities).to.be.an('array');
                expect(analyzer.cdf.probabilities[0]).to.be.a('number');
                expect(analyzer.cdf.values).to.be.an('array');
                expect(analyzer.cdf.values[0]).to.be.a('number');
                expect(analyzer.cdf.probabilities.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(200);
                expect(analyzer.cdf.values.length).to.be.equal(analyzer.pdf.probabilities.length);
                expect(analyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.01);
            });
            it('should has correct cdf curve', () => {
                // Step: 0.5
                let analyzer = Common.getInstance(distribution, {
                        pdf: 1000
                    }),
                    values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                    probs = [ 0.13166114852895808,
                        0.22475963947259356,
                        0.3007742390176028,
                        0.36660481328208183,
                        0.4254854689033712,
                        0.4792359077108271,
                        0.5289991443303643,
                        0.5755483898021821,
                        0.6194354393118348,
                        0.6610703501823583,
                        0.700767680103977,
                        0.7387749798764817,
                        0.7752912123386076,
                        0.8104791344060732,
                        0.8444738967790864,
                        0.8773891839113258,
                        0.9093217028627981,
                        0.9403545331773433,
                        0.9705596721893553,
                        1 ],
                    j = 0,
                    sum = 0;
                for(let i in values) {
                    while(j < analyzer.pdf.probabilities.length) {
                        sum += analyzer.pdf.probabilities[j];
                        if(analyzer.pdf.values[j] >= values[i]) {
                            expect(sum).to.be.closeTo(probs[i], 0.05);
                            j += 1;
                            break;
                        }
                        j += 1;
                    }
                }
            });
        });
    });
});

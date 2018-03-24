/**
 * Tests for Analyzer
 * Created by Alexey S. Kiselev
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    fs = require('fs');

chai.should();

describe('Analyzer', () => {
    it('should be asynchronous', (done) => {
        let randomjs = require('../lib'),
            promise = randomjs.analyze([1, 4, 5, 9, 6, 4, 2, 6, 2, 10, 11, 8, 7, 12, 1, 1, 8, 6, 4, 5, 9]),
            min = -1;
        promise.then((res) => {
            min = res.min;
            expect(res.min).to.be.equal(1);
            done();
        });
        expect(min).to.be.equal(-1);
    });
    it('should rejected with not array input', (done) => {
        let randomjs = require('../lib'),
            promise = randomjs.analyze(3),
            rejected = false;
        promise
            .catch((err) => {
                rejected = true;
                expect(err).to.be.equal('Input must be an Array!');
                done();
            });
        expect(rejected).to.be.equal(false);
    });
    it('should rejected with too small array', (done) => {
        let randomjs = require('../lib'),
            promise = randomjs.analyze([1, 2, 3]),
            rejected = false;
        promise
            .catch((err) => {
                rejected = true;
                expect(err).to.be.equal('Analyzer.Common: input randomArray is too small, that is no reason to analyze');
                done();
            });
        expect(rejected).to.be.equal(false);
    });
    it('should rejected with method, which does not exist', (done) => {
        let randomjs = require('../lib'),
            promise = randomjs.analyze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
            rejected = false;
        promise.somemethod
            .then((res) => {
                expect(res).to.be.a('number');
                done();
            })
            .catch((err) => {
                rejected = true;
                expect(err).to.be.equal('No such method in analyzer');
                done();
            });
        expect(rejected).to.be.equal(false);
    });
    describe('Imported Common class', () => {
        let Common = require('../lib/analyzer/common'),
            sampleArray = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // Not random Array
            sampleRandomArray = [1, 4, 5, 9, 6, 4, 2, 6, 2, 10, 11, 8, 7, 12, 1, 1, 8, 6, 4, 5, 9],
            sampleSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        it('should be a Singleton', () => {
            let methods1 = Common.getInstance([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
                methods2 = Common.getInstance([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
                methods3 = new Common([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
                methods4 = new Common([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            expect(methods1).to.equal(methods2);
            expect(methods3).to.not.equal(methods4);
        });
        it('should has "publicMethods" property for instances', () => {
            let common = Common.getInstance([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
                common2 = new Common([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            expect(common).to.have.property('publicMethods');
            expect(common2).to.have.property('publicMethods');
        });
        it('should receive for input data only array with length > 10', () => {
            let receiveNotArray = () => {
                Common.getInstance(3);
            };
            receiveNotArray.should.throw(Error);

            let receiveSmallArray = () => {
                Common.getInstance([1, 2, 3]);
            };
            receiveSmallArray.should.throw(Error);

            let receiveArray = () => {
                Common.getInstance([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            };
            receiveArray.should.not.throw(Error);
        });
        // Tests for non random input
        describe('With non-random input', () => {
            it('should has mean value equals to 2', () => {
                let commonNonRandom = Common.getInstance(sampleArray);
                expect(commonNonRandom.mean).to.be.a('number');
                expect(commonNonRandom.mean).to.be.closeTo(2, 0.001);
            });
            it('should has variance and standard deviation equal to zero', () => {
                let commonNonRandom = Common.getInstance(sampleArray);
                expect(commonNonRandom.variance).to.be.a('number');
                expect(commonNonRandom.variance).to.be.closeTo(0, 0.001);
                expect(commonNonRandom.standard_deviation).to.be.a('number');
                expect(commonNonRandom.standard_deviation).to.be.closeTo(0, 0.001);
            });
            it('should has min and max values equal to 2', () => {
                let commonNonRandom = Common.getInstance(sampleArray);
                expect(commonNonRandom.max).to.be.a('number');
                expect(commonNonRandom.max).to.be.closeTo(2, 0.001);
                expect(commonNonRandom.min).to.be.a('number');
                expect(commonNonRandom.min).to.be.closeTo(2, 0.001);
            });
            it('should has mode value equals to [2]', () => {
                let commonNonRandom = Common.getInstance(sampleArray);
                expect(commonNonRandom.mode).to.be.an('array');
                expect(commonNonRandom.mode[0]).to.be.closeTo(2, 0.001);
            });
            it('should has entropy value equals to zero', () => {
                let commonNonRandom = Common.getInstance(sampleArray);
                expect(commonNonRandom.entropy).to.be.a('number');
                expect(commonNonRandom.entropy).to.be.closeTo(0, 0.001);
            });
            it('should not have numeric skewness value', () => {
                let commonNonRandom = Common.getInstance(sampleArray);
                expect(commonNonRandom.skewness).to.be.NaN;
            });
            it('should not have numeric kurtosis value', () => {
                let commonNonRandom = Common.getInstance(sampleArray);
                expect(commonNonRandom.kurtosis).to.be.NaN;
            });
            it('for 12-elements array should has 12-elements pdf array with first element equals to 1 and others equal to zero', () => {
                let commonNonRandom = Common.getInstance(sampleArray);
                expect(commonNonRandom.pdf.probabilities).to.be.an('array');
                expect(commonNonRandom.pdf.probabilities.length).to.equal(12);
                expect(commonNonRandom.pdf.probabilities[0]).to.equal(1);
                for(let i = 1; i <= 11; i += 1){
                    expect(commonNonRandom.pdf.probabilities[i]).to.equal(0);
                }
            });
            it('for 12-elements array should has 12-elements cdf array with all elements equals to 1', () => {
                let commonNonRandom = Common.getInstance(sampleArray);
                expect(commonNonRandom.cdf.probabilities).to.be.an('array');
                expect(commonNonRandom.cdf.probabilities.length).to.equal(12);
                for(let i = 0; i <= 11; i += 1){
                    expect(commonNonRandom.cdf.probabilities[i]).to.equal(1);
                }
            });
        });
        // Tests for non-random sequence
        describe('With non-random sequence [1, 2, 3, 4, 5, ...]', () => {
            it('should has min value equals to 1', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.min).to.be.a('number');
                expect(commonSequence.min).to.be.equal(1);
            });
            it('should has max value equals to 20', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.max).to.be.a('number');
                expect(commonSequence.max).to.be.equal(20);
            });
            it('should has mean value equals to 10.5', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.mean).to.be.a('number');
                expect(commonSequence.mean).to.be.equal(10.5);
            });
            it('should has median value equals to 10.5', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.median).to.be.a('number');
                expect(commonSequence.median).to.be.closeTo(10.5, (commonSequence.max - commonSequence.min) / sampleSequence.length);
            });
            it('should has variance value equals to 35', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.variance).to.be.a('number');
                expect(commonSequence.variance).to.be.equal(35);
            });
            it('should has standard deviation value equals to 5.916079', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.standard_deviation).to.be.a('number');
                expect(commonSequence.standard_deviation).to.be.closeTo(5.916079, 0.00001);
            });
            it('should has mode array equal to input', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.mode).to.be.an('array');
                expect(commonSequence.mode.length).to.be.equal(sampleSequence.length);
                for(let i in sampleSequence) {
                    expect(commonSequence.mode[i]).to.be.closeTo(sampleSequence[i], (commonSequence.max - commonSequence.min) / sampleSequence.length);
                }
            });
            it('should has entropy value equals to log(20)', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.entropy).to.be.a('number');
                expect(commonSequence.entropy).to.be.closeTo(Math.log(20), 0.05);
            });
            it('should has skewness value equals to 0', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.skewness).to.be.a('number');
                expect(commonSequence.skewness).to.be.closeTo(0, 0.00001);
            });
            it('should has kurtosis value equals to 1.704286', () => {
                let commonSequence = Common.getInstance(sampleSequence);
                expect(commonSequence.kurtosis).to.be.a('number');
                expect(commonSequence.kurtosis).to.be.closeTo(1.704286, 0.00001);
            });
            it('should has pdf function with 20 elements and sum of them equals to 1', () => {
                let commonRandom = Common.getInstance(sampleSequence),
                    probSum = 0;
                expect(commonRandom.pdf.probabilities).to.be.an('array');
                expect(commonRandom.pdf.probabilities[0]).to.be.a('number');
                expect(commonRandom.pdf.values).to.be.an('array');
                expect(commonRandom.pdf.values[0]).to.be.a('number');
                expect(commonRandom.pdf.probabilities.length).to.be.equal(20);
                expect(commonRandom.pdf.probabilities.length).to.be.equal(commonRandom.pdf.values.length);
                for(let i in commonRandom.pdf.probabilities) {
                    probSum += commonRandom.pdf.probabilities[i];
                }
                expect(probSum).to.be.closeTo(1, 0.001);
            });
            it('should has cdf function with 20 elements and last element equals to 1', () => {
                let commonRandom = Common.getInstance(sampleSequence);
                expect(commonRandom.cdf.probabilities).to.be.an('array');
                expect(commonRandom.cdf.probabilities[0]).to.be.a('number');
                expect(commonRandom.cdf.values).to.be.an('array');
                expect(commonRandom.cdf.values[0]).to.be.a('number');
                expect(commonRandom.cdf.probabilities.length).to.be.equal(20);
                expect(commonRandom.cdf.probabilities.length).to.be.equal(commonRandom.pdf.values.length);
                expect(commonRandom.cdf.probabilities[19]).to.be.closeTo(1, 0.001);
            });
        });
        // Tests for random input, but not distribution
        describe('With random input, but not distribution', () => {
            it('should has min value equals to 1', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.min).to.be.a('number');
                expect(commonRandom.min).to.be.closeTo(1, 0.001);
            });
            it('should has max value equals to 12', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.max).to.be.a('number');
                expect(commonRandom.max).to.be.closeTo(12, 0.001);
            });
            it('should has correct mean value equals to 5.761905', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.mean).to.be.a('number');
                expect(commonRandom.mean).to.be.closeTo(5.761905, 0.00001);
            });
            it('should has correct variance value equals to 11.190476', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.variance).to.be.a('number');
                expect(commonRandom.variance).to.be.closeTo(11.190476, 0.00001);
            });
            it('should has correct standard deviation value equals to 3.345216884', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.standard_deviation).to.be.a('number');
                expect(commonRandom.standard_deviation).to.be.closeTo(3.345216884, 0.00001);
            });
            it('should has correct mode values equals to [1, 4, 6]', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.mode).to.be.an('array');
                expect(commonRandom.mode[0]).to.be.closeTo(1, (commonRandom.max - commonRandom.min) / Math.floor(sampleRandomArray.length));
                expect(commonRandom.mode[1]).to.be.closeTo(4, (commonRandom.max - commonRandom.min) / Math.floor(sampleRandomArray.length));
                expect(commonRandom.mode[2]).to.be.closeTo(6, (commonRandom.max - commonRandom.min) / Math.floor(sampleRandomArray.length));
            });
            it('should has correct median value equals to 6 +/- accuracy', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.median).to.be.a('number');
                expect(commonRandom.median).to.be.closeTo(6, (commonRandom.max - commonRandom.min) / Math.floor(sampleRandomArray.length));
            });
            it('should has correct entropy value equals to 2.30592168 +/- accuracy', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.entropy).to.be.a('number');
                expect(commonRandom.entropy).to.be.closeTo(2.30592168, (commonRandom.max - commonRandom.min) / Math.floor(sampleRandomArray.length));
            });
            it('should has correct skewness value equals to 0.1431', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.skewness).to.be.a('number');
                expect(commonRandom.skewness).to.be.closeTo(0.1431, 0.0001);
            });
            it('should has correct kurtosis value equals to 1.931', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.kurtosis).to.be.a('number');
                expect(commonRandom.kurtosis).to.be.closeTo(1.931, 0.001);
            });
            it('should has pdf function with 21 elements and sum of them equals to 1', () => {
                let commonRandom = Common.getInstance(sampleRandomArray),
                    probSum = 0;
                expect(commonRandom.pdf.probabilities).to.be.an('array');
                expect(commonRandom.pdf.probabilities[0]).to.be.a('number');
                expect(commonRandom.pdf.values).to.be.an('array');
                expect(commonRandom.pdf.values[0]).to.be.a('number');
                expect(commonRandom.pdf.probabilities.length).to.be.equal(21);
                expect(commonRandom.pdf.probabilities.length).to.be.equal(commonRandom.pdf.values.length);
                for(let i in commonRandom.pdf.probabilities) {
                    probSum += commonRandom.pdf.probabilities[i];
                }
                expect(probSum).to.be.closeTo(1, 0.001);
            });
            it('should has cdf function with 21 elements and last element equals to 1', () => {
                let commonRandom = Common.getInstance(sampleRandomArray);
                expect(commonRandom.cdf.probabilities).to.be.an('array');
                expect(commonRandom.cdf.probabilities[0]).to.be.a('number');
                expect(commonRandom.cdf.values).to.be.an('array');
                expect(commonRandom.cdf.values[0]).to.be.a('number');
                expect(commonRandom.cdf.probabilities.length).to.be.equal(21);
                expect(commonRandom.cdf.probabilities.length).to.be.equal(commonRandom.pdf.values.length);
                expect(commonRandom.cdf.probabilities[20]).to.be.closeTo(1, 0.001);
            });
        });
        // Tests for uniform distribution
        describe('With uniform distribution a = 0, b = 10', () => {
            // generate uniform distribution
            let uniformArray = [];
            for(let i = 0; i < 50000; i += 1) {
                uniformArray[i] = Math.random() * 10;
            }
            it('should has min value close to 0', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray);
                expect(uniformArray.length).to.be.equal(50000);
                expect(uniformAnalyzer.min).to.be.a('number');
                expect(uniformAnalyzer.min).to.be.closeTo(0, 0.05);
            });
            it('should has min value close to 10', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray);
                expect(uniformArray.length).to.be.equal(50000);
                expect(uniformAnalyzer.max).to.be.a('number');
                expect(uniformAnalyzer.max).to.be.closeTo(10, 0.05);
            });
            it('should has mean value close to 5', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray);
                expect(uniformArray.length).to.be.equal(50000);
                expect(uniformAnalyzer.mean).to.be.a('number');
                expect(uniformAnalyzer.mean).to.be.closeTo(5, 0.05);
            });
            it('should has median value close to 5', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray);
                expect(uniformArray.length).to.be.equal(50000);
                expect(uniformAnalyzer.median).to.be.a('number');
                expect(uniformAnalyzer.median).to.be.closeTo(5, 0.1);
            });
            it('should has variance value close to 8.333', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray);
                expect(uniformArray.length).to.be.equal(50000);
                expect(uniformAnalyzer.variance).to.be.a('number');
                expect(uniformAnalyzer.variance).to.be.closeTo(8.333, 0.1);
            });
            it('should has skewness value close to 0', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray);
                expect(uniformArray.length).to.be.equal(50000);
                expect(uniformAnalyzer.skewness).to.be.a('number');
                expect(uniformAnalyzer.skewness).to.be.closeTo(0, 0.05);
            });
            it('should has entropy value close to log(10)', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray);
                expect(uniformArray.length).to.be.equal(50000);
                expect(uniformAnalyzer.entropy).to.be.a('number');
                expect(uniformAnalyzer.entropy).to.be.closeTo(Math.log(uniformAnalyzer.max - uniformAnalyzer.min), 0.05);
            });
            it('should has kurtosis value close to -6/5 + 3', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray);
                expect(uniformArray.length).to.be.equal(50000);
                expect(uniformAnalyzer.kurtosis).to.be.a('number');
                expect(uniformAnalyzer.kurtosis).to.be.closeTo(3 - (6 / 5), 0.05);
            });
            it('should has pdf function with 200 equal elements and sum of them equals to 1', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray),
                    probSum = 0;
                expect(uniformAnalyzer.pdf.probabilities).to.be.an('array');
                expect(uniformAnalyzer.pdf.probabilities[0]).to.be.a('number');
                expect(uniformAnalyzer.pdf.values).to.be.an('array');
                expect(uniformAnalyzer.pdf.values[0]).to.be.a('number');
                expect(uniformAnalyzer.pdf.probabilities.length).to.be.equal(200);
                expect(uniformAnalyzer.pdf.probabilities.length).to.be.equal(uniformAnalyzer.pdf.values.length);
                for(let i in uniformAnalyzer.pdf.probabilities) {
                    probSum += uniformAnalyzer.pdf.probabilities[i];
                    if(i >= uniformAnalyzer.pdf.probabilities.length - 1) {
                        expect(uniformAnalyzer.pdf.probabilities[i]).to.be.closeTo(0, 0.002);
                    } else {
                        expect(uniformAnalyzer.pdf.probabilities[i]).to.be.closeTo(0.005, 0.002);
                    }
                }
                expect(probSum).to.be.closeTo(1, 0.001);
            });
            it('should has cdf function with 200 elements and last element equals to 1', () => {
                let uniformAnalyzer = Common.getInstance(uniformArray);
                expect(uniformAnalyzer.cdf.probabilities).to.be.an('array');
                expect(uniformAnalyzer.cdf.probabilities[0]).to.be.a('number');
                expect(uniformAnalyzer.cdf.values).to.be.an('array');
                expect(uniformAnalyzer.cdf.values[0]).to.be.a('number');
                expect(uniformAnalyzer.cdf.probabilities.length).to.be.equal(200);
                expect(uniformAnalyzer.cdf.probabilities.length).to.be.equal(uniformAnalyzer.pdf.values.length);
                expect(uniformAnalyzer.cdf.probabilities[199]).to.be.closeTo(1, 0.001);
                expect(uniformAnalyzer.cdf.probabilities[0]).to.be.closeTo(0, 0.007);
            });
        });
        // Tests for non-uniform distribution
        describe('With non-uniform symmetric (normal mu = 1, sigma = 1) distribution', () => {
            let normalData = fs.readFileSync(__dirname + '/sample_normal.array').toString().split('\n'),
                normalArray = [],
                mu = 1,
                sigma = 1;
            for(let data of normalData) {
                normalArray.push(parseFloat(data.trim()));
            }
            it('should has minimum value less then mu - 3sigma', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
                expect(normalAnalyzer.min).to.be.a('number');
                expect(normalAnalyzer.min).to.be.at.most(mu - 3 * sigma);
            });
            it('should has maximum value more then mu + 3sigma', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
                expect(normalAnalyzer.max).to.be.a('number');
                expect(normalAnalyzer.max).to.be.at.least(mu + 3 * sigma);
            });
            it('should has mean value close to mu +/- accuracy', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
                expect(normalAnalyzer.mean).to.be.a('number');
                expect(normalAnalyzer.mean).to.be.closeTo(mu, 3 * sigma / normalAnalyzer.pdf.probabilities.length);
            });
            it('should has median value close to mu +/- accuracy', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
                expect(normalAnalyzer.median).to.be.a('number');
                expect(normalAnalyzer.median).to.be.closeTo(mu, 6 * sigma / normalAnalyzer.pdf.probabilities.length);
            });
            it('should has one mode value close to mu +/- accuracy', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
                expect(normalAnalyzer.mode.length).to.be.equal(1);
                expect(normalAnalyzer.mode[0]).to.be.a('number');
                expect(normalAnalyzer.mode[0]).to.be.closeTo(mu, 0.05);
            });
            it('should has variance value close to sigma^2 +/- accuracy', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
                expect(normalAnalyzer.variance).to.be.a('number');
                expect(normalAnalyzer.variance).to.be.closeTo(Math.pow(sigma, 2), 3 * sigma / normalAnalyzer.pdf.probabilities.length);
            });
            it('should has skewness value close to 0 +/- accuracy', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
                expect(normalAnalyzer.skewness).to.be.a('number');
                expect(normalAnalyzer.skewness).to.be.closeTo(0, 6 * sigma / normalAnalyzer.pdf.probabilities.length);
            });
            it('should has entropy value close to 0.5log(2 pi e sigma^2) +/- accuracy', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
                expect(normalAnalyzer.entropy).to.be.a('number');
                expect(normalAnalyzer.entropy).to.be.closeTo(0.5 * Math.log(Math.PI * Math.E * 2 * normalAnalyzer.variance), 3 * sigma / normalAnalyzer.pdf.probabilities.length);
            });
            it('should has kurtosis value close to 0 +/- accuracy', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
                expect(normalAnalyzer.kurtosis).to.be.a('number');
                expect(normalAnalyzer.kurtosis - 3).to.be.closeTo(0, 0.1);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let normalAnalyzer = Common.getInstance(normalArray),
                    sum = 0;
                expect(normalAnalyzer.pdf.probabilities).to.be.an('array');
                expect(normalAnalyzer.pdf.probabilities[0]).to.be.a('number');
                expect(normalAnalyzer.pdf.values).to.be.an('array');
                expect(normalAnalyzer.pdf.values[0]).to.be.a('number');
                expect(normalAnalyzer.pdf.probabilities.length).to.be.equal(200);
                expect(normalAnalyzer.pdf.values.length).to.be.equal(200);
                expect(normalAnalyzer.pdf.values.length).to.be.equal(normalAnalyzer.pdf.probabilities.length);
                for(let el of normalAnalyzer.pdf.probabilities) {
                    sum += el;
                }
                expect(sum).to.be.closeTo(1, 0.05);
            });
            it('should has sum of pdf from mu-sigma to mu+sigma close to 0.68', () => {
                let normalAnalyzer = Common.getInstance(normalArray),
                    sum = 0;
                for(let i in normalAnalyzer.pdf.values) {
                    if((normalAnalyzer.pdf.values[i] >= mu - sigma) && (normalAnalyzer.pdf.values[i] <= mu + sigma)) {
                        sum += normalAnalyzer.pdf.probabilities[i];
                    }
                }
                expect(sum).to.be.closeTo(0.68, 0.02);
            });
            it('should has sum of pdf from mu-2sigma to mu+2sigma close to 0.95', () => {
                let normalAnalyzer = Common.getInstance(normalArray),
                    sum = 0;
                for(let i in normalAnalyzer.pdf.values) {
                    if((normalAnalyzer.pdf.values[i] >= mu - 2 * sigma) && (normalAnalyzer.pdf.values[i] <= mu + 2 * sigma)) {
                        sum += normalAnalyzer.pdf.probabilities[i];
                    }
                }
                expect(sum).to.be.closeTo(0.95, 0.02);
            });
            it('should has sum of pdf from mu-3sigma to mu+3sigma close to 0.98', () => {
                let normalAnalyzer = Common.getInstance(normalArray),
                    sum = 0;
                for(let i in normalAnalyzer.pdf.values) {
                    if((normalAnalyzer.pdf.values[i] >= mu - 3 * sigma) && (normalAnalyzer.pdf.values[i] <= mu + 3 * sigma)) {
                        sum += normalAnalyzer.pdf.probabilities[i];
                    }
                }
                expect(sum).to.be.closeTo(0.98, 0.02);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let normalAnalyzer = Common.getInstance(normalArray);
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
        // Beta distribution
        describe('With non-uniform asymmetric (beta alpha = 2, beta = 5) distribution', () => {
            // prepare data
            let betaData = fs.readFileSync(__dirname + '/sample_beta.array').toString(),
                tempData = '',
                alpha = 2,
                beta = 5,
                betaArray;

            for(let i in betaData) {
                if(betaData[i] !== '\n' && betaData[i] !== ' ') {
                    tempData = tempData.concat(betaData[i]);
                }
            }
            betaArray = tempData.split(',').map(Number);

            it('should has minimum value close to zero', () => {
                let betaAnalyzer = Common.getInstance(betaArray);
                expect(betaAnalyzer.min).to.be.a('number');
                expect(betaAnalyzer.min).to.be.closeTo(0, 0.005);
            });
            it('should has maximum value close to 0.9 +/- 0.1', () => {
                let betaAnalyzer = Common.getInstance(betaArray);
                expect(betaAnalyzer.max).to.be.a('number');
                expect(betaAnalyzer.max).to.be.closeTo(0.9, 0.05);
            });
            it('should has mean value close to alpha / (alpha + beta)', () => {
                let betaAnalyzer = Common.getInstance(betaArray);
                expect(betaAnalyzer.mean).to.be.a('number');
                expect(betaAnalyzer.mean).to.be.closeTo(alpha / (alpha + beta), 0.005);
            });
            it('should has median value close to (alpha - 1/3) / (alpha + beta - 2/3)', () => {
                let betaAnalyzer = Common.getInstance(betaArray);
                expect(betaAnalyzer.median).to.be.a('number');
                expect(betaAnalyzer.median).to.be.closeTo((alpha - 0.33333) / (alpha + beta - 0.66667), 0.005);
            });
            it('should has one mode value close to (alpha - 1) / (alpha + beta - 2)', () => {
                let betaAnalyzer = Common.getInstance(betaArray);
                expect(betaAnalyzer.mode.length).to.be.equal(1);
                expect(betaAnalyzer.mode[0]).to.be.a('number');
                expect(betaAnalyzer.mode[0]).to.be.closeTo((alpha - 1) / (alpha + beta - 2), 0.02);
            });
            it('should has variance value close to 0.025510204', () => {
                let betaAnalyzer = Common.getInstance(betaArray);
                expect(betaAnalyzer.variance).to.be.a('number');
                expect(betaAnalyzer.variance).to.be.closeTo(0.025510204, 0.001);
            });
            it('should has skewness value close to 0.596284794', () => {
                let betaAnalyzer = Common.getInstance(betaArray);
                expect(betaAnalyzer.skewness).to.be.a('number');
                expect(betaAnalyzer.skewness).to.be.closeTo(0.596284794, 0.01);
            });
            it('should has entropy value close to -0.484777 +/- accuracy', () => {
                let betaAnalyzer = Common.getInstance(betaArray),
                    Utils = require('../lib/utils/utils'),
                    B = Utils.gamma(alpha) * Utils.gamma(beta) / Utils.gamma(alpha + beta),
                    entropyToCheck = Math.log(B) - (alpha - 1) * Utils.digamma(alpha) - (beta - 1) * Utils.digamma(beta) + (alpha + beta - 2) * Utils.digamma(alpha + beta);
                expect(betaAnalyzer.entropy).to.be.a('number');
                expect(betaAnalyzer.entropy).to.be.closeTo(entropyToCheck, 0.005);
            });
            it('should has kurtosis value close to 0 +/- accuracy', () => {
                let betaAnalyzer = Common.getInstance(betaArray),
                    alphaPBeta = alpha + beta,
                    kurtosisToCheck = 6 * (Math.pow(alpha-beta, 2) * (alphaPBeta + 1) - alpha * beta * (alphaPBeta + 2)) / (alpha * beta * (alphaPBeta + 2) * (alphaPBeta + 3));
                expect(betaAnalyzer.kurtosis).to.be.a('number');
                expect(betaAnalyzer.kurtosis - 3).to.be.closeTo(kurtosisToCheck, 0.03);
            });
            it('should has pdf array with 200 elements and sum of them close to 1', () => {
                let betaAnalyzer = Common.getInstance(betaArray),
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
                let betaAnalyzer = Common.getInstance(betaArray);
                expect(betaAnalyzer.pdf.probabilities).to.be.an('array');
                expect(betaAnalyzer.pdf.probabilities[0]).to.be.a('number');
                expect(betaAnalyzer.pdf.probabilities[0]).to.be.closeTo(0, 0.01);
                expect(betaAnalyzer.pdf.probabilities[199]).to.be.closeTo(0, 0.01);
            });
            it('should has cdf array with 200 elements and last element close to 1', () => {
                let betaAnalyzer = Common.getInstance(betaArray);
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
});

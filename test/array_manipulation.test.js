/**
 * Tests for array manipulation methods
 * Created by Alexey S. Kiselev
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    fs = require('fs'),
    prng = require('../lib/prng/prngProxy').default,
    smoothProxy = require('../lib/array_manipulation/smooth').default;

chai.should();
prng.seed();

describe('Array manipulation methods', () => {
    beforeEach(() => {
        prng.seed();
    });
    before(() => {
        prng.seed();
    });
    describe('Sample', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Sample = require('../lib/array_manipulation/sample').default;
        it('requires at least one correct argument', () => {
            let zeroParams = () => {
                let sample = new Sample();
                return sample.getSample();
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let sample = new Sample();
                return sample.getSample([1, 2, 3, 4, 5]);
            };
            oneParam.should.not.throw(Error);

            let badParam1 =  () => {
                let sample = new Sample();
                return sample.getSample(1);
            };
            badParam1.should.throw(TypeError);

            let badParam2 = () => {
                let sample = new Sample();
                return sample.getSample([1, 2, 3], -1);
            };
            badParam2.should.throw(Error);

            let badParam3 = () => {
                let sample = new Sample();
                return sample.getSample([1, 2, 3], 'a');
            };
            badParam3.should.throw(Error);

            let goodParams = () => {
                let sample = new Sample();
                return sample.getSample([1, 2, 3, 4], 2);
            };
            goodParams.should.not.throw(Error);
        });
        it('returns the same type as input with the length of k', () => {
            let sample = new Sample(),
                input_array = [1, 2, 3, 4, 5, 6, 7, 8, 9],
                input_string = 'abcdefghijklmnopqrst',
                input_object = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6};
            expect(sample.getSample(input_array, 2)).to.be.a('array');
            sample.getSample(input_array, 2).length.should.equal(2);
            expect(sample.getSample(input_string, 2)).to.be.a('string');
            sample.getSample(input_string, 2).length.should.equal(2);
            expect(sample.getSample(input_object, 2)).to.be.a('object');
            Object.keys(sample.getSample(input_string, 2)).length.should.equal(2);
        });
        it('should generate different results each time for k/n < 0.2', () => {
            let sample = new Sample(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                samples = {};
            prng.seed();
            for(let i = 0; i < 1000; i += 1) {
                samples[sample.getSample(input_str, 4)] = 1;
            }
            expect(Object.keys(samples).length).to.be.at.least(995);
        });
        it('should select each element with the same probability for k/n < 0.2', function(done) {
            this.timeout(480000);
            let sample = new Sample(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                letters = {},
                temp;
            prng.seed();
            // generate letters dict
            for(let letter of input_str) {
                letters[letter] = 0;
            }
            // generate samples
            for(let i = 0; i < 10000000; i += 1) {
                temp = sample.getSample(input_str, 5);
                for(let ch of temp) {
                    letters[ch] += 1;
                }
            }
            let valueToCompare = 5 * 10000000 / 62;
            for(let key of Object.keys(letters)) {
                expect(letters[key]).to.be.closeTo(valueToCompare, 0.015 * valueToCompare);
            }
            done();
        });
        it('should generate different results each time for k/n > 0.2', () => {
            let sample = new Sample(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                samples = {};
            prng.seed();
            for(let i = 0; i < 1000; i += 1) {
                samples[sample.getSample(input_str, 16)] = 1;
            }
            expect(Object.keys(samples).length).to.be.at.least(995);
        });
        it('should select each element with the same probability for k/n > 0.2', function(done) {
            this.timeout(480000);
            let sample = new Sample(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                letters = {},
                temp;
            prng.seed();
            // generate letters dict
            for(let letter of input_str) {
                letters[letter] = 0;
            }
            // generate samples
            for(let i = 0; i < 10000000; i += 1) {
                temp = sample.getSample(input_str, 16);
                for(let ch of temp) {
                    letters[ch] += 1;
                }
            }
            let valueToCompare = 16 * 10000000 / 62;
            for(let key of Object.keys(letters)) {
                expect(letters[key]).to.be.closeTo(valueToCompare, 0.015 * valueToCompare);
            }
            done();
        });
        it('should keep correct order by default and shouldn\'t with shuffle', function(done) {
            this.timeout(480000);
            let sample = new Sample(),
                input_arr = [],
                temp,
                correctOrders = 0;
            prng.seed();
            // function for checking correct order
            let checkOrder = (input) => {
                for(let i = 1; i < input.length; i += 1) {
                    if(input[i] < input[i - 1]) {
                        return false;
                    }
                }
                return true;
            };

            // populate input array
            for(let i = 1; i <= 20000; i += 1) {
                input_arr[i - 1] = i;
            }
            for(let j = 0; j < 20000; j += 1) {
                temp = sample.getSample(input_arr, 1000);
                if(checkOrder(temp)) {
                    correctOrders += 1;
                }
            }
            expect(correctOrders).to.be.equal(20000);

            correctOrders = 0;
            for(let j = 0; j < 20000; j += 1) {
                temp = sample.getSample(input_arr, 1000, {shuffle: true});
                if(checkOrder(temp)) {
                    correctOrders += 1;
                }
            }
            expect(correctOrders).to.be.at.most(50);
            done();
        });
        it('should return the input with k greater then input length', () => {
            let sample = new Sample(),
                input = [1, 2, 3, 5, 6, 7, 8, 9, 5],
                temp,
                checkInput = (input, arrToCompare) => {
                    for(let i = 0; i < input.length; i += 1) {
                        if(input[i] !== arrToCompare[i]) {
                            return false;
                        }
                    }
                    return true;
                };
            temp = sample.getSample(input, input.length + 5);
            expect(input.length).to.be.equal(temp.length);
            expect(checkInput(input, temp)).to.be.equal(true);
        });
        it('should not mutate the original input', function(done) {
            this.timeout(480000);
            let sample = new Sample(),
                input_arr = [],
                correctOrders = 0,
                temp; // eslint-disable-line no-unused-vars

            // function for checking correct order
            let checkOrder = (input) => {
                for(let i = 1; i <= input.length; i += 1) {
                    if(input[i - 1] !== i) {
                        return false;
                    }
                }
                return true;
            };

            // populate input array
            for(let i = 1; i <= 20000; i += 1) {
                input_arr[i - 1] = i;
            }

            for(let j = 0; j < 20000; j += 1) {
                temp = sample.getSample(input_arr, 1000);
                if(checkOrder(input_arr)) {
                    correctOrders += 1;
                }
            }
            expect(correctOrders).to.be.equal(20000);

            correctOrders = 0;
            for(let j = 0; j < 20000; j += 1) {
                temp = sample.getSample(input_arr, 5000);
                if(checkOrder(input_arr)) {
                    correctOrders += 1;
                }
            }
            expect(correctOrders).to.be.equal(20000);
            done();
        });
    });
    describe('Shuffle', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Shuffle = require('../lib/array_manipulation/shuffle').default;
        it('requires at least one correct argument', () => {
            let zeroParams = () => {
                let shuffle = new Shuffle();
                return shuffle.getPermutation();
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let shuffle = new Shuffle();
                return shuffle.getPermutation([1, 2, 3, 4, 5]);
            };
            oneParam.should.not.throw(Error);

            let badParam1 =  () => {
                let shuffle = new Shuffle();
                return shuffle.getPermutation(1);
            };
            badParam1.should.throw(TypeError);

            let badParam2 =  () => {
                let shuffle = new Shuffle();
                return shuffle.getPermutation({1: 2, 3: 4, 5: 6});
            };
            badParam2.should.throw(TypeError);
        });
        it('returns the same type as input with the same length', () => {
            let shuffle = new Shuffle(),
                input_array = [1, 2, 3, 4, 5, 6, 7, 8, 9],
                input_string = 'abcdefghijklmnopqrst';
            expect(shuffle.getPermutation(input_array)).to.be.a('array');
            shuffle.getPermutation(input_array).length.should.equal(input_array.length);
            expect(shuffle.getPermutation(input_string)).to.be.a('string');
            shuffle.getPermutation(input_string).length.should.equal(input_string.length);
        });
        it('should generate different results each time', function (done) {
            this.timeout(480000);
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                samples = {},
                temp;
            prng.seed();
            for(let i = 0; i < 100000; i += 1) {
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                temp = shuffle.getPermutation(input_str);
                samples[temp] = 1;
            }
            expect(Object.keys(samples).length).to.be.at.least(99990);
            done();
        });
        it('should place each element on each position with the same probability', function(done) {
            this.timeout(480000);
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyz',
                letters = {},
                temp;
            prng.seed();
            // generate letters dict
            for(let letter of input_str) {
                letters[letter] = {};
                for(let i = 0; i < input_str.length; i += 1) {
                    letters[letter][i] = 0;
                }
            }
            // generate samples
            for(let i = 0; i < 10000000; i += 1) {
                input_str = 'abcdefghijklmnopqrstuvwxyz';
                temp = shuffle.getPermutation(input_str);
                for(let j = 0; j < temp.length; j += 1) {
                    letters[temp[j]][j] += 1;
                }
            }
            let valueToCompare = 10000000 / 26;
            for(let key of Object.keys(letters)) {
                for(let j = 0; j < letters[key].length; j += 1) {
                    expect(letters[key][j]).to.be.closeTo(valueToCompare, 0.015 * valueToCompare);
                }
            }
            done();
        });
        it('should select each element only once', function (done) {
            this.timeout(480000);
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyz',
                letters = {},
                checkLetters = (input) => {
                    let keys = Object.keys(input);
                    for(let i = 0; i < keys.length; i += 1) {
                        if(input[keys[i]] > 1) {
                            return false;
                        }
                    }
                    return true;
                },
                temp;
            prng.seed();
            for(let i = 0; i < 100000; i += 1) {
                letters = {};
                input_str = 'abcdefghijklmnopqrstuvwxyz';
                temp = shuffle.getPermutation(input_str);
                for(let j = 0; j < temp.length; j += 1) {
                    if(letters[temp[j]]) {
                        letters[temp[j]] += 1;
                    } else {
                        letters[temp[j]] = 1;
                    }
                }
                expect(temp.length).to.be.equal(input_str.length);
                expect(checkLetters(letters)).to.be.equal(true);
            }
            done();
        });
    });
    describe('Derange', () => {
        beforeEach(() => {
            prng.seed();
        });
        before(() => {
            prng.seed();
        });
        let Shuffle = require('../lib/array_manipulation/shuffle').default;
        it('requires at least one correct argument', () => {
            let zeroParams = () => {
                let shuffle = new Shuffle();
                return shuffle.getDerangement();
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let shuffle = new Shuffle();
                return shuffle.getDerangement([1, 2, 3, 4, 5]);
            };
            oneParam.should.not.throw(Error);

            let badParam1 =  () => {
                let shuffle = new Shuffle();
                return shuffle.getDerangement(1);
            };
            badParam1.should.throw(TypeError);

            let badParam2 =  () => {
                let shuffle = new Shuffle();
                return shuffle.getDerangement({1: 2, 3: 4, 5: 6});
            };
            badParam2.should.throw(TypeError);
        });
        it('returns the same type as input with the same length', () => {
            let shuffle = new Shuffle(),
                input_array = [1, 2, 3, 4, 5, 6, 7, 8, 9],
                input_string = 'abcdefghijklmnopqrst';
            expect(shuffle.getDerangement(input_array)).to.be.a('array');
            shuffle.getDerangement(input_array).length.should.equal(input_array.length);
            expect(shuffle.getDerangement(input_string)).to.be.a('string');
            shuffle.getDerangement(input_string).length.should.equal(input_string.length);
        });
        it('should generate different results each time', function (done) {
            this.timeout(480000);
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                samples = {},
                temp;
            prng.seed();
            for(let i = 0; i < 100000; i += 1) {
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                temp = shuffle.getDerangement(input_str);
                samples[temp] = 1;
            }
            expect(Object.keys(samples).length).to.be.at.least(99990);
            done();
        });
        it('should place each element on each position with the same probability', function(done) {
            this.timeout(960000);
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyz',
                letters = {},
                temp;
            prng.seed();
            // generate letters dict
            for(let letter of input_str) {
                letters[letter] = {};
                for(let i = 0; i < input_str.length; i += 1) {
                    letters[letter][i] = 0;
                }
            }
            // generate samples
            for(let i = 0; i < 10000000; i += 1) {
                input_str = 'abcdefghijklmnopqrstuvwxyz';
                temp = shuffle.getDerangement(input_str);
                for(let j = 0; j < temp.length; j += 1) {
                    letters[temp[j]][j] += 1;
                }
            }
            let valueToCompare = 10000000 / 26;
            for(let key of Object.keys(letters)) {
                for(let j = 0; j < letters[key].length; j += 1) {
                    expect(letters[key][j]).to.be.closeTo(valueToCompare, 0.015 * valueToCompare);
                }
            }
            done();
        });
        it('should select each element only once', function (done) {
            this.timeout(480000);
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyz',
                letters = {},
                checkLetters = (input) => {
                    let keys = Object.keys(input);
                    for(let i = 0; i < keys.length; i += 1) {
                        if(input[keys[i]] > 1) {
                            return false;
                        }
                    }
                    return true;
                },
                temp;
            prng.seed();
            for(let i = 0; i < 100000; i += 1) {
                letters = {};
                input_str = 'abcdefghijklmnopqrstuvwxyz';
                temp = shuffle.getDerangement(input_str);
                for(let j = 0; j < temp.length; j += 1) {
                    if(letters[temp[j]]) {
                        letters[temp[j]] += 1;
                    } else {
                        letters[temp[j]] = 1;
                    }
                }
                expect(temp.length).to.be.equal(input_str.length);
                expect(checkLetters(letters)).to.be.equal(true);
            }
            done();
        });
        it('should not has fixed points', function (done) {
            this.timeout(480000);
            prng.seed();
            let shuffle = new Shuffle(),
                input_arr = [],
                checkDerangement = (input) => {
                    for(let i = 0; i < input.length; i += 1) {
                        if(input[i] === i + 1) {
                            return false;
                        }
                    }
                    return true;
                },
                temp;

            // Initialize input array
            for(let i = 0; i < 12; i += 1) {
                input_arr[i] = i + 1;
            }

            for(let i = 0; i < 1000000; i += 1) {
                input_arr = [];
                for(let i = 0; i < 12; i += 1) {
                    input_arr[i] = i + 1;
                }
                temp = shuffle.getDerangement(input_arr);
                expect(temp.length).to.be.equal(12);
                expect(checkDerangement(temp)).to.be.equal(true);
            }
            done();
        });
    });
    describe('Winsorize', () => {
        let Winsorize = require('../lib/array_manipulation/winsorize').default;
        it('requires at least two correct arguments', () => {
            let zeroParams = () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize();
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize([1, 2, 3, 4, 5]);
            };
            oneParam.should.not.throw(Error);

            let badParam1 =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize(1);
            };
            badParam1.should.throw(TypeError);

            let badParam2 =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize({1: 2, 3: 4, 5: 6});
            };
            badParam2.should.throw(TypeError);

            let badParam3 =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize([1, 2, 3, 4, 5], 1);
            };
            badParam3.should.throw(Error);

            let badParam4 =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize([1, 2, 3, 4, 5], -1);
            };
            badParam4.should.throw(Error);

            let badParam5 =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize([1, 2, 3, 4, 5], ['a', 0.9]);
            };
            badParam5.should.throw(Error);

            let badParam6 =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize([1, 2, 3, 4, 5], [-1, 0.9]);
            };
            badParam6.should.throw(Error);

            let badParam7 =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize([1, 2, 3, 4, 5], [0.2, 1.9]);
            };
            badParam7.should.throw(Error);

            let badParam8 =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize([1, 2, 3, 4, 5], [0.6, 0.4]);
            };
            badParam8.should.throw(Error);

            let goodParams2 =  () => {
                let winsorize = new Winsorize();
                return winsorize.winsorize([1, 2, 3, 4, 5], [0.2, 0.6]);
            };
            goodParams2.should.not.throw(Error);
        });
        it('returns the same type as input with the same length', () => {
            let winsorize = new Winsorize(),
                input_array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            expect(winsorize.winsorize(input_array)).to.be.a('array');
            winsorize.winsorize(input_array).length.should.equal(input_array.length);
        });
        it('returns correctly winsorized array', function(done) {
            this.timeout(480000);
            let winsorize = new Winsorize(),
                beforeData = fs.readFileSync(__dirname + '/winsorize_before.data').toString().trim().split('\n'),
                afterData = fs.readFileSync(__dirname + '/winsorize_after.data').toString().trim().split('\n'),
                limitsData = fs.readFileSync(__dirname + '/winsorize_limits.data').toString().trim().split('\n'),
                n = beforeData.length,
                beforeArr,
                afterArr,
                limit,
                compareArrays = (arrA, arrB) => {
                    for(let i = 0; i < arrA.length; i += 1) {
                        if(arrA[i] !== arrB[i]) {
                            return false;
                        }
                    }
                    return true;
                },
                winsorized;

            for(let i = 0; i < n; i += 1) {
                beforeArr = beforeData[i].split(',').map((el) => parseInt(el));
                afterArr = afterData[i].split(',').map((el) => parseInt(el));
                limit = parseFloat(limitsData[i]);
                winsorized = winsorize.winsorize(beforeArr, limit);
                compareArrays(winsorized, afterArr).should.equal(true);
            }
            done();
        });
        it('should mutate input array for mutate=true and not - for mutate=false', () => {
            let winsorize = new Winsorize(),
                beforeData1 = [676,952,721,733,510,78,554,890,692,532,715,442,751,288,366,530,47,181,492,254,246,499,715,663,198,54,598,114,104,246,52,840,897,300,3,578,308,426,153,160,101,884,297,809,701,278,298,249,415,890,910,586,45,158,473,225,631,258,995,371,748,74,769,533,374,589,130,902,67,606,933,745,657,807,70,464,742,171,411,763,890,985,253,771,401,810,103,537,971,231,637,604,204,486,462,775,440,390,223],
                beforeData2 = [176,111,967,806,202,742,813,165,306,800,318,373,741,105,224,492,918,80,795,781,975,581,105,671,537,934,467,797,197,605,243,429,307,348,62,28,277,722,792,811,38,817,867,749,167,823,483,656,919,475,119,307,38,166,69,965,334,240,313,922,794,93,892,891,243,487,696,909,991,392,62,631,47,131,330,159,943,974,302,465,565,324,85,446,115,249,312,978,121,916,594,716,674,168,550,756,551,64,550],
                limit1 = 0.14,
                limit2 = 0.28,
                afterData1 = [676,810,721,733,510,130,554,810,692,532,715,442,751,288,366,530,130,181,492,254,246,499,715,663,198,130,598,130,130,246,130,810,810,300,130,578,308,426,153,160,130,810,297,809,701,278,298,249,415,810,810,586,130,158,473,225,631,258,810,371,748,130,769,533,374,589,130,810,130,606,810,745,657,807,130,464,742,171,411,763,810,810,253,771,401,810,130,537,810,231,637,604,204,486,462,775,440,390,223],
                afterData2 = [240,240,756,756,240,742,756,240,306,756,318,373,741,240,240,492,756,240,756,756,756,581,240,671,537,756,467,756,240,605,243,429,307,348,240,240,277,722,756,756,240,756,756,749,240,756,483,656,756,475,240,307,240,240,240,756,334,240,313,756,756,240,756,756,243,487,696,756,756,392,240,631,240,240,330,240,756,756,302,465,565,324,240,446,240,249,312,756,240,756,594,716,674,240,550,756,551,240,550],
                compareArrays = (arrA, arrB) => {
                    for(let i = 0; i < arrA.length; i += 1) {
                        if(arrA[i] !== arrB[i]) {
                            return false;
                        }
                    }
                    return true;
                };
            // mutate = true
            compareArrays(beforeData1, afterData1).should.equal(false);
            winsorize.winsorize(beforeData1, limit1, true);
            compareArrays(beforeData1, afterData1).should.equal(true);
            // mutate = false
            compareArrays(beforeData2, afterData2).should.equal(false);
            winsorize.winsorize(beforeData2, limit2, false);
            compareArrays(beforeData2, afterData2).should.equal(false);
        });
    });
    describe('k-fold', () => {
        const KFold = require('../lib/array_manipulation/kfold').default;
        const generateInput = () => {
            const res = [];
            const n = 1000 + Math.floor(prng.next() * 9000);
            for (let i = 0; i < n; i += 1) {
                res[i] = Math.floor(prng.next() * 10000);
            }
            return res;
        };
        it('requires at least two correct arguments', () => {
            let zeroParams = () => {
                let kfold = new KFold();
                return kfold.getKFold();
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let kfold = new KFold();
                return kfold.getKFold([1, 2, 3, 4, 5]);
            };
            oneParam.should.throw(Error);

            let badParam1 =  () => {
                let kfold = new KFold();
                return kfold.getKFold(1);
            };
            badParam1.should.throw(TypeError);

            let badParam2 =  () => {
                let kfold = new KFold();
                return kfold.getKFold({1: 2, 3: 4, 5: 6});
            };
            badParam2.should.throw(TypeError);

            let goodParams =  () => {
                let kfold = new KFold();
                return kfold.getKFold([1, 2, 3, 4, 5], 2);
            };
            goodParams.should.not.throw(Error);

            let badParam3 =  () => {
                let kfold = new KFold();
                return kfold.getKFold([1, 2, 3, 4, 5], -1);
            };
            badParam3.should.throw(Error);

            let badParam4 = () => {
                let kfold = new KFold();
                return kfold.getKFold([1, 2, 3, 4, 5], ['a', 0.9]);
            };
            badParam4.should.throw(Error);

            let badParam5 = () => {
                let kfold = new KFold();
                return kfold.getKFold([1, 2, 3, 4, 5], 10);
            };
            badParam5.should.throw(Error);
        });
        it('requires correct options', () => {
            let wrongType = () => {
                let kfold = new KFold();
                return kfold.getKFold([1, 2, 3, 4, 5], 2, {
                    type: 'abc'
                });
            };
            wrongType.should.throw(Error);

            let goodType = () => {
                let kfold = new KFold();
                return kfold.getKFold([1, 2, 3, 4, 5], 2, {
                    type: 'list'
                });
            };
            goodType.should.not.throw(Error);

            let goodType2 = () => {
                let kfold = new KFold();
                return kfold.getKFold([1, 2, 3, 4, 5], 2, {
                    type: 'set'
                });
            };
            goodType2.should.not.throw(Error);
        });
        it('should have exactly k folds', function(done) {
            this.timeout(480000);
            const kfold = new KFold();
            let randomInput;
            let res;
            let k;
            for (let i = 0; i < 10000; i += 1) {
                randomInput = generateInput();
                k = 2 + Math.floor(randomInput.length * prng.next() * 0.95);
                res = kfold.getKFold(randomInput, k, {type: 'list'});
                res.length.should.equal(k);
            }
            done();
        });
        it('should have folds differ at most one element', function(done) {
            this.timeout(480000);
            const kfold = new KFold();
            let randomInput;
            let res;
            let k;
            const checkFolds = (folds) => {
                let max = 0;
                let min = Infinity;
                for (let i = 0; i < folds.length; i += 1) {
                    max = Math.max(max, folds[i].length);
                    min = Math.min(min, folds[i].length);
                }

                return max - min <= 1;
            };
            for (let i = 0; i < 10000; i += 1) {
                randomInput = generateInput();
                k = 2 + Math.floor(randomInput.length * prng.next() * 0.95);
                res = kfold.getKFold(randomInput, k, {type: 'list'});
                checkFolds(res).should.equal(true);
            }
            done();
        });
        it('should have folds with sum of elements equals to input length', function(done) {
            this.timeout(480000);
            const kfold = new KFold();
            let randomInput;
            let res;
            let k;
            const checkFolds = (folds) => {
                let res = 0;
                for (let i = 0; i < folds.length; i += 1) {
                    res += folds[i].length;
                }

                return res;
            };
            for (let i = 0; i < 10000; i += 1) {
                randomInput = generateInput();
                k = 2 + Math.floor(randomInput.length * prng.next() * 0.95);
                res = kfold.getKFold(randomInput, k, {type: 'list'});
                checkFolds(res).should.equal(randomInput.length);
            }
            done();
        });
        it('should have correct output structure for type "crossvalidation"', () => {
            const kfold = new KFold();
            const randomInput = generateInput();
            const res = kfold.getKFold(randomInput, 10, {
                type: 'crossvalidation'
            });

            expect(res.length).to.be.equal(10);
            expect(Array.isArray(res)).to.be.equal(true);
            expect(res[0].id).to.be.equal(0);
            expect(res[0].test).to.be.not.equal(undefined);
            expect(res[0].data).to.be.not.equal(undefined);
            expect(Object.keys(res[0]).length).to.be.equal(3);
            expect(Array.isArray(res[0].test)).to.be.equal(true);
            expect(Array.isArray(res[0].data)).to.be.equal(true);
            for (let i = 0; i < res.length; i += 1) {
                expect(res[i].test.length + res[i].data.length).to.be.equal(randomInput.length);
            }
        });
        it('should generate correct data for type "crossvalidation"', function(done) {
            this.timeout(480000);
            const kfold = new KFold();
            let input = [];
            let res;
            const checkExistance = (data, test) => {
                let ht = {};
                let fail = false;
                for (let i = 0; i < test.length; i += 1) {
                    ht[test[i]] = 1;
                }
                for (let i = 0; i < data.length; i += 1) {
                    if (ht[data[i]]) {
                        fail = true;
                        break;
                    }
                }
                expect(fail).to.be.equal(false);
            };

            const checkUniqueness = (data, test) => {
                const ht = {};
                for (let i = 0; i < data.length; i += 1) {
                    ht[data[i]] = 1;
                }
                
                for (let i = 0; i < test.length; i += 1) {
                    ht[test[i]] = 1;
                }

                expect(Object.keys(ht).length).to.be.equal(data.length + test.length);
            };

            for (let i = 0; i < 5000; i += 1) {
                input[i] = i;
            }

            for (let i = 0; i < 400; i += 1) {
                res = kfold.getKFold(input, 200, {
                    type: 'crossvalidation'
                });

                for (let j = 0; j < res.length; j += 1) {
                    checkUniqueness(res[j].data, res[j].test);
                    checkExistance(res[j].data, res[j].test);
                }
            }

            done();
        });
    });
    describe('Smooth', () => {
        const data = [];
        // generate data
        for (let i = 0; i < 100; i += 1) {
            data[i] = Math.random() * 200;
        }
        describe('SmoothProxy', () => {
            it('should have .smooth and .smoothSync methods', () => {
                expect(smoothProxy).to.have.property('smooth');
                expect(smoothProxy).to.respondsTo('smooth');
                expect(smoothProxy).to.have.property('smoothSync');
                expect(smoothProxy).to.respondsTo('smoothSync');
            });
            it('.smooth method should return result with same size', () => {
                const res = smoothProxy.smoothSync(data);
                expect(Array.isArray(res)).to.be.equal(true);
                expect(res.length).to.be.equal(data.length);
            });
            it('.smooth method should be asynchronous', (done) => {
                let smoothPromise = smoothProxy.smooth(data);
                smoothPromise.then((res) => {
                    expect(res.length).to.be.equal(100);
                    done();
                });
            });
            it('should throw error for data with too small size', () => {
                let badDataSize = () => {
                    return smoothProxy.smoothSync([1, 2]);
                };
                badDataSize.should.throw(Error);

                let goodDataSize = () => {
                    return smoothProxy.smoothSync([1, 2, 3, 4, 5, 6]);
                };
                goodDataSize.should.not.throw(Error);
            });
            it('should throw Error with bad non-allowed algorithm', () => {
                let badAlgorithm = () => {
                    return smoothProxy.smoothSync([1, 2, 3, 4, 5], {
                        algorithm: 'anfsgskfsdmf'
                    });
                };
                badAlgorithm.should.throw(Error);

                let goodAlgorithm = () => {
                    return smoothProxy.smoothSync([1, 2, 3, 4, 5, 6], {
                        algorithm: 'moving_average'
                    });
                };
                goodAlgorithm.should.not.throw(Error);

                expect(smoothProxy.getDefaultAlgorithmName()).to.be.equal('moving_average');
            });
            it('should return diff data for options.diff=true', () => {
                const res = smoothProxy.smoothSync(data, {
                    diff: true
                });
                expect(res).to.have.property('smoothData');
                expect(res.smoothData.length).to.be.equal(data.length);
                expect(res).to.have.property('diff');
                expect(res.diff).to.have.property('diffData');
                expect(res.diff.diffData.length).to.be.equal(data.length);
                expect(res.diff).to.have.property('min');
                expect(res.diff).to.have.property('variance');
                expect(res.diff).to.have.property('quartiles');
            });
        });
        describe('Moving average algorithm', () => {
            smoothProxy.setSmoothAlgorithm('moving_average');
            const movingAverage = smoothProxy._currentSmoothAlgorithm;
            expect(movingAverage.getName()).to.be.equal('Moving Average');
            it('should have .smooth method', () => {
                expect(movingAverage).to.have.property('smooth');
                expect(movingAverage).to.respondsTo('smooth');
            });
            it('should not throw error for all policies', () => {
                const policies = movingAverage._policies;
                for(let p of Object.keys(policies)) {
                    let res = () => {
                        let r = movingAverage.smooth(data, {
                            policy: p
                        });
                        expect(r.length).to.be.equal(data.length);
                        for(let i = 0; i < r.length; i += 1) {
                            if (typeof r[i] !== 'number') {
                                throw new Error();
                            }
                        }
                    };
                    res.should.not.throw(Error);
                }
                // empty options
                let resEmptyOptions = () => {
                    let r = movingAverage.smooth(data);
                    expect(r.length).to.be.equal(data.length);
                    for(let i = 0; i < r.length; i += 1) {
                        if (typeof r[i] !== 'number') {
                            throw new Error();
                        }
                    }
                };
                resEmptyOptions.should.not.throw(Error);
            });
            it('should throw error with wrong options', () => {
                const badOptions1 = () => {
                    movingAverage.smooth(data, {
                        weights: [0.1, 0.3, 0.4]
                    });
                };
                badOptions1.should.throw(Error);
                const badOptions2 = () => {
                    movingAverage.smooth(data, {
                        weights: [0.1, 0.3, 0.4, 0.4]
                    });
                };
                badOptions2.should.throw(Error);
                const goodOptions1 = () => {
                    let r = movingAverage.smooth(data, {
                        weights: [0.1, 0.3, 0.4, 0.1, 0.1]
                    });
                    expect(r.length).to.be.equal(data.length);
                };
                goodOptions1.should.not.throw(Error);
                const badOptions3 = () => {
                    movingAverage.smooth(data, {
                        weights: 'abc'
                    });
                };
                badOptions3.should.throw(Error);
                const badOptions4 = () => {
                    movingAverage.smooth(data, {
                        weights: 1
                    });
                };
                badOptions4.should.throw(Error);
                const badOptions5 = () => {
                    movingAverage.smooth(data, {
                        weights: []
                    });
                };
                badOptions5.should.throw(Error);
                const badOptions6 = () => {
                    movingAverage.smooth(data, {
                        weights: [0.1, 0.2, 0.4, 0.2, 0.1],
                        centerIndex: 'abc'
                    });
                };
                badOptions6.should.throw(Error);
                const badOptions7 = () => {
                    movingAverage.smooth(data, {
                        weights: [0.1, 0.2, 0.4, 0.2, 0.1],
                        centerIndex: -1
                    });
                };
                badOptions7.should.throw(Error);
                const badOptions8 = () => {
                    movingAverage.smooth(data, {
                        weights: [0.1, 0.2, 0.4, 0.2, 0.1],
                        centerIndex: 5
                    });
                };
                badOptions8.should.throw(Error);
                const goodOptions2 = () => {
                    let r = movingAverage.smooth(data, {
                        weights: [0.1, 0.2, 0.4, 0.2, 0.1],
                        centerIndex: 4
                    });
                    expect(r.length).to.be.equal(data.length);
                };
                goodOptions2.should.not.throw(Error);
                const goodOptions3 = () => {
                    let r = movingAverage.smooth(data, {
                        weights: [0.1, 0.2, 0.4, 0.2, 0.1],
                        centerIndex: 0
                    });
                    expect(r.length).to.be.equal(data.length);
                };
                goodOptions3.should.not.throw(Error);
                const goodOptions4 = () => {
                    let r = movingAverage.smooth(data, {
                        order: 3
                    });
                    expect(r.length).to.be.equal(data.length);
                };
                goodOptions4.should.not.throw(Error);
                const badOptions9 = () => {
                    movingAverage.smooth(data, {
                        order: 1
                    });
                };
                badOptions9.should.throw(Error);
                const badOptions10 = () => {
                    movingAverage.smooth(data, {
                        order: 0
                    });
                };
                badOptions10.should.throw(Error);
                const badOptions11 = () => {
                    movingAverage.smooth(data, {
                        order: -1
                    });
                };
                badOptions11.should.throw(Error);
                const badOptions12 = () => {
                    movingAverage.smooth(data, {
                        order: [0, 1]
                    });
                };
                badOptions12.should.throw(Error);
                const badOptions13 = () => {
                    movingAverage.smooth(data, {
                        order: 'abc'
                    });
                };
                badOptions13.should.throw(Error);
                const badOptions14 = () => {
                    movingAverage.smooth([1, 2, 3, 4], {
                        order: 5
                    });
                };
                badOptions14.should.throw(Error);
                const badOptions15 = () => {
                    movingAverage.smooth([1, 2, 3, 4], {
                        weights: [0.1, 0.2, 0.4, 0.2, 0.1]
                    });
                };
                badOptions15.should.throw(Error);
            });
            it('should not throw error for small data size', () => {
                const goodF1 = () => {
                    movingAverage.smooth([1, 2, 3], {
                        weights: [0.3, 0.3, 0.4]
                    });
                };
                goodF1.should.not.throw(Error);
                const goodF2 = () => {
                    movingAverage.smooth([1, 2, 3, 4], {
                        weights: [0.3, 0.3, 0.4]
                    });
                };
                goodF2.should.not.throw(Error);
                const goodF3 = () => {
                    movingAverage.smooth([1, 2, 3, 4, 5], {
                        weights: [0.3, 0.3, 0.4]
                    });
                };
                goodF3.should.not.throw(Error);
                const goodF4 = () => {
                    movingAverage.smooth([1, 2, 3, 4, 5], {
                        weights: [0.2, 0.3, 0.3, 0.2]
                    });
                };
                goodF4.should.not.throw(Error);
                const goodF5 = () => {
                    movingAverage.smooth([1, 2, 3, 4, 5, 6], {
                        weights: [0.2, 0.3, 0.3, 0.2]
                    });
                };
                goodF5.should.not.throw(Error);
                const goodF6 = () => {
                    movingAverage.smooth([1, 2, 3, 4, 5, 6, 7], {
                        weights: [0.2, 0.3, 0.3, 0.2]
                    });
                };
                goodF6.should.not.throw(Error);
                const goodF7 = () => {
                    movingAverage.smooth([1, 2, 3, 4, 5], {
                        weights: [0.2, 0.3, 0, 0.3, 0.2],
                        centerIndex: 0
                    });
                };
                goodF7.should.not.throw(Error);
                const goodF8 = () => {
                    movingAverage.smooth([1, 2, 3, 4, 5], {
                        weights: [0.2, 0.3, 0, 0.3, 0.2],
                        centerIndex: 4
                    });
                };
                goodF8.should.not.throw(Error);
            });
        });
    });
    describe('RouletteWheel', () => {
        const RouletteWheel = require('../lib/array_manipulation/rouletteWheel').default;
        it('requires at least one correct argument', () => {
            let zeroParams = () => {
                let rouletteWheel = new RouletteWheel();
                return rouletteWheel.select();
            };
            zeroParams.should.throw(Error);

            let oneParam =  () => {
                let rouletteWheel = new RouletteWheel([1, 2, 3]);
                return rouletteWheel.select();
            };
            oneParam.should.not.throw(Error);

            let badParam1 =  () => {
                let rouletteWheel = new RouletteWheel([]);
                return rouletteWheel.select();
            };
            badParam1.should.throw(Error);

            let badParam2 = () => {
                let rouletteWheel = new RouletteWheel([1, 0]);
                return rouletteWheel.select();
            };
            badParam2.should.throw(Error);

            let badParam3 = () => {
                let rouletteWheel = new RouletteWheel([1, 'abc']);
                return rouletteWheel.select();
            };
            badParam3.should.throw(Error);

            let badParam4 = () => {
                let rouletteWheel = new RouletteWheel('abc');
                return rouletteWheel.select();
            };
            badParam4.should.throw(Error);

            let badParam5 = () => {
                let rouletteWheel = new RouletteWheel(1);
                return rouletteWheel.select();
            };
            badParam5.should.throw(Error);
        });
        it('should support all public methods', () => {
            const rouletteWheel = new RouletteWheel([1, 2, 3, 4]);
            expect(rouletteWheel).to.have.property('select');
            expect(rouletteWheel).to.respondsTo('select');
            expect(rouletteWheel).to.have.property('seed');
            expect(rouletteWheel).to.respondsTo('seed');
            expect(rouletteWheel).to.have.property('setPrng');
            expect(rouletteWheel).to.respondsTo('setPrng');
            expect(rouletteWheel).to.have.property('reset');
            expect(rouletteWheel).to.respondsTo('reset');
        });
        it('should support prng options', () => {
            let zeroParams = () => {
                const rouletteWheel = new RouletteWheel([1, 2, 3, 4], {
                    seed: 1234567,
                    prng: 'abc'
                });
                rouletteWheel.select();
            };
            zeroParams.should.throw(Error);

            const rouletteWheel = new RouletteWheel([1, 2, 3, 4], {
                seed: 1234567,
                prng: 'tt800'
            });
            expect(rouletteWheel._prng.prng_name).to.be.equal('tt800');
            expect(rouletteWheel._prng._seed).to.be.equal(1234567);

            rouletteWheel.setPrng('r250');
            expect(rouletteWheel._prng.prng_name).to.be.equal('r250');

            rouletteWheel.seed(98765);
            expect(rouletteWheel._prng._seed).to.be.equal(98765);
        });
        it('should return indexes with probability due to weights', function(done) {
            this.timeout(480000);
            const testsCount = 10;
            const selectCount = 200000;
            const weightsCount = 6;
            let weights = [];
            let weightsHashTable = {};
            let weightsSum = 0;
            const fillWeights = () => {
                weights = [];
                weightsHashTable = {};
                weightsSum = 0;
                for (let i = 0; i < weightsCount; i += 1) {
                    weights[i] = Math.floor(Math.random() * 90 + 10);
                    weightsHashTable[i] = 0;
                    weightsSum += weights[i];
                }
            };

            for (let i = 0; i < testsCount; i += 1) {
                fillWeights();

                const rouletteWheel = new RouletteWheel(weights);
                rouletteWheel.seed();
                rouletteWheel.reset();
                let selected;
                for (let j = 0; j < selectCount; j += 1) {
                    selected = rouletteWheel.select();
                    expect(selected).to.be.a('number');
                    expect(selected >= 0).to.be.equal(true);
                    expect(selected < weightsCount).to.be.equal(true);
                    weightsHashTable[selected] += 1;
                }

                for (let j = 0; j < weightsCount; j += 1) {
                    expect(weightsHashTable[j]/selectCount).to.be.closeTo(weights[j] / weightsSum, 0.05 * (weights[j] / weightsSum));
                }
            }
            done();
        });
    });
});

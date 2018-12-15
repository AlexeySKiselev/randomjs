/**
 * Tests for array manipulation methods
 * Created by Alexey S. Kiselev
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    fs = require('fs');

chai.should();

describe('Array manipulation methods', () => {
    describe('Sample', () => {
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
                temp,
                correctOrders = 0;

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
        it('should generate different results each time', () => {
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                samples = {},
                temp;
            for(let i = 0; i < 100000; i += 1) {
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                temp = shuffle.getPermutation(input_str);
                samples[temp] = 1;
            }
            expect(Object.keys(samples).length).to.be.at.least(99990);
        });
        it('should place each element on each position with the same probability', function(done) {
            this.timeout(480000);
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyz',
                letters = {},
                temp;
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
        it('should generate different results each time', () => {
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                samples = {},
                temp;
            for(let i = 0; i < 100000; i += 1) {
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                temp = shuffle.getDerangement(input_str);
                samples[temp] = 1;
            }
            expect(Object.keys(samples).length).to.be.at.least(99990);
        });
        it('should place each element on each position with the same probability', function(done) {
            this.timeout(480000);
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyz',
                letters = {},
                temp;
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
});

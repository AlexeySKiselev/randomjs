[![Build Status](https://travis-ci.org/AlexeySKiselev/randomjs.svg?branch=master)](https://travis-ci.org/AlexeySKiselev/randomjs)
[![dependencies Status](https://david-dm.org/AlexeySKiselev/randomjs/status.svg)](https://david-dm.org/AlexeySKiselev/randomjs)

# Unirand
A JavaScript module for generating seeded random distributions and its statistical analysis.

Implemented in pure JavaScript with no dependencies, designed to work in Node.js and fully asynchronous, tested *with ~600 tests*.

[Supported distributions](./core/methods/)

## Installation and Usage

Install the `unirand` module, using `npm install unirand`, then include the code with require. The `require` method returns an object with all of the module's methods attached to it.

```
const unirand = require('unirand')
```

### PRNG
Unirand supports different PRNGs: *default JS generator, tuchei sedded generator*. By default unirand uses **tuchei** generator.
Our seeded generator supports *seed*, *random*, *next* methods.
A name of current using PRNG is stored in:
```$xslt
unirand.prng.prng_name; // returns a name of current generator
```
Also you can set another PRNG by calling:
```$xslt
unirand.prng.set_prng('default'); // now PRNG is default JS generator equals to Math.random()
```

#### .random() and .randomInt()
Returns random uniformly distributed value or array of length *n*. Returns different value each time without seed and same value with seed value.
```$xslt
unirand.random(); // random value [0, 1)
unirand.random(n); // uniformly distributed random array of length n

unirand.randomInt(); // random integer [0, 2^32)
unirand.randomInt(n); // uniformly distributed random integer array of size n 
```
Without *seed value* this method returns different values each call. With *seed value* this method returns same value each time.

#### .next() and .nextInt()
It makes sense only for seeded generators. Otherwise that method works as `.random()`. If you want to return another random seeded value after *.random()* method, use *.next()*.
```$xslt
unirand.seed(123456);
unirand.random(); // returns 0.07329190103337169
unirand.random(); // returns same 0.07329190103337169
unirand.next(); // returns 0.49862336413934827
unirand.next(); // returns 0.045074593275785446
...
```
Same results for `.nextInt()`. These methods always return single value.

#### .seed()
```$xslt
unirand.seed('unirand'); // sets seed value for PRNG
unirand.random(); // always 0.026891989167779684
unirand.normal(1, 1).randomSync(); // always -0.46754931268295974
```
After setting seed value *unirand* always will use this value for generating random values.
If you want to reset *seed* use
```$xslt
unirand.seed(<new seed value>);
```
If you want to unset *seed* and generate different values each time use:
```$xslt
unirand.seed(); // unset seed value for all generators
```

### Random number
Generates random number with given distribution. For example, if you want to generate random number with *normal distribution*:
```
let mu = 1,
    sigma = 2;
// Asynchronous call
unirand.normal(mu, sigma).random()
    .then((randomNumber) => {
        console.log(randomNumber);
    });
// Synchronous call
let randomNumber = unirand.normal(mu, sigma).randomSync();

// for seeded generator
let randomNext = unirand.normal(mu, sigma).nextSync();
```
For any generator `.random()` and `.next()` are *synchronous*, while `.randomSync()` and `.nextSync()` - *asynchronous*.

### Random distribution
Generates random distribution (array with *n* random numbers). For example, if you want to generate random number with *normal distribution*:
```
let mu = 1,
    sigma = 2,
    n = 100;
// Asynchronous call
unirand.normal(mu, sigma).distribution(n)
    .then((randomDistribution) => {
        randomDistribution.map((randomNumber) => {
            console.log(randomNumber);
        });
    });
// Synchronous call
let randomArray = unirand.normal(mu, sigma).distributionSync(n);
```
For seeded generator returns same distribution each time. You still can use `.next()` or `.nextSync()` after this method.

### Analyze
Analyze random distribution ([Analyzer docs](./core/analyzer/)):
```
let analyzer = unirand.analyze(randomArray, {
    pdf: 1000 // default: 200
});
// Fully asynchronous
// Returns full analyzer object
analyzer.then((res) => {
    console.log(res);
    // returns {min, max, mean, median...} object
});
// Returns only one random array option
analyzer.entropy.then((res) => {
    console.log(res);
    // returns entropy value as a number
});
```

### Utils
Different utils ([Special functions list](./core/utils/))
```
unirand.utils.gamma(2); // returns gamma function with argument 2
unirand.utils.digamma(2); // returns digamma function with argument 2
unirand.utils.erf(2); // returns error function with argument 2
```

### Hash
Returns *hash* using murmur3 algorithm
```$xslt
unirand.hash('unirand');
```  

### Sample
Generates **random sample** from array, string or object. This method will generate *k* random elements from array/string with *n* elements.
```
const sample = unirand.sample;
sample(<array|string|object>, <number|options object>, options object);
```
You can point *k* value (in this case `.sample` returns k-length result) or not (in this case `.sample` returns result with random length).
Method will return random sample with same type as input. In case when *k* greater then input length method will return input.
This method also allow shuffle output:
```
sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) // will output [2, 5, 8], for example, or [1, 4, 9] - in ascending order by index
sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3, {shuffle: true}) // will output [6, 9, 1] or [3, 2, 7] - shuffled result
sample([1, 2, 3, 4, 5, 6, 7, 8, 9]) // will output [2, 5, 8], for example, or [1, 4, 7, 9] - random length, in ascending order by index
sample([1, 2, 3, 4, 5, 6, 7, 8, 9], {shuffle: true}) // will output [6, 9, 1] or [3, 2, 7, 4] - random length, shuffled result
```
*Does not mutate input!*

Sample method is **3 times faster** for arrays and **7 times faster** for string compared to simple shuffled and sliced array|string.

### Shuffle 
**Shuffle** array or string (O(n) time complexity)
```
const shuffle = unirand.shuffle;
shuffle(<array|string>); // will output random permutation of input
```
Method will return random permutation with same type as input.

### Derange
**Derange** method returns random derangement of array or string (O(n) time complexity)
Derangement is a permutation of the elements of a set, such that no element appears in its original position. In other words, derangement is a permutation that has no fixed points.
```
const derange = unirand.derange;
derange(<array|string>); // will output random derangement of input
```
There are approximately n!/e derangements for array with *n* elements. 

### Winsorize
Winsorization replaces extreme data values with less extreme values.
Winsorization is the transformation of statistics by limiting extreme values in the statistical data to reduce the effect of possibly spurious outliers.
Parameters:
- *input*: array of numbers
- *limits*: single number, represent same value trimming value from left and right (should be 0 < limit < 0.5), or an array \[left trim value, right trim value\] (values should be 0 < left trim value < right trim value < 1)
- *mutate*: <true|false> value (default *true*). If true - mutate ofiginal array, otherwise - no

```
const winsorize = unirand.winsorize;
winsorize(input: <array>, limits: <number|array>, mutate: <true|false>);
const input = [92, 19, 101, 58, 1053, 91, 26, 78, 10, 13, −40, 101, 86, 85, 15, 89, 89, 28, −5, 41];
winsorize(input, 0.05, false); // returns [92, 19, 101, 58, 101, 91, 26, 78, 10, 13, −5, 101, 86, 85, 15, 89, 89, 28, −5, 41]
// replaced -40 with -5 and 1053 with 101
```

### Chance
**Chance** returns *true* with given probability
```
const chance = unirand.chance;
chance(0.3); // returns true with 30% probability
```

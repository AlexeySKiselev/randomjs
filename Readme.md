[![Build Status](https://travis-ci.org/AlexeySKiselev/randomjs.svg?branch=master)](https://travis-ci.org/AlexeySKiselev/randomjs)
[![dependencies Status](https://david-dm.org/AlexeySKiselev/randomjs/status.svg)](https://david-dm.org/AlexeySKiselev/randomjs)

# Unirand
A JavaScript module for generating seeded random distributions and its statistical analysis.

Implemented in pure JavaScript with no dependencies, designed to work in Node.js and fully asynchronous, tested *with 600+ tests*.

#### [Supported distributions](./core/methods/)

| Name | Parameters | Usage |
| --- | --- | --- |
| Uniform distribution | `min` - any value, `max` - any value, `min` < `max` | `unirand.uniform(min, max).random()` |
| Normal (Gaussian) distribution | `mu` - any value, `sigma` > 0 | `unirand.normal(mu, sigma).random()` |
| Bates distribution | `n` - integer, `n` >= 1, `a` - any value, `b` - any value, `b` > `a` | `unirand.bates(n, a, b).random()` |
| Bernoulli distribution | `p` - float number, 0 <= `p` <= 1 | `unirand.bernoulli(p).random()` |
| Beta distribution | `alpha` - integer, `alpha` > 0, `beta` > integer, `beta` > 0 | `unirand.beta(alpha, beta).random()` |
| BetaPrime distribution | `alpha` - integer, `alpha` > 0, `beta` > integer, `beta` > 0 | `unirand.betaprime(alpha, beta).random()` |
| Binomial distribution | `n` - integer, `n` > 0, `p` - float number, 0 <= `p` <= 1  | `unirand.binomial(n, p).random()` |
| Cauchy (Lorenz) distribution | `x` - any value, `gamma` > 0 | `unirand.cauchy(x, gamma).random()` |
| Chi distribution | `k` - integer, `k` > 0 | `unirand.chi(k).random()` |
| Chi Square distribution | `k` - integer, `k` > 0 | `unirand.chisquare(k).random()` |
| Erlang distribution | `k` - integer, `k` > 0, `mu` - float value, `mu` > 0 | `unirand.erlang(k, mu).random()` |
| Exponential distribution | `lambda` - float value, `lambda` > 0 | `unirand.exponential(lambda).random()` |
| Extreme (Gumbel-type) Value distribution | `mu` - any value, `sigma` - float number, `sigma` > 0 | `unirand.extremevalue(mu, sigma).random()` |
| Gamma distribution | `alpha` - float value, `alpha` > 0, `beta` - integer, `beta` > 0 | `unirand.gamma(alpha, beta).random()` |
| Geometric distribution | `p` - float value, 0 <= `p` <= 1 | `unirand.geometric(p).random()` |
| Irwin-Hall distribution | `n` - integer, `n` > 0 | `unirand.irwinhall(n).random()` |
| Laplace distribution | `mu` - any value, `b` - float value, `b` > 0 | `unirand.laplace(mu, b).random()` |
| Logistic distribution | `mu` - any value, `s` - float value, `s` > 0 | `unirand.logistic(mu, s).random()` |
| Lognormal distribution | `mu` - any value, `sigma` - float value, `sigma` > 0 | `unirand.lognormal(mu, sigma).random()` |
| Negative Binomial distribution | `r` - integer, `r` > 0, `p` - float value, 0 <= `p` <= 1 | `unirand.negativebinomial(r, p).random()` |
| Pareto distribution | `xm` - float value, `xm` > 0, `alpha` - float value, `alpha` > 0 | `unirand.pareto(xm, alpha).random()` |
| Poisson distribution | `lambda` - integer, `lambda` > 0 | `unirand.poisson(lambda).random()` |
| Rayleigh distribution | `sigma` - float value, `sigma` > 0 | `unirand.rayleigh(sigma).random()` |
| Student's t-distribution | `v` - integer, `v` > 0 | `unirand.student(v).random()` |
| Triangular distribution | `a`, `b`, `c` - any number, `b` > `a`, `a` <= `c` <= `b` | `unirand.triangular(a, b, c).random()` |
| Weibull distribution | `k` - float value, `k` > 0, `lambda` - float value, `lambda` > 0 | `unirand.weibull(k, lambda).random()` |
| Zipf distribution | `alpha` - float value, `alpha` >= 0, `shape` - integer, `shape` > 1 | `unirand.zipf(alpha, shape).random()` |

## Installation and Usage

Install the `unirand` module, using `npm install unirand`, then include the code with require. The `require` method returns an object with all of the module's methods attached to it.

```javascript
const unirand = require('unirand');
```

### PRNG
Unirand supports different PRNGs: *default JS generator, tuchei seeded generator*. By default unirand uses **tuchei** generator.
Our seeded generator supports *seed*, *random*, *next* methods.
A name of current using PRNG is stored in:
```javascript
unirand.prng.prng_name; // returns a name of current generator
```
Also you can set another PRNG by calling:
```javascript
unirand.prng.set_prng('default'); // now PRNG is default JS generator equals to Math.random()
```

#### .random() and .randomInt()
Returns random uniformly distributed value or array of length *n*. Returns different value each time without seed and same value with seed value.
```javascript
unirand.random(); // random value [0, 1)
unirand.random(n); // uniformly distributed random array of length n

unirand.randomInt(); // random integer [0, 2^32)
unirand.randomInt(n); // uniformly distributed random integer array of size n 
```
Without *seed value* this method returns different values each call. With *seed value* this method returns same value each time.

#### .next() and .nextInt()
It makes sense only for seeded generators. Otherwise that method works as `.random()`. If you want to return another random seeded value after *.random()* method, use *.next()*.
```javascript
unirand.seed(123456);
unirand.random(); // returns 0.07329190103337169
unirand.random(); // returns same 0.07329190103337169
unirand.next(); // returns 0.49862336413934827
unirand.next(); // returns 0.045074593275785446
...
```
Same results for `.nextInt()`. These methods always return single value.

#### .seed()
```javascript
unirand.seed('unirand'); // sets seed value for PRNG
unirand.random(); // always 0.026891989167779684
unirand.normal(1, 1).randomSync(); // always -0.46754931268295974
```
After setting seed value *unirand* always will use this value for generating random values.
If you want to reset *seed* use
```javascript
unirand.seed(<new seed value>);
```
If you want to unset *seed* and generate different values each time use:
```javascript
unirand.seed(); // unset seed value for all generators
```

### Random number
Generates random number with given distribution. For example, if you want to generate random number with *normal distribution*:
```javascript
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
For any generator `.random()` and `.next()` are *asynchronous*, while `.randomSync()` and `.nextSync()` - *synchronous*.

### Random distribution
Generates random distribution (array with *n* random numbers). For example, if you want to generate random number with *normal distribution*:
```javascript
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
```javascript
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
```javascript
unirand.utils.gamma(2); // returns gamma function with argument 2
unirand.utils.digamma(2); // returns digamma function with argument 2
unirand.utils.erf(2); // returns error function with argument 2
```

### Hash
Returns *hash* using murmur3 algorithm
```javascript
unirand.hash('unirand'); // string input
// or
unirand.hash(123456); // numerical input
```  

Also supports different `seed` values. By default, `seed` value is zero.

```javascript
unirand.hash('unirand', 123);
```
`Seed` can be array, meaning that `.hash` returns array of hash values for different seeds:
```javascript
unirand.hash('unirand', [1, 2, 3, 4]); // output [<hash1>, <hash2>, <hash3>, <hash4>]
```

Also supports different hash algorithms:
* Murmur3 - `unirand.hash('unirand', 0, {algorithm: 'murmur'})`
* Jenkins - `unirand.hash('unirand', 0, {algorithm: 'jenkins'})`

Alternate usage:
```javascript
unirand.hash('unirand', {
    algorithm: 'murmur'
});
// or
unirand.hash('unirand', 123, {
    algorithm: 'jenkins'
});
// or
unirand.hash('unirand', [1, 2, 3], {
    algorithm: 'murmur'
}); // outputs array of hash values
```

If You want to bound hash values, You can use option `modulo` (*0x080000000* by default):
```javascript
unirand.hash('unirand', 123, {
    algorithm: 'jenkins',
    modulo: 1234
});
// or
unirand.hash('unirand', 123, {
    modulo: 1234
}); // will use murmur3 algorithm as default value
```

### Sample
Generates **random sample** from array, string or object. This method will generate *k* random elements from array/string with *n* elements.
```javascript
const sample = unirand.sample;
sample(<array|string|object>, <number|options object>, options object);
```
You can point *k* value (in this case `.sample` returns k-length result) or not (in this case `.sample` returns result with random length).
Method will return random sample with same type as input. In case when *k* greater then input length method will return input.
This method also allow shuffle output:
```javascript
sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) // will output [2, 5, 8], for example, or [1, 4, 9] - in ascending order by index
sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3, {shuffle: true}) // will output [6, 9, 1] or [3, 2, 7] - shuffled result
sample([1, 2, 3, 4, 5, 6, 7, 8, 9]) // will output [2, 5, 8], for example, or [1, 4, 7, 9] - random length, in ascending order by index
sample([1, 2, 3, 4, 5, 6, 7, 8, 9], {shuffle: true}) // will output [6, 9, 1] or [3, 2, 7, 4] - random length, shuffled result
```
*Does not mutate input!*

Sample method is **3 times faster** for arrays and **7 times faster** for string compared to simple shuffled and sliced array|string.

### k-fold
Splits array into *k* subarrays. Requires at least 2 arguments: array itself and *k*. Also supports *options*.

- *type*: output type, **list** (default) for output like `[<fold>, <fold>, <fold>, ...]`, **set** for output like `{0: <fold>, 1: <fold>, 2: <fold>, ...}`, **crossvalidation** for output like `[{test: <fold>, data: <remaining folds>}, ...]`
- *derange*: items will be shuffled as *random permutation* (default, `derange: false`) or *random derangement* (`derange: true`)
```javascript
const kfold = unirand.kfold;
kfold([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3); // [ [ 9, 8, 2, 10 ], [ 1, 7, 3 ], [ 4, 5, 6 ] ]

// with options
kfold([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, {
    type: 'set',
    derange: true
});
// { '0': [ 8, 10, 7, 1 ], '1': [ 6, 4, 9 ], '2': [ 5, 2, 3 ] }

// cross validation
kfold([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, {
    type: 'crossvalidation',
    derange: true
})
// [ { id: 0, test: [ 5, 6, 9, 7 ], data: [ 4, 1, 10, 2, 8, 3 ] },
//  { id: 1, test: [ 4, 1, 10 ], data: [ 5, 6, 9, 7, 2, 8, 3 ] },
//  { id: 2, test: [ 2, 8, 3 ], data: [ 5, 6, 9, 7, 4, 1, 10 ] } ]
```
For permutation unirand uses seeded PRNG. With *seed* k-fold will always return same result.

*Does not mutate input!*

### Shuffle 
**Shuffle** array or string (O(n) time complexity)
```javascript
const shuffle = unirand.shuffle;
shuffle(<array|string>); // will output random permutation of input
```
Method will return random permutation with same type as input.

### Derange
**Derange** method returns random derangement of array or string (O(n) time complexity)
Derangement is a permutation of the elements of a set, such that no element appears in its original position. In other words, derangement is a permutation that has no fixed points.
```javascript
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
- *mutate*: <true|false> value (default *true*). If true - mutate original array, otherwise - no

```javascript
const winsorize = unirand.winsorize;
winsorize(input: <array>, limits: <number|array>, mutate: <true|false>);
const input = [92, 19, 101, 58, 1053, 91, 26, 78, 10, 13, −40, 101, 86, 85, 15, 89, 89, 28, −5, 41];
winsorize(input, 0.05, false); // returns [92, 19, 101, 58, 101, 91, 26, 78, 10, 13, −5, 101, 86, 85, 15, 89, 89, 28, −5, 41]
// replaced -40 with -5 and 1053 with 101
```

### Chance
**Chance** returns *true* with given probability
```javascript
const chance = unirand.chance;
chance(0.3); // returns true with 30% probability
```

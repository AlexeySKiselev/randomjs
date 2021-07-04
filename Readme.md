[![Build Status](https://travis-ci.org/AlexeySKiselev/randomjs.svg?branch=master)](https://travis-ci.org/AlexeySKiselev/randomjs)
[![dependencies Status](https://david-dm.org/AlexeySKiselev/randomjs/status.svg)](https://david-dm.org/AlexeySKiselev/randomjs)
[![GitHub](https://img.shields.io/github/license/AlexeySKiselev/randomjs)](https://github.com/AlexeySKiselev/randomjs)

# Unirand
A JavaScript module for generating seeded random distributions and its statistical analysis.

Implemented in pure JavaScript with no dependencies, designed to work in Node.js and fully asynchronous, tested *with 900+ tests*.

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
| Compertz distribution | `nu` > 0 - float value, `b` > 0 - float value | `unirand.compertz(nu, b).random()` |
| Delaporte distribution | `alpha` > 0 - float value, `beta` > 0 - float value, `lambda` > 0 - float value | `unirand.delaporte(alpha, beta, lambda).random()` |
| Erlang distribution | `k` - integer, `k` > 0, `mu` - float value, `mu` > 0 | `unirand.erlang(k, mu).random()` |
| Exponential distribution | `lambda` - float value, `lambda` > 0 | `unirand.exponential(lambda).random()` |
| Extreme (Gumbel-type) Value distribution | `mu` - any value, `sigma` - float number, `sigma` > 0 | `unirand.extremevalue(mu, sigma).random()` |
| Fatigue life distribution | `alpha` > 0, `beta` > 0 | `unirand.fatigue(alpha, beta).random()` |
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

Unirand supports different PRNGs:

| Name | Description | Performance | Supports seed |
|---|---|---|---|
| default | Default JS PRNG | fast | No |
| tuchei | Tuchei PRNG, period ~2<sup>32</sup> | very fast | Yes |
| xorshift | Xorshift PRNG, period ~2<sup>32</sup> | very fast | Yes |
| kiss | Kiss PRNG, period ~2<sup>121</sup> | fast | Yes |
| parkmiller | Park-Miller PRNG, period ~2<sup>31</sup> | medium | Yes |
| coveyou | Coveyou PRNG, period ~2<sup>31</sup> | slow | Yes |
| knuthran2 | knuthran2 PRNG, period ~10<sup>18</sup> | slow | Yes |
| r250 | r250 PRNG, period ~2<sup>250</sup> | very fast | Yes |
| mrg5 | Fifth-order multiple recursive PRNG, period ~10<sup>46</sup> | slow | Yes |
| gfsr4 | gfsr4 PRNG, period ~2<sup>9689</sup> | fast | Yes |
| dx1597 | Dx-1957-f PRNG, period ~10<sup>14903</sup> | slow | Yes |
| tt800 | TT800 PRNG, period ~10<sup>240</sup> | medium | Yes |
| xorwow | Xorwow PRNG, period ~10<sup>38</sup> | fast | Yes |
| mt19937 | Marsenne Twister PRNG, period ~2<sup>19937</sup> | medium | Yes |
| philox | Philox 4x32 PRNG, period ~2<sup>193</sup> | slow | Yes |
| swb2712 | Swb2712 PRNG, period ~2<sup>1492</sup> | fast | Yes |
| taus113 | Tausworthe PRNG, period ~2<sup>113</sup> | very fast | Yes |

#### .random(), .randomInt() and .randomInRange(from, to)
Returns random uniformly distributed value or array of length *n*. Returns different value each time without seed and same value with seed value.
```javascript
unirand.random(); // random value [0, 1)
unirand.random(n); // uniformly distributed random array of length n

unirand.randomInt(); // random integer [0, 2^32)
unirand.randomInt(n); // uniformly distributed random integer array of size n 

unirand.randomInRange(from, to); // random value in range [from, to), from > to
unirand.randomInRange(from, to, n); // array of size n, each value is random in range [from, to), from > to
```
Without *seed value* this method returns different values each call. With *seed value* this method returns same value each time.

#### .next(), .nextInt() and .nextInRange(from, to)
It makes sense only for seeded generators. Otherwise, that method works as `.random()`. If you want to return another random seeded value after *.random()* method, use *.next()*.
```javascript
unirand.seed(123456);
unirand.random(); // returns 0.07329190103337169
unirand.random(); // returns same 0.07329190103337169
unirand.next(); // returns 0.49862336413934827
unirand.next(); // returns 0.045074593275785446
unirand.nextInRange(10, 20); // 12.58303941693157
unirand.nextInt(); // 1398469627
...
```
Same results for `.nextInt()` and `.nextInRange(from, to)`. These methods always return single value.

\**Note*: for seeded prng we don't recommend use `.random()` method for generating all random values. Use `.random()` first time flushing generator, then `.next()` for all other random values.

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

#### PRNG Factory
Unirand allows you to generate independent PRNGs of all supported types.

```javascript
let prng = newPrng(<prng name>[, <seed value>]); // unseeded by default

// example
prng = newPrng('r250');
prng.random(); // 0.6259469939395785
prng.random(); // 0.3127290401607752
prng.next();   // 0.10631363722495735

// you can generate seeded PRNG
prng = newPrng('tuchei', 'unirand');
prng.random();  // 0.026891989167779684
prng.random();  // same 0.026891989167779684
prng.next();    // 0.23777238093316555
prng.nextInt(); // 2513331331
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

### Roulette wheel
Consider You have an array of elements represented by some weight *w<sub>i</sub>*, and You want to select each element with probability w<sub>i</sub> / \<sum all weights\>. You can use roulette wheel algorithm for that purpose:

```javascript
// will create RouletteWheel instance with its own PRNG
const rouletteWheel = unirand.newRouletteWheel(<weights array>);
// weights array should be an array of positive numerical values
// weights array can be unsorted, weight can be any positive value

// @example
const rouletteWheel = unirand.newRouletteWheel([2, 1, 3]); // O(weights.length) time complexity
rouletteWheel.select(); // always O(1) time complexity
// method .select() will return index 0 with 33.33% probability
// method .select() will return index 1 with 16.67% probability
// method .select() will return index 2 with 50.00% probability
```
RouletteWheel `.select()` method will return a corresponding index of weights array with **O(1) time complexity**. As `rouletteWheel` instance has own prng attached, it supports additional options:

```javascript
const rouletteWheel = unirand.newRouletteWheel([1, 2, 3], {
    prng: 'tt800', // supports all unirand's PRNG algorithms
    seed: 12345 // initial seed values, by default PRNG is unseeded
});

// PRNG options can be changed via next methods as well
rouletteWheel.seed(<seed value>);
rouletteWheel.seed(); // will unset seed from PRNG making PRNG unseeded
rouletteWheel.setPrng(<prng name>[, reset]); // will set new PRNG
// reset (default: false) will reset PRNG to initial state, useful to reproduce selections
rouletteWheel.reset(); // reset PRNG to initial state
```

### String utils
Unirand allow You to generate different random strings:

| Usage | Description | Example |
| --- | --- | --- |
| unirand.stringutils.random('abcdefg', n) | Generates random string of size `n` with Your alphabet | `dbfagcdaeb` |
| unirand.stringutils.randomHex(n) | Generates random string of size `n` with `0123456789abcdef` alphabet | `ebe9a1d10d` |
| unirand.stringutils.randomAlphabetic(n) | Generates random string of size `n` with [a-z, A-Z] alphabet | `LfeFYWVjDH` |
| unirand.stringutils.randomAscii(n) | Generates random string of size `n` with ASCII alphabet | `&TxiHCFN<d` |
| unirand.stringutils.randomAlphanumeric(n) | Generates random string of size `n` with [a-z, A-Z, 0-9] alphabet | `r4A77w1fo0` |
| unirand.stringutils.randomNumeric(n) | Generates random string of size `n` with [0-9] alphabet | `3826717859` |
| unirand.stringutils.randomBitString(n, p) | Generates random string of size `n` consists of only `1` or `0` with `p` probability of `1` (default `p=0.5`) | `1101100011` |
| unirand.stringutils.randomUID(type) | Generates random UID of type `type` (see [UID generation](#uid-generation)) | `3b6d5575-1a03-40a8-9cd2-e1493dbe5d01` |

For seeded PRNGs You can use `.next*` methods:

```javascript
unirand.seed('unirand');
unirand.stringutils.randomAscii(15); // "6W5,Wj8JeZsz"$
unirand.stringutils.randomAscii(15); // "6W5,Wj8JeZsz"$
unirand.stringutils.nextAscii(15); // 20wv]+m)!p;+;t=
unirand.stringutils.nextAscii(15); // CM6-BgKAj;O>8TK
```

\**Note: not all UID generators will generate same UID for seeded PRNGs.* 

### UID generation
You can generate random UID of different types. Not all of them can be seeded. `unirand.stringutils.randomUID('uuid')` and `unirand.uid('uuid').random()` are the same:

| Name | Usage | Description | Randomness | Example |
| --- | --- | --- | --- | --- |
| betterguid | unirand.uid('betterguid').random() | 8 bytes of time (milliseconds) + 9 random bytes | Partly random | `-MJvUyyWjbsx01BAu` |
| ksuid | unirand.uid('ksuid').random() | 4 bytes of time (seconds) + 16 random bytes | Partly random | `DBnbYgY8lToilslDcryc4PQFCjE` |
| uuid | unirand.uid('uuid').random() | UUIDv4 from RFC 4112, 4 bytes for time in milliseconds, other 12 bytes - random | Partly random | `3b834ec5-0383-428b-b6b9-de0022dd91c1` |
| shortuuid | unirand.uid('shortuuid').random() | Short representation of UUIDv4 | Partly random | `8mkdCaDhVxg9TV48shm1ZX` |
| sno | unirand.uid('sno').random() | 5 bytes timestamp, 3 bytes random payload, 2 bytes increased (with any call) sequence | Partly random | `BL7E614A0RH68001` |
| snowflake | unirand.uid('snowflake').random() | 5 bytes timestamp, 28 bit machine id (random payload in browser), 12 bit increased (with any call) sequence | Non random, Partly random in browser | `20803747841385512962` |
| sonyflake | unirand.uid('sonyflake').random() | 5 bytes of time (10 ms) + 1 byte sequence (increased with any call) + 2 bytes machine id (random in browser) | Non random, Partly random in browser | `04814e6d06001a954` |
| ulid | unirand.uid('ulid').random() | 6 bytes of time (milliseconds) + 8 bytes random | Partly random | `05TKQ54NHR33S59T4ABCJGR` |
| xid | unirand.uid('xid').random() | 4 bytes of time (seconds) + 3 byte machine id + 2 byte process id + 3 bytes random | Partly random | `1GCU16S2L5A7824LPPHG` |

It supports `unirand.uid(<type>).next()` method as well, but it will not have much effect as all UID generators are not fully random.

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

### Smooth data
Smooth method return an array contains smoothed data using different algorithms and strategies for smoothing.

```javascript
const asyncSmoothedData = await unirand.smooth(data: Array<number>, ?options); // Asynchronous smoothing
const syncSmoothedData = unirand.smoothSync(data: Array<number>, ?options); // Synchronous smoothing

// method return Array<number> of smoothed data
// @example
// for data [2, 6, 9, 4, 6, 7, 3, 2, 4, 7] .smooth method will return [4.375, 5, 5.75, 6.375, 5.75, 4.75, 4.25, 4, 4.5, 5.25]
```

![Smoothed data example](https://github.com/AlexeySKiselev/randomjs/raw/master/smooth.png "Smoothed data example")

You can also specify `options` for smoothing. Multiple options are allowed:

##### Policy or pre-defined algorithm

Unirand provides different well known pre-defined algorithms (*default - 2x4-MA*) You can choose for smoothing:

```javascript
const smoothedData = unirand.smoothSync(data, {
    policy: '2x4-MA' // will implement 4-MA followed by 2-MA algorithm for smoothing
});
``` 
Allowed policies:
1. *3-MA* - centered moving average of 3th order
2. *5-MA* - centered moving average of 5th order
3. *2x4-MA* - 4-MA followed by 2-MA
4. *2x8-MA* - 8-MA followed by 2-MA
5. *2x12-MA* - 12-MA followed by 2-MA
6. *3x3-MA* - 3-MA followed by 3-MA
7. *3x5-MA* - 5-MA followed by 3-MA
8. *H5-MA* - Henderson’s weighted moving average
9. *H9-MA* - Henderson’s weighted moving average
10. *H13-MA* - Henderson’s weighted moving average
11. *H23-MA* - Henderson’s weighted moving average
12. *S15-MA* - Spencer’s weighted moving average
13. *S21-MA* - Spencer’s weighted moving average

##### Custom weights

Instead of policy You can specify Your own custom weights:

```javascript
const smoothedData = unirand.smoothSync(data, {
    weights: [0.1, 0.2, 0.3, 0.4] // will be treated as [0.1, 0.2, 0, 0.3, 0.4]
});
// or
const smoothedData = unirand.smoothSync(data, {
    weights: [0.1, 0.2, 0.3, 0.2, 0.2]
});
// Important: sum of weights must be equal to 1
// will return centered weighted moving average
```

If You want to get non-centered moving average You can point `centerIndex` option. Without `centerIndex` option unirand will treated weights as centered weights.

```javascript
const smoothedData = unirand.smoothSync(data, {
    weights: [0.1, 0.2, 0.3, 0.4],
    centerIndex: 3 // must be 0 <= centerIndex < weights.length
});
```

##### Custom order

You can point moving average order. Unirand will calculate m-ordered moving average.

```javascript
const smoothedData = unirand.smoothSync(data, {
    order: 5 // will calculate moving average for five point including current one,  (y[i-2] + y[i-1] + y[i] + y[i+1] + y[i+2]) / 5
});
// for even orders
const smoothedData = unirand.smoothSync(data, {
    order: 4 // (y[i-2] + y[i-1] + y[i] + y[i+1]) / 4
});
// or if You want centered moving average
const smoothedData = unirand.smoothSync(data, {
    order: 4,
    centered: true // (y[i-2] + y[i-1] + y[i+1] + y[i+2]) / 4
});
```

##### Analize diff

Unirand allow You to get diff between real and smoothed data (allowed for other all possible options). Unirand will return smoothed data, diff and result of diff analysis:
```javascript
const smoothedData = unirand.smoothSync(data, {
    diff: true
});
// or
const smoothedData = unirand.smoothSync(data, {
    policy: '2x4-MA',
    diff: true
});
// or
const smoothedData = unirand.smoothSync(data, {
    weights: [0.1, 0.2, 0.3, 0.4],
    centerIndex: 3,
    diff: true
});
// or
const smoothedData = unirand.smoothSync(data, {
    order: 4,
    centered: true,
    diff: true
});
// for example data: 
const data = [2, 6, 9, 4, 6, 7, 3, 2, 4, 7];
// unirand will return
{ 
    smoothData: [ 4.375, 5, 5.75, 6.375, 5.75, 4.75, 4.25, 4, 4.5, 5.25 ],
    diff: { 
        diffData: [ -2.375, 1, 3.25, -2.375, 0.25, 2.25, -1.25, -2, -0.5, 1.75 ],
        min: -2.375,
        max: 3.25,
        mean: 3.552713678800501e-17,
        mode: [ -2.375 ],
        variance: 4.09375,
        standard_deviation: 2.023301757029831,
        entropy: 1.8495713674278502,
        skewness: 0.21525076336911947,
        kurtosis: 1.692241451870844,
        pdf: { values: [Array], probabilities: [Array] },
        cdf: { values: [Array], probabilities: [Array] },
        quartiles: { q1: -2.09375, q2: -0.125, q3: 1.1875 },
        median: -0.125,
        interquartile_range: 3.28125
    }
}
```

By default diff option is `false`. Does not mutate original array.

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

### Utils
Different utils ([Special functions list](./core/utils/))
```javascript
unirand.utils.gamma(2); // returns gamma function with argument 2
unirand.utils.digamma(2); // returns digamma function with argument 2
unirand.utils.erf(2); // returns error function with argument 2
```

### Encoder
You can also encode and decode strings with well known encoders:

```javascript
unirand.encoder(<type>).encode(<string to encode>);
unirand.encoder(<type>).encodeFromByteArray(<byte array to encode>);
unirand.encoder(<type>).decode(<string to decode>);
unirand.encoder(<type>).decodeToByteArray(<string to decode>);
```

Allowed types:

* base62
* base64
* base32
* base32Hex
* z-base-32
* crockford-base32
* base58
* bitcoin-base58
* flickr-base58
* ripple-base58

### RandomColor
This method generates a random color with good contrast and randomness:

```javascript
const randomColor = unirand.randomColor(<saturation value>); // 0 <= saturation <= 1
console.log(randomColor); // will return #f8b34a

// You can specify two types of returned result, 'rgb' and 'hex' (default)
unirand.randomColor(0.9, 'hex'); // #b97437
unirand.randomColor(0.9, 'rgb'); // [54, 181, 116]

// for seeded generator supports also nextColor method
unirand.seed('unirand');
unirand.randomColor(0.9, 'hex'); // #132ac5
unirand.randomColor(0.9, 'hex'); // #132ac5
unirand.nextColor(0.9, 'hex'); // #9dc413
unirand.nextColor(0.9, 'hex'); // #7f16e0

// You are able to generate random vector as well
unirand.randomColor(0.9, 'hex', 5); // ['#23bf13', '#6bcc14', '#dc5a16', '#14cd5d', '#6a15d3']
unirand.randomColor(0.9, 'rgb', 3); // [[ 203, 116, 20 ], [ 23, 236, 61 ], [ 45, 23, 232 ]]
```

### Chance
**Chance** returns *true* with given probability
```javascript
const chance = unirand.chance;
chance(0.3); // returns true with 30% probability
```

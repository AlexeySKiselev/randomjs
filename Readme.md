[![Build Status](https://travis-ci.org/AlexeySKiselev/randomjs.svg?branch=master)](https://travis-ci.org/AlexeySKiselev/randomjs)
[![dependencies Status](https://david-dm.org/AlexeySKiselev/randomjs/status.svg)](https://david-dm.org/AlexeySKiselev/randomjs)

# Unirand
A JavaScript module for generating random distributions and its statistical analysis.

Implemented in pure JavaScript with no dependencies, designed to work Node.js and fully asynchronous, tested *with 500+ tests*.

[Supported distributions](./core/methods/)

## Installation and Usage

Install the `unirand` module, using `npm install unirand`, then include the code with require. The `require` method returns an object with all of the module's methods attached to it.
<br /><pre>let unirand = require('unirand')</pre>

### Random number
Generate random number with given distribution:
<br /> <pre>
let mu = 1,
    sigma = 2;
// Asynchronous call
unirand.normal(mu, sigma).random()
    .then((randomNumber) => {
        console.log(randomNumber);
    });
// Synchronous call
let randomNumber = unirand.normal(mu, sigma).randomSync();
</pre>

### Random distribution
Generate random distribution (array with n random numbers):
<br /> <pre>
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
</pre>

### Analyze
Analyze random distribution ([Analyzer docs](./core/analyzer/)):
<br /> <pre>
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
</pre>

### Utils
Use utils ([Special functions list](./core/utils/))
<br /> <pre>
// Return gamma function
console.log(unirand.utils.gamma(2));
// returns value for gamma function with argument 2
</pre>

### Sample
Generate **random sample** from array, string or object. This method will generate "k" random elements from array/string with "n" elements.
<br /> <pre>
let sample = unirand.sample;
console.log(sample(<array|string|object>, 10));
</pre>
<br /> Method will return random sample with same type as input. In case when "k" greater then input length method will return input.
This method also allow shuffle output:
<br /> <pre>
sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) // will output [2, 5, 8], for example, or [1, 4, 9]
sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3, true) // will output [6, 9, 1] or [3, 2, 7]
</pre>

Sample method is **3 times faster** for arrays and **7 times faster** for string compared to simple shuffled and sliced array|string.

### Shuffle 
**Shuffle** array or string
<br /><pre>
let shuffle = unirand.shuffle;
console.log(shuffle(<array|string>)); // will output random permutation of input
</pre>
Method will return random permutation with same type as input.

### Derange
**Derange** method returns random derangement of array or string.<br />
Derangement is a permutation of the elements of a set, such that no element appears in its original position. In other words, derangement is a permutation that has no fixed points.
<br /> <pre>
let derange = unirand.derange;
console.log(derange(<array|string>)); // will output random derangement of input
</pre>
<br />
There are approximately n!/e derangements for array with n elements. 

### Chance
**Chance** returns `true` with given probability
<br /> <pre>
let chance = unirand.chance;
console.log(chance(0.3)); // returns true with 30% probability
</pre>

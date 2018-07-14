[![Build Status](https://travis-ci.org/AlexeySKiselev/randomjs.svg?branch=master)](https://travis-ci.org/AlexeySKiselev/randomjs)
[![dependencies Status](https://david-dm.org/AlexeySKiselev/randomjs/status.svg)](https://david-dm.org/AlexeySKiselev/randomjs)

# Unirand
A JavaScript for generating random distributions and its statistical analysis.

Implemented in pure JavaScript with no dependencies, designed to work Node.js and fully asynchronous, tested *with 450+ tests*.

[Supported distributions](./core/methods/)

## Installation and Usage

* Install the `unirand` module, using `npm install unirand`, then include the code with require. The `require` method returns an object with all of the module's methods attached to it.
<br /><pre>let unirand = require('unirand')</pre>

* Generate random number with given distribution:
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

* Generate random distribution (array with n random numbers):
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

* Analyze random distribution ([Analyzer docs](./core/analyzer/)):
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
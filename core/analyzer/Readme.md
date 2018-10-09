# Analyzer

Analyzer object contains next fields:
<pre>
{
    min: [min value: number],
    max: [max value: number],
    mean: [mean value: number],
    median: [median value: number],
    mode: [array of modes: Array[number]],
    variance: [variance: number],
    standard_deviation: [standard deviation: number]
    entropy: [entropy: number],
    skewness: [skewness: number],
    kurtosis: [kurtosis: number],
    pdf: {
        values: [distribution values: Array[number]],
        probabilities: [distribution values probabilities: Array[number]]
    },
    cdf: {
        values: [distribution values: Array[number]],
        probabilities: [distribution values probabilities: Array[number]]
    },
    quartiles: {
        q1: [25% quartile: number],
        q2: [50% quartile: number],
        q3: [75% quartile: number]
    },
    interquartile_range: [number]
}
</pre>

Also you can calculate percentiles using .percentile() function. Input value must be between 0 and 1:
<pre>
// when you point single value
analyze([1, 2, 3, 4, 5, 6]).percentile(0.6).then((p) => {
    console.log(p); // output 60% percentile
});
// or you can point a list of values
analyze([1, 2, 3, 4, 5, 6]).percentile([0.2, 0.6, 0.3]).then((p) => {
    console.log(p); // output [20%, 60%, 30%] percentiles
});
</pre>

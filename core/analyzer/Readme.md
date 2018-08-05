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
    kurtosis: [kurtosis: number]
    pearson: {
        skewness_mode: [skewness_mode: number],
        skewness_median: [skewness_median: number]    
    },
    pdf: {
        values: [distribution values: Array[number]],
        probabilities: [distribution values probabilities: Array[number]]
    },
    cdf: {
        values: [distribution values: Array[number]],
        probabilities: [distribution values probabilities: Array[number]]
    }
}
</pre>
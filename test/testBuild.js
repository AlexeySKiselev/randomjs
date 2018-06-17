/**
 * Test Built Class
 * Created by Alexey S. Kiselev on 23.12.2017.
 */

let randomjs = require('../lib'),
    distribution = randomjs.student(2).distributionSync(300000);
let analyzer = randomjs.analyze(distribution, {
    pdf: 300
});
//console.log(analyzer);
analyzer.pdf.then(res => {
    for(let i = 0; i < res.probabilities.length; i += 1) {
        console.log(res.values[i], res.probabilities[i]);
    }
})
    .catch((err) => {
        console.error('Error', err);
    });
analyzer.kurtosis.then((res) => {
    console.log(res);
});
console.log('Sync');


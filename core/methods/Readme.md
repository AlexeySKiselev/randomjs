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

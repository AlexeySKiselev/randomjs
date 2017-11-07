// @flow
/**
 * Normal Gaussian Distribution
 * @param mu: number - Mu value of Normal Distribution
 * @param sigma: number - Sigma value of Normal Distribution
 * @returns Normal Distributed value based on parameters
 * Created by Alexey S. Kiselev
 */

class Normal {
    constructor(mu: number, sigma: number): void {
        this.mu = mu;
        this.sigma = sigma;
    }

    random(): number {
        return this.mu;
    }

    distribution(n: number): Array<number> {
        return [this.sigma];
    }

    isError(): boolean | {error: string} {
        return false;
    }

    refresh(newMu: number, newSigma: number): Normal {
        this.mu = newMu;
        this.sigma = newSigma;
        return this;
    }

    toString(): string {
        return 'Normal distribution';
    }
}

module.exports = Normal;

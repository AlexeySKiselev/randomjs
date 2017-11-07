// @flow
/**
 * Factory method for creation random distributed methods
 * Created by Alexey S. Kiselev
 */

interface IRandomFactory {
    random() : Promise<number>;
    randomSync(): number;
    distribution(n: number): Promise<Array<number>>;
    distributionSync(n: number): Array<number>;
    isError(): boolean | {error: string};
    refresh(): void;
    toString(): string;
}

class RandomFactory implements IRandomFactory {
    constructor(method, ...params) {
        let Method = require(__dirname + '/methods/' + method);
        this.method = new Method(...params);
        /**
         * Add methods to this Factory class form the "Method" class
         * Add only that methods which is not in RandomFactory class
         * Because in this class we are re-define existing methods from "Method" class
         */
        Object.getOwnPropertyNames(Object.getPrototypeOf(this.method)).map(method => {
            if(!this[method]){
                Object.defineProperty(this, method, {
                    __proto__: null,
                    get: () => {
                        return this.method[method];
                    }
                });
            }
        });
    }

    random() {
        return new Promise((resolve, reject) => {
            if(this.isError()){
                reject(this.isError());
            } else {
                resolve(this.method.random());
            }
        });
    }

    randomSync() {
        return this.method.random();
    }

    distribution(...distParams) {
        return new Promise((resolve, reject) => {
            if(this.isError()){
                reject(this.isError());
            } else {
                resolve(this.method.distribution(...distParams));
            }
        });
    }

    distributionSync(...distParams) {
        return this.method.distribution(...distParams);
    }

    isError() {
        return this.method.isError();
    }

    refresh(...newParams) {
        this.method = this.method.refresh(...newParams);
    }

    toString() {
        return this.method.toString();
    }
}

// TODO: add comments add methods

export default RandomFactory;

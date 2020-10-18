// @flow
/**
 * Factory method for generating UIDs using different algorithms
 * Created by Alexey S. Kiselev
 */

import type {IUIDGeneratorFactory, IUIDGenerator} from './interfaces';

const uidGenerators: {[string]: IUIDGenerator} = require('./utils/string_utils/uid');
const DEFAULT_GENERATOR: string = 'uuid';

class UidFactory implements IUIDGeneratorFactory {

    _currentGenerator: string;

    constructor(): void {
        this.setGenerator(DEFAULT_GENERATOR);
    }

    setGenerator(generator: string): void {
        if (!uidGenerators[generator]) {
            throw new Error(`UID generator: "${generator}" is not allowed`);
        }
        this._currentGenerator = generator;
    }

    random(): string {
        return uidGenerators[this._currentGenerator].generateRandom();
    }

    next(): string {
        return uidGenerators[this._currentGenerator].generateNext();
    }
}

export default UidFactory;

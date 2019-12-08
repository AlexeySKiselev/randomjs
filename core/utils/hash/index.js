// @flow
/**
 * Return hash proxy with given algorithm
 * Created by Alexey S. Kiselev
 */

import type { IHashProxy } from '../../interfaces';
import HashProxy from './hashProxy';

const hashProxy: IHashProxy = new HashProxy();
const defaultHashFunctionName: string = hashProxy.getDefaultHashFunctionName();
const hash: Function<IHashProxy> = (name: string = 'default'): IHashProxy  => {
    hashProxy.setHashFunction(name || defaultHashFunctionName);
    return hashProxy;
};

export default hash(defaultHashFunctionName);

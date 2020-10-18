// @flow
/**
 * Common class for encoders
 * Created by Alexey S. Kiselev
 */

import type {IEncoder} from '../../interfaces';

class CommonEncoder implements IEncoder {

    constructor() {}

    encode(str: string): string {
        const bytes: Array<number> = [];
        for (let i = 0; i < str.length; i += 1) {
            bytes[i] = str[i].charCodeAt(0);
        }
        return this.encodeFromByteArray(bytes);
    }

    decode(str: string): string {
        const bytes: Array<number> = this.decodeToByteArray(str);
        let res: string = '';

        for (let i = 0; i < bytes.length; i += 1) {
            res += String.fromCharCode(bytes[i]);
        }

        return res;
    }

    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    encodeFromByteArray(bytes: Array<number>): string {
        throw new Error('encodeFromByteArray method not implemented');
    }

    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    decodeToByteArray(str: string): Array<number> {
        throw new Error('decodeToByteArray method not implemented');
    }
}

export default CommonEncoder;

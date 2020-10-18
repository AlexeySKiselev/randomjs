// @flow
/**
 * Encoders proxy
 * Creates encoder due to type
 * Created by Alexey S. Kiselev
 */

import type {IEncoderProxy, IEncoder} from '../../interfaces';

import base62 from './base62'; // object already created, because of multiple usage
import base64 from './base64'; // object already created, because of multiple usage
import {Base32, Base32Hex, ZBase32, CrockfordBase32} from './base32';
import {BitcoinBase58, FlickrBase58, RippleBase58} from './base58';

class EncoderProxy implements IEncoderProxy {

    _encoders: {[string]: IEncoder};
    _allowed_encoders: {[string]: any};
    _current_encoder_name: string;
    _current_encoder: IEncoder;

    constructor() {
        this._allowed_encoders = {
            'base62': base62,
            'base64': base64,
            'base32': Base32,
            'base32Hex': Base32Hex,
            'z-base-32': ZBase32,
            'crockford-base32': CrockfordBase32,
            'base58': BitcoinBase58,
            'bitcoin-base58': BitcoinBase58,
            'flickr-base58': FlickrBase58,
            'ripple-base58': RippleBase58
        };
        // encoders already created must be in list of encoders by default
        this._encoders = {
            'base62': base62,
            'base64': base64
        };
    }

    /**
     * A list of allowed encoders
     * @returns {Array<string>} a list of encoders
     */
    get encoders(): Array<string> {
        return Object.keys(this._allowed_encoders);
    }

    /**
     * Current Encoder name
     * @returns {string} name of current Encoder
     */
    get encoder_name(): string {
        return this._current_encoder_name;
    }

    setEncoder(encoder: string): void {
        if (!this._allowed_encoders[encoder]) {
            throw new Error(`Encoder ${encoder} is not allowed`);
        }

        // if current encoder is the same - do nothing
        if (this._current_encoder_name === encoder) {
            return;
        }

        if (!this._encoders[encoder]) {
            this._encoders[encoder] = new this._allowed_encoders[encoder]();
        }

        this._current_encoder_name = encoder;
        this._current_encoder = this._encoders[encoder];
    }

    encode(str: string): string {
        return this._current_encoder.encode(str);
    }

    encodeFromByteArray(bytes: Array<number>): string {
        return this._current_encoder.encodeFromByteArray(bytes);
    }

    decode(str: string): string {
        return this._current_encoder.decode(str);
    }

    decodeToByteArray(str: string): Array<number> {
        return this._current_encoder.decodeToByteArray(str);
    }
}

const encoderProxy: IEncoderProxy = new EncoderProxy();

export default encoderProxy;

// @flow
/**
 * Random UID generators
 * Created by Alexey S. Kiselev
 */

import type {IUIDGenerator} from '../../../interfaces';

import RandomKsuidGenerator from './ksuid';
import RandomXidGenerator from './xid';
import RandomBetterGuidGenerator from './betterguid';
import RandomSonyflakeGenerator from './sonyflake';
import RandomSnowflakeGenerator from './snowflake';
import RandomUlidGenerator from './ulid';
import RandomUuidGenerator from './uuid';
import RandomShortUuidGenerator from './shortuuid';
import RandomSnoGenerator from './sno';

const ksuid: IUIDGenerator = new RandomKsuidGenerator();
const xid: IUIDGenerator = new RandomXidGenerator();
const betterguid: IUIDGenerator = new RandomBetterGuidGenerator();
const sonyflake: IUIDGenerator = new RandomSonyflakeGenerator();
const snowflake: IUIDGenerator = new RandomSnowflakeGenerator();
const ulid: IUIDGenerator = new RandomUlidGenerator();
const uuid: IUIDGenerator = new RandomUuidGenerator();
const shortuuid: IUIDGenerator = new RandomShortUuidGenerator();
const sno: IUIDGenerator = new RandomSnoGenerator();

module.exports = {
    ksuid,
    xid,
    betterguid,
    sonyflake,
    snowflake,
    ulid,
    uuid,
    shortuuid,
    sno
};

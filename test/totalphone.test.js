import assert from 'assert';
import thePhoneBill from '../totalphone.js';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/phone_bill2';

const config = {
    connectionString
}

if(process.env.NODE_ENV == "production"){
    config.ssl = {
        rejectUnauthorized: false
    }
}

const db = pgp(config);
const bill = thePhoneBill(db);

describe('thePhoneBill', function(){
    beforeEach(async () => {
        await db.manyOrNone('DELETE FROM addUser where id > 0');
        });  
    it('should be able to add a user', async function(){
        await bill.addUser('Bongani', 'sms100');
        const getUser = await bill.getTheUser('Bongani');
        assert.equal(getUser.length, 1);
    });
    it('should be able to get the plan', async function(){
        await bill.addUser('Bongani', 'sms100');
        const getUserPlan = await bill.getTheUserPlan('Bongani');
        const thePlanName = getUserPlan[0].price_plan;
        assert.equal(thePlanName, 'sms100');    
    });
    it('should be able to get the price of sms', async function(){
        await bill.addUser('Bongani', 'sms100');
        const getUserSms = await bill.getTheUserSms('Bongani');
        const theSmsPrice = getUserSms[0].sms_price;
        assert.equal(theSmsPrice, 1);
    });
    it('should be able to get the price of calls', async function(){
        await bill.addUser('Bongani', 'sms100');
        const getUserCall = await bill.getTheUserCall('Bongani');
        const theCallPrice = getUserCall[0].call_price;
        assert.equal(theCallPrice, 2);
    })
    after(async () => {
        await db.manyOrNone('Truncate addUser');
    })
});


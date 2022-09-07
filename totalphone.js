function thePhoneBill(db){
     async function addUser(name,thePlan){
      await db.none("insert into addUser (name, price_plan) values ($1, $2)", [name, thePlan]);
    } 
    async function getThePlan(thePlan){
        return await db.manyOrNone("select * from plans where plan_name = $1", [thePlan]);
    }
    async function getTheUser(name){
        return await db.manyOrNone("select * from addUser where name = $1", [name]);
    }
    async function getTheUserPlan(name){
        return await db.manyOrNone("select price_plan from addUser where name = $1", [name]);
    }
    async function getTheUserPrice(name){
        return await db.manyOrNone("select sms_price, call_price from plans where plan_name = (select price_plan from addUser where name = $1)", [name]);
    }
    async function getTheUserSms(name){
        return await db.manyOrNone("select sms_price from plans where plan_name = (select price_plan from addUser where name = $1)", [name]);
    }
    async function getTheUserCall(name){
        return await db.manyOrNone("select call_price from plans where plan_name = (select price_plan from addUser where name = $1)", [name]);
    }
    async function getTheUserSms100(){
        return await db.manyOrNone("select name from addUser where price_plan = 'sms100'");
    }
    async function getTheUserCall100(){
        return await db.manyOrNone("select name from addUser where price_plan = 'call100'");
    }
    async function getTheUserTextMe(){
        return await db.manyOrNone("select name from addUser where price_plan = 'text-me'");
    }
    return {
        addUser,
        getThePlan,
        getTheUser,
        getTheUserPlan,
        getTheUserPrice,
        getTheUserSms,
        getTheUserCall,
        getTheUserSms100,
        getTheUserCall100,
        getTheUserTextMe
    };
}

export default thePhoneBill;
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
    async function getTheUserSms(name){
        return await db.manyOrNone("select sms_price from plans where plan_name = (select price_plan from addUser where name = $1)", [name]);
    }
    async function getTheUserCall(name){
        return await db.manyOrNone("select call_price from plans where plan_name = (select price_plan from addUser where name = $1)", [name]);
    }
    async function getTheUserSms100(){
        const theSms100 = await db.manyOrNone("select name from addUser where price_plan = 'sms100'");
        // return the names of the users with the sms100 plan
        return theSms100;
    }
    async function getTheUserCall100(){
        const theCall100 = await db.manyOrNone("select name from addUser where price_plan = 'call100'");
        return theCall100;
    }
    async function getTheUserTextMe(){
        const theText =await db.manyOrNone("select name from addUser where price_plan = 'text-me'");
        return theText;
    }
    return {
        addUser,
        getThePlan,
        getTheUser,
        getTheUserPlan,
        getTheUserSms,
        getTheUserCall,
        getTheUserSms100,
        getTheUserCall100,
        getTheUserTextMe
    };
}

export default thePhoneBill;
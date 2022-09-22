import express from "express";
import bodyParser from "body-parser";
import exphbs, { engine } from "express-handlebars";
import thePhoneBill from "./totalphone.js";
import flash from "express-flash";
import session from "express-session";
import pgPromise from 'pg-promise';
// import greetRouter from './routes/routes.js';

const app = express();
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/phone_bill';

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

app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));
// ?
app.get('/', async (req, res) => {
    res.render('index',{
        total
    });
});
// ?
app.get("/price_plans", async (req, res) => {
    const getSms100 = await bill.getTheUserSms100();
    const getSms100Names = [];
    const getCall100 = await bill.getTheUserCall100();
    const getCall100Names = [];
    const getTextMe = await bill.getTheUserTextMe();
    const getTextMeNames = [];
    // each of getSms100 get name
    for (let i = 0; i < getSms100.length; i++) {
        getSms100Names.push(getSms100[i].name);
    }
    // each of getCall100 get name
    for (let i = 0; i < getCall100.length; i++) {
        getCall100Names.push(getCall100[i].name);
    }
    // each of getTextMe get name
    for (let i = 0; i < getTextMe.length; i++) {
        getTextMeNames.push(getTextMe[i].name);
    }
    res.render("price_plans", {
        getSms100Names,
        getCall100Names,
        getTextMeNames
    });
});
// ?
let total = 0;
app.post("/calc_bill", async (req, res) => {
    const { name } = req.body;
    const upperName = name.toUpperCase();
    const { theUsage } = req.body;
    // console.log(theUsage);
    // eg. theUsage = sms,sms,sms
    const usage = theUsage.split(",");
    // console.log(usage);
    // eg usage = ['call','sms','call']
    let getUser = await bill.getTheUser(upperName);
    // mabhozeni
    if(getUser.length != 0){
    const getUser1 = getUser[0].name;
    const getUserPlan = await bill.getTheUserPlan(getUser1);
    // sms100
    const getUserPlan1 = getUserPlan[0].price_plan;
    const getUserSms = await bill.getTheUserSms(getUser1);
    const getUserSms1 = getUserSms[0].sms_price;
    //1
    const getUserCall = await bill.getTheUserCall(getUser1);
    const getUserCall1 = getUserCall[0].call_price;
    //2
    let smsPrice = 0;
    // eg. smsPrice = [1, 1, 1, 1]
    let callPrice = 0;
    // eg. callPrice = [2, 2, 2, 2]
    if(getUser.length == 0){
        req.flash('info', 'Please enter a valid name');
        res.redirect('/');
    }else if(getUserPlan1 === "sms100" && getUser.length !== 0){
        for (let i = 0; i < usage.length; i++) {
            if (usage[i] === "sms") {
                smsPrice += getUserSms1;
            } else if (usage[i] === "call") {
                callPrice += getUserCall1;
            }
        }
    }else if(getUserPlan1 == "call100" && getUser.length !== 0){
        for (let i = 0; i < usage.length; i++) {
            if (usage[i] === "sms") {
                smsPrice += getUserSms1;
            } else if (usage[i] === "call") {
                callPrice += getUserCall1;
        }
    }
    }else if(getUserPlan1 == "text-me" && getUser.length !== 0){
        for (let i = 0; i < usage.length; i++) {
            if (usage[i] === "sms") {
                smsPrice += getUserSms1;
            } else if (usage[i] === "call") {
                callPrice += getUserCall1;
            } 
        }
    }
    total = smsPrice + callPrice;
}
    res.redirect('/');
});

app.get("/calc_bill", async (req, res) => {
    res.render("index", {
        total
    });
});

app.get("/price_plans", async (req, res) => {
    const getSms100 = await bill.getTheUserSms100();
    console.log(getSms100);
    const getCall100 = await bill.getTheUserCall100();
    const getTextMe = await bill.getTheUserTextMe();
    res.render("price_plans", {
        getSms100,
        getCall100,
        getTextMe
    });
    });
app.get("/link_user", async (req, res) => {
    res.render("link_user", {
    });
});
app.post("/link_user", async (req, res) => {
    const theName = req.body.username;
    const upperName = theName.toUpperCase();
    const thePlan = req.body.plan;
    const getTheUser = await bill.getTheUser(upperName);
    if(getTheUser.length === 0){
    await bill.addUser(upperName, thePlan);
    }
    res.render("link_user", {
    });
}); 


app.listen(process.env.PORT || 3_777, () => {
    console.log("Server is running on port 3_777");
});

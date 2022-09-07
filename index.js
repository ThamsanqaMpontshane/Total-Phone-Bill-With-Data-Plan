import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
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
    const name = req.query.name;
    const getUser = await bill.getTheUser(name);
    const getUserPlan = await bill.getTheUserPlan(name);
    const getUserPrice = await bill.getTheUserPrice(name);
    const getUserSms = await bill.getTheUserSms(name);
    const getUserCall = await bill.getTheUserCall(name);
    res.render('index',{
    });
});
// ?
app.get("/price_plans", async (req, res) => {
    res.render("price_plans", {
    });
});
// ?
app.post("/calc_bill", async (req, res) => {});

app.get("/price_plans/:id", async (req, res) => {
    res.render("price_plans", {
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

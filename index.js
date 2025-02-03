let express = require("express")
let app = express()
app.set("view engine","ejs")
app.listen(1000,()=>{
    console.log("port 1000 running")
})
app.use(express.static(__dirname + "/public/"));

const {MongoClient} = require("mongodb")
const client = new MongoClient("mongodb://localhost:27017")

var bodyParser = require ('body-parser')
const res = require("express/lib/response")
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get("",(req,res)=>{
    res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/registration",(req,res)=>{
    res.render("registration")
})
app.get("/balance",(req,res)=>{
    res.render("balance")
})
app.get("/deposit",(req,res)=>{
    res.render("deposit")
})
app.get("/withdraw",(req,res)=>{
    res.render("withdraw")
})
app.get("/nav",(req,res)=>{
    res.render("nav")
})
app.get("/account",(req,res)=>{
    res.render("account")
})

app.post("/regForm",urlencodedParser,async(req,res)=>{
    let con = await client.connect()
    let db = con.db("bank")
    let user = db.collection("user")
    user.insertOne(req.body).then((result)=>{                                                    
        res.send("<script> alert('NEW USER CREATED'); location='/account'; </script>")
        // res.redirect("/")
    })
})



app.get("/loginForm",urlencodedParser,async(req,res)=>{
    let con = await client.connect()
    let db = con.db("bank")
    let user = db.collection("user")
    let userData = await user.find({pass:req.body.pass ,user:req.body.pass }).toArray();
    if (userData.length>0){
        res.send ("<script> alert('LOGGED IN'); location='/nav'; </script>")
    }
    else{
        res.send("<script> alert('INVALID CREDENTIALS'); location='/'; </script>")
    }
})
app.post("/acc",urlencodedParser,async(req,res)=>{
    let con = await client.connect()
    let db = con.db("bank")
    let user = db.collection("account")
    user.insertOne(req.body).then((result)=>{                                                    
        res.send("<script> alert('Account created'); location='/nav'; </script>")
    })
})

app.post("/depositAmt",urlencodedParser,async(req,res)=>{
    let con = await client.connect()
    let db = con.db("bank")
    let user = db.collection("account")
    let userData = await user.findOne({accNo:req.body.accNo})
    console.log(userData)
    let balance = userData.balance;
    let newBalance = eval(balance) + eval(req.body.deposit);
    user.updateOne({accNo:req.body.accNo},{ $set: {balance:newBalance} }).then(async(result)=>{
        let showData = await user.findOne({accNo:req.body.accNo})
            res.render("showbal",{"i":showData})
    })
})

app.post("/withdrawAmt",urlencodedParser,async(req,res)=>{
    let con = await client.connect()
    let db = con.db("bank")
    let user = db.collection("account")
    let userData = await user.findOne({accNo:req.body.accNo});
    let balance = userData.balance;
    let newBalance = eval(balance) - eval(req.body.withdraw);
    user.updateOne({accNo:req.body.accNo},{ $set: {balance:newBalance} }).then(async(result)=>{
        let showData = await user.findOne({accNo:req.body.accNo})
            res.render("showbal",{"i":showData})
    })
})

app.get("/showbalance", (req,res) => {
        res.render("showbal")
    })

    app.post("/balance",urlencodedParser, async (req,res) => {
        let con =await client.connect()
        let db = con.db("bank")
        let user = db.collection("account")
        let showData = await user.findOne({accNo:req.body.accNo})
            res.render("showbal",{"i":showData})
        })

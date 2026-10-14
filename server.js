let express = require("express")
let session = require("express-session")
let bodyParser = require("body-parser")

let app = express()
//database
let users = [
    {username:"shaan",password:123456}
]

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    name:"sid",
    resave:false,
    saveUninitialized : false,
    secret : "thisismysecretcode",
    cookie:{
        maxAge : 1000 * 30
    }
}))

function  requireAuth(req,res,next){
    if(!req.session.username){
        return res.redirect("/login")
    }
    next()
}


//loginpage
app.get("/login",(req,res)=>{
    res.send(`
        <h1>Login Page</h1>
        <form action="/login" method="POST">
            Username : <input type="username" name="username"  />
            Password : <input type="password" name="password" />
            <button type="submit">Login</button>
        </form>
        `)
})

app.post("/login",(req,res)=>{
    let {username,password} =  req.body
    if(username,password){
        let user = users.find((u)=> u.username == username &&
            u.password == password)
        if(user){
            req.session.username = username
            // res.send("<h1>Welcome User</h1>")
           return res.redirect("/profile")
        }    
    }
    res.redirect("/login")
})

app.get("/profile",requireAuth,(req,res)=>{
    res.send(`<h1>Welcome User</h1> 
              <a href="logout">Logout</a>`)
})

app.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.error("Error Destroying Session:",err)
        }
        res.clearCookie("sid")
        res.redirect("/login")
    })
})



app.listen("3078",()=>{
    console.log("server is running on http://localhost:3078/login")
})

// nodemon server.js



//login functionality

let express = require("express")
// let session = require("express-session")
let bodyParser = require("body-parser")
let jwt = require("jsonwebtoken")
let cookieParser = require("cookie-parser")




let app = express()
app.use(cookieParser())




//database
let users = [
    {username:"shaan",password:123456}
]

let jwtSecret = "thisismysecretcode"

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

// app.use(session({
//     name:"sid",
//     resave:false,
//     saveUninitialized : false,
//     secret : "thisismysecretcode",
//     cookie:{
//         maxAge : 1000 * 30
//     }
// }))

// function  requireAuth(req,res,next){
//     if(!req.session.username){
//         return res.redirect("/login")
//     }
//     next()
// }

function verifyToken(req,res,next){
    let userToken = req.cookies.token
    if(!userToken){
        return res.status(401).send("TOKEN NOT FOUND")
    }
    // verifying token 
    jwt.verify(userToken,jwtSecret,(err,decoded)=>{
        if(err){
            console.log(err)
            return res.status(403).send("INVALID TOKEN")
        }
        req.user = decoded
        next()
    })
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
            let token= jwt.sign({username:user.username},jwtSecret,{
                expiresIn : "20s"
            })
            console.log(token)
            
            res.cookie("token",token,{
                httpOnly : true,
                maxAge : 40 * 1000
            })
            // req.session.username = username
            // res.send("<h1>Welcome User</h1>")
           return res.redirect("/profile")
        }    
    }
    res.redirect("/login")
})

app.get("/profile",verifyToken,(req,res)=>{
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

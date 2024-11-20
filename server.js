if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash= require('express-flash')
const session = require('express-session')
const methodOverride =require('method-override')  
const mysql = require("mysql")
const bodyParser = require("body-parser");
// const ejsLint = require('ejs-lint')
// // Parsing Middleware
app.use(bodyParser.urlencoded({ extended: false })); // true to false
app.use(bodyParser.json()); //{ extended: true }

const initializePassport =require('./passport-config')
initializePassport(
passport, 
email =>  users.find(user => user.email === email),
id => users.find(user => user.id === id)
)

const users =[]
// const users = require("./data/users");
const product = require("./data/product");

app.use(express.static("public"));
app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', (req, res)=>{    // checkAuthenticated, 
    res.render('index.ejs', {name:"river" }) //req.user.name
})

app.get('/login', checkNotAuthenticated, (req, res)=>{   
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local',{ // 
  successRedirect:'/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res)=>{  //
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res)=>{  //
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
 users.push({
    id: Date.now().toString(),
    name: req.body.name,
    emai: req.body.email,
    password: hashedPassword
 })
 res.redirect('/login')
  }catch{
res.redirect('/register')
  }
  console.log(users)
})

app.delete('/logout', (req, res)=>{
  req.logOut()
  res.redirect('/login')
})



// function checkAuthenticated(req, res, next){
//   if (req.isAuthenticated()){
//     return next()
//   }
//   res.redirect('/login')
// }

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/')
  }
  next()
}

app.get('/shopping', (req, res) => {
  res.render('shopping.ejs', { product: product }); ///show product important!!!
});
//next step of study: select 3 items to display:
// app.get('/shopping',  (req, res)=>{   
//     //   const query ="SELECT* FROM product LIMIT 3";
//     // //execute query
//     // connection.query(query, (error, result)=>{
//     //     if(!req.session.cart)
//     //     {
//     //         req.session.cart =[];
//     //     }
//     //     res.render("shopping.ejs", {product : result, cart: req.session.cart});
//     // });
// })


// //route for add item to cart---failed
// let cart = {}
// app.post('/add-cart/:product_id', (req,res)=>{
//     const product_id = req.body.product_id;   //req.params.id  ????
//     const product_price = req.body.product_price;   
//     const product_name = req.body.product_name;
// // const product = product.find(p => p.id == productId);
//     let count =0;
//     for(let i=0; i < req.session.cart.length; i++)   
//     {
//         if( req.session.cart[i].product_id  === product_id)  
//         {
//             req.session.cart[i].quantity += 1;
//             count++;
//         }
//     }
//     if(count === 0)
//     {const cart_data ={
//         product_id : product_id,
//         product_name : product_name,
//         product_price : parseFloat(product_price),
//         quantity : 1
//     };
//      req.session.cart.push(cart_data);  
// }
// res.redirect('/shopping');
// });

// app.get('/cart', (req, res) => {
//   res.render('cart', { cart: req.session.cart || [] });
// });


// // //route for remove item
// app.get("/remove_item", (req, res) => {
//     const product_id = req.query.id;
//     for(let i = 0; i < req.session.cart.length; i++)
//     { 
//         if(req.session.cart[i].product_id === product_id)
//         {
//             req.session.cart.splice(i, 1);
//         }
//     }
//     res.redirect("/");
// });

// //always here,  no change.
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.json({ error: err.message });
// });
app.listen(3000);


// //login components, steps
// //git init
// //npm init
// //npm i  nodemon--save-dev
// //npm i express express-session dotenv ejs body-parser mysql
// // server.js
// // passport-config.js
// //.env
// //views/index.ejs  login.ejs  register.ejs
// //npm run devStart
// //npm i bcrypt passport  express-flash
//npm i method-override
//for login.ejs
// <% if (message.error) { %>
//   <%= message.error %>
//   <%} %> 








// app.set("views", "./views");


// //REF make mysql database connection
// const connection = mysql.createConnection({
//     host :"localhost",
//     database :"testing",
//     user : "root",
//     password : ""
// })
// //check mysql database connection
// connection.connect((error)=>{
//     console.log("mysql database is connected  successfully");
// });

// //set up session middleware
// app.use(session({
//     secret : "1234567890abcdefghijklmnopqrstuvwxyz",
//     resave : false,
//     saveUnitialized : true,
//     cookie : {secure: false}
// }));







// app.listen(port, () => {
//   console.log(`Server listening on port: ${port}.`);
// });
//= app.listen(3000, () => {
//   console.log('Server listening on port 3000');
//   open('http://localhost:3000'); // Automatically open the browser
// });
// // Logging Middlewaare
// app.use((req, res, next) => {
//   const time = new Date();
//   console.log(
//     `-----
// ${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
//   );
//   if (Object.keys(req.body).length > 0) {
//     console.log("Containing the data:");
//     console.log(`${JSON.stringify(req.body)}`);
//   }
//   next();
// });
// const users = require("./routes/users");
// const posts = require("./routes/posts");
// const posts = require("./routes/comments");
// const error = require("./utilities/error");
//used all required libraries

var express = require('express'), 
http = require('http'),
path = require('path'),
fileUpload = require('express-fileupload'),
app = express(),
mysql  = require('mysql'),
bodyParser=require("body-parser"),
multer=require('multer'),
cors=require('cors');
const nodemailer = require('nodemailer');

app.use(cors());
//this line will directly search for uploaded-images names folder in our node project
app.use(express.static(path.join(__dirname, '/uploaded-images')));
app.use(express.static(path.join(__dirname, '/product-images')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PATH ='./uploaded-images'; 

// here we are using multer to store images at a particular path ,it is using diskStorage with request and file using a callback method which uses PATH to store images
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  }, 

//here it will match file format and if everything goes ok it will save with its original name and extension , here origina name is must cause it will help to find image and match with the name of path which is store in my sql user_image column , if use others it will save file as 'undefined-09876543' 
  filename: (req, file, cb) => {
 if (!file.originalname.match(/\.(jpg|png|JPEG)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return callback(err);
        } else {
            cb(null,file.originalname);
        }
  }
});
// it will help to store image file only ,here 'image' is a proptery of multer
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image.', 400), false);
  }
};


// it will create an object kind of to use while getting images from request
upload = multer({
storage: multerStorage,
filter:multerFilter
});


//creating database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'niit',
  database: 'fullstackdb'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//show all users with their roles
app.get('/api/users',(req, res) => {
  let sql = "SELECT * FROM registrationwithroles";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//show all user's profile
app.get('/api/users/profile',(req, res) => {
  let sql = "SELECT * FROM userprofile";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//getting all users from reg and userprofile table
 app.get('/api/users/foradmin',(req, res) => {
  let sql = "SELECT rg.user_reg_id,rg.user_email,rg.user_role,up.user_name,up.user_age,up.user_mobile ,up.user_address,up.user_gender,up.user_image from registrationwithroles rg left join userprofile up on rg.user_reg_id = up.user_reg_id ";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show single user
app.get('/api/users/:user_reg_id',(req, res) => {
  let sql = "SELECT * FROM registrationwithroles WHERE user_reg_id="+req.params.user_reg_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//add new user immediately after registration and before login
app.post('/api/users',(req, res) => {
  let data = {user_email: req.body.user_email, user_password: req.body.user_password,user_repassword: req.body.user_repassword,user_role:req.body.user_role};
  let sql = "INSERT INTO registrationwithroles SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});



//show single user's profile using profile id
app.get('/api/users/profile/:user_profile_id',(req, res) => {
var message='';
  let sql = "SELECT * FROM userprofile WHERE user_profile_id="+req.params.user_profile_id;
  let query = conn.query(sql, (err, results) => {
		if(results.length <= 0)
	  message = "Profile not found!"
    res.send(JSON.stringify({"status": 200, "error": null, "response": results,message:message}));
  });
});
 


// POST File - this will be used to upload image which comes from request , here you can see 'upload' object , we are uploading single image here
app.post('/api/upload', upload.single('userImage'), function (req, res) {
  if (!req.file) {
console.log("No file is available!");
return res.send({
success: false
});
} 
else {
return res.send({
success: true
});
}
});



//add new user's profile 
var imagePost= app.post('/api/users/profile',function(req, res){
console.log("in app.post method");
let data ={user_reg_id:req.body.user_reg_id,
user_name:req.body.user_name,
user_age:req.body.user_age,
user_mobile:req.body.user_mobile,
user_gender:req.body.user_gender,
user_address:req.body.user_address,
user_image:req.body.user_image};
let sql = "INSERT INTO userprofile SET ?";
let query = conn.query(sql, data,(err, results) => {
if(err) throw err;
res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
console.log("data stored in table and file stored in folder");
  });
});



 
//update user
app.put('/api/users/:user_reg_id',(req, res) => {
  let sql = "UPDATE registrationwithroles SET user_password='"+req.body.user_password+"',user_repassword='"+req.body.user_repassword+"' WHERE user_reg_id="+req.params.user_reg_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
console.log("password updated in table");
  });
});

//update user's profile
app.put('/api/users/profile/:user_profile_id',(req, res) => {
  let sql = "UPDATE userprofile SET user_name='"+req.body.user_name+"',user_age='"+req.body.user_age+"',user_mobile='"+req.body.user_mobile+"',user_gender='"+req.body.user_gender+"',user_address='"+req.body.user_address+"',user_image='"+req.body.user_image+"'WHERE user_profile_id="+req.params.user_profile_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//Delete user
app.delete('/api/users/profile/:user_reg_id',(req, res) => {
  let sql = "DELETE FROM registrationwithroles WHERE user_reg_id="+req.params.user_reg_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//Delete user's profile
app.delete('/api/users/:user_profile_id',(req, res) => {
  let sql = "DELETE FROM userprofile WHERE user_profile_id="+req.params.user_proifle_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

 //====================================================================//
//product api 

const PATH1 ='./product-images'; 

// here we are using multer to store images at a particular path ,it is using diskStorage with request and file using a callback method which uses PATH to store images
const multerStorage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH1);
console.log("taking path1");
  }, 

//here it will match file format and if everything goes ok it will save with its original name and extension , here original name is must cause it will help to find image and match with the name of path which is store in my sql user_image column , if use others it will save file as 'undefined-09876543' 
  filename: (req, file, cb) => {
 if (!file.originalname.match(/\.(jpg|png|JPEG)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return callback(err);
        } else {
console.log("calling cb in else");
            cb(null,file.originalname);
        }
  }
});

// it will help to store image file only ,here 'image' is a proptery of multer
const multerFilter1 = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
console.log("checking mimetype");
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image.', 400), false);
  }
};


// it will create an object kind of to use while getting images from request
upload1 = multer({
storage: multerStorage1,
filter:multerFilter1
});


// POST File - this will be used to upload image which comes from request , here you can see 'upload' object , we are uploading single image here
app.post('/api/uploadprdimage', upload1.single('productImage'), function (req, res) {
  if (!req.file) {
console.log("No file is available!");
return res.send({
success: false
});
} 
else {
console.log("in else after image upload");
return res.send({
success: true
});

}
});


//saving product image and data to an external folder and in database
var imagePost= app.post('/api/products',function(req, res){
console.log("in app.post method");
let data ={
product_name:req.body.product_name,
product_category:req.body.product_category,
product_description:req.body.product_description,
product_price:req.body.product_price,
unit_in_stock:req.body.unit_in_stock,
product_image:req.body.product_image};
let sql = "INSERT INTO productstable SET ?";
let query = conn.query(sql, data,(err, results) => {
if(err) throw err;
res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
console.log("data stored in table and product image stored in folder");
  });
});


//getting all product 
app.get('/api/products',(req, res) => {
  let sql = "SELECT * FROM productstable";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//show single user
app.get('/api/products/:product_id',(req, res) => {
  let sql = "SELECT * FROM productstable WHERE product_id="+req.params.product_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//update product units 
app.put('/api/products/units/:product_id',(req, res) => {
  let sql = "UPDATE productstable SET unit_in_stock='"+req.body.unit_in_stock+"'WHERE product_id="+req.params.product_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
console.log("data updated into table");
});



//update product
app.put('/api/products/:product_id',(req, res) => {
  let sql = "UPDATE productstable SET product_name='"+req.body.product_name+"',product_category='"+req.body.product_category+"',product_description='"+req.body.product_description+"',product_price='"+req.body.product_price+"',unit_in_stock='"+req.body.unit_in_stock+"',product_image='"+req.body.product_image+"'WHERE product_id="+req.params.product_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
console.log("data updated into table");
});


//Delete product
app.delete('/api/products/:product_id',(req, res) => {
  let sql = "DELETE FROM productstable WHERE product_id="+req.params.product_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//=========================================================
//cart api 


//inserting cart item
app.post('/api/cart/items',function(req, res){
console.log("=======before inserting cart items into cart==========");
let data ={
product_id:req.body.product_id,
user_reg_id:req.body.user_reg_id,
quantity:req.body.quantity,
total_price:req.body.total_price,
product_price:req.body.product_price,
product_name:req.body.product_name,
product_category:req.body.product_category,
product_description:req.body.product_description,
unit_in_stock:req.body.unit_in_stock,
product_image:req.body.product_image};
let sql = "INSERT INTO cartitem SET ?";
let query = conn.query(sql, data,(err, results) => {
if(err) throw err;
res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
console.log("after inserting cart items into cart");
  });
});

//SELECT rg.user_reg_id,rg.user_email,rg.user_role,up.user_name,up.user_age,up.user_mobile ,up.user_address,up.user_gender,up.user_image from registrationwithroles rg left join //userprofile up on rg.user_reg_id = up.user_reg_id ";


//getting all cart items with productstable joining
app.get('/api/cart/items',(req, res) => {
 let sql = "SELECT * from cartitem";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


 
//get cart items by Id 
app.get('/api/cart/items/:user_reg_id',(req, res) => {
  let sql = "SELECT * FROM cartitem WHERE user_reg_id="+req.params.user_reg_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//update cart item
app.put('/api/cart/items/:product_id/:user_reg_id',(req, res) => {
console.log("in upldate of cart items");
  let sql = "UPDATE cartitem SET quantity='"+req.body.quantity+"',total_price='"+req.body.total_price+"'WHERE product_id="+req.params.product_id+" and user_reg_id="+req.params.user_reg_id ;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
console.log("data updated into table");
});


//Delete cart item
app.delete('/api/cart/items/:product_id/:user_reg_id',(req, res) => {
  let sql = "DELETE FROM cartitem WHERE product_id="+req.params.product_id+" and user_reg_id="+req.params.user_reg_id ;;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//Delete whole cart item
app.delete('/api/cart/items/:user_reg_id',(req, res) => {
  let sql = "DELETE FROM cartitem WHERE user_reg_id="+req.params.user_reg_id ;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});



//Server listening
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});


//=====================================

// address api

app.post('/api/user/address',function(req, res){
console.log("=======before inserting address into addresstable==========");
let data ={
user_reg_id:req.body.user_reg_id,
full_name:req.body.full_name,
street_address_1:req.body.street_address_1,
street_address_2:req.body.street_address_2,
city:req.body.city,
state:req.body.state,
zip_code:req.body.zip_code
};
let sql = "INSERT INTO addresstable SET ?";
let query = conn.query(sql, data,(err, results) => {
if(err) throw err;
res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
console.log("after inserting address into addresstable");
  });
});




//getting all addresses
app.get('/api/user/address',(req, res) => {
  let sql = "SELECT * from addresstable";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//get address by Id 
app.get('/api/user/address/:user_reg_id',(req, res) => {
  let sql = "SELECT * FROM addresstable WHERE user_reg_id="+req.params.user_reg_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//update address
app.put('/api/user/address/:user_reg_id',(req, res) => {
console.log("in update of address");
let sql = "UPDATE addresstable SET full_name='"+req.body.full_name+"',street_address_1='"+req.body.street_address_1+"',street_address_2='"+req.body.street_address_2+"',city='"+req.body.city+"',state='"+req.body.state+"',zip_code='"+req.body.zip_code+"'WHERE user_reg_id="+req.params.user_reg_id;
let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
console.log("data updated into address table");
});

//Delete  address
app.delete('/api/user/address/:address_id',(req, res) => {
  let sql = "DELETE FROM addresstable WHERE user_reg_id="+req.params.user_reg_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//=====================================

// invoice api

//inserting invoice
app.post('/api/user/invoice',function(req, res){
console.log("=======before inserting invoice into invoicetable==========");
let data ={
user_reg_id:req.body.user_reg_id,
customer_details:req.body.customer_details,
purchased_date:req.body.purchased_date,
grand_total:req.body.grand_total,
};
let sql = "INSERT INTO userinvoice SET ?";
let query = conn.query(sql, data,(err, results) => {
if(err) throw err;
res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
console.log("after inserting invoice into invoicetable");
  });
});



//getting all invoices
app.get('/api/user/invoice',(req, res) => {
  let sql = "SELECT * from userinvoice";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//get single invoice
app.get('/api/user/invoice/:user_reg_id',(req, res) => {
  let sql = "SELECT * FROM userinvoice WHERE user_reg_id="+req.params.user_reg_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//update invoice
app.put('/api/user/invoice/:user_reg_id',(req, res) => {
console.log("in update of address");
let sql = "UPDATE userinvoice SET customer_details='"+req.body.customer_details+"',purchased_date='"+req.body.purchased_date+"',grand_total='"+req.body.grand_total+"'WHERE user_reg_id="+req.params.user_reg_id;
let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
console.log("data updated into address table");
});

//Delete  inovoice
app.delete('/api/user/address/:user_reg_id',(req, res) => {
  let sql = "DELETE FROM invoice WHERE user_reg_id="+req.params.user_reg_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//=================	

//cart history api

//inserting cart history item
app.post('/api/cart/items/history',function(req, res){
console.log("=======before inserting cart history items into cart==========");
let data ={
cart_item_id:req.body.cart_item_id,
product_id:req.body.product_id,
user_reg_id:req.body.user_reg_id,
quantity:req.body.quantity,
total_price:req.body.total_price,
product_price:req.body.product_price,
product_name:req.body.product_name,
product_category:req.body.product_category,
product_description:req.body.product_description,
unit_in_stock:req.body.unit_in_stock,
product_image:req.body.product_image};
let sql = "INSERT INTO cart_history SET ?";
let query = conn.query(sql, data,(err, results) => {
if(err) throw err;
res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
console.log("after inserting cart items into cart");
  });
});


//==================

//final cart
app.post('/api/usercart/items',function(req, res){
console.log("=======before inserting cart items into final cart==========");
let data ={
user_reg_id:req.body.user_reg_id,
grand_total:req.body.grand_total};
let sql = "INSERT INTO usercart SET ?";
let query = conn.query(sql, data,(err, results) => {
if(err) throw err;
res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
console.log("after inserting cart items into cart");
  });
});


//=========== sending mail api ============
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  provider: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: 'emailaddress', // Enter here email address from which you want to send emails
    pass: 'password' // Enter here password for email account from which you want to send emails
  },
  tls: {
  rejectUnauthorized: false
  }
});

app.post('/send', function (req, res) {

  let senderName = req.body.contactFormName;
  let senderEmail = req.body.contactFormEmail;
  let messageSubject = req.body.contactFormSubjects;
  let messageText = req.body.contactFormMessage;
  let copyToSender = req.body.contactFormCopy;

  let mailOptions = {
    to: ['vikram_6785@yahoo.com'], // Enter here the email address on which you want to send emails from your customers
    from: senderName,
    subject: messageSubject,
    text: messageText,
    replyTo: senderEmail
  };

  if (senderName === '') {
    res.status(400);
    res.send({
    message: 'Bad request'
    });
    return;
  }

  if (senderEmail === '') {
    res.status(400);
    res.send({
    message: 'Bad request'
    });
    return;
  }

  if (messageSubject === '') {
    res.status(400);
    res.send({
    message: 'Bad request'
    });
    return;
  }

  if (messageText === '') {
    res.status(400);
    res.send({
    message: 'Bad request'
    });
    return;
  }

  if (copyToSender) {
    mailOptions.to.push(senderEmail);
  }

  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.end('error');
    } else {
      console.log('Message sent: ', response);
      res.end('sent');
    }
  });
});

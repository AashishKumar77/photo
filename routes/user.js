var express = require('express');
var con = require('./db');
var formidable = require('formidable');
const mongoose = require('mongoose');
var body = require('body-parser');
var router = express.Router();
 var nodemailer = require('nodemailer');
var Genpassword = require('secure-random-password');
var User = require("../models/user_model");
var Client = require("../models/client_model");
var Studio = require("../models/studio_model");
var Event = require("../models/event_model");
var UploadImage = require("../models/upload_image_model");
var SharedImage = require("../models/shareimages_model");
var crypto = require('crypto');
var multer  = require('multer');
var client_profile_image = 'http://18.188.175.133/PhotoGraph/uploads/client_profile_images/';
var upload_images_url = 'http://18.188.175.133/PhotoGraph/uploads/images/';
var storage4 = multer.diskStorage({
destination: function(req,file,cb){
cb(null,'./uploads/images/');
},
filename:function(req,file,cb){
    cb(null,file.originalname);
}
});
var storage = multer.diskStorage({
    destination: function(req,file,cb){
    cb(null,'./uploads/profile_images/');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
    });
    var storage2 = multer.diskStorage({
        destination: function(req,file,cb){
        cb(null,'./uploads/client_profile_images/');
        },
        filename:function(req,file,cb){
            cb(null,file.originalname);
        }
        });
        var storage1 = multer.diskStorage({
            destination: function(req,file,cb){
            cb(null,'./uploads/studio_profile/');
            },
            filename:function(req,file,cb){
                cb(null,file.originalname);
            }
            });
var upload_profile = multer({ storage : storage1 });
var upload_profile_image = multer({ storage : storage1 });
var upload_client_profile = multer({ storage : storage });
var uploads_images = multer({ storage : storage4 });
var upload_image = multer({ storage : storage });
var upload_studio_profile = multer({ storage : storage1 });
var upload = multer({ storage : storage2 });
var baseurl = 'http://18.188.175.133/PhotoGraph/uploads/profile_images/deafult.png';
var studio_profile ='http://18.188.175.133/PhotoGraph/uploads/studio_profile/'; 
// var transporter = require("../config/email");
// --------------Register api ----------- //
router.post('/register', upload_profile.single('file'), (req,res,next) => {
    var email = req.body.email;
    var pwd = req.body.password;
    var c_date = req.body.date;
    var m_date = req.body.date;
    var type = req.body.type;
    var usertype = req.body.user_type;
    // var mykey = crypto.createCipher('aes-128-cbc', 'pwd');
    // var password = mykey.update(pwd, 'utf8', 'hex') + mykey.final('hex');
    var phone = req.body.phone_no;
    var country_code = req.body.country_code;
    var random_num = Math.floor(Math.random() * 1000000) + 1;
    var de_token = random_num.toString();
    var mykey = crypto.createCipher('aes-128-cbc', 'token');
    var token_en = mykey.update(de_token, 'utf8', 'hex') + mykey.final('hex');
   if(email == "" || pwd == "" || phone == "" || country_code == ""){
    user.save().then().catch(err => {
        res.status(500).json({
            "Status":"0",
          "message":"All fields are required"
        });
    });
   }else{
       var user = new User({
         email:email,
         password:pwd,
         phone_number:phone,
         country_code:country_code,
         created_date:c_date,
         modified_date:m_date,
         is_deleted:"0",
         token:token_en,
         type:type,
         social_id:"",
         user_name:"",
         user_type:usertype,
         profile_image:""

       });
       user
       .save()
       .then(result=>{
          res.status(201).json({
              status:"1",
              message:"Registered Successfully",
              user_id:user._id,
              token:user.token
          });
       })
       .catch(err =>{
        res.status(500).json({
          "Status":"0",
          "message":"Email already Registered"
        });
       });
   }
});
// --------------Register api ----------- //

//-------------Social login api ---------//
router.post('/sociallogin', function(req, res, next) {
        User.findOne({ 'social_id': req.body.social_id }, function(err, data) {
            if(data == null){
                var social_id = req.body.social_id;
                var user_name = req.body.user_name;
                var email = req.body.email;
                var type = req.body.type;
                var random_num = Math.floor(Math.random() * 1000000) + 1;
                var de_token = random_num.toString();
                var mykey = crypto.createCipher('aes-128-cbc', 'token');
                var token_en = mykey.update(de_token, 'utf8', 'hex') + mykey.final('hex');
                var user = new User({
                    social_id:social_id,
                    type:type,
                    user_name:user_name,
                    token:token_en,
                    email:email
                });
                user.save().then(result=>{
                    res.status(201).json({
                        status:"1",
                        message:"Registration Successfully",
                        user_id:user._id,
                        token:user.token,
                        "register_or_login":'R'
                    });
                }).catch();
            }
            else{
                res.json({
                    "status": "1",
                    "status_message": "Logged in Successfully",
                    "user_id": data._id,
                    "token": data.token,
                    "register_or_login":'L'
                });
            }
        });
    });
 
//-------------Social login api ---------//
//-------------------login api ------------//

router.post('/login', function(req, res, next) {
    var pwd = req.body.password;
        User.findOne({ 'email': req.body.email }, function(err, data) {
            try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        if (data.email != req.body.email) {
                            res.json({
                                "status": "0",
                                "status_message": "Email does not exist.",
                            }); return;
                        } if (data.password == pwd) {
                            res.json({
                                "status": "1",
                                "status_message": "Logged in Successfully",
                                "user_id": data._id,
                                "token": data.token,
                            }); return;
                           
                        } else {
                            res.json({
                                "status": "0",
                                "status_message": "Wrong Password.",
                            }); return;
                        }
                    } else {
                        res.json({
                            "status": "0",
                            "status_message": "User not Found",
                        }); return;
                    }
                }
            } catch (e) {
                res.json({ "status": "0", "status_message": "", 'error': e }); return;
            }
        });
    
});
//-------------------login api ------------//

//------------------Forgot password api ------------//

router.post('/forgot', upload_profile.single('file'), function(req, res, next) {
                  var  email = req.body.email;
                  var randomstring = Genpassword.randomPassword({ characters: [
                 { characters: Genpassword.upper, exactly: 1 },
                     { characters: Genpassword.symbols, exactly: 1 },
                     { characters:Genpassword.digits, exactly: 2},
                     Genpassword.lower ] });
                     User.findOne({ 'email': req.body.email }, function(err, data) {
                         if(data){
                         var myquery = { _id: data._id };
                        var newvalues = { $set: {password:randomstring} };
                         User.updateMany(myquery, newvalues, function(err, result) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'keyfisolutions@gmail.com',
                          pass: 'Comal1845'
                        }
                      });
                  
                      var mailOptions = {
                        from: 'keyfisolutions@gmail.com',
                        to: email,
                        subject: 'Forgot Password',
                        text: 'Your new password is ' + randomstring
                      };
 
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            res.json({
                                "status": "1",
                                "status_message": "Please Enter valid Email address"
                              });
                          
                        } else {
                          res.json({
                            "status": "1",
                            "status_message": "New Password has been sent to your email address"
                          });
                        }
                      });
                    });
                }
                else{
                    res.json({
                                    "status": "0",
                                    "status_message": "Email is not Registered",
                                }); return;
                }
                });
});


//-------------------Forgot password api ------------//

//------------------Edit pofile api ----------------//
router.post('/edit_profile', upload_profile_image.single('image'),(req, res, next) =>{
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
    User.findOne({ 'token': req.headers.token }, function(err, data) {
         try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
                if (data) {
                    Studio.findOne({ 'photograph_id': data._id }, function(err, data2) {
                    if(data2){
                        var id = data2.photograph_id;
                        var country_code = req.body.country_code;
                        var studio_name = req.body.studio_name;
                        var studio_email = req.body.studio_email;
                        var phone_no = req.body.studio_phone_no;
                        var photographer_name1 = req.body.photographer_name;
                        if(!req.file){
                            image = "";
                        }
                        else{
                            image = req.file.originalname;
                        }
                        var myquery = { photograph_id: data._id };
                        var newvalues = { $set: {studio_email:studio_email,studio_name:studio_name,studio_phone_no:phone_no,country_code:country_code,file:image,photographer_name:photographer_name1} };
                        Studio.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                Studio.findOne({ 'photograph_id': data._id }, function(err, data3) {
        
                                if(data3){
                                    console.log(data3)
                                    res.json({
                                        "status": "1",
                                        "status_message":"Data Updated Successfully",
                                        "id":data3._id,
                                        "image":studio_profile+data3.file,
                                        "name":data3.studio_name,
                                        "email":data3.studio_email,
                                        "country_code":data3.country_code,
                                        "phone_no":data3.studio_phone_no,
                                        "photographer_name":data3.photographer_name
                                    });return;
                                }
                                });
                            }
                        });
                    }
                    });
   
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found1",
                    }); return;
            }
        }
    }catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });

                }
	});



//------------------Edit pofile api --------------//

//------------------edit studio profile -----------//
router.post('/edit_studio_profilepic', upload_profile.single('file'),(req, res, next) =>{
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
    User.findOne({ 'token': req.headers.token }, function(err, data) {
         try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
                if (data) {
                    Studio.findOne({ 'photograph_id': data._id }, function(err, data2) {
                    if(data2){
                        var file = req.file.originalname;
                        var myquery = { photograph_id: data._id };
                        var newvalues = { $set: {file:file} };
                        Studio.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                Studio.findOne({ 'photograph_id': data._id }, function(err, data3) {
                                   res.json({
                                "status": "1",
                                "status_message": "Data updated successfully",
                                "result":data3
                            }); return;
                                });
                            }
                        });
                    }
                    });
   
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found1",
                    }); return;
   
            }
            
        }
    }catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });

                }
	});

// ----------------edit studio profile ----------//

//----------------get profile -----------------//
router.post('/get_profile', (req, res, next) =>{
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
    User.findOne({ 'token': req.headers.token }, function(err, data) {
        try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
                if (data) {
                    if (data.token != req.headers.token) {
                        res.json({
                            "status": "0",
                            "status_message": "User does not Exist.",
                        }); return;
                    } else {
                        Studio.find({ 'photograph_id': data._id }, function(err, data) {
                           if(data){
                               data.forEach(function(element) {
                                   if(element.file ==""){
                                       var image = baseurl;
                                   }else{
                                  var image = studio_profile+element.file;
                                   }
                                res.json({
                                        "status": "1",
                                        "image":image,
                                        "name":element.studio_name,
                                        "country_code":element.country_code,
                                        "email":element.studio_email,
                                        "phone_no":element.studio_phone_no,
                                        "photographer_name":element.photographer_name
                                    }); return;
                              });
                           }
                         });
                       
                    }
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found",
                    }); return;
                }
            }
        } catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });
}

});
//-----------------------get Profile ----------------//

//----------------- add client ---------------------------//

router.post('/add_client',upload.single('image'), (req,res,next) => {
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
    User.findOne({ 'token': req.headers.token }, function(err, data) {
        try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
                if (data) {
                    if (data.token != req.headers.token) {
                        res.json({
                            "status": "0",
                            "status_message": "User does not Exist.",
                        }); return;
                    } else {
                        var photograph_id = data._id;
                        var cemail = req.body.email;
                        var cname = req.body.client_name;
                        var c_date = req.body.date;
                        var m_date = req.body.date;
                        var phone = req.body.phone_no;
                        var country_code = req.body.country_code;
                    
                        
                        if(!req.file){
                            file = "";
                        }
                        else{
                            file = req.file.originalname;
                         }
                         Client.find({ 'client_phone_no': phone,'country_code':country_code}, function(err, data) {
                         var count = data.length;
                         console.log(count)
                             if(count == 0){
                               var client = new Client({
                                 client_email:cemail,
                                 photograph_id:photograph_id,
                                 client_phone_no:phone,
                                 password : "",
                                 token:"",
                                 country_code:country_code,
                                 created_date:c_date,
                                 modified_date:m_date,
                                 is_deleted:"0",
                                 client_name:cname,
                                 profile_image:file,
                               });
                               
                               client
                               .save()
                               .then(result=>{
                                   if(client.profile_image){
                                    var imageurl =  client_profile_image+client.profile_image 
                                   }else{
                                       var imageurl  = baseurl;
                                   }
                                  res.status(201).json({
                                      status:"1",
                                      message:"Client added successfully",
                                      client_id:client._id,
                                      client_name:client.client_name,
                                      image:imageurl,
                                      date:client.created_date
                                  });
                               })
                               .catch(err =>{
                                res.status(500).json({
                                  "Status":"0",
                                  "message":"Email already Registered"
                                });
                               });
                            }else{
                                res.status(500).json({
                                    "Status":"0",
                                    "message":"Client Already exist",
                                    "data":data

                                  });
                            }
                            });
                    }
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found",
                    }); return;
                }
            }
        } catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });
}
	});
// ----------------------add client -------------//

//---------------------get client -------------//
router.post('/get_client', (req, res, next) =>{
if(!req.headers.token){
                     res.json({
                        "status": "0",
                        "status_message": "Fields are required",
                    }); return;
}
else{
    User.findOne({ 'token': req.headers.token }, function(err, data) {
        try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
                if (data) {
                    if (data.token != req.headers.token) {
                        res.json({
                            "status": "0",
                            "status_message": "User does not Exist.",
                        }); return;
                    } else {
                        Client.find({ 'photograph_id': data._id }, function(err, dataa) {
                            var  data = [];
                            dataa.forEach(function(data2){
                                if(data2.profile_image){
                                    var image  = client_profile_image+data2.profile_image;
                                }else{
                                    var image = baseurl;
                                }
                                data.push({
                                                    "_id":data2._id,
                                                    "country_code": data2.country_code,
                                                    "client_name":data2.client_name ,
                                                    "client_email": data2.client_email,
                                                    "client_phone_no": data2.client_phone_no,
                                                    "created_date": data2.created_date,
                                                    "modified_date": data2.modified_date,
                                                    "profile_image":image 
                                
                                                  });
                                                });
                                                res.json({
                                                  "status": "1",
                                                  "status_message": "Record Found",
                                                  "data":data,
                                                });
                        });
                    
                                }
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found",
                    }); return;
                }
            }
        } catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });
}
                                });

//---------------------get client-------------//

//---------------------save profile -----------//
router.post('/save_profile',upload_studio_profile.single('image'), (req,res,next) => {
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
    User.findOne({ 'token': req.headers.token }, function(err, data) {
        try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"User not required"
                });return;
            } else {
                if (data) {
                    if (data.token != req.headers.token) {
                        res.json({
                            "status": "0",
                            "status_message": "User does not Exist.",
                        }); return;
                    } else {
                        var photograph_id = data._id;
                        var studio_email = req.body.studio_email;
                        var phone = req.body.studio_phone_no;
                        var country_code = req.body.studio_country_code;
                        var studio_name_var = req.body.studio_name;
                        var studio_name_status = req.body.studio_name_on_image;
                        var slide_Show_time = req.body.slide_Show_time;
                        var interval = req.body.interval;
                        var disable_interval_view = req.body.disable_interval_view;
                        var photographer_name = req.body.photographer_name;
                        var c_date = req.body.date;
                        var m_date = req.body.date;
                        if(!req.file){
                            file = "";
                        }
                        else{
                            file = req.file.originalname;
                        }
                               var studio = new Studio({
                                 country_code:country_code,
                                 studio_email:studio_email,
                                 studio_name:studio_name_var,
                                 studio_phone_no:phone,
                                 slide_Show_time:slide_Show_time,
                                 interval:interval,
                                 disable_interval_view:disable_interval_view,
                                 photograph_id:photograph_id,
                                 created_date:c_date,
                                 modified_date:m_date,
                                 is_deleted:"0",
                                 studio_name_on_image:studio_name_status,
                                 file:file,
                                 photographer_name:photographer_name
                               });
                               studio
                               .save()
                               .then(result=>{
                                   if(studio.file){
                                     var image = studio_profile+studio.file;
                                   }else{
                                     var image = baseurl;
                                   }
                                  res.status(201).json({
                                      status:"1",
                                      message:"Successfull",
                                      date:studio.created_date,
                                      studio_id:studio._id,
                                      studio_name:studio.studio_name,
                                      photographer_name:photographer_name,
                                      studio_image:image,
                                  });
                               })
                               .catch(err =>{
                                res.status(500).json({
                                  "Status":"0",
                                  "message":"Email already Registered"
                                });
                               });
                    }
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found",
                    }); return;
                }
            }
        } catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });
}
	});

//--------------------save profile ------------//

//-----------------change password ----------//

router.post('/change_password',upload.single('profile_image'), (req,res,next) => {
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are gdfrequired",
       }); return;
}
else{
    User.findOne({ 'token': req.headers.token }, function(err, data) {
        try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"User not required"
                });return;
            } else {
                if (data) {
                    if (data.token != req.headers.token) {
                        res.json({
                            "status": "0",
                            "status_message": "User does not Exist.",
                        }); return;
                    } else {
                        var pwd_old = req.body.old_password;
                        if(pwd_old == data.password){
                           
                            var new_password = req.body.new_password;
                            var confirm_password = req.body.confirm_password;
                            if(new_password == confirm_password){
                                var myquery = { _id:data._id};
                                var newvalues = { $set: {password:new_password} };
                                User.update(myquery, newvalues, function(err, result) {
                                    res.json({
                                        "status": "1",
                                        "status_message": "Password updated",
                                    }); return;
                                });
                            }else{
                                res.json({
                                    "status": "1",
                                    "status_message": "New password or confirm Password are not matched",
                                }); return;
                            }
                        }else{
                            res.json({
                                "status": "0",
                                "status_message": "old password not matched.",
                                "data":data
                            }); return; 
                        }
                    }
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found",
                    }); return;
                }
            }
        } catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });
}
});
//-----------------change password ---------//

//-------------------add event --------------//

router.post('/add_event',upload.single('number_of_images'), (req,res,next) => {
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{

    User.findOne({ 'token': req.headers.token }, function(err, data) {
        try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
                if (data) {
                    if (data.token != req.headers.token) {
                        res.json({
                            "status": "0",
                            "status_message": "User does not Exist.",
                        }); return;
                    } else {
                        var photograph_id = data._id;
                        var event_name = req.body.event_name;
                        var client_id = req.body.client_id;
                        var event__created_date = req.body.date;
                        var c_date = req.body.date;
                        var m_date = req.body.date;
                               var event = new Event({
                                 event_name:event_name,
                                 client_id:client_id,
                                 photograph_id:photograph_id,
                                 event__created_date:event__created_date,
                                 created_date:c_date,
                                 modified_date:m_date,
                                 is_deleted:"0",
                                 number_of_images:""
                               });
                               event
                               .save()
                               .then(result=>{
                                  res.status(201).json({
                                      status:"1",
                                      message:"Event added successfully",
                                  });
                               })
                               .catch(err =>{
                                res.status(500).json({
                                  "Status":"0",
                                  "message":"Email already Registered"
                                });
                               });
                    }
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found",
                    }); return;
                }
            }
        } catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });
}
	});
//-------------------add event -------------//

//-----------------get event --------------//
router.post('/get_event', (req, res, next) =>{
    if(!req.headers.token){
                         res.json({
                            "status": "0",
                            "status_message": "Fields are required",
                        }); return;
    }
    else{
        User.findOne({ 'token': req.headers.token }, function(err, data) {
            try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        if (data.token != req.headers.token) {
                            res.json({
                                "status": "0",
                                "status_message": "User does not Exist.",
                            }); return;
                        } else {
                            Event.find({ 'photograph_id': data._id ,client_id:req.body.client_id}, function(err, data) {
                                // console.log(data)
                                // var count =  data.length;
                                // for(var i=0; i>=count; i++ ){
                                //   console.log(data.i)
                                // }
                                var  record = [];
                                data.forEach(function(data3){
                                  if(data3.number_of_images == ""){
                                      var image = "0"
                                  }else{
                                    var image = data3.number_of_images;
                                  }

                                                      record.push({
                                                        "_id": data3._id,
                                                        "event_name": data3.event_name,
                                                        "event__created_date": data3.event__created_date,
                                                        "created_date": data3.created_date,
                                                        "modified_date": data3.modified_date,
                                                        "number_of_images": image
                                                         
                                                      });
                                                    });
                                                    res.json({
                                                      "status": "1",
                                                      "status_message": "Record Found",
                                                      "data":record,
                                                    });
                       
                       
                                //        res.json({
                        //     "status": "1",
                        //     "status_message": "shown Successfully",
                        //     "data":data,
                            
                        // }); return;
                            });
                        
                                    }
                    } else {
                        res.json({
                            "status": "0",
                            "status_message": "User not Found",
                        }); return;
                    }
                }
            } catch (e) {
                res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
            }
        });
    }
                                    });
//-----------------get event ------------//

//---------------upload Image -----------//
router.post('/upload_images',uploads_images.single('image'), (req, res, next) =>{
    if(!req.headers.token){
                         res.json({
                            "status": "0",
                            "status_message": "Fields are required",
                        }); return;
    }
    else{
        User.findOne({ 'token': req.headers.token }, function(err, data) {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        console.log(data)
                        if (data.token != req.headers.token) {
                            res.json({
                                "status": "0",
                                "status_message": "User does not Exist.",
                            }); return;
                        } else {
                            UploadImage.find({ 'event_id': req.body.event_id}, function(err, data2) {
                                var varr = '1';

                              var add1 = data2.length;
                              var count = Number(varr)+Number(add1);
                              console.log(count)
                              var myquery = { _id:req.body.event_id};
                                var newvalues = { $set: {number_of_images:count} };
                                Event.update(myquery, newvalues, function(err, result) {
                                });
                            });
                            var photograph_id = data._id;
                            var event_id = req.body.event_id;
                            var image = req.file.originalname;
                            var uploadimage = new UploadImage({
                               photograph_id:photograph_id,
                               image:image,
                               event_id:event_id
                              });
                              uploadimage
                              .save()
                              .then(result=>{
                                 res.status(201).json({
                                     status:"1",
                                     message:"image uploaded",
                                     image_id:uploadimage._id,
                                     image:upload_images_url+uploadimage.image 
                                 });
                              })
                              .catch(err =>{
                               res.status(500).json({
                                 "Status":"0",
                                 "message":"error"
                               });
                              });
                        
                                    }
                    } else {
                        res.json({
                            "status": "0",
                            "status_message": "User not Found",
                        }); return;
                    }
                }
        });
    }
                                    });

//--------------upload Image -----------//

//-------------shared images -------------//
router.post('/shared_images',upload_image.single('image'), (req, res, next) =>{
    if(!req.headers.token){
                         res.json({
                            "status": "0",
                            "status_message": "Fields are required",
                        }); return;
    }
    else{
        User.findOne({ 'token': req.headers.token }, function(err, data) {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        
                        if (data.token != req.headers.token) {
                            res.json({
                                "status": "0",
                                "status_message": "User does not Exist.",
                            }); return;
                        } else {
                            var photograph_id = data._id;
                            var client_id = req.body.client_id;
                            var upload_images_id = req.body.images_id;
                            var preview_mode = req.body.preview_mode;
                            var sharedimage = new SharedImage({
                               photograph_id:photograph_id,
                               image_ids:upload_images_id,
                               client_id:client_id,
                               preview_mode:preview_mode
                              });
                              sharedimage
                              .save()
                              .then(result=>{
                                 res.status(201).json({
                                     status:"1",
                                     message:"Images are shared with client",
                                 });
                              })
                              .catch(err =>{
                               res.status(500).json({
                                 "Status":"0",
                                 "message":"error"
                               });
                              });
                        
                                    }
                    } else {
                        res.json({
                            "status": "0",
                            "status_message": "User not Found",
                        }); return;
                    }
                }
        });
    }
                                    });

//------------shared images -------------//

//-------------get client profile ------//

router.post('/get_client_profile', (req, res, next) =>{
    if(!req.headers.token){
                         res.json({
                            "status": "0",
                            "status_message": "Fields are required",
                        }); return;
    }
    else{
        Client.findOne({ 'token': req.headers.token }, function(err, data) {
            try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        if (data.token != req.headers.token) {
                            res.json({
                                "status": "0",
                                "status_message": "User does not Exist.",
                            }); return;
                        } else {
                           if(data){
                               if(data.profile_image){
                                var profile_image =client_profile_image+profile_image;
                               }else{
                                   var profile_image = baseurl; 
                               }

                               
                               res.json({
                            "status": "1",
                            "status_message": "shown Successfully",
                            "country_code": data.country_code,
                            "client_name":data.client_name,
                            "client_email":data.client_email,
                            "is_deleted": data.is_deleted,
                            "profile_image": profile_image,
                            "photograph_id": data.photograph_id,
                            "password": data.password,
                            "_id": data._id,
                            "client_phone_no": data.client_phone_no,
                            "created_date": data.created_date,
                           });
                           }  
                          


                            //    res.json({
                            // "status": "1",
                            // "status_message": "shown Successfully",
                            // "data":data,
                            
                    
                        
                        
                                    }
                    } else {
                        res.json({
                            "status": "0",
                            "status_message": "User not Found",
                        }); return;
                    }
                }
            } catch (e) {
                res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
            }
        });
    }
                                    });
    

//-------------get client profile ------//

//--------------edit client profile ----- //

router.post('/edit_client_profile',upload_client_profile.single('image'),(req, res, next) =>{
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
Client.findOne({ 'token': req.headers.token }, function(err, data) {
         try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
               
                if (data) {
                    console.log(data)
                        var country_code = req.body.country_code;
                        var user_name = req.body.user_name;
                        var email = req.body.email;
                        var phone_no = req.body.phone_no;
                         if(!req.file){
                            image = "";
                        }
                        else{
                            image = req.file.originalname;
                        }
                        var myquery = { _id: data._id };
                        console.log(myquery)
                        var newvalues = { $set: {client_email:email,client_name:user_name,client_phone_no:phone_no,country_code:country_code,profile_image:image} };
                        console.log(newvalues)
                        Client.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                Client.findOne({ '_id': data._id }, function(err, data3) {
                                   res.json({
                                "status": "1",
                                "status_message": "Data updated successfully",
                                "result":data3
                
                            }); return;
                                });
                            }
                        });


                    
                    
   
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found1",
                    }); return;
   
            }
            
        }
    }catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });

                }
	});


//--------------edit client profile -----//


    //----------------------get gallery api ---------//
  
    router.post('/get_gallery',upload_client_profile.single('file'),(req, res, next) =>{
        if(!req.headers.token){
            res.json({
               "status": "0",
               "status_message": "Fields are required",
           }); return;
    }
    else{
        User.findOne({ 'token': req.headers.token }, function(err, data) {
             try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        UploadImage.find({ 'event_id': req.body.event_id }, function(err, data2) {
                            var  record = [];
                            data2.forEach(function(data3){
                                                  record.push({
                                                  "image_id": data3.id,
                                                  "image":upload_images_url+data3.image,
                                
                                                  });
                                                });
                                                res.json({
                                                  "status": "1",
                                                  "status_message": "Record Found",
                                                  "record":record,
                                                });
                                                
                            //    res.json({
                            //     "status": "1",
                            //     "data":data2,
                            //      //"image":'http://18.188.175.133/uploads/images/'+data2.image,
                            // }); return;
                         
                           
                        });
                    } else {
                        res.json({
                            "status": "0",
                            "status_message": "User not Found1",
                        }); return;
                }
            }
        }catch (e) {
                res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
            }
        });
    
       }
        });
//---------------------get gallery api ---------//

//--------------update prefrences =------//
router.post('/update_prefrences',upload_studio_profile.single('image'),(req, res, next) =>{
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
    User.findOne({ 'token': req.headers.token }, function(err, data) {
         try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
                if (data) {
                         var studio_name_on_image = req.body.studio_name_on_image;
                         var interval = req.body.interval;
                         var slide_Show_time = req.body.slide_Show_time;
                         var disable_interval_view = req.body.disable_interval_view;
                         if(!req.file){
                            image = "";
                        }
                        else{
                            image = req.file.originalname;
                        }


                        var myquery = {_id:req.body.studio_id};
                        var newvalues = { $set: {studio_name_on_image:studio_name_on_image,interval:interval,slide_Show_time:slide_Show_time,disable_interval_view:disable_interval_view,file:image} };
                        Studio.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                   res.json({
                                "status": "1",
                                "status_message": "Data updated successfully",
                                
                
                            }); return;
                                
                            }
                        });
                } else {
                    res.json({
                        "status": "0",
                        "status_message": "User not Found1",
                    }); return;
            }
        }
    }catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });

   }
    });
    //---------------update prefrences  ----------------------//

//----------------- client register ---------------------------//
router.post('/client_register', upload_profile.single('file'), (req,res,next) => {
     var pwd = req.body.password;
    var phone = req.body.phone_no;
    var country_code = req.body.country_code;
    var random_num = Math.floor(Math.random() * 1000000) + 1;
    var de_token = random_num.toString();
    var mykey = crypto.createCipher('aes-128-cbc', 'token');
    var token_en = mykey.update(de_token, 'utf8', 'hex') + mykey.final('hex');
   if(pwd == "" || phone == "" || country_code == ""){
        res.status(500).json({
            "Status":"0",
          "message":"All fields are required"
        });
   }else{
    Client.findOne({ 'client_phone_no': phone,'country_code':country_code}, function(err, data) {
        if(data){
            console.log(data)
            var myquery1 = {client_phone_no:data.client_phone_no};
            
            var newvalues1 = { $set: {password:req.body.password} };
            
            Client.updateMany(myquery1, newvalues1, function(err, result) {
        // var  record = [];
        // data.forEach(function(data3){
        //                       record.push({
        //                                 "country_code": data3.country_code,
        //                                 "client_name": data3.client_name,
        //                                 "client_id": data3._id,
        //                                 "client_email": data3.client_email,
        //                                 "client_phone_no": data3.client_phone_no,
        //                                 "profile_image": data3.profile_image,
        //                                 "password":data3.password
        //                       });
        //                     });
        if(result){
                            res.json({
                              "status": "1",
                              "status_message": "Record Found",
                              "data":result,
                            });
                        }else{
                            res.json({
                                "status": "1",
                                "status_message": "not update",
                                "data":result,
                              });
                        }
                        });
        }
        else{
            var pwd = req.body.password;
            var phone = req.body.phone_no;
            var country_code = req.body.country_code;
            var random_num = Math.floor(Math.random() * 1000000) + 1;
            var de_token = random_num.toString();
            var mykey = crypto.createCipher('aes-128-cbc', 'token');
            var token_en = mykey.update(de_token, 'utf8', 'hex') + mykey.final('hex');
            var client = new Client({
                client_phone_no:phone,
                country_code:country_code,
                is_deleted:"0",
                profile_image:"",
                password:pwd,
                token:token_en,
              });
              client
              .save()
              .then(result=>{
                 res.status(201).json({
                     status:"1",
                     message:"Registered Successfully",
                     data:client
                 });
              })
              .catch(err =>{
               res.status(500).json({
                 "Status":"0",
                 "message":"Client already Registered"
                 
               });
              });
        }
    });

      
   }
});

    //---------------client register --------------//




    //-------------------client login api ------------//

router.post('/client_login', function(req, res, next) {
    var pwd = req.body.password;
    var phone =  req.body.phone;
    var country_code =  req.body.country_code;
    if( pwd == "" || phone == "" ||country_code == ""){
            res.status(500).json({
                "Status":"0",
              "message":"All fields are required"
            });
        
       }else{
        Client.findOne({ 'client_phone_no': phone,'country_code':country_code }, function(err, data) {
            try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        console.log(data)
                        if (data.client_phone_no != phone) {
                            res.json({
                                "status": "0",
                                "status_message": "Phone number does not exist.",
                                "data":data
                            }); return;
                        } if (data.password == pwd) {
                            res.json({
                                "status": "1",
                                "status_message": "Logged in Successfully",
                                "user_id": data._id,
                                "token": data.token,
                                
                            }); return;
                           
                        } else {
                            res.json({
                                "status": "0",
                                "status_message": "Wrong Password.",
                            }); return;
                        }
                    } else {
                        res.json({
                            "status": "0",
                            "status_message": "User not Found",
                        }); return;
                    }
                }
            } catch (e) {
                res.json({ "status": "0", "status_message": "", 'error': e }); return;
            }
        });
    }
    
});
//-------------------client login api ------------//
module.exports = router;
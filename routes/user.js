var express = require('express');
var con = require('./db');
var formidable = require('formidable');
const mongoose = require('mongoose');
var body = require('body-parser');
var router = express.Router();
var User = require("../models/user_model");
var Client = require("../models/client_model");
var Studio = require("../models/studio_model");
var Event = require("../models/event_model");
var UploadImage = require("../models/upload_image_model");
var SharedImage = require("../models/shareimages_model");
var crypto = require('crypto');
var multer  = require('multer');
var profile_url = 'http://18.188.175.133/uploads/profile_images';
var upload_images_url = 'http://18.188.175.133/uploads/images/';
var storage = multer.diskStorage({
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
    var storage = multer.diskStorage({
        destination: function(req,file,cb){
        cb(null,'./uploads/client_profile_images/');
        },
        filename:function(req,file,cb){
            cb(null,file.originalname);
        }
        });
        var storage = multer.diskStorage({
            destination: function(req,file,cb){
            cb(null,'./uploads/studio_profile/');
            },
            filename:function(req,file,cb){
                cb(null,file.originalname);
            }
            });
var upload_profile = multer({ storage : storage });
var upload_client_profile = multer({ storage : storage });
var upload_image = multer({ storage : storage });
var upload_studio_profile = multer({ storage : storage });
var upload = multer({ storage : storage });
var baseurl = 'http://18.188.175.133:3000/uploads/profile_images/deagult.jpg';
var studio_profile ='http://18.188.175.133:3000/uploads/studio_profile/'; 
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
              message:"Registration Successfully",
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
            /*try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } 
                else {
                    if (data.social_id != req.body.social_id) {
						res.json({
									"status": "1",
									"status_message": "Logged in Successfully",
									"user_id": data._id,
									"token": data.token,
						}); return;
                    } 
                    else {
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
                                        token:user.token

                                    });
                                }).catch();
                       
                    }
                }
            } catch(e) {
                var social_id = req.body.social_id;
                res.json({ "status": "0", "status_message": social_id, 'error':"Undefined" }); return;
            }*/
        });
    });
    


//-------------Social login api ---------//
//-------------------login api ------------//

router.post('/login', function(req, res, next) {
    var pwd = req.body.password;
    // var mykey = crypto.createCipher('aes-128-cbc', 'pwd');
    // var password = mykey.update(pwd, 'utf8', 'hex') + mykey.final('hex');
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
router.post('/forgot', function(req, res, next) {
    var email = req.body.email;
    var password = Math.random().toString(36).substring(7);
    if(email == ""){
        return res.status(200).json({
          "status":"0",
          "message":"Fields are required"
        });
       }else{
        var user = new User({
            email:email
          });
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
                        }  else {
                            var mailOptions = {
                                to: req.body.email,
                                subject: 'Password sent successfully',
                                text: 'Hello Dear', // plain text body
                                html: '<b>Hello Dear</b><br/><br/> ' + email + ' to verify your account kindly clieck on Verification Link mentioned  below.<br/><br/> Your Updated password is '+password + '<br/><br/>Thanks, <br/>Support Team'
                                // html body
                            };
                            transporter.sendMail(mailOptions, function(error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);								
                                }
                            });

								// res.json({
								// 	"status": "1",
								// 	"status_message": "Logged in Successfully",
								// 	"user_id": data._id,
								// 	"token": data.token,
								// }); return;
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


//-------------------Forgot password api ------------//

//------------------Edit pofile api ----------------//
router.post('/edit_profile', upload_profile.single('file'),(req, res, next) =>{
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
                        var file = "";
                        if(!req.file){
                            file = "";
                        }
                        else{
                            file = req.file.originalname;
                        }
                        var myquery = { photograph_id: data._id };
                        var newvalues = { $set: {studio_email:studio_email,studio_name:studio_name,studio_phone_no:phone_no,country_code:country_code,file:file} };
                        Studio.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                Studio.findOne({ 'photograph_id': data._id }, function(err, data3) {
        
                                if(data3){
                                    res.json({
                                        "status": "1",
                                        "status_message":"Data Updated Successfully",
                                        "id":data3._id,
                                        "image":studio_profile+data3.file,
                                        "name":data3.studio_name,
                                        "email":data3.studio_email,
                                        "country_code":data3.country_code,
                                        "phone_no":data3.studio_phone_no
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
                                        "phone_no":element.studio_phone_no
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

router.post('/add_client',upload.single('profile_image'), (req,res,next) => {
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
                               var client = new Client({
                                 client_email:cemail,
                                 photograph_id:photograph_id,
                                 client_phone_no:phone,
                                 country_code:country_code,
                                 created_date:c_date,
                                 modified_date:m_date,
                                 is_deleted:"0",
                                 client_name:cname,
                                 profile_image:""
                        
                               });
                               client
                               .save()
                               .then(result=>{
                                  res.status(201).json({
                                      status:"1",
                                      message:"Client added successfully",
                                      client_id:client._id,
                                      client_name:client.client_name,
                                      image:baseurl,
                                      date:client.created_date
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
                        Client.find({ 'photograph_id': data._id }, function(err, data) {
                           res.json({
                        "status": "1",
                        "status_message": "shown Successfully",
                        "data":data,
                        
                    }); return;
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
router.post('/save_profile',upload_studio_profile.single('file'), (req,res,next) => {
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
                        var studio_name_status = req.body.studio_name_status;
                        var c_date = req.body.date;
                        var m_date = req.body.date;
                        var image = "";
                        if(!req.file){
                            image = "";
                        }
                        else{
                            image = req.file.originalname;
                        }
                               var studio = new Studio({
                                 country_code:country_code,
                                 studio_email:studio_email,
                                 studio_name:studio_name_var,
                                 studio_phone_no:phone,
                                 photograph_id:photograph_id,
                                 created_date:c_date,
                                 modified_date:m_date,
                                 is_deleted:"0",
                                 studio_name_status:studio_name_status,
                                 studio_image:image,
                               });
                               studio
                               .save()
                               .then(result=>{
                                  res.status(201).json({
                                      status:"1",
                                      message:"Successfull",
                                      date:studio.created_date,
                                      studio_name:studio.studio_name,
                                      studio_image:studio.file,
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
                               res.json({
                            "status": "1",
                            "status_message": "shown Successfully",
                            "data":data,
                            
                        }); return;
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
router.post('/upload_images',upload_image.single('image'), (req, res, next) =>{
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
                            
                               res.json({
                            "status": "1",
                            "status_message": "shown Successfully",
                            "data":data,
                            
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
                res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
            }
        });
    }
                                    });
    

//-------------get client profile ------//

//--------------edit client profile -----, //

router.post('/edit_client_profile',upload_client_profile.single('file'),(req, res, next) =>{
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
                        var country_code = req.body.country_code;
                        var user_name = req.body.user_name;
                        var email = req.body.email;
                        var phone_no = req.body.phone_no;
                        // var file = req.file.originalname;
                        var myquery = { _id: data._id };
                        var newvalues = { $set: {email:email,user_name:user_name,phone_no:phone_no,country_code:country_code} };
                        User.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                User.findOne({ '_id': data._id }, function(err, data3) {
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

//--------------edit client profile pic =------//
router.post('/edit_client_profilepic',upload_client_profile.single('file'),(req, res, next) =>{
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
                         var file = req.file.originalname;
                        var myquery = { _id: data._id };
                        var newvalues = { $set: {profile_image:file} };
                        User.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                User.findOne({ '_id': data._id }, function(err, data3) {
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
    //---------------edit client profile pic ------------//

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
                           if(data2){
                            //    res.json({
                            //     "status": "1",
                            //     "data":data2,
                                

                            //     //"image":'http://18.188.175.133/uploads/images/'+data2.image,
                            // }); return;
                            data2.forEach(function(element) {
                                console.log(element);
                                res.json({
                                        "status": "1",
                                        "data":'http://18.188.175.133/uploads/images/'+element.image,
                                        
        
                                        //"image":'http://18.188.175.133/uploads/images/'+data2.image,
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

    //---------------------get gallery api ---------//

module.exports = router;
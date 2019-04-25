var express = require('express');
var con = require('./db');
var formidable = require('formidable');
const mongoose = require('mongoose');
var body = require('body-parser');
var _ = require('underscore-node');
var Q= require("q");
var http = require('http');
var router = express.Router();
 var nodemailer = require('nodemailer');
var Genpassword = require('secure-random-password');
var User = require("../models/user_model");
var Client = require("../models/client_model");
var Studio = require("../models/studio_model");
var Event = require("../models/event_model");
var UploadImage = require("../models/upload_image_model");
var SharedImage = require("../models/shareimages_model");
var Order = require("../models/order_model");
var Notification = require("../models/notification");
var crypto = require('crypto');
var multer  = require('multer');
var extend = require('node.extend');
var async = require("async");
var $ = require("jquery");
var client_profile_image = 'https://s3.us-east-2.amazonaws.com/keyfi/clientprofileimages/'
var upload_images_url = 'https://s3.us-east-2.amazonaws.com/keyfi/images/';
var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
var multerS3 = require('multer-s3');
var unique = require('array-unique');
var str = require('node-strings');
const uniqueArrayBy = require('unique-array-by')
var md5 = require('md5');
var apn = require('apn');
var options = {
    token: {
      key: __dirname+'/notificationfile/AuthKey_JUX62R7775.p8',
      keyId: "JUX62R7775",
      teamId: "6SCRY2R5D5"
    },
    production: false
  };
  
  function ApnSendPilot(DEvice,Message,payload,client_id){
    var apnProvider = new apn.Provider(options);
     myDevice = DEvice;
     note = new apn.Notification();
     note.badge = 0;
     note.sound = "ping.aiff";
     note.alert = Message;
     note.topic="com.keyfi.in";
     note.payload.payload =  payload;
     apnProvider.send(note,myDevice).then( (result) => {
        notification_send(client_id)
     });
   function  notification_send(client_id){
    var notifiy = new Notification({
        client_id:client_id,
    });
    notifiy
       .save()
       .then()
       .catch();

   }
 }

 
// var APNS = require("apns"), options, connection, notification;
// router.options('/*', function(req, res, next) {
//     res.json({ "status": "fail" });

// });


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
        // var storage1 = multer.diskStorage({
        //     destination: function(req,file,cb){
        //     cb(null,'./uploads/studio_profile/');
        //     },
        //     filename:function(req,file,cb){
        //         cb(null,file.originalname);
        //     }
        //     });
        
// var upload_profile = multer({ storage : storage1 , limits: { fileSize:  1024 * 1024 * 50   } });
// var upload_profile_image = multer({ storage : storage1 , limits: { fileSize:1024 * 1024 * 50  } });
// var upload_client_profile = multer({ storage : storage  , limits: { fileSize:  1024 * 1024 * 50  }});
// var uploads_images = multer({ storage : storage4 , limits: { fileSize:1024 * 1024 * 50 } });
var upload_image = multer({ storage : storage , limits: { fileSize:  1024 * 1024 * 50  } });
// var upload_studio_profile = multer({ storage : storage1 , limits: { fileSize: 1024 * 1024 * 50  } });
var upload = multer({ storage : storage2, limits: { fileSize: 1024 * 1024 * 50 } });

var baseurl = 'http://18.216.236.250/PhotoGraph/uploads/deafult.png'; 
var studio_profile = 'https://s3.us-east-2.amazonaws.com/keyfi/studioprofile/';

// var transporter = require("../config/email");
// --------------Register api ----------- //
AWS.config.update({
    accessKeyId: "AKIAIHUXQAUXLRV35PLA",
    secretAccessKey: "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",
    region:'us-east-2'
});
var maxSize = 1024 * 1024 * 50;
var  rootFolder = path.resolve(__dirname, './');
var s3 = new AWS.S3({params: {Bucket: 'keyfi'}});
var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'keyfi/images',
      acl: 'public-read-write',
      limits: {
        fileSize: maxSize
    },
      metadata: function (req, file, cb) {
        cb(null,{fieldName:file.originalname});
        console.log(file);
      },
      key: function (req, file, cb) {
       
        cb(null,file.originalname)
      }
    })
  })
  var s3 = new AWS.S3({params: {Bucket: 'keyfi'}});
  var upload_profile_image = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'keyfi/studioprofile',
      acl:'public-read',
      limits: {
        fileSize: maxSize
    },
      metadata: function (req, file, cb) {
        cb(null,{fieldName:file.originalname});
        console.log(file);
      },
      key: function (req, file, cb) {
        
        cb(null,file.originalname)
      }
    })
  })
  var s3 = new AWS.S3({params: {Bucket: 'keyfi'}});
  var upload_client_profile = multer({
    storage: multerS3({
      s3: s3,
     
      bucket: 'keyfi/clientprofileimages',
      acl:'public-read',
      limits: {
        fileSize: maxSize
    },
      metadata: function (req, file, cb) {
        cb(null,{fieldName:file.originalname});
      },
      key: function (req, file, cb) {
      
        cb(null,file.originalname)
      }
    })
  })
//   var upload_studio_profile = multer({
//     storage: multerS3({
//       s3: s3,
     
//       bucket: 'keyfi/studioprofile',
//       acl:'public-read',
//       metadata: function (req, file, cb) {
//         cb(null,{fieldName:file.originalname});
//       },
//       key: function (req, file, cb) {
     
//         cb(null,file.originalname)
//       }
//     })
//   })
//   var uploads_images = multer({
//     storage: multerS3({
//       s3: s3,
     
//       bucket: 'keyfi/images',
//       metadata: function (req, file, cb) {
//         cb(null,{fieldName:file.originalname});
//       },
//       key: function (req, file, cb) {
//         var random_num = Math.floor(Math.random() * 100) + 1;
//         cb(null,file.originalname)
//       }
//     })
//   })
router.post('/register',upload.single('image'),(req,res,next) => {
    var email = req.body.email;
    var password = req.body.password;
    var pwd = md5(password);
    var c_date = req.body.date;
    var m_date = req.body.date;
    var type = req.body.type;
    var usertype = req.body.user_type;
    // var mykey = crypto.createCipher('aes-128-cbc', 'pwd');
    // var password = mykey.update(pwd, 'utf8', 'hex') + mykey.final('hex');
    var phone = req.body.phone_no;
    var country_code = req.body.country_code;
    var complete_number = country_code+phone;
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
         profile_image:"",
         complete_number:complete_number,
         device_id:"",
         device_type:""

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
router.post('/sociallogin',upload.single('image'), function(req, res, next) {
        User.findOne({ 'social_id': req.body.social_id }, function(err, data) {
            console.log(data)
            if(data){
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
 
//------------- Social login api ---------//

//------------------- login api ------------//

router.post('/login',upload.single('image'), function(req, res, next) {
    var password = req.body.password;
var pwd = md5(password);
            User.findOne( { $or: [ { 'email':req.body.email } , { 'phone_number': req.body.phone_no } ] },function(err, data) {
                  console.log(data)
                //   res.json({
                //                 "status": "1",
                //                 "status_message": data,
                               
                //             }); return;
                    if (data) {
                        if(req.body.email){
                        if (data.email != req.body.email ) {
                            res.json({
                                "status": "0",
                                "status_message": "Email does not exist.",
                            }); return;
                        } 
                    }else if(req.body.phone_no){
                            if (data.phone_number != req.body.phone_no ) {
                                res.json({
                                    "status": "0",
                                    "status_message": "Phone Number does not exist.",
                                }); return;
                            }
                        }
                        if (data.password == pwd) {
                            Studio.findOne({ 'photograph_id':  data._id}, function(err, data2) {
                            res.json({
                                "status": "1",
                                "status_message": "Logged in Successfully",
                                 "studio_id":data2._id,
                                 "user_id": data._id,
                                 "token": data.token,
                            }); return;
                            });
                        } else {
                            res.json({
                                "status": "0",
                                "status_message": "Wrong Password.",
                            }); return;
                        }
                    } else {
                        res.json({
                            "status": "0",
                            "status_message": "Please Enter Valid Data.",
                        }); return;
                    }
               
        });
    
});
//-------------------login api ------------//

//------------------- login api ------------//

// router.post('/login', function(req, res, next) {
//     var pwd = req.body.password;
//         User.findOne({ 'email': req.body.email }, function(err, data) {
//             try {
//                 if (err) {
//                     res.json({
//                         "status": "0",
//                         "status_message":"Fields are required"
//                     });return;
//                 } else {
//                     if (data) {
//                         if (data.email != req.body.email ) {
//                             res.json({
//                                 "status": "0",
//                                 "status_message": "Email does not exist.",
//                             }); return;
//                         } if (data.password == pwd) {
//                             Studio.findOne({ 'photograph_id':  data._id}, function(err, data2) {
//                             res.json({
//                                 "status": "1",
//                                 "status_message": "Logged in Successfully",
//                                 "studio_id":data2._id,
//                                 "user_id": data._id,
//                                 "token": data.token,
//                             }); return;
//                             });
//                         } else {
//                             res.json({
//                                 "status": "0",
//                                 "status_message": "Wrong Password.",
//                             }); return;
//                         }
//                     } else {
//                         res.json({
//                             "status": "0",
//                             "status_message": "Please Enter Valid Email Address.",
//                         }); return;
//                     }
//                 }
//             } catch (e) {
//                 res.json({ "status": "0", "status_message": "", 'error': e }); return;
//             }
//         });
    
// });
//-------------------login api ------------//

//------------------Forgot password api ------------//

router.post('/forgot', upload.single('image'), function(req, res, next) {
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
                         //  user: 'keyfisolutions@gmail.com',
                         //  pass: 'Comal1845'
                        user: 'support@oversizepilotfinder.com',
                        pass:'@Truckhit88'
                        }
                      });
                  
                      var mailOptions = {
                        from: 'keyfisolutions@gmail.com',
                        to: email,
                        subject: 'Forgot Password',
                        text: 'Your new password is ' + randomstring
                      };
 
                      transporter.sendMail(mailOptions, function(error, info){
                          console.log(info)
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
                        
                        var newvalues = { $set: {studio_email:studio_email,studio_name:studio_name,studio_phone_no:phone_no,country_code:country_code,studio_image:image,photographer_name:photographer_name1} };
                       
                        Studio.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                console.log(result)
                                Studio.findOne({ 'photograph_id': data._id }, function(err, data3) {
                                if(data3){
                                    res.json({
                                        "status": "1",
                                        "status_message":"Profile Updated Successfully",
                                        "id":data3._id,
                                        "image":studio_profile+data3.studio_image,
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
router.post('/edit_studio_profilepic',(req, res, next) =>{
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
                                "status_message": "Studio Profile updated successfully",
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
router.post('/get_profile',upload.single('image'), (req, res, next) =>{
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
                                   if(element.studio_image ==""){
                                       var image = baseurl;
                                       
                                   }else{
                                  var image = studio_profile+element.studio_image;
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

router.post('/add_client',upload_client_profile.single('image'), (req,res,next) => {
    if(!req.headers.token){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
    User.findOne({ 'token': req.headers.token }, function(err, dataa) {
	
                        var photograph_id = dataa._id;
                        var cemail = req.body.email;
                        var cname = req.body.client_name;
                        var c_date = req.body.date;
                        var m_date = req.body.date;
                        var phone = req.body.phone_no;
                        var country_code = req.body.country_code;
                        var random_num = Math.floor(Math.random() * 1000000) + 1;
                            var de_token = random_num.toString();
                            var mykey = crypto.createCipher('aes-128-cbc', 'token');
                            var token_en = mykey.update(de_token, 'utf8', 'hex') + mykey.final('hex');
                        
                        if(!req.file){
                            file = "";
                        }
                        else{
                            file = req.file.originalname;
                         }
						 Client.findOne({ 'client_phone_no': phone }, function(err, dataa) {
						 console.log(dataa);
						 if(dataa){
                            var myquery = { _id: dataa._id };
                    
                            var newvalues = { $set: {client_name:cname,photograph_id:photograph_id,profile_image:file} };
                            Client.updateMany(myquery, newvalues, function(err, result) {
                                if(result){
                                    Client.findOne({ 'client_phone_no': phone }, function(err, dataa2) {
                                          if(dataa2.profile_image){
                                                       var imageurl =  client_profile_image+dataa2.profile_image 
                                                      }else{
                                                          var imageurl  = baseurl;
                                                      }
                                        res.status(201).json({
                                            status:"1",
                                            message:"Client added successfully",
                                            client_id:dataa2._id,
                                         client_name:dataa2.client_name,
                                         image:imageurl,
                                         date:dataa2.created_date,
                                          token:dataa2.token
                                        });
                                    });
                                  
                                    // res.status(201).json({
                                    //                      status:"1",
                                    //                      message:"Client added successfully",
                                    //                      client_id:client._id,
                                    //                   client_name:client.client_name,
                                    //                   image:imageurl,
                                    //                   date:client.created_date,
                                    //                    token:client.token
                                    //                  });
                                }
                            
                            });
						//  var token = dataa.token;
						//  var client = new Client({
                        //             client_email:cemail,
                        //             client_name:cname,
                        //             photograph_id:photograph_id,
                        //             client_phone_no:phone,
                        //             password : "",
						// 			token:token,
                        //             photograph_token:req.headers.token,
                        //             country_code:country_code,
                        //             created_date:c_date,
                        //             modified_date:m_date,
                        //             is_deleted:"0",
                        //             profile_image:file,
                        //             profile_image2:"",
                        //             client_email2:"",
                        //             client_name2:""
                        //           });
                                  
                        //           client
                        //           .save()
                        //           .then(result=>{
                        //               if(client.profile_image){
                        //                var imageurl =  client_profile_image+client.profile_image 
                        //               }else{
                        //                   var imageurl  = baseurl;
                        //               }
                        //              res.status(201).json({
                        //                  status:"1",
                        //                  message:"Client added successfully",
                        //                  client_id:client._id,
                        //                  client_name:client.client_name,
                        //                  image:imageurl,
                        //                  date:client.created_date,
                        //                  token:client.token
                        //              });
                        //           })
                        //           .catch(err =>{
                        //            res.status(500).json({
                        //              "Status":"0",
                        //              "message":"Account already registered with same number."
                        //            });
                        //           });
						 }else{
						 var client = new Client({
                                    client_email:cemail,
                                    client_name:cname,
                                    photograph_id:photograph_id,
                                    client_phone_no:phone,
                                    password : "",
									token:"",
                                    photograph_token:req.headers.token,
                                    country_code:country_code,
                                    created_date:c_date,
                                    modified_date:m_date,
                                    is_deleted:"0",
                                    profile_image:file,
                                    profile_image2:"",
                                    client_email2:"",
                                    client_name2:""
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
                                         date:client.created_date,
                                         token:client.token
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
						 
                                // var client = new Client({
                                    // client_email:cemail,
                                    // client_name:cname,
                                    // photograph_id:photograph_id,
                                    // client_phone_no:phone,
                                    // password : "",
                                    // photograph_token:req.headers.token,
                                    // country_code:country_code,
                                    // created_date:c_date,
                                    // modified_date:m_date,
                                    // is_deleted:"0",
                                    // profile_image:file,
                                  // });
                                  
                                  // client
                                  // .save()
                                  // .then(result=>{
                                      // if(client.profile_image){
                                       // var imageurl =  client_profile_image+client.profile_image 
                                      // }else{
                                          // var imageurl  = baseurl;
                                      // }
                                     // res.status(201).json({
                                         // status:"1",
                                         // message:"Client added successfully",
                                         // client_id:client._id,
                                         // client_name:client.client_name,
                                         // image:imageurl,
                                         // date:client.created_date,
                                         // token:client.token
                                     // });
                                  // })
                                  // .catch(err =>{
                                   // res.status(500).json({
                                     // "Status":"0",
                                     // "message":"Email already Registered"
                                   // });
                                  // });
                            //     User.findOne({ 'token': req.headers.token }, function(err, dataas) {
                            //      var phone =  req.body.phone_no;
                            //      var cname = req.body.client_name;
                            //      if(!req.file){
                            //         file = "";
                            //     }
                            //     else{
                            //         file = req.file.originalname;
                            //      }
                            //     var myquery1 = {client_phone_no:phone};
                                
                            //     var newvalues1 = { $set: {client_name:cname,profile_image:file} };
                            //     Client.updateMany(myquery1, newvalues1, function(err, data3) {
                            //        if(data3){
                            //         Client.find({ 'client_phone_no': phone,'country_code':country_code}, function(err, datas) {
                            //      res.status(500).json({
                            //         "Status":"0",
                            //         "message":"Client added successfully",
                            //         "data":datas

                            //       });
                            //         });
                            //        }

                               
                            //     });

                            // });



                           
                          
                   
            
                                });    
}
	});
// ----------------------add client -------------//

//---------------------get client -------------//
router.post('/get_client',upload_profile_image.single('image'),(req, res, next) =>{
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
                        Client.find({ 'photograph_id': data._id ,is_deleted:'0'}, function(err, dataa) {
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
                                                    "profile_image":image,
                                                    "login_status": data2.login_status
                                
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
router.post('/save_profile',upload_profile_image.single('image'),(req,res,next) => {
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
                        //  if(!req.file){
                        //     studio_profile = "";
                        // }
                        // else{
                        //     studio_profile = req.file.originalname
                        // }

                         if(!req.file){
                           var  file = "";
                         }
                         else{
                            var file = req.file.originalname;
                            
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
                                 photographer_name:photographer_name,
                                 studio_image:""
                               });
                               
                               studio
                               .save()
                               .then(result=>{
                                if(studio.studio_image == ""){
                                  var image2 = baseurl
                                }
                                 if(studio.file == ""){
                                    var image  = ""
                                   }else{
                                    var image = studio_profile+studio.file;
                                   }
                                  res.status(201).json({
                                      status:"1",
                                      message:"Successfull",
                                      date:studio.created_date,
                                      studio_id:studio._id,
                                      studio_name:studio.studio_name,
                                      photographer_name:photographer_name,
                                      photograph_id:photograph_id,
                                      file:image,
                                      studio_profile:image2
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
router.post('/get_event',upload.single('number_of_images'), (req, res, next) =>{
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
                            Event.find({ 'photograph_id': data._id ,client_id:req.body.client_id,is_deleted:'0'}, function(err, data) {
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
router.post('/upload_images',upload.single('image'), (req, res, next) =>{
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
                            UploadImage.find({ 'event_id': req.body.event_id}, function(err, data2) {
                                console.log(data2)
                                var varr = '1';
                              var add1 = data2.length;
                              var count = Number(varr)+Number(add1);
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
                               event_id:event_id,
                               status:'1',
                               payment_status:'1' //  1 is for unpaid and 0 for paid status
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
router.post('/shared_images', upload.single('number_of_images'),(req, res, next) =>{
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
                            var images_data = upload_images_id.split(',');
                            var preview_mode = req.body.preview_mode;
                            var event_id = req.body.event_id;
                            var studio_id = req.body.studio_id;
                            var interval = req.body.interval;
                            var slide_Show_time = req.body.slide_Show_time;
                            var myquery = { _id: { $in:images_data }};
                                var newvalues = { $set: {status:"0"} };
                                UploadImage.update(myquery, newvalues ,function(err, result) {
                                    UploadImage.find({_id: { $in: images_data}}, function(err, docs){
                                        var  images_data = JSON.stringify(docs);
                                            Client.findOne({ '_id': req.body.client_id }, function(err, data) {
                              if(data){
                            var sharedimage = new SharedImage({
                               photograph_id:photograph_id,
                               image_ids:images_data,
                               client_id:client_id,
                               preview_mode:preview_mode,
                               event_id:event_id,
                               studio_id:studio_id,
                               interval:interval,
                               slide_Show_time:slide_Show_time
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

                            }else{
                                res.status(201).json({
                                    status:"0",
                                    message:"Clientid is not valid",
                                });
                            }



                            });
                                    });
                                });
                            // UploadImage.find({_id: { $in: images_data}}, function(err, docs){
                                
                            //     var  record = [];
                            //     docs.forEach(function(data3){
                            //              record.push(data3._id);
                            //     });
                               
                            //     var myquery = { _id: { $in:record }};
                            //     var newvalues = { $set: {status:"0"} };
                            //     UploadImage.update(myquery, newvalues ,function(err, result) {
                            //     var  images_data = JSON.stringify(docs);
                            
                            //     Client.findOne({ '_id': req.body.client_id }, function(err, data) {
                            //   if(data){
                            // var sharedimage = new SharedImage({
                            //    photograph_id:photograph_id,
                            //    image_ids:images_data,
                            //    client_id:client_id,
                            //    preview_mode:preview_mode,
                            //    event_id:event_id,
                            //    studio_id:studio_id,
                            //    interval:interval,
                            //    slide_Show_time:slide_Show_time
                            //   });
                            //   sharedimage
                            //   .save()
                            //   .then(result=>{
                            //      res.status(201).json({
                            //          status:"1",
                            //          message:"Images are shared with client",
                            //      });
                            //   })
                            //   .catch(err =>{
                            //    res.status(500).json({
                            //      "Status":"0",
                            //      "message":"error"
                            //    });
                            //   });

                            // }else{
                            //     res.status(201).json({
                            //         status:"0",
                            //         message:"Clientid is not valid",
                            //     });
                            // }



                            // });
                            //     });



                            

                            // });


                        
                        
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

router.post('/get_client_profile', upload_client_profile.single('number_of_images'), (req, res, next) =>{
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
                               if(data.profile_image2){
                                var profile_image =client_profile_image+data.profile_image2;
                               }else{
                                   var profile_image = baseurl; 
                               }

                               
                               res.json({
                            "status": "1",
                            "status_message": "shown Successfully",
                            "country_code": data.country_code,
                            "client_name":data.client_name2,
                            "client_email":data.client_email2,
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
                         if(!req.file){
                         var   image = " ";
                        }
                        else{
                            var   image = req.file.originalname;
                        }
                        var myquery = { _id: data._id };
                        var newvalues = { $set: {client_name2:req.body.user_name,client_email2:req.body.email,client_phone_no:req.body.phone_no,profile_image2:image} };
                        Client.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                               
                                Client.findOne({ '_id': data._id }, function(err, data3) {
                                   res.json({
                                "status": "1",
                                "status_message": "Profile updated successfully",
                               

                
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

//--------------edit client profile ----- //

router.post('/edit_client_profile_second',upload_client_profile.single('image'),(req, res, next) =>{
    if(!req.body.client_id){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
Client.findOne({ '_id': req.body.client_id }, function(err, data) {
         try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
               
                if (data) {
                    console.log(data)
                         if(!req.file){
                         var   image = "";
                        }
                        else{
                            var   image = req.file.originalname;
                        }
                        var myquery = { _id: data._id };
                    
                        var newvalues = { $set: {client_name:req.body.client_name,client_email:req.body.email,profile_image:image} };
                        Client.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                
                                Client.findOne({ '_id': data._id }, function(err, data3) {
                                   res.json({
                                "status": "1",
                                "status_message": "Profile updated successfully",
                                "data":data3

                
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
							// "image":'http://18.188.175.133/uploads/images/'+data2.image,
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
router.post('/update_prefrences',upload_client_profile.single('image'),(req, res, next) =>{
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
                                console.log(result)
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

    /////////////////client_register//////////////////////////////
    router.post('/client_register',upload_client_profile.single('file'), (req,res,next) => {
        var pwd = req.body.password;
       var phone = req.body.phone_no;
       var country_code = req.body.country_code;
      if(pwd == "" || phone == "" || country_code == ""){
           res.status(500).json({
               "Status":"0",
             "message":"All fields are required"
           });
      }else{
       Client.findOne({ 'client_phone_no': phone,'country_code':country_code}, function(err, data) {
      if(data){

              if(data.password == ""){
                     var random_num = Math.floor(Math.random() * 1000000) + 1;
                       var de_token = random_num.toString();
                       var password = req.body.password;
                      var pwd = md5(password);
                       var mykey = crypto.createCipher('aes-128-cbc', 'token');
                       var token_en = mykey.update(de_token, 'utf8', 'hex') + mykey.final('hex');
                       var myquery1 = {client_phone_no:data.client_phone_no};
                       console.log(myquery1);
                       var newvalues1 = { $set: {password:pwd,token:token_en,device_id:" ",device_type:" ",login_status:"1"} };
                       console.log(newvalues1);
                               Client.updateMany(myquery1, newvalues1, function(err, result) {
                                           if(result){
                                               Client.findOne({ 'client_phone_no': req.body.phone_no}, function(err, data) {
                                                 res.json({
                                                 "status": "1",
                                                 "status_message": "Registered Successfully.",
                                                 "data":data
                                               });
                                          });
                                           }else{
                                               res.json({
                                                   "status": "0",
                                                   "status_message": "not update",
                                                   "data":result,
                                                 });
                                           }
                                           });
              }else{
                Client.findOne({ 'client_phone_no': req.body.phone_no}, function(err, data) {
                                                   res.json({
                                                   "status": "0",
                                                   "status_message": "Already Registered",
                                                   "data":data
                                                 });
                                           });
              }
      }else{
                       var password = req.body.password;
                       var pwd = md5(password);
                       var phone = req.body.phone_no;
                       var country_code = req.body.country_code;
                       var random_num = Math.floor(Math.random() * 1000000) + 1;
                       var de_token = random_num.toString();
                       var mykey = crypto.createCipher('aes-128-cbc', 'token');
                       var token_en = mykey.update(de_token, 'utf8', 'hex') + mykey.final('hex');
                       var client = new Client({
                           client_phone_no:phone,
                           country_code:country_code,
                           login_status:"1",
                           is_deleted:"0",
                           profile_image:"",
                           device_id:"",
                           device_type:"",
                           password:pwd,
                           token:token_en,
                           
                         });
                         client
                         .save()
                         .then(result=>{
                            res.status(201).json({
                                status:"1",
                                message:"Registered Successfully.",
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
    //////////////////////////////////////////////////////////////

//----------------- client register ---------------------------//
// router.post('/client_register',upload_client_profile.single('file'), (req,res,next) => {
//      var pwd = req.body.password;
//     var phone = req.body.phone_no;
//     var country_code = req.body.country_code;
//    if(pwd == "" || phone == "" || country_code == ""){
//         res.status(500).json({
//             "Status":"0",
//           "message":"All fields are required"
//         });
//    }else{
//     Client.find({ 'client_phone_no': phone,'country_code':country_code}, function(err, data) {
//     var countdata = data.length;
//     var password = req.body.password;
//      var pwd = md5(password);
//      console.log(data)
//         if(countdata > 0){
//             record1 = [];
//             record2 = [];
//             data.forEach(function(data3){
//                 record1.push(data3.client_phone_no);
//                 });
//                 data.forEach(function(data3){
//                     record2.push(data3.password);
//                 });
//             var record2_count = record2.length;
// if(record2_count<1){
//     console.log('hello')
//     var random_num = Math.floor(Math.random() * 1000000) + 1;
//     var de_token = random_num.toString();
//     var mykey = crypto.createCipher('aes-128-cbc', 'token');
//     var token_en = mykey.update(de_token, 'utf8', 'hex') + mykey.final('hex');
//     var myquery1 = {client_phone_no:record1};
//     var newvalues1 = { $set: {password:pwd,token:token_en} };
//             Client.updateMany(myquery1, newvalues1, function(err, result) {
//                         if(result){
//                             Client.findOne({ 'client_phone_no': req.body.phone_no}, function(err, data) {
// 							  res.json({
//                               "status": "1",
//                               "status_message": "Registered Successfully.",
//                               "data":data
//                             });
                            
//                         });
//                         }else{
//                             res.json({
//                                 "status": "0",
//                                 "status_message": "not update",
//                                 "data":result,
//                               });
//                         }
//                         });
        
//                     }else{
//                         Client.findOne({ 'client_phone_no': req.body.phone_no}, function(err, data) {
//                             res.json({
//                             "status": "0",
//                             "status_message": "Already Registered",
//                             "data":data
//                           });
//                     });
//                 }
        
//                     }else{
//             var password = req.body.password;
//             var pwd = md5(password);
//             var phone = req.body.phone_no;
//             var country_code = req.body.country_code;
//             var random_num = Math.floor(Math.random() * 1000000) + 1;
//             var de_token = random_num.toString();
//             var mykey = crypto.createCipher('aes-128-cbc', 'token');
//             var token_en = mykey.update(de_token, 'utf8', 'hex') + mykey.final('hex');
//             var client = new Client({
//                 client_phone_no:phone,
//                 country_code:country_code,
//                 is_deleted:"0",
//                 profile_image:"",
//                 password:pwd,
//                 token:token_en,
//               });
//               client
//               .save()
//               .then(result=>{
//                  res.status(201).json({
//                      status:"1",
//                      message:"Registered Successfully.",
//                      data:client
//                  });
//               })
//               .catch(err =>{
//                res.status(500).json({
//                  "Status":"0",
//                  "message":"Client already Registered"
                 
//                });
//               });
//         }
//     });

      
//    }
// });

    //---------------client register --------------//




    //-------------------client login api ------------//

router.post('/client_login',upload_client_profile.single('file'), function(req, res, next) {
    var password = req.body.password;
    var pwd = md5(password);
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
                    console.log(data);
                    if (data) {
                       if(data.login_status == "1"){
                        if (data.client_phone_no != phone) {
                            res.json({
                                "status": "0",
                                "status_message": "Phone number does not exist.",
                                "data":data
                            }); return;
                        } 
                        
                        
                        if (data.password == pwd) {
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

                    }else{
                        res.json({
                            "status": "0",
                            "status_message": "Your Account has been freezed !!",
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

//-------------------delete  api ------------//

router.post('/delete',upload_client_profile.single('file'), function(req, res, next) {
 var client_id =  req.body.client_id;
var event_id = req.body.event_id;
if(client_id){
    if( client_id == "" ){
            res.status(500).json({
                "Status":"0",
              "message":"All fields are required"
            });
        
       }else{
        Client.findOne({ '_id':client_id }, function(err, data) {
            try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        if (data._id != client_id) {
                            res.json({
                                "status": "0",
                                "status_message": "client Id does not exist.",
                                "data":data
                            }); return;
                        } if (data._id == client_id) {
                            var myquery1 = {_id:data._id};
                            var newvalues1 = { $set: {is_deleted:'1'} };
                            Client.updateMany(myquery1, newvalues1, function(err, result) {
                                        if(result){

                            res.json({
                                "status": "1",
                                "status_message": "Client Delete Successfully",
                            }); return;
                                        }
                                        });
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
}else{
    if( event_id == "" ){
        res.status(500).json({
            "Status":"0",
          "message":"All fields are required"
        });
    
   }else{
    Event.findOne({ '_id':event_id }, function(err, data) {
        try {
            if (err) {
                res.json({
                    "status": "0",
                    "status_message":"Fields are required"
                });return;
            } else {
                if (data) {
                    if (data._id != event_id) {
                        res.json({
                            "status": "0",
                            "status_message": "Event Id does not exist.",
                            "data":data
                        }); return;
                    } if (data._id == event_id) {
                        var myquery1 = {_id:data._id};
                        var newvalues1 = { $set: {is_deleted:'1'} };
                        Event.updateMany(myquery1, newvalues1, function(err, result) {
                                    if(result){

                        res.json({
                            "status": "1",
                            "status_message": "Event Delete Successfully",
                        }); return;
                                    }
                                    });
                    } else {
                        res.json({
                            "status": "0",
                            "status_message": "Event not found",
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
}
    
});
//-------------------delete api ------------//

router.post('/getevents',upload_client_profile.single('file'),(req, res, next) =>{
    if(!req.headers.token){
                         res.json({
                            "status": "0",
                            "status_message": "Fields are required",
                        }); return;
    }
    else{
        Client.find({ 'token': req.headers.token }, function(err, data) {

            try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        record1 = [];
                        data.forEach(function(data3){
                        record1.push(data3._id);
                        });
                        
                                SharedImage.find({'client_id':record1}).populate('event_id').populate('studio_id').exec(function(err, c) {
                                           record = [];
                                           c.forEach(function(data3){
                                               console.log(data3)
                                               var shared_id = data3._id;
                                               var photograph_id =   data3.studio_id.photograph_id;
                                               var studio_id = data3.studio_id._id;
                                               var event_name = data3.event_id.event_name;
                                                 var images =  JSON.parse(data3.image_ids);
                                                 var event_id = data3.event_id._id;
                                                 var count = images.length;
                                                 var studio_name = data3.studio_id.studio_name;
                                                 if(data3.studio_id.studio_image == ""){
                                                     var file =baseurl;
                                                 }else{
                                                   var file =studio_profile+data3.studio_id.studio_image;
                                                 }
                                               record.push({
                                                   "shared_id":shared_id,
                                                   "number_of_images":count,
                                                   "created_date":data3.created_date ,
                                                   "event_id":event_id,
                                                   "photograph_id":photograph_id,
                                                   "event_name":event_name,
                                                   "studio_profile_image":file,
                                                   "studio_name":studio_name,
                                                   "studio_id":studio_id
                                               });
                                             });
                                       res.json({
                                                               "status": "1",
                                                               "status_message": "Data Found.",
                                                               "data":record,
                                                               
                                                             });
                                    });
                                
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

//---------------------get occasion -------------//
router.post('/get_occasion',upload_client_profile.single('file'),(req, res, next) =>{
    if(!req.headers.token){
                         res.json({
                            "status": "0",
                            "status_message": "Fields are required",
                        }); return;
    }
    else{
        Client.find({ 'token': req.headers.token }, function(err, data) {

            try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        record1 = [];
                        data.forEach(function(data3){
                        record1.push(data3._id);
                        });
                        
                                SharedImage.find({'client_id':record1}).populate('event_id').populate('studio_id').exec(function(err, c) {
                                           record = [];
                                           c.forEach(function(data3){
                                               console.log(data3)
                                               var shared_id = data3._id;
                                               var photograph_id =   data3.studio_id.photograph_id;
                                               var studio_id = data3.studio_id._id;
                                               var event_name = data3.event_id.event_name;
                                                 var images =  JSON.parse(data3.image_ids);
                                                 var event_id = data3.event_id._id;
                                                 var count = images.length;
                                                 var studio_name = data3.studio_id.studio_name;
                                                 if(data3.studio_id.studio_image == ""){
                                                     var file =baseurl;
                                                 }else{
                                                   var file =studio_profile+data3.studio_id.studio_image;
                                                 }
                                               record.push({
                                                   "shared_id":shared_id,
                                                   "number_of_images":count,
                                                   "created_date":data3.created_date ,
                                                   "event_id":event_id,
                                                   "photograph_id":photograph_id,
                                                   "event_name":event_name,
                                                   "studio_profile_image":file,
                                                   "studio_name":studio_name,
                                                   "studio_id":studio_id
                                               });
                                             });
                                       res.json({
                                                               "status": "1",
                                                               "status_message": "Data Found.",
                                                               "data":record,
                                                               
                                                             });
                                    });
                                
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
    
    //---------------------get occasion-------------//

    //--------------------order api ---------------//
    router.post('/order',upload_client_profile.single('file'), (req,res,next) => {
        var client_id = req.body.client_id;
       var studio_id = req.body.studio_id;
        var photograph_id = req.body.photograph_id;
        var image_ids = req.body.image_ids;
        var event_id = req.body.event_id;
 
       if(client_id == "" || photograph_id == "" || image_ids == ""){
            res.status(500).json({
                "Status":"0",
              "message":"All fields are required"
            });
       }else{
           var order = new Order({
            client_id:client_id,
             photograph_id:photograph_id,
             image_ids:image_ids,
             payment_status:'0',
             studio_id:studio_id,
             event_id:event_id
           });
          
           order
           .save()
           .then(result=>{
              var data = [];
              var data1 = [];
              var images = order.image_ids;
              var images_data = images.split(','); // split string on comma space
               var count_images =  images_data.length;

               data.push({
                  "order_id":order._id,
                  "order_date":order.order_date,
                  "number_of_images":count_images
               });

            Client.findOne({ '_id': order.client_id ,is_deleted:'0'}, function(err, dataa) {
                if(dataa.profile_image){
                  var image = client_profile_image+dataa.profile_image;
                }else{
                    var image = baseurl;
                }
                data1.push({
                    "client_profile_pic":image,
                    "client_name":dataa.client_name
                 });
                 var arr3 =  extend(true, data1,data);
                 res.json({
               "status": "1",
               "status_message": "Ordered Has Been Placed Successfully.",
               "data":arr3,
             });

            });
           })
           .catch(err =>{
            res.status(500).json({
              "Status":"0",
              "message":"Not Ordered Successfully"
            });
           });
       }
    });
    //-------------------order api ----------------//
  //-------------------get order images  api ------------//

  router.post('/getorderimages',upload_client_profile.single('file'), function(req, res, next) {
    var order_id = req.body.order_id;
   

    if(order_id == "" ){
            res.status(500).json({
                "Status":"0",
              "message":"All fields are required"
            });
        
       }else{
        Order.findOne({ '_id': order_id }, function(err, data) {
            try {
                if (err) {
                    res.json({
                        "status": "0",
                        "status_message":"Fields are required"
                    });return;
                } else {
                    if (data) {
                        if (data._id == order_id ) {
                               var images = data.image_ids;
                               var images_count = images.split(','); 
                               if(images_count){
                                UploadImage.find({_id: { $in: images_count}}, function(err, docs){
                                    var  record = [];
                                    docs.forEach(function(data3){
                                                          record.push({
                                                              "_id":data3._id,
                                                          "image":upload_images_url+data3.image,
                                                          "payment_status":data3.payment_status
                                                     });
                                                        });
                                                        res.json({
                                                          "status": "1",
                                                          "status_message": "Record Found",
                                                          "record":record,
                                                        });
                                });
                               }else{
                                res.json({
                                    "status": "1",
                                    "status_message": "Record Not Found",
                                    "record":record,
                                  });
                               }
                           
                        } else {
                            res.json({
                                "status": "0",
                                "status_message": "Wrong Order Id.",
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
//-------------------get order images api ------------//


//-----------------get shared image --------------//
router.post('/getshared_images',upload_client_profile.single('file'),(req, res, next) =>{
    var  record = [];
    
                                    if(req.body.event_id == "" && req.body.client_id == ""){
                                        res.json({
                                            "status": "0",
                                            "status_message": "Record Not Found"
                                        });
                                }else{
                                SharedImage.find({ '_id': req.body.shared_id}).populate('studio_id').exec(function(err, Parentresponse){ 
                                console.log(Parentresponse)
                                    Parentresponse.forEach(function(data3){
                                        if(data3.studio_id.studio_name_on_image == null){
                                            var studio_name_on_image = "";
                                        }else{
                                        
                                            var studio_name_on_image = data3.studio_id.studio_name_on_image;
                                        } 
                                                            
                                        
                                        if(data3.interval == "" &&  data3.slide_Show_time == ""){
                                                var interval =  data3.studio_id.interval;//from studio profile
                                                var slide_Show_time =  data3.studio_id.slide_Show_time;//from studio profile
                                        }else{
                                            var interval = data3.interval;//from get sharedimage
                                            var slide_Show_time = data3.slide_Show_time;//from get sharedimage
                                        }

                                    // var studio_name_on_image = data3.studio_id.studio_name_on_image;
                                //    var interval =  data3.studio_id.interval;
                                //    var slide_Show_time =  data3.studio_id.slide_Show_time;
                                   var disable_interval_view =  data3.studio_id.disable_interval_view;
                                   if(data3.studio_id.file == ""){
                                   var file = " ";
                                   }else{
                                    var file = client_profile_image+data3.studio_id.file;
                                   }
         var images =   JSON.parse(data3.image_ids);
        
         var  record1 = [];
         var record2 = [];
         images.forEach(function(data4){
             console.log(data4)
             record2.push({
                "interval":data4.interval,
                "slide_Show_time":data4.slide_Show_time,
             });
               record1.push({
                  
                "image_id":data4._id, 
                "image_name":upload_images_url+data4.image,
                "status":data4.status
            });
         });

         
                                      record.push({
                                          "studio_name_on_image":studio_name_on_image,
                                          "interval":interval,
                                          "slide_Show_time":slide_Show_time,
                                          "disable_interval_view":disable_interval_view,
                                          "file":file,
                                          "image":record1
                                 });
        
                    });
                    res.json({
                        "status": "1",
                        "status_message": "Record Found",
                        "data":record
                      });
//         if(Parentresponse.photograph_id ){
//    Studio.find({ 'photograph_id':Parentresponse.photograph_id }).lean().exec(function(err, data){
//           var countarray =  Parentresponse.image_ids;
//           var images_data = countarray.split(',');
// 	  UploadImage.find({_id: { $in: images_data}}, function(err, docs){
    
//     docs.forEach(function(data3){
//                           record.push({
//                               "image_id":data3._id,
//                               "image":upload_images_url+data3.image,
//                      });
//                         });
//                         res.json({
//                           "status": "1",
//                           "status_message": "Record Found",
//                           "studio_name_on_image":data.studio_name_on_image,
//                             "slide_Show_time":data.slide_Show_time,
//                             "interval":data.interval,
//                             "disable_interval_view":data.disable_interval_view,
//                           "record":record,
//                         });
// });
// });  
//     }     else{
//         res.json({
//             "status": "1",
//             "status_message": "Record Not Found"
//           });
//     } 
});
}
  
    });
//----------------------get order folder ---------------//

router.post('/getorderfolder',upload_client_profile.single('file'), (req,res,next) => {
        
    if(!req.headers.token){
         res.status(500).json({
             "Status":"0",
           "message":"All fields are required"
         });
    }else{
        User.findOne({ 'token':req.headers.token }, function(err, data) {
         if(data){
              
             Order.find({'photograph_id':data._id}).populate('client_id').exec(function(err, c) {
                
                 if (err) { return console.log(err); }
                     record = [];
                     c.forEach(function(data3){
                         console.log(data3)
                         var images = data3.image_ids;
                         var images_data = images.split(',');
                         var count = images_data.length;
                         var created_date = data3.created_date;
                           var client_name =  data3.client_id.client_name2;
                           var client_id   =  data3.client_id._id;
                           if(data3.client_id.profile_image == ""){
                            var profile_image =baseurl;
                        }else{
                          var profile_image =client_profile_image+data3.client_id.profile_image;
                        }
                           record.push({
                              'client_id': client_id,
                              'client_name':client_name,
                              'created_date':created_date,
                              'profile_image':profile_image
                           });

                       });
                       var client_id   =  uniqueArrayBy(record, 'client_id');
                        res.json({
                                         "status": "1",
                                         "status_message": "Data Found.",
                                         "data":client_id,
                                         
                                       });
             });
            
         }  
     });
    }
 });



//--------------------get order folder ---------------//

//-----------------delete images api---------------//
router.post('/delete_images',upload_client_profile.single('file'), (req,res,next) => {

    if(!req.body.images_id){
         res.status(500).json({
             "Status":"0",
           "message":"All fields are required"
         });
    }else{
        var upload_images_id = req.body.images_id;
        var images_data = upload_images_id.split(',');
        UploadImage.remove({_id: { $in: images_data}}, function(err, docs){
            if(docs){
                res.json({
                    "Status":"1",
                  "message":"Images deleted Successfully."
                });
            }else{
                res.json({
                    "Status":"0",
                    "message":"Images not deleted"
                });
            }
        
        });
    }
 });

//----------------delete images api --------------//
//-----------------get shared image ------------//

    //--------------------getorder api ---------------//
    router.post('/getorder',upload_client_profile.single('file'), (req,res,next) => {
        
       if(!req.headers.token){
            res.status(500).json({
                "Status":"0",
              "message":"All fields are required"
            });
       }else{
           User.findOne({ 'token':req.headers.token }, function(err, data) {
            if(data){
                 
                Order.find({'photograph_id':data._id}).populate('client_id').populate('event_id').exec(function(err, c) {
                    if (err) { return console.log(err); }
                        record = [];
                        c.forEach(function(data3){
                            console.log(data3);
                           
                           if(data3.client_id._id == req.body.client_id){
                            var payment_status = data3.payment_status;
                              var images = data3.image_ids;
                              var order_id = data3._id;
                              var event_id =data3.event_id;
                        
                             if(data3.event_id.event_name == ""){
                                var event_id = " ";
                             }else{
                                var event_id = data3.event_id.event_name;
                             }
                              var images_data = images.split(',');
                              var count = images_data.length;
                              var client_name = data3.client_id.client_name2;
                              if(data3.client_id.profile_image == ""){
                                  var profile_image =baseurl;
                              }else{
                                var profile_image =client_profile_image+data3.client_id.profile_image;
                              }
                            record.push({
                                "payment_status":payment_status,
                                "number_of_images":count,
                                "order_date":data3.order_date ,
                                "order_id":order_id,
                                "profile_image":profile_image,
                               "event_name":event_id
                            });
                           }
                          });
                          res.json({
                            "status": "1",
                            "status_message": "Data Found.",
                            "data":record,
                            
                          });
                 
                });
               
            }  
        });
       }
    });
    //-------------------getorder api ----------------//

    //--------------------updatepayment status api ---------------//
    router.post('/payment_status',upload_client_profile.single('file'),  (req,res,next) => {
        // var preview_mode = req.body.preview_mode;
        // var event_id = req.body.event_id;
        // var studio_id = req.body.studio_id;
        // var interval = req.body.interval;
        // var slide_Show_time = req.body.slide_Show_time;
        // var myquery = { _id: { $in:images_data }};
        //     var newvalues = { $set: {status:"0"} };
        //     UploadImage.update(myquery, newvalues ,function(err, result) {
        //     UploadImage.find({_id: { $in: images_data}}, function(err, docs){
        //     var  images_data = JSON.stringify(docs);
        if(!req.headers.token){
             res.status(500).json({
                 "Status":"0",
               "message":"All fields are required"
             });
        }else{
            User.findOne({ 'token':req.headers.token }, function(err, data) {
             if(data){
                //  Order.findOne({'photograph_id':data._id,}).exec(function(err, c) {
                     var upload_images_id = req.body.images_id;
                     var images_data = upload_images_id.split(',');
                     var myquery = { _id: { $in:images_data } };
                     var newvalues = { $set: {payment_status:'0'} };
                     
                     UploadImage.updateMany(myquery, newvalues, function(err, result) {
                         if(result){
                            var myquery2 = { _id: req.body.order_id };
                            var newvalues2 = { $set: {payment_status:'1'} };
                            Order.updateMany(myquery2, newvalues2, function(err, result2) {
                         if(result2){
                               res.json({
                                                     "status": "1",
                                                     "status_message": "Payment status Updated.",
                                                 
                                                   });
                         }else{
                            res.json({
                                "status": "1",
                                "status_message": "Payment status Not Updated.",
                            
                              }); 
                         }
                    });


                        //   res.json({
                        //                              "status": "1",
                        //                              "status_message": "Payment status Updated.",
                                                 
                        //                            });
                                                }else{
                                                    res.json({
                                                        "status": "1",
                                                        "status_message": "Payment status Not Updated.",
                                                    
                                                      });
                                                }               
                    });

                
                //  });
                
             }  else{
                res.json({
                    "status": "1",
                    "status_message": "User not Found.",
                
                  });
             }
         });
        }
     });
     //-------------------updatepayment status  api ----------------//

//---------------------purchases-------------//
router.post('/purchases',upload_client_profile.single('file'), (req, res, next) =>{
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
                            
                                Order.find({'client_id':data._id,payment_status:'1'}).populate('studio_id').exec(function(err, c) {
                                          console.log(c)
                                           record = [];
                                           c.forEach(function(data3){
                                               var photograph_id =   data3.studio_id.photograph_id;
                                                 var images = data3.image_ids;
                                                 var order_id = data3._id;
                                                 var event_id = data3.event_id;
                                                 var images_data = images.split(',');
                                                 var count = images_data.length;
                                                 var studio_name = data3.studio_id.studio_name;
                                                 if(data3.studio_id.studio_image == ""){
                                                     var file =baseurl;
                                                 }else{
                                                   var file =studio_profile+data3.studio_id.studio_image;
                                                 }
                                               record.push({
                                                   "number_of_images":count,
                                                   "created_date":data3.created_date ,
                                                   "event_id":event_id,
                                                   "photograph_id":photograph_id,
                                                   "event_name":"Appointment",
                                                   "studio_profile_image":file,
                                                   "order_id":order_id,
                                                   "studio_name":studio_name,
                                                   
                                               });
                                             });
                                       res.json({
                                                               "status": "1",
                                                               "status_message": "Data Found.",
                                                               "data":record,
                                                               
                                                             });
                                                         });                           
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
    
    //---------------------purchases -------------//
//--------------update slide show-------------//
router.post('/update_slide_show',upload_client_profile.single('file'),(req, res, next) =>{
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
                         var shared_id = req.body.shared_id;
                       
                         if(!shared_id ){
                            res.json({
                               "status": "0",
                               "status_message": "Shared id is not empty",
                           }); return;
                    }else{
                        SharedImage.findOne({ '_id':shared_id }, function(err, shareddata) {
                         if(shareddata){
                            var slide_Show_time = req.body.slide_show_time;
                            var myquery = {_id:shared_id};
                        var newvalues = { $set: {slide_Show_time:slide_Show_time} };
                        SharedImage.updateMany(myquery, newvalues, function(err, result) {
                                if(result){
                                    console.log(result)
                                       res.json({
                                    "status": "1",
                                    "status_message": "Data updated successfully",
                                    
                    
                                }); return;
                                    
                                }
                            });
                         }
                    });
                    }
 

                        //  var slide_Show_time = req.body.slide_Show_time;
                        // var myquery = {_id:req.body.studio_id};
                        // var newvalues = { $set: {interval:interval,slide_Show_time:slide_Show_time} };
                        // Studio.updateMany(myquery, newvalues, function(err, result) {
                        //     if(result){
                        //         console.log(result)
                        //            res.json({
                        //         "status": "1",
                        //         "status_message": "Data updated successfully",
                                
                
                        //     }); return;
                                
                        //     }
                        // });
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
//------------update slide show --------------//

   //--------------update prefrences =------//
router.post('/preview_mode',upload_client_profile.single('file'),(req, res, next) =>{
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
                         var interval = req.body.interval;
                         var slide_Show_time = req.body.slide_Show_time;
                        var myquery = {_id:req.body.studio_id};
                        var newvalues = { $set: {interval:interval,slide_Show_time:slide_Show_time} };
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

   
  //-----------test api --------------------------------//
//   router.post('/test',upload_studio_profile.single('image'),(req, res, next) =>{
   
//     res.json({
//         "status":"1"
//     });
//     });
// router.post('/upload_images_s3', upload.single('image'),  (req,res,next) => {
    
//    res.json('Successfully uploaded  files!')
// });
  //---------test api ------------------------------//

  //---------------get Update prefrence --------------------//
  router.post('/get_update_prefrences',upload_client_profile.single('file'),(req, res, next) =>{
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
                    Studio.findOne({ 'photograph_id':data._id }, function(err, data2) {
                                               var file = data2.file
                                               var image_split = file.split('.');
                                    
                                                if(image_split[1] == 'jpg'){
                                                    var file_jpg = data2.file
                                                }else{
                                                    var file_jpg = "";
                                                }
                                                
                                                if(image_split[1] == 'png'){
                                                    var file_png = data2.file
                                                }
                                                else{
                                                    var file_png = "";
                                                }

                                                           res.json({
                                                               "status": "1",
                                                               "status_message": "Data Found.",
                                                               "studio_name_on_image":data2.studio_name_on_image,
                                                               "slide_Show_time":data2.slide_Show_time,
                                                               "interval":data2.interval,
                                                               "disable_interval_view":data2.disable_interval_view,
                                                               "file_jpg":file_jpg,
                                                               "file_png":file_png
                                                             
                                                             });     
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
//---------------get Update  prefrence -------------------//
//------------------update device_id client -----------//
router.post('/device_id_client', upload_profile_image.single('image'),(req, res, next) =>{
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
                  
                        var device_id = req.body.device_id;
                        var device_type = req.body.device_type;
                         if(device_id == ""){
                            res.json({
                                "status": "0",
                                "status_message": "Device id required",
                            }); return;
                        }else{
                        var myquery = { _id: data._id };
                        
                        var newvalues = { $set: {device_id:device_id,device_type:device_type} };
                       
                        Client.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                res.json({
                                    "status": "1",
                                    "status_message": "Device id Updated",
                                }); return;
                            }else{
                                res.json({
                                    "status": "0",
                                    "status_message": "Error Occured in Updation",
                                }); return;
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
    }catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });

                }
	});

//----------------update device_id client ------------//
//---------------update device_id user-----------------//

router.post('/device_id_user', upload_profile_image.single('image'),(req, res, next) =>{
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
                  
                        var device_id = req.body.device_id;
                        var device_type = req.body.device_type;
                        if(device_id == ""){
                            res.json({
                                "status": "0",
                                "status_message": "Device id required",
                            }); return;
                        }else{
                        var myquery = { _id: data._id };
                        
                        var newvalues = { $set: {device_id:device_id,device_type:device_type} };
                       
                        User.updateMany(myquery, newvalues, function(err, result) {
                            if(result){
                                res.json({
                                    "status": "1",
                                    "status_message": "Device id Updated",
                                }); return;
                            }else{
                                res.json({
                                    "status": "0",
                                    "status_message": "Error Occured in Updation",
                                }); return;
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
    }catch (e) {
            res.json({ "status": "0", "status_message": "fghfh", 'error': e }); return;
        }
    });

                }
	});

//--------------update device_id user-------------------//
//-------------send notification---------------//
router.post('/notification', upload_profile_image.single('image'),(req, res, next) =>{
var photograph_id =  req.body.photograph_id;
var client_id  = req.body.client_id;
User.findOne({ '_id': photograph_id }, function(err, data) {
    if(data){

         Notification.findOne({ 'client_id': client_id,'is_deleted':'1' }, function(err, data2) {
         if(data2){
            var myquery = { _id: req.body.client_id };
            var newvalues = { $set: {login_status:"0"} };
            Client.updateMany(myquery, newvalues, function(err, result) {
            
                // Client.findOne({ '_id': client_id }, function(err, data3) {
                //     var message = {
                //     job_id: result,
                //   };
                //   console.log(message)
                // payload=[];
                // payload.push(message);
                // var msgios = "ScreenShot";
                // ApnSendPilot(data.device_id,msgios,payload[0],client_id);
            res.json({
                status:"1",
                message:"Your Account has been freezed."
            });
                // });
                
             });
            
        }
        else{
            Client.findOne({ '_id': client_id }, function(err, data3) {
                console.log(data3)
              var message = {
                job_id: data._id,
              };
            payload=[];
            payload.push(message);
           

            // var msgios = data3.client_name+" "+"has taken the screenshot.";
            var msgios = "Client"+" "+data3.client_name+" "+" has taken a screenshot of a shared preview image. Please contact your client about this issue."
            ApnSendPilot(data.device_id,msgios,payload[0],client_id);
            res.json({
              status:"0",
              message:"This is a violation of policy and a violation of trust with your photographer. They have been notified. If you take another screenshot, your account will be frozen and you will have to contact support to re-access your account."
            });
        });
        }
        });    
    }else{
        res.json({
         "status":"0",
         "message":"Taking Screenshot is not allowed, your account will automatically be freezed if you try to take the screenshot next time."
        });
    }
});
});
//-------------send notification--------------//


//---------- client account activate------------//
router.post('/client_account_activate', upload_profile_image.single('image'),(req, res, next) =>{
    var client_id  = req.body.client_id;
    if(!client_id){
        res.json({
           "status": "0",
           "status_message": "Fields are required",
       }); return;
}
else{
    var myquery = { _id: client_id };
    var newvalues = { $set: {login_status:"1"} };
    Client.updateMany(myquery, newvalues, function(err, result) {
    if(result){

        Client.findOne({ '_id': client_id }, function(err, data2) {
    // Notification.remove({'client_id':client_id}).exec();
    var myquery2 = { client_id: client_id };
    var newvalues2 = { $set: {is_deleted:"0"} };
    Notification.updateMany(myquery2, newvalues2, function(err, result) {
    // var message = {
    //     job_id: result,
    //   };
    // payload=[];
    // payload.push(message);
    // var msgios = "Account activate";
    // ApnSendPilot(data2.device_id,msgios,payload[0],client_id);
res.json({
    status:"1",
    message:"Your Account has been Activate,Now you can Login again with same credentials."
});
});
             
           
});

        

  
    }else{
        res.json({
            "status": "0",
            "status_message": "Please try agaain later.",
        }); return;
    }
    });
}
});
//-----------client account activate -----------//
module.exports = router;
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var userSchema = new Schema({
country_code: {
		type: String,
		default:""
	},
    phone_number: {
        type: String,
        maxlength: 15
    },
    email: {
        type: String,	
		sparse: true,
		unique:true,
        maxlength: 255
    },
    password: {
        type: String,
        default:"",	
    },
	
    created_date: {
        type: Date,
        default: Date.now
    },
    modified_date: {
        type: Date,
        default: Date.now
    },
    is_deleted:{
        type: Boolean,
        default: 1
    },
    token:{
        type: String,
        maxlength: 225
    },
    type:{
        type:String,
    },
    social_id:{
        type:String
    },
    user_name:{
        type:String
    },
    user_type:{
        type:String
    },
    profile_image:{
        type:String
    }
},
{
   versionKey: false // You should be aware of the outcome after set to false
});
userSchema.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var user = mongoose.model('user', userSchema);
module.exports = user;
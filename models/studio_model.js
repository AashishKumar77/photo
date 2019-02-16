var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var studioSchema = new Schema({

    studio_name: {
        type: String,
    },
    studio_phone_no: {
        type: String,
        maxlength: 15
    },
    studio_email: {
        type: String,	
		sparse: true,
		unique:true,
        maxlength: 255
    }, 
    studio_name_on_image: {
        type: String,
        default:""	
    },
    slide_Show_time:{
        type: String,
        default:""
    },
    interval:{
        type: String,
        default:""
    },
    disable_interval_view:{
        type: String,
        default:""
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
    photograph_id:{
        type:String
    },
   
    file:{
        type:String,
        deafult:""
    },
    country_code:{
        type:String,
        
    },
    photographer_name:{
        type:String,
    },
},
{
   versionKey: false // You should be aware of the outcome after set to false
});
studioSchema.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var studio = mongoose.model('studio', studioSchema);
module.exports = studio;
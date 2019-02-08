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
    studio_name_status: {
        type: Boolean,
        default:"0"	
		
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
        
    }
},
{
   versionKey: false // You should be aware of the outcome after set to false
});
studioSchema.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var studio = mongoose.model('studio', studioSchema);
module.exports = studio;
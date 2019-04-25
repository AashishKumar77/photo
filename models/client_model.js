var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    client_phone_no:{
        type: String,
        default:""
    },
    device_id:{
        type: String,
    },
    device_type:{
        type: String,
    },
    country_code:{
        type: String,
        default:""
    },
    client_name: {
        type: String,
        default:""
    },
    client_name2: { //for client end
        type: String,
        default:""
    },
    
    client_email: {
        type: String,	
        maxlength: 255
    },
    client_email2: { //for client end 
        type: String,	
        maxlength: 255
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
    client_token:{
        type: String,
        maxlength: 225
    },
    profile_image:{     //for client end 
        type:String,
        default:""
    },
    profile_image2:{
        type:String,
        default:""
    },
    photograph_id:{
        type:String,
        default:""
    },
    password:{
        type:String,
        default:""
    },
    token:{
        type:String,
        default:""
    },
    login_status:{
        type:String,
        default:""
    }
,event_id: {
    type: Schema.Types.ObjectId,
    ref: 'event',
},
},
{
   versionKey: false // You should be aware of the outcome after set to false
});
clientSchema.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var client = mongoose.model('client', clientSchema);
module.exports = client;
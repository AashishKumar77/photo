var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    event_id: {
        type: Schema.Types.ObjectId,
        ref: 'event',
    },
country_code: {
		type: String,
		default:""
    },
    client_name: {
        type: String,
        default:""
    },
    client_phone_no: {
        type: String,
        maxlength: 15,
        unique:true,
    },
    client_email: {
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
    profile_image:{
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
    }

},
{
   versionKey: false // You should be aware of the outcome after set to false
});
clientSchema.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var client = mongoose.model('client', clientSchema);
module.exports = client;
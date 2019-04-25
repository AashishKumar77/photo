var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    client_id:{
        type: String,
        unique:true,
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
    
},
{
   versionKey: false // You should be aware of the outcome after set to false
});
notificationSchema.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var notification = mongoose.model('notification', notificationSchema);
module.exports = notification;
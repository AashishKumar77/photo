var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var eventSchema_ = new Schema({

    event_name: {
        type: String,
    },
    client_id: {
        type: String,
    },
    event__created_date: {
        type: Date,
        default: Date.now
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
    number_of_images:{
        type:String,
        deafult:""
    }
   
},
{
   versionKey: false // You should be aware of the outcome after set to false
});
eventSchema_.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var event = mongoose.model('event', eventSchema_);
module.exports = event;
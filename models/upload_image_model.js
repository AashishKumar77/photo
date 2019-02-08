var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var uploadSchema  = new Schema({

    event_id: {
        type: String,
    },
    photograph_id: {
        type: String,
    },
    image: {
        type: String,
        
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
    }
   
},
{
   versionKey: false // You should be aware of the outcome after set to false
});
uploadSchema.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var upload_image = mongoose.model('upload_images', uploadSchema);
module.exports = upload_image;
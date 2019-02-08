var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var shareimageSchema  = new Schema({

    client_id: {
        type: String,
    },
    photograph_id: {
        type: String,
    },
    image_ids: {
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
        default: 0
    },
    preview_mode:{
        type: String,
        
    },
   
},
{
   versionKey: false // You should be aware of the outcome after set to false
});
shareimageSchema.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var shared_image = mongoose.model('shared_images', shareimageSchema);
module.exports = shared_image;
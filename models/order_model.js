var mongoose = require('mongoose');
var client = require("./client_model");
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
   
    client_id:{
        type: Schema.Types.ObjectId, 
        ref: 'client',
    },
    image_ids: {
		type: String,
		default:""
    },
    order_date: {
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
        type:String,
        default:""
    },
    payment_status:{
        type: Boolean,
        default: 1
    },
    studio_id:{
        type: Schema.Types.ObjectId, 
        ref: 'studio',
    }
    

},
{
   versionKey: false // You should be aware of the outcome after set to false
});
orderSchema.plugin(uniqueValidator,{ message: '{PATH} is to be unique.' });
var order = mongoose.model('order', orderSchema);
module.exports = order;
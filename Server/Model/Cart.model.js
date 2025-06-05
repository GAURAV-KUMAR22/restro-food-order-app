import mongoose, { now } from "mongoose";

const CartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        _id: false,
    }],
    addedAt: {
        type: Date,
        default: Date.now
    }
});
const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
import express from 'express';
import { getCartItems, patchDecrementQuantity, patchIncrementCartQuantity, postAddTOCart } from '../Controller/Cart.controller.js';
const route = express.Router();

route.get('/', getCartItems);
route.post('/add-cart', postAddTOCart);
route.post('/inc-qty', patchIncrementCartQuantity);
route.post('/dec-qty', patchDecrementQuantity);


export default route;
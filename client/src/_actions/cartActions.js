import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ADD_TO_CART, GET_CART_ITEM, UPDATE_CART_ITEM,REMOVE_CART_ITEM, CLEAR_CART_ITEM} from './types';

export default function useCarts() {
    const token = localStorage.getItem('customerToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const dispatch = useDispatch();

    const addToCart = async (data) => {
        try {
            const result = await axios.post('/carts/addToCart', data, config);
            dispatch({
                type: ADD_TO_CART,
                payload: result.data,
            });
            return result.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return error.response?.data;
        }
    };

    const getCartItems = async () => {
        try {
            const result = await axios.get('/carts', config);
            dispatch({
                type: GET_CART_ITEM,
                payload: result.data,
            });
            return result.data;
        } catch (error) {
            console.error('Error getting cart items:', error);
            return error.response?.data;
        }
    };
    const updateCartItem= async (data) => {
        try {
            const result = await axios.put('/carts/updateCartItem', data, config);
            dispatch({
                type: UPDATE_CART_ITEM,
                payload: result.data,
            });
            return result.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return error.response?.data;
        }
    };

    const removeCartItem= async (productId) => {
        try {
            const result = await axios.put(`/carts/removeCartItem/${productId}`, false, config);
            dispatch({
                type: REMOVE_CART_ITEM,
                payload: result.data,
            });
            return result.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return error.response?.data;
        }
    };
    const clearCart= ()=>{
        dispatch({
            type: CLEAR_CART_ITEM
        })
    }

    return {
        getCartItems,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart
    };
}

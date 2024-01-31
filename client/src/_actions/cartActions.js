import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ADD_TO_CART, GET_CART_ITEM } from './types';

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

    return {
        getCartItems,
        addToCart,
    };
}

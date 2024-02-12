import axios from 'axios';
import { useDispatch } from 'react-redux';
import {ADD_TO_CART, CHECKOUT, GET_ORDER_HISTORY} from './types';

export default function useOrders() {
    const token = localStorage.getItem('customerToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const dispatch = useDispatch();

    const checkout = async (data) => {
        try {
            const result = await axios.post('/orders/checkout', data, config);
            dispatch({
                type: CHECKOUT,
                payload: result.data,
            });
            return result.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return error.response?.data;
        }
    };
    const getOrderHistory =async () => {
        try {
            const result = axios.post('/orders/orderHistory', config);
            dispatch({
                type: GET_ORDER_HISTORY,
                payload: result,
            });
            return result;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return error.response?.data;
        }
    };
    return{
        checkout,
        getOrderHistory
    }
}

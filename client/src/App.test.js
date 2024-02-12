import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import useCarts from './_actions/cartActions';
import { ADD_TO_CART, GET_CART_ITEM } from './_actions/types';
import { useDispatch } from 'react-redux';

//  мок объект axios для имитации запросов
const mockAxios = new MockAdapter(axios);

// мок функции useDispatch
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));

describe('useCarts', () => {
    // Подготовка перед каждым тестом
    beforeEach(() => {
        // Очищаем мок функции useDispatch перед каждым тестом
        useDispatch.mockClear();
    });

    it('should add item to cart correctly', async () => {
        const data = { itemId: 1, quantity: 2 };
        const responseData = { id: 1, name: 'Item 1', quantity: 2 };
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        mockAxios.onPost('/carts/addToCart').reply(200, responseData);

        const { addToCart } = useCarts();
        const result = await addToCart(data);

        expect(result).toEqual(responseData);
        expect(dispatchMock).toHaveBeenCalledWith({
            type: ADD_TO_CART,
            payload: responseData,
        });
    });

    it('should handle error when adding item to cart', async () => {
        const data = { itemId: 1, quantity: 2 };
        const errorResponse = { message: 'Error adding to cart' };
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        mockAxios.onPost('/carts/addToCart').reply(500, errorResponse);

        const { addToCart } = useCarts();
        const result = await addToCart(data);

        expect(result).toEqual(errorResponse);
        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('should get cart items correctly', async () => {
        const responseData = [{ id: 1, name: 'Item 1', quantity: 2 }];
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        mockAxios.onGet('/carts').reply(200, responseData);

        const { getCartItems } = useCarts();
        const result = await getCartItems();

        expect(result).toEqual(responseData);
        expect(dispatchMock).toHaveBeenCalledWith({
            type: GET_CART_ITEM,
            payload: responseData,
        });
    });

    it('should handle error when getting cart items', async () => {
        const errorResponse = { message: 'Error getting cart items' };
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        mockAxios.onGet('/carts').reply(500, errorResponse);

        const { getCartItems } = useCarts();
        const result = await getCartItems();

        expect(result).toEqual(errorResponse);
        expect(dispatchMock).not.toHaveBeenCalled();
    });
});
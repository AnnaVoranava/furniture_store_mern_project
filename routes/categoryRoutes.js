const Router = require('express').Router;
const { Category } = require('../models/Category');

const router = Router();

// Пример маршрута для получения всех категорий
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().exec();
        return res.status(200).json({
            status: true,
            message: 'Get category successfully!',
            data: categories,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error.message,
        });
    }
});

// Пример маршрута для создания новой категории
router.post('/create', async (req, res) => {
    const category = new Category(req.body);
    try {
        const savedCategory = await category.save();
        return res.status(200).json({
            status: true,
            message: 'Category has been added successfully!',
            data: savedCategory,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error.message,
        });
    }
});

module.exports = router;

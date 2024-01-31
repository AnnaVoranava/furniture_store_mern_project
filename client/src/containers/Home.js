import React, { useEffect, useState } from 'react';
import { Button, Card, Carousel, Col, message, Popover, Row, Space, Tabs, Typography } from 'antd';
import 'antd/dist/antd.css';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import useProducts from '../_actions/productActions';
import slide1 from '../assets/images/slide-1.jpg';
import slide2 from '../assets/images/slide-2.jpg';
import slide3 from '../assets/images/slide-3.jpeg';
import slide4 from '../assets/images/slide-4.jpg';
import ProductDetailsModal from '../components/Modals/ProductDetailsModal';
import useCarts from '../_actions/cartActions';

const { TabPane } = Tabs;
const contentStyle = {
    height: '500px',
    width: '100%',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    objectFit: 'cover'
};
const { Text } = Typography;

function Home() {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.product.productList);
    const { addToCart } = useCarts();
    const { getProductList } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleShowProductDetails = (item) => {
        setSelectedProduct(item);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handlePreview = (item) => {
        setSelectedProduct(item);
        setShowModal(true);
    };

    const handleAddToCart = (item) => {
        const data = {
            _productId: item._id,
            quantity: 1,
        };

        dispatch(addToCart(data)).then((res) => {
            if (res.payload.status) {
                message.success(res.payload.message);
            } else {
                message.error(res.payload.message);
            }
        });
    };

    useEffect(() => {
        getProductList();
    }, []);

    const renderSlider = () => {
        return (
            <div>
                <Carousel autoplay>
                    <div>
                        <img src={slide1} alt="Slide 1" style={contentStyle} />
                    </div>
                    <div>
                        <img src={slide2} alt="Slide 2" style={contentStyle} />
                    </div>
                    <div>
                        <img src={slide3} alt="Slide 3" style={contentStyle} />
                    </div>
                    <div>
                        <img src={slide4} alt="Slide 4" style={contentStyle} />
                    </div>
                </Carousel>
            </div>
        );
    };

    const renderProductList = () => {
        const filteredProducts =
            selectedCategory === 'all'
                ? productList
                : productList.filter((item) => item._category?.name === selectedCategory);

        return (
            <div>
                <Tabs
                    textColor="primary"
                    indicatorColor="primary"
                    activeKey={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                    centered
                    style={{ marginBottom: '20px' }}
                >
                    <TabPane tab="All products" key="all" />
                    <TabPane tab="Armchairs" key="Armchairs" />
                    <TabPane tab="Beds" key="Beds" />
                    <TabPane tab="Chairs" key="Chairs" />
                    <TabPane tab="Sofas" key="Sofas" />
                </Tabs>

                <Row gutter={[12, 12]} style={{ padding: 10 }}>
                    {filteredProducts?.map((item, index) => (
                        <Col key={index} xs={24} sm={12} md={12} xl={6} xxl={6} lg={6}>
                            <Card
                                hoverable
                                cover={
                                    <Popover
                                        placement="bottomRight"
                                        content={
                                            <img
                                                alt="example"
                                                src={item.image}
                                                style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                                            />
                                        }
                                        trigger="hover"
                                    >
                                        <img
                                            alt="example"
                                            src={item.image}
                                            style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                                        />
                                    </Popover>
                                }
                                actions={[
                                    <Button icon={<EyeOutlined style={{ color: '#b82', fontSize: 16 }} />} onClick={() => handlePreview(item)}>
                                        Preview
                                    </Button>,
                                    <Button icon={<ShoppingCartOutlined key="cart" style={{ color: '#b82837', fontSize: 16 }} />} onClick={() => handleAddToCart(item)}>
                                        Add
                                    </Button>,
                                ]}

                            >
                                <Space direction="vertical">
                                    <Text strong onClick={() => handleShowProductDetails(item)}>
                                        {item?.name}
                                    </Text>
                                    <Text type="secondary">{item?._category?.name}</Text>
                                    <Text type="success">${item?.price}</Text>
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    };

    return (
        <div>
            {renderSlider()}
            {renderProductList()}
            <ProductDetailsModal visible={showModal} product={selectedProduct} onCancel={handleCancel} />
        </div>
    );
}

export default Home;

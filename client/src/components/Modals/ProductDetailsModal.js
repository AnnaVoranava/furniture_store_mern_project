import React, {useState} from "react";
import {Button, Row, Col, Image, InputNumber, Modal, Space, Typography, message} from "antd";
import {ShoppingCartOutlined} from "@ant-design/icons";
import useCarts from'../../_actions/cartActions';
import {useDispatch} from "react-redux";

const  {Title, Text} =Typography;
 function ProductDetailsModal (props) {
     const {product, visible, onCancel} =props;
     const dispatch =useDispatch();
     const {addToCart}= useCarts();
     const [quantity, setQuantity]= useState(1);
    const handleChangeQuantity =(value)=> {
        setQuantity(value);
    };
     const handleAddToCart = (item) => {
         const data = {
             _productId: item._id,
             quantity,
         };

         dispatch(addToCart(data)).then((res) => {
             if (res.payload.status) {
                 message.success(res.payload.message);
                 setQuantity(1)
             } else {
                 message.error(res.payload.message);
             }
         });
     };
     return (
         <Modal title={product?.name} width={700} visible={visible} onCancel={onCancel} footer={null}>
             <Row gutter={12}>
                 <Col xs={24} sm={12} md={12} lg={12}>
                     <Image src={product?.image}></Image>
                 </Col>
                 <Col xs={24} sm={12} md={12} lg={12}>
                     <Space direction={'vertical'}>
                         <Title level={5}>{product?.name}</Title>
                         <Text type={'secondary'}>{product?.category?.name}</Text>
                         <Text type={'success'}>${product?.price}</Text>
                         <Text italic>{product?.description}</Text>
                         <Space direction={'horizontal'}></Space>
                         <InputNumber min={1} value={quantity} onChange={handleChangeQuantity}/>
                         <Button type={'primary'} icon= {<ShoppingCartOutlined style={{fontSize:18}}/>}>Add to Cart</Button>
                     </Space>
                 </Col>
             </Row>
         </Modal>
     )
 }
 export default ProductDetailsModal;
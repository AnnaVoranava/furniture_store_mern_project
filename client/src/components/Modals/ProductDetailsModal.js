import React, {useState} from "react";
import {Button, Row, Col, Image, InputNumber, Modal, Space, Typography, message} from "antd";
import {ShoppingCartOutlined} from "@ant-design/icons";
 const  {Title, Text} =Typography;
 function ProductDetailsModal (props) {
     const {product, visible, onCancel} =props;
     const [quantity, setQuantity]= useState(1);
    const handleChangeQuantity =(value)=> {
        setQuantity(value);
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
import React from "react";
import {Image, PageHeader, Space, Table, Typography} from "antd";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails)
    const renderCartItems = () => {
        return (
            <Table columns={columns} dataSource={cartItems || []} scroll={{x: 1300}}/>
        )
    }
    const columns = [
        {
            title: "Product",
            width: 100,
            dataIndex: "_product",
            key: 'name',
            render: (item) => {
                return (
                    <Space direction={"vertical"}>
                        <Typography.Text strong>{item?.name}</Typography.Text>
                        <Image src={item?._productId?.image} alt="image" width={100}></Image>
                    </Space>)
            },
            fixed: "left"
        },
        {
            title: "Price ($)",

            dataIndex: "price",
            key: "price",
            align: 'right'
        },
        {
            title: "Quantity",

            dataIndex: "quantity",
            key: "quantity",
            align: 'right'
        },
        {
            title: "Amount ($)",

            dataIndex: "amount",
            key: "amount",
            align: 'right'
        }
    ]
    return (
        <>
            <PageHeader title="Your Cart" onBack={() => navigate(-1)}/>
            <div className="page-wrapper"></div>
            {renderCartItems()}
        </>
    )
}

export default Cart;
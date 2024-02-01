import React from "react";
import {PageHeader, Table, Space, Typography, Image} from "antd";
import  {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Login from "./Login";

function Cart() {
    const navigate= useNavigate();
    const cartItems = useSelector((state)=>state.cart.cartItems?.cartDetails)
    const renderCartItems =()=> {
        return(
            <Table columns={columns} dataSource={cartItems || []} scroll={{ x: true }} />
        )
    }
    const columns= [
        {
            title:"Product",

            dataIndex: "_product",
            key: 'name',
            render:(item)=> {
                return(
                <Space direction={"vertical"}>
<Typography.Text strong>{item?.name}</Typography.Text>
                    <Image src={item?.image} alt="image" width={100}></Image>
                </Space>)
            },
            fixed:"left"
        },
        {
            title: "Price ($)",

            dataIndex: "price",
            key:"price",
            align:'right'
        },
        {
            title: "Quantity",

            dataIndex: "quantity",
            key:"quantity",
            align:'right'
        },
        {
            title: "Amount ($)",

            dataIndex: "amount",
            key:"amount",
            align:'right'
        }
    ]
    return(
        <>
            <PageHeader title="Your Cart" onBack={()=>navigate(-1)}/>
            <div className="page-wrapper"></div>
            {renderCartItems()}
        </>
    )
}
export default Cart;
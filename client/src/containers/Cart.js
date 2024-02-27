import React, {useState} from "react";
import {Button, Image, InputNumber, message, PageHeader, Space, Table, Typography} from "antd";
import {DeleteTwoTone, DollarOutlined, EditTwoTone, ReloadOutlined, SaveTwoTone} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import useCarts from "../_actions/cartActions"
import {sumBy} from "lodash";
import StripeCheckout from "react-stripe-checkout";
import useOrders from "../_actions/orderActions";

function Cart() {
    const navigate = useNavigate();
    const {updateCartItem, removeCartItem, clearCart} = useCarts();
    const dispatch = useDispatch();
    const {checkout} = useOrders();
    const auth = useSelector((state) => state.customer.auth)
    const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);
    const [editItem, setEditItem] = useState(null);
    const [quantity, setQuantity] = useState(null);

    const handleEdit = (item) => {
        setEditItem(item);
        setQuantity(item.quantity)
    };
    const handleRemove = (item) => {
        dispatch(removeCartItem(item._product._id)).then(res => {
            if (res.payload.message) {
                message.success(res.payload.message);
            } else {
                message.error(res.payload.message)
            }
        })
    };
    const handleReset = () => {
        setEditItem(null)
    }
    const handleQuantityChange = (value) => {
        setQuantity(value);

    }
    const handleUpdateCartItem = (item) => {
        const data = {
            _productId: item?._product?._id,
            quantity
        }
        dispatch(updateCartItem(data)).then((res) => {
            if (res.payload.status) {
                message.success(res.payload.message);
                setEditItem(null)
            } else {
                message.error(res.payload.message)
            }
        })
    }
    const renderCartItems = () => {
        return (
            <Table columns={columns} dataSource={cartItems} scroll={{x: 1300}}/>
        )
    }
    const handlePayout = (token, totalPay) => {
        dispatch(checkout({token, totalPay})).then(res => {
            if (res.payload.status) {
                clearCart();
            } else {
                message.error(res.payload.message)
            }
        })
    }


    const columns = [
        {
            title: "Product",
            width: 20,
            dataIndex: "_product",
            key: 'name',
            render: (item) => {
                return (
                    <Space direction={"vertical"}>
                        <Typography.Text strong>{item?.name}</Typography.Text>
                        <Image src={item?.image} alt="image" width={150}></Image>
                    </Space>)
            },
            fixed: "left"
        },
        {
            title: "Price ($)",
            width: 20,
            dataIndex: "price",
            key: "price",
            align: 'left'
        },
        {
            title: "Quantity",
            width: 20,
            align: 'left',
            render: (item) => {
                if (editItem?._product?._id === item?._product?._id) {
                    return (
                        <InputNumber size="small" min={1} value={quantity} onChange={handleQuantityChange}/>
                    )
                }
                return <span>{item?.quantity}</span>
            }
        },
        {
            title: "Amount ($)",
            width: 20,
            dataIndex: "amount",
            key: "amount",
            align: 'left'
        },
        {
            title: "Actions",
            fixed: 'left',
            width: 20,
            render: (item) => {
                return (
                    <>
                        {editItem?._product?._id === item?._product?._id ? (
                            <span style={{marginRight: 4}}>
                                <SaveTwoTone style={{marginRight: 4, fontSize: 16}} onClick={() => {
                                    handleUpdateCartItem(item)
                                }}/>
                                <ReloadOutlined style={{fontSize: 16, color: "green"}} onClick={handleReset}/>
                            </span>
                        ) : (
                            <EditTwoTone style={{marginRight: 4, fontSize: 16}} twoToneColor="orange"
                                         onClick={() => handleEdit(item)}/>)}
                        <DeleteTwoTone style={{fontSize: 16}} twoToneColor="red" onClick={() => handleRemove(item)}/>
                    </>
                )
            }
        }
    ];
    const renderCheckout = () => {
        const totalPay = sumBy(cartItems, (item) => item.amount);
        console.log(totalPay)
        if (cartItems?.length > 0) {
            return (<center>
                <p>Total amount: ${totalPay}</p>
                <StripeCheckout
                    name="Payment" email={auth?.data?.email}
                    description="Payment for products"
                    amount={totalPay * 100}
                    token={(token) => handlePayout(token, totalPay)}
                    stripeKey='pk_test_51OifeWFz5hLXfkRKUrcOPjG4Ey5C7dgEpN5JrsZZvViDhnkmOD7oyKQYBy0kpBTutSdh6PC3Tc0AWa66ZsNI8Qxm00R63Ba9qV'>
                    <Button type='primary' icon={<DollarOutlined/>}>Checkout</Button></StripeCheckout></center>)
        }
    }
    return (
        <>
            <PageHeader title="Your Cart" onBack={() => navigate(-1)}/>
            <div className="page-wrapper">
                {renderCartItems()}
                {renderCheckout()}</div>
        </>
    )
}

export default Cart;
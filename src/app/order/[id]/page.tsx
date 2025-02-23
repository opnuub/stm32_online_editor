"use client"

import { useState, useEffect } from "react";
import { Row, Col, ListGroup, Button, Card } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import {isMobile} from 'react-device-detect';

import Image from 'next/image'
import Link from "next/link";
import Message from "@/app/components/Message";
import Loader from "@/app/components/Loader";

type OrderItem = {
    name: string
    product: number
    qty: number
    size: number
    image: string
    price: number
}

type User = {
    id: string
    username: string
    email: string
    name: string
    is_admin: string
}

type Order = {
    _id: number;
    orders: OrderItem[];
    shippingAddress: {
        address: string
    }
    user: User
    paymentMethod: string;
    totalPrice: string;
    isPaid: boolean;
    paidAt: string;
    isDelivered: boolean;
    deliveredAt: string;
    createdAt: string;
}

export default function Order({
    params
}: {
    params: {id: string}
}) {
    const [data, setData] = useState<Order>();
    const [isLoading, setLoading] = useState(true);
    const [link, setLink] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [change, setChange] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    function handleVisibilityChange() {
        if (!document.hidden) {
            const userInfo = localStorage.getItem("userInfo")
            if (userInfo && !isPaid) {    
                fetch(`${process.env.SERVER}/api/payment/verify/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                    },
                    body: JSON.stringify({
                        orderId: params.id
                    })
                    }).then((res) => res.json()).then(() => setChange(!change))
            }
        }
    }

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {    
            const decodedToken = jwtDecode(JSON.parse(userInfo).token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp) {
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem("userInfo")
                    setError(true)
                    setErrorMessage("请重新登陆")
                } else {
                    fetch(`${process.env.SERVER}/api/orders/${params.id}/`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                        },
                        }).then((res) => {
                            if (res.ok) {
                                res.json().then((data) => {
                                    setData(data);
                                    setIsPaid(data.isPaid);
                                })
                            } else {
                                if (res.status == 401) {
                                    setErrorMessage("个别商品缺货, 请重新下单")
                                    setLink("False")
                                    setError(true)
                                } else {
                                    setError(true);
                                    setErrorMessage("Unauthorised")
                                }
                            }
                        })
                }
            };   
            if (link == "") {
                fetch(`${process.env.SERVER}/api/payment/init/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${JSON.parse(userInfo).token}`,  
                    },
                    body: JSON.stringify({
                        orderId: params.id,
                        device: isMobile.toString(),
                    })
                    }).then((res) => res.json()).then((data) => setLink(data["url"]))    
            }
        } else {
            setError(true)
            setErrorMessage("请登陆")
        }
        setLoading(false);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [change, params.id])

    const verifyPayment = (e: React.FormEvent) => {
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {    
            fetch(`${process.env.SERVER}/api/payment/verify/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                },
                body: JSON.stringify({
                    orderId: params.id
                })
                }).then((res) => res.json()).then(() => setChange(!change))
        }
    }

    return isLoading ? <Loader /> :
    error ? <Message variant="danger">{errorMessage}</Message> :
    data && (
        <>
            <Row>
                <Col md={9}>
                    <ListGroup variant='flush'>
                        <h2>订单状态</h2>
                        <ListGroup.Item>
                            <p><strong>收货人: </strong>{data.user.name}</p>
                            <p>
                                <strong>寄送至: </strong>
                                {data.shippingAddress.address}
                            </p>
                            {data.isDelivered ? (
                                <Message variant='success'>已送达</Message>
                            ) : (
                                    <Message variant='warning'>未送达</Message>
                                )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>
                                <strong>支付方式: </strong>
                                {data.paymentMethod}
                            </p>
                            {data.isPaid ? (
                                <Message variant='success'>{`支付日期: ${data.paidAt}`}</Message>
                            ) : (
                                    <Message variant='warning'>未支付</Message>
                                )}
                        </ListGroup.Item>
                        <br></br>
                        {data.orders.length === 0 ? <Message variant='info'>订单不存在</Message> 
                        : (
                            <ListGroup variant='flush'>
                                {data.orders.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1} className="d-flex justify-content-end">
                                            <Image src={item.image} alt={item.name} width="0"
                                                height="0"
                                                sizes="100vw"
                                                style={{ width: '100%', height: 'auto' }} unoptimized/> 
                                            </Col>
                                            <Col>
                                                <Link href={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>
                                            <Col>
                                                尺寸{item.size}
                                            </Col>
                                            <Col md={4} className="d-flex justify-content-end">
                                                {item.qty} X ¥{item.price} = ¥{(item.qty * item.price).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            {!data.isPaid ? (
                                <>
                                <ListGroup.Item>
                                <h2>实支付</h2>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>商品总价</Col>
                                        <Col>¥{data.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button 
                                    href={link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className='btn-block' 
                                    type='button' 
                                    style={{ width: '100%', height: 'auto' }}
                                    >
                                        <i className="fa-brands fa-alipay"></i>
                                    </Button>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>已支付？</Col>
                                        <Col><Link href={`/order/${params.id}`} onClick={(e) => verifyPayment(e)}>刷新</Link></Col>
                                    </Row>
                                </ListGroup.Item>
                                </>
                            ) : (
                                <>
                                <ListGroup.Item>
                                <h2>支付完成</h2>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>已支付</Col>
                                        <Col>¥{data.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                </>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

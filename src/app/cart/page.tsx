"use client"

import { useState, useEffect } from "react";
import { Row, Col, ListGroup, Form, Button, Card } from "react-bootstrap";
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode";

import Image from 'next/image'
import Link from "next/link";
import Message from "../components/Message";
import Loader from "../components/Loader";

type Stock = {
    id: number,
    size: number,
    countInStock: number,
    product: number,
}

type Product = {
    _id: string;
    quantity: string;
    size: number;
    stocks: Stock[]
}

type FetchedProduct = {
    _id: string;
    name: string;
    image: string;
    stocks: Stock[]
    description: string;
    brand: string;
    category: string;
    price: number;
    countInStock: number;
    quantity: string; // We'll add this from the products array
    size: string;
}

export default function Cart() {
    const [cartItems, setCartItems] = useState<FetchedProduct[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [change, setChange] = useState(true)

    const router = useRouter()

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {    
            const decodedToken = jwtDecode(JSON.parse(userInfo).token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp) {
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem("userInfo")
                    router.push("/login")
                }
            };       
            fetch(`${process.env.SERVER}/api/cart/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                },
                }).then((res) => {
                if (res.ok) {
                    res.json().then((data: Product[]) => {
                        data.forEach(product => {
                            fetch(`${process.env.SERVER}/api/products/${product._id}/`).then(res => res.json()).then(data => {
                                data.quantity = product.quantity;
                                data.size = product.size
                                setCartItems(cartItems => [...cartItems, data]);
                            }).catch(err => {
                                setErrorMessage(err)
                                setError(true)
                            })
                        })
                    }).then(() => setLoading(false))
                } else {
                    setErrorMessage(res.statusText);
                    setError(true);
                    setLoading(false);
                }
            })
        } else {
            setError(true)
            setErrorMessage("请登录")
            setLoading(false);
        }
    }, [change, router])

    const changeQuantity = (e:React.FormEvent, idx: string, qty: string, size: string) => {
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {    
            fetch(`${process.env.SERVER}/api/cart/update/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
                body: JSON.stringify({
                    idx: idx,
                    qty: qty,
                    size: size
                })
            }).then((res) => res.json()).then(() => {
                setChange(!change)
                setCartItems([])
            })
        } else {
            router.back()
        }
    }

    const deleteItem = (e: React.FormEvent, id: string, size: string) => {
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {  
            setLoading(true)
            fetch(`${process.env.SERVER}/api/cart/update/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
                body: JSON.stringify({
                    idx: id,
                    qty: 0,
                    size: size
                })
            }).then((res) => res.json()).then(() => {
                setChange(!change)
                setCartItems([])
            })
            setLoading(false)
        } else {
            router.back()
        }
        
    }

    const checkout = (e: React.FormEvent) => {
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {  
            fetch(`${process.env.SERVER}/api/orders/add/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
            }).then((res) => res.json()).then((data) => router.push(`/order/${data}`), () => {
                setError(true)
                setErrorMessage("Create order failed, try again")
                setChange(!change)
            })
        } else {
            router.back()
        }
    }

    return isLoading ? <Loader /> : 
            error ? <Message variant="danger">{errorMessage}</Message> :
            (
                <Row>
                    <Col md={8}>
                        <h2>购物车</h2>
                        {cartItems.length === 0 ? (
                            <Message variant='info'>
                                购物车暂时是空的～
                            </Message>
                        ) : (
                            <ListGroup variant="flush">
                                {cartItems.map((item, index) => (
                                    <ListGroup.Item key={index} >
                                        <Row className="d-flex align-items-center">
                                            <Col md={2}>
                                                <Image src={item.image}
                                                alt={item.name} width="0"
                                                height="0"
                                                sizes="100vw"
                                                style={{ width: '100%', height: 'auto', margin: "10px 0px 0px 0px"}} unoptimized/>
                                            </Col>
                                            <Col md={3}>
                                                <Link href={`/product/${item._id}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={1}>
                                                ${item.price}
                                            </Col>
                                            <Col md={2}>
                                                尺寸{item.size}
                                            </Col>
                                            <Col md={2}>
                                                <Form.Select
                                                    size='sm'
                                                    value={item.quantity}
                                                    onChange={(e) => changeQuantity(e, item._id, e.target.value, item.size)}
                                                >
                                                    {
                                                        [...Array(item.stocks.filter(stock => stock.size === parseInt(item.size)).map(stock => stock.countInStock)[0] || 0)].map((_, x: number) => (
                                                            <option key={x+1} value={x+1}>{x+1}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Col>
                                            <Col md={1}>
                                                <Button type='button' variant='light' onClick={(e) => deleteItem(e, item._id, item.size)}>
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>价格明细</h2>
                                    ¥{cartItems.reduce((acc, item) => acc + Number(item.quantity) * item.price, 0)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button 
                                        type='button' 
                                        className="btn-block"
                                        style={{ width: '100%', height: 'auto' }}
                                        disabled={cartItems.length === 0}
                                        onClick={(e) => checkout(e)}
                                    >
                                        创建订单
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )
}
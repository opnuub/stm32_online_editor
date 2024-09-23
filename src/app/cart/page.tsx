"use client"

import { useState, useEffect } from "react";
import { Row, Col, ListGroup, Form, Button, Card } from "react-bootstrap";
import { useRouter } from 'next/navigation'

import Image from 'next/image'
import Link from "next/link";
import Message from "../components/Message";
import Loader from "../components/Loader";

interface Product {
    _id: string;
    quantity: string;
}

interface FetchedProduct {
    _id: string;
    name: string;
    image: any;
    description: string;
    brand: string;
    category: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
    quantity: string; // We'll add this from the products array
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
            fetch(`http://127.0.0.1:8000/api/cart/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                },
                }).then((res) => {
                if (res.ok) {
                    res.json().then((data: Product[]) => {
                        data.forEach(product => {
                            fetch(`http://127.0.0.1:8000/api/products/${product._id}/`).then(res => res.json()).then(data => {
                                data.quantity = product.quantity;
                                setCartItems([...cartItems, data]);
                            }).catch(err => {
                                setErrorMessage(err)
                                setError(true)
                            })
                        })
                    })
                    setLoading(false);
                } else {
                    setErrorMessage(res.statusText);
                    setError(true);
                    setLoading(false);
                }
            })
        } else {
            setError(true)
            setErrorMessage("Please log in")
            setLoading(false);
        }
    }, [change])

    const changeQuantity = (e:any, idx: string, qty: string) => {
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {    
            fetch("http://127.0.0.1:8000/api/cart/update/", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
                body: JSON.stringify({
                    idx: idx,
                    qty: qty,
                })
            }).then((res) => res.json()).then((_) => {
                setChange(!change)
                setCartItems([])
            })
        } else {
            router.back()
        }
    }

    const deleteItem = (e: any, id: string) => {
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {  
            fetch("http://127.0.0.1:8000/api/cart/update/", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
                body: JSON.stringify({
                    idx: id,
                    qty: 0,
                })
            }).then((res) => res.json()).then((_) => {
                setChange(!change)
                setCartItems([])
            })
        } else {
            router.back()
        }
    }

    const checkout = (e: any) => {
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {  
            fetch("http://127.0.0.1:8000/api/orders/add/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
            }).then((res) => res.json()).then((data) => router.push(`/order/${data}`), (_) => {
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
                        <h2>Shopping Cart</h2>
                        {cartItems.length === 0 ? (
                            <Message variant='info'>
                                Your cart is empty
                            </Message>
                        ) : (
                            <ListGroup variant="flush">
                                {cartItems.map(item => (
                                    <ListGroup.Item key={item._id} >
                                        <Row className="d-flex align-items-center">
                                            <Col md={2}>
                                                <Image src={`http://127.0.0.1:8000${item.image}`}
                                                alt={item.name} width="0"
                                                height="0"
                                                sizes="100vw"
                                                style={{ width: '100%', height: 'auto', margin: "10px 0px 0px 0px"}}/>
                                            </Col>
                                            <Col md={3}>
                                                <Link href={`/shop/${item._id}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={2}>
                                                ${item.price}
                                            </Col>
                                            <Col md={2}>
                                                <Form.Select
                                                    size='sm'
                                                    value={item.quantity}
                                                    onChange={(e) => changeQuantity(e, item._id, e.target.value)}
                                                >
                                                    {
                                                        [...Array(item.countInStock)].map((_, x: number) => (
                                                            <option key={x+1} value={x+1}>{x+1}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Col>
                                            <Col md={1}>
                                                <Button type='button' variant='light' onClick={(e) => deleteItem(e, item._id)}>
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
                                    <h2>Subtotal</h2>
                                    ${cartItems.reduce((acc, item) => acc + Number(item.quantity) * item.price, 0)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button 
                                        type='button' 
                                        className="btn-block"
                                        style={{ width: '100%', height: 'auto' }}
                                        disabled={cartItems.length === 0}
                                        onClick={(e) => checkout(e)}
                                    >
                                        Proceed To Checkout
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )
}
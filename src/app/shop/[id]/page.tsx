"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Row, Col, ListGroup, Button, Card, Form } from 'react-bootstrap'
import { jwtDecode } from "jwt-decode";
import Link from 'next/link'
import Image from 'next/image'

import Loader from "../../components/Loader";
import Message from "../../components/Message";

type Product = {
    _id: string;
    name: string;
    image: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
}

export default function Product({
    params
} : {
    params: { id: string }
}) {
    const [product, setProduct] = useState<Product>();
    const [isLoading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [qty, setQty] = useState("1");

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            const decodedToken = jwtDecode(JSON.parse(userInfo).token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp) {
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem("userInfo")
                    router.push("/login")
                } else {
                    setIsLoggedIn(true)
                }
            }; 
        }
        fetch(`${process.env.SERVER}/api/products/${params.id}/`).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setProduct(data);
                    setLoading(false);
                })
            } else {
                setErrorMessage(res.statusText);
                setError(true);
                setLoading(false);
            }
        })
    }, [params.id])


    const router = useRouter()
    const addToCart = (e: React.FormEvent) => {
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo && product) {  
            fetch(`${process.env.SERVER}/api/cart/add/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
                body: JSON.stringify({
                    idx: product._id,
                    qty: qty,
                })
            }).then((res) => {
                if (res.ok) {
                    router.push('/cart')
                } else {
                    setError(true)
                    setErrorMessage('Unknown error has occurred when adding item to cart')   
                }
            })
        } else {
            router.refresh()
        }
        
    }

    return isLoading ? <Loader />
        : error ? <Message variant="danger">{errorMessage}</Message>
        : product &&
            <div>
                <Link href='/shop' className='btn btn-light my-3'>返回商品目录</Link>
                <Row>
                    <Col md={6}>
                        <Image src={`${process.env.SERVER}/static${product.image}`} alt={product.name} width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }} unoptimized /> 
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
                            <ListGroup.Item><strong>商品详情：</strong><br></br>{product.description}</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>单价:</Col>
                                        <Col className="d-flex justify-content-end"><strong>¥{product.price}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>库存:</Col>
                                        <Col className="d-flex justify-content-end">{product.countInStock}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {isLoggedIn ? ( 
                                <ListGroup.Item >
                                    <Row>
                                        <Col md={9}>
                                            <Button 
                                            onClick={(e) => addToCart(e)}
                                            className='btn-block' 
                                            disabled={product.countInStock == 0} 
                                            type='button' 
                                            style={{ width: '100%', height: 'auto' }}
                                            >
                                                加入购物车
                                            </Button>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Select
                                                size='sm'
                                                value={qty}
                                                onChange={(e) => setQty(e.target.value)}
                                            >
                                                {
                                                    [...Array(product.countInStock)].map((_, x: number) => (
                                                        <option key={x+1} value={x+1}>{x+1}</option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                ): <ListGroup.Item>
                                    <Row className="d-flex justify-content-center align-items-center">请先登陆</Row>
                                </ListGroup.Item>}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
}

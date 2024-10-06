"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Row, Col, ListGroup, Button, Card, Form } from 'react-bootstrap'
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
            setIsLoggedIn(true)
        }
        fetch(`http://54.179.90.179:8000/api/products/${params.id}/`).then((res) => {
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
            fetch("http://54.179.90.179:8000/api/cart/add/", {
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
                <Link href='/shop' className='btn btn-light my-3'>Go Back</Link>
                <Row>
                    <Col md={6}>
                        <Image src={`http://54.179.90.179:8000${product.image}`} alt={product.name} width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }} /> 
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
                            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col className="d-flex justify-content-end"><strong>${product.price}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col className="d-flex justify-content-end">{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row className="d-flex justify-content-between align-items-center">
                                            <Col>Quantity:</Col>
                                            <Col xs='auto' className="my-1">
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
                                )}
                                {isLoggedIn ? ( 
                                <ListGroup.Item >
                                    <Button 
                                    onClick={(e) => addToCart(e)}
                                    className='btn-block' 
                                    disabled={product.countInStock == 0} 
                                    type='button' 
                                    style={{ width: '100%', height: 'auto' }}
                                    >
                                        Add to Cart
                                    </Button>
                                </ListGroup.Item>
                                ): <ListGroup.Item>
                                    <Row className="d-flex justify-content-center align-items-center">Log in before adding to Cart</Row>
                                </ListGroup.Item>}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
}
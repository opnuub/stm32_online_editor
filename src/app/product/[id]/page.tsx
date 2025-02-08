"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Row, Col, ListGroup, Button, Card, Form } from 'react-bootstrap'
import { jwtDecode } from "jwt-decode";
import Link from 'next/link'
import Image from 'next/image'

import Loader from "../../components/Loader";
import Message from "../../components/Message";

type Stock = {
    id: number,
    size: number,
    countInStock: number,
    product: number,
}

type Product = {
    _id: number;
    stocks: Stock[];
    name: string;
    image: string;
    min_size: number;
    max_size: number;
    description: string;
    category: string;
    price: string;
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
    const [size, setSize] = useState(160);
    const [minSize, setMinSize] = useState(160);
    const [maxSize, setMaxSize] = useState(165);

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
                } else {
                    setIsLoggedIn(true)
                }
            }; 
        }
        fetch(`${process.env.SERVER}/api/products/${params.id}/`).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setProduct(data);
                    setSize(data.min_size);
                    setMinSize(data.min_size);
                    setMaxSize(data.max_size);
                    setLoading(false);
                })
            } else {
                setErrorMessage(res.statusText);
                setError(true);
                setLoading(false);
            }
        })
    }, [params.id, router])

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
                    size: size
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
                <Link href='/' className='btn btn-light my-3'>返回商品目录</Link>
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
                                        <Col className="d-flex justify-content-end">{product.stocks.filter(stock => stock.size === size).map(stock => stock.countInStock)[0] || 0}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {isLoggedIn ? ( 
                                <>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>尺寸:</Col>
                                        <Col><Form.Select
                                                size='sm'
                                                value={size}
                                                onChange={(e) => setSize(parseInt(e.target.value))}
                                            >
                                                {
                                                    [...Array.from({ length: (maxSize - minSize) / 5 + 1 }, (_, index: number) => (
                                                        <option key={minSize + index * 5} value={minSize + index * 5}>
                                                            {minSize + index * 5}
                                                        </option>
                                                    ))]
                                                }
                                        </Form.Select></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>数量:</Col>
                                        <Col><Form.Select
                                                size='sm'
                                                value={qty}
                                                onChange={(e) => setQty(e.target.value)}
                                            >
                                                {
                                                    [...Array(product.stocks.filter(stock => stock.size === size).map(stock => stock.countInStock)[0] || 0)].map((_, x: number) => (
                                                        <option key={x+1} value={x+1}>{x+1}</option>
                                                    ))
                                                }
                                        </Form.Select></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item >
                                    <Button 
                                    onClick={(e) => addToCart(e)}
                                    className='btn-block' 
                                    disabled={(product.stocks.filter(stock => stock.size === size).map(stock => stock.countInStock)[0] || 0) == 0} 
                                    type='button' 
                                    style={{ width: '100%', height: 'auto' }}
                                    >
                                        加入购物车
                                    </Button>
                                </ListGroup.Item>
                                </>): <ListGroup.Item>
                                    <Row className="d-flex justify-content-center align-items-center">请先登陆</Row>
                                </ListGroup.Item>}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
}

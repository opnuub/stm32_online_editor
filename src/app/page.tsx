"use client"

import { useState, useEffect } from "react";
import { Row, Col, Button, ButtonGroup } from "react-bootstrap";
import Product from "./components/ProductCard"
import Loader from "./components/Loader";
import Message from "./components/Message";
import Footer from "./components/Footer";

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

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState('全部');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
        fetch(`${process.env.SERVER}/api/products/`).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setProducts(data);
                    setFilteredProducts(data);
                    setLoading(false);
                })
            } else {
                setErrorMessage(res.statusText);
                setError(true)
                setLoading(false);
            }
        })
    }, [])

    useEffect(() => {
        if (filter === '全部') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter((product) => product.name.includes(filter)))
        }
    }, [filter])

    return (
            <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "90vh",
            }}
            >
            <div style={{flex: 1}}>
                <Row>
                <h2>商品目录</h2>
                <ButtonGroup>
                {['全部', '小学部', '中学部', '侨小', '侨中'].map((category) => (
                <Button
                    key={category}
                    variant={filter === category ? 'dark' : 'outline-dark'}
                    onClick={() => setFilter(category)}
                >
                    {category}
                </Button>
                ))}
                </ButtonGroup>
                </Row>
                <Row>
                    {isLoading ? <Loader /> 
                    : error ? <Message variant="danger">{errorMessage}</Message> 
                    : <Row>
                        {filteredProducts.map((product: Product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    } 
                </Row>
                </div>
                <Footer />
            </div>
    )
}
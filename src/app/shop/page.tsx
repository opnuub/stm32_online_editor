"use client"

import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/ProductCard"
import Loader from "../components/Loader";
import Message from "../components/Message";

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
    const [products, setProducts] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
        fetch(`${process.env.SERVER}/api/products/`).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setProducts(data);
                    setLoading(false);
                })
            } else {
                setErrorMessage(res.statusText);
                setError(true)
                setLoading(false);
            }
        })
    }, [])

    return (
        <div>
            <h2>Products</h2>
            {isLoading ? <Loader /> 
            : error ? <Message variant="danger">{errorMessage}</Message> 
            : <Row>
                {products.map((product: Product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
              </Row>
            } 
        </div>
    )
}
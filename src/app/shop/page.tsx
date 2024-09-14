"use client"

import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/ProductCard"

import axios from 'axios'

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
    
    useEffect(() => {
        async function fetchProduct() {
            const { data } = await axios.get("http://127.0.0.1:8000/api/products/");
            setProducts(data);
        }
        fetchProduct();
    }, [])

    return (
        <div>
            <h2>Products</h2>
            <Row>
                {products.map((product: Product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    )
}
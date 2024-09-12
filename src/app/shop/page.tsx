"use client"

import { Container, Row, Col } from "react-bootstrap";
import Product from "../components/ProductCard"

import products from "../products"

export default function Shop() {
    return (
        <div>
            <h2>Products</h2>
            <Row>
                {products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    )
}
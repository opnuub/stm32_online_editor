"use client"

import { Container, Row, Col } from "react-bootstrap";
import Product from "../components/Product"

import products from "../products"

export default function Shop() {
    return (
        <div>
            <Container>
                <h2>Products</h2>
                <Row>
                    {products.map(product => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    )
}
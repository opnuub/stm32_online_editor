"use client"

import { Row, Col, ListGroup, Button, Card } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'

import products from '../../products'

export default function Product({
    params
} : {
    params: { id: string }
}) {
    const product = products.find((p) => p._id == params.id)
    return product ? (
        <div>
            <Link href='/shop' className='btn btn-light my-3'>Go Back</Link>
            <Row>
                <Col md={6}>
                    <Image src={product.image} alt={product.name} width="0"
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
                                    <Col><strong>${product.price}</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button className='btn-block' disabled={product.countInStock == 0} type='button' style={{ width: '100%', height: 'auto' }}>Add to Cart</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    ) : <div><Link href='/' className='btn btn-light my-3'>Go Back</Link></div>
}
"use client"

import { useState, useEffect } from "react";
import { Row, Col, ListGroup, Form, Button, Card } from "react-bootstrap";
import { useRouter } from 'next/navigation'

import Image from 'next/image'
import Link from "next/link";
import Message from "@/app/components/Message";
import Loader from "@/app/components/Loader";

type OrderItem = {
    name: string
    product: number
    qty: number
}

type Order = {
    _id: number;
    orders: OrderItem[];
    shippingAddress: {
        address: string
    }
    user: {}
    paymentMethod: string;
    totalPrice: string;
    isPaid: boolean;
    paidAt: any;
    isDelivered: boolean;
    deliveredAt: any;
    createdAt: any;
}

export default function Order({
    params
}: {
    params: {id: string}
}) {
    const [data, setData] = useState<Order>();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [change, setChange] = useState(true)

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {    
            fetch(`http://127.0.0.1:8000/api/orders/${params.id}/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                },
                }).then((res) => {
                    if (res.ok) {
                        res.json().then((data) => {
                            setData(data);
                            setLoading(false);
                        })
                    } else {
                        setError(true);
                        setErrorMessage("Unauthorised")
                    }
                })
            setLoading(false)
        } else {
            setError(true)
            setErrorMessage("Please log in")
            setLoading(false);
        }
    }, [change])

    return isLoading ? <Loader /> :
    error ? <Message variant="danger">{errorMessage}</Message> :
    data && (
        <>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <h2>Order Summary</h2>
                        <ListGroup.Item>
                            <p>
                                <strong>Shipping Address: </strong>
                                {data.shippingAddress.address}
                            </p>

                            {data.isDelivered ? (
                                <Message variant='success'>{`Delivered on ${data.deliveredAt}`}</Message>
                            ) : (
                                    <Message variant='warning'>Not Delivered</Message>
                                )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>
                                <strong>Payment Method: </strong>
                                {data.paymentMethod}
                            </p>
                            {data.isPaid ? (
                                <Message variant='success'>{`Paid on ${data.paidAt}`}</Message>
                            ) : (
                                    <Message variant='warning'>Not Paid</Message>
                                )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                                <h2>Order Items</h2>
                                {data.orders.length === 0 ? <Message variant='info'>
                                    Order is empty
                        </Message> : (
                                        <ListGroup variant='flush'>
                                            {data.orders.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={1}>
                                                        </Col>
                                                        <Col>
                                                            <Link href={`/shop/${item.product}`}>{item.name}</Link>
                                                        </Col>

                                                        <Col md={4}>
                                                            {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}
                            </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </>
    )
}
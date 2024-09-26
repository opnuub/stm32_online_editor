"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Form, Button, Row, Col, Table } from "react-bootstrap"

import Link from "next/link"
import Loader from "@/app/components/Loader"
import Message from "@/app/components/Message"

type Order = {
    _id: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    paidAt: string;
    isDelivered: boolean;
    deliveredAt: string;
}

export default function Profile() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [success, setSuccess] = useState(false)
    const [orders, setOrder] = useState<Order[]>([])

    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {       
            fetch("http://127.0.0.1:8000/api/users/profile/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
            }).then((res) => res.json()).then((data) => {
                        setUsername(data.name)
                        setEmail(data.email)
                    }, () => router.back())
            fetch("http://127.0.0.1:8000/api/orders/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
            }).then((res) => res.json()).then((data) => setOrder(data))
            setIsLoading(false);
        } else {
            router.back();
        }
    }, [router])

    const update = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password != confirmPassword) {
            setError(true)
            setErrorMessage("Password does not match")
        } else if (password.length < 8) {
            setError(true)
            setErrorMessage("Your password must be at least 8 characters")
        } else {
            const userInfo = localStorage.getItem("userInfo")
            if (userInfo) {
                fetch("http://127.0.0.1:8000/api/users/update/", {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                    },
                    body: JSON.stringify({
                        name: username,
                        email: email,
                        password: password,
                    })
                }).then((res) => {
                    if (res.ok) {
                        res.json().then((data) => {
                            localStorage.setItem('userInfo', JSON.stringify(data))
                            setSuccess(true)
                            setError(false)
                        })
                    } else {
                        setError(true)
                        setSuccess(false)
                        setErrorMessage("Email already exists")
                    }
                })
            } else {
                router.back()
            }
        }
    }

    return isLoading ? <Loader /> : (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={update}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' placeholder="Enter New Full Name" value={username} onChange={(e) => setUsername(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder="Enter New Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='confirm_password'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary' className="my-2">Register</Button>
                </Form>
                { error && <Message variant="danger">{errorMessage}</Message>}
                { success && <Message variant="success">Profile Details Updated</Message>}
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                {orders.length === 0 ? <Message variant="info">No orders made yet</Message> : (
                    <Table striped responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th>Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}</td>
                                    <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}</td>
                                    <td>
                                        <Link href={`/order/${order._id}`}>
                                            <Button className='btn-sm'>Details</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}
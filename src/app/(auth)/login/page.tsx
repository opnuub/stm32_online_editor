"use client"

import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useRouter } from "next/navigation";

import Link from "next/link";
import Message from "@/app/components/Message";
import Loader from "@/app/components/Loader";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {       
            router.back();
        } else {
            setIsLoading(false);
        }
    }, [])

    const login = (e: any) => {
        e.preventDefault()
        fetch("http://127.0.0.1:8000/api/users/login/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: email,
                password: password,
            })
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    localStorage.setItem('userInfo', JSON.stringify(data))
                    router.back();
                })
            } else {
                setError(true);
            }
        })
    }
    
    return (
        isLoading ? <Loader /> :
        <Row className="justify-content-md-center">
            <h2>Sign In</h2>
            <Col className="my-1">
                New Customer? <Link href='/register'>Register</Link>
            </Col>
            { error ? <Message variant="danger">Wrong credentials or the user does not exist</Message> : <></>}
            <Form onSubmit={login}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className="my-2">Sign In</Button>
            </Form>
        </Row>
    )
}
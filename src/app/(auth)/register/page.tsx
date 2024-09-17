"use client"

import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useRouter } from "next/navigation";

import Link from "next/link";
import Message from "@/app/components/Message";
import Loader from "@/app/components/Loader";

export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {       
            router.back();
        } else {
            setIsLoading(false);
        }
    }, [])

    const register = (e: any) => {
        e.preventDefault()
        if (password != confirmPassword) {
            setError(true)
            setErrorMessage("Password does not match")
        } else if (password.length < 8) {
            setError(true)
            setErrorMessage("Your password must be at least 8 characters")
        } else {
            fetch("http://127.0.0.1:8000/api/users/register/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
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
                        router.back();
                    })
                } else {
                    setError(true);
                    setErrorMessage("Email already exists")
                }
            })
        }
    }
    
    return (
        isLoading ? <Loader /> :
        <Row className="justify-content-md-center">
            <h2>Register</h2>
            <Col className="my-1">
                Have an account? <Link href='/login'>Log In</Link>
            </Col>
            { error && <Message variant="danger">{errorMessage}</Message> }
            <Form onSubmit={register}>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' placeholder="Enter Full Name" value={username} onChange={(e) => setUsername(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirm_password'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className="my-2">Register</Button>
            </Form>
        </Row>
    )
}
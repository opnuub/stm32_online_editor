"use client"

import { useState, useEffect } from "react";
import { Form, Button, Row } from 'react-bootstrap'
import { useRouter } from "next/navigation";

import { jwtDecode } from "jwt-decode";
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
            const decodedToken = jwtDecode(JSON.parse(userInfo).token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp) {
                (decodedToken.exp < currentTime) ? localStorage.removeItem("userInfo") : router.back()
            };       
            router.back();
        } else {
            setIsLoading(false);
        }
    }, [router])

    const login = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        fetch(`${process.env.SERVER}/api/users/login/`, {
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
                    window.location.reload()
                })
            } else {
                setError(true);
            }
        })
    }
    
    return (
        isLoading ? <Loader /> :
        <Row className="justify-content-md-center">
            <h2>登陆</h2>
            {/* <Col className="my-1">
                New Customer? <Link href='/register'>Register</Link>
            </Col> */}
            { error && <Message variant="danger">账户名或登录密码不正确，请重新输入</Message>}
            <Form onSubmit={login}>
                <Form.Group controlId='email'>
                    <Form.Label>账户名</Form.Label>
                    <Form.Control type='text' placeholder="请输入账户名" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>密码</Form.Label>
                    <Form.Control type='password' placeholder="请输入密码" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className="my-2">登陆</Button>
            </Form>
        </Row>
    )
}
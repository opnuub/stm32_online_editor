"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Image, Row, Col, ListGroup, ButtonGroup, Button } from "react-bootstrap"
import { jwtDecode } from "jwt-decode"

import Link from "next/link"
import Loader from "@/app/components/Loader"
import Message from "@/app/components/Message"

type Stock = {
    id: number,
    size: number,
    countInStock: number,
    product: number,
}

type Product = {
    _id: number;
    stocks: Stock[];
    name: string;
    image: string;
    min_size: number;
    max_size: number;
    description: string;
    category: string;
    price: string;
}

export default function Admin() {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([])
    const [filter, setFilter] = useState("小学部")
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            const decodedToken = jwtDecode(JSON.parse(userInfo).token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp) {
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem("userInfo")
                    router.push("/login")
                }
            }
            fetch(`${process.env.SERVER}/api/users/validate/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                },
            }).then((res) => {
                if (res.ok) {
                    setIsAdmin(true)
                    fetch(`${process.env.SERVER}/api/products/`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            filter: filter,
                            page: 0
                        })
                    }).then((res) => {
                        if (res.ok) {
                            res.json().then((data) => {
                                setProducts(data);
                                setLoading(false);
                            })
                        } else {
                            setIsAdmin(false)
                            setLoading(false);
                        }
                    })
                } else {
                    setIsAdmin(false)
                    setLoading(false);
                }})
        } else {
            router.back();
        }
    }, [router, filter, isAdmin])

    return loading ? <Loader /> : isAdmin ?
        <div>
            <h2>商品目录</h2>
            <ButtonGroup style={{ width: '100%' }}>
                {['小学部', '中学部', '侨小', '侨中'].map((category) => (
                <Button
                    key={category}
                    variant={filter === category ? 'dark' : 'outline-dark'}
                    onClick={() => {
                        setLoading(true)
                        setFilter(category)
                    }}
                >
                    {category}
                </Button>
                ))}
            </ButtonGroup>
        {
            loading ? <div className="py-2"><Loader /></div> : (
                <Row>
                    <Col md={9}>
                        {products.length === 0 ? <Message variant="info">暂无商品可显示</Message> : (
                            <ListGroup variant='flush'>
                            {products.map((item, id) => (
                                <ListGroup.Item key={id}>
                                    <Row>
                                        <Col md={1} className="d-flex justify-content-end">
                                        <Image src={`${process.env.SERVER}/static${item.image}`} alt={item.name} width="0"
                                            height="0"
                                            sizes="100vw"
                                            style={{ width: '100%', height: 'auto' }}/> 
                                        </Col>
                                        <Col>
                                            <Link href={`/admin/${item._id}`}>{item.name}</Link>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        )}
                    </Col>
                </Row>
            )
        }
    </div>
    : <Message variant="danger">您未获得权限</Message>
}
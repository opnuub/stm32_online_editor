"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Image, Row, Col, ListGroup, ButtonGroup, Button, Table } from "react-bootstrap"
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

type Order = {
    _id: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    paidAt: string;
    isDelivered: boolean;
    deliveredAt: string;
}

export default function Admin() {
    const [init, setInit] = useState(true)
    const [loading, setLoading] = useState(true)
    const [loadingOrder, setLoadingOrder] = useState(true)
    const [products, setProducts] = useState<Product[]>([])
    const [filter, setFilter] = useState("小学部")
    const [isAdmin, setIsAdmin] = useState(false)
    const [orders, setOrder] = useState<Order[]>([])
    const router = useRouter();

    const getOrders = () => {
        setLoadingOrder(true)
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            fetch(`${process.env.SERVER}/api/orders/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`
                },
            }).then((res) => res.json()).then((data) => {
                setOrder(data)
                setLoadingOrder(false)
            })
        }
    }

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
                    setInit(false)
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
                    getOrders()
                } else {
                    setInit(false)
                    setIsAdmin(false)
                    setLoading(false);
                }})
        } else {
            router.back();
        }
    }, [router, filter])

    const verifyAll = () => {
        setLoadingOrder(true)
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            fetch(`${process.env.SERVER}/api/payment/verifyAll/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                },
            }).then((res) => res.json()).then(() => getOrders())
        }
    }

    const download = () => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            fetch(`${process.env.SERVER}/api/payment/download/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                }, 
            }).then((res) => res.blob()).then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "文件.xlsx"); // Adjust filename if needed
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
        };
    }

    return init ? <Loader /> : isAdmin ?
        <div>
            <Row>
            <Col md={6}>
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
                { loading ? <div className="py-2"><Loader /></div> : (
                <Row>
                    {products.length === 0 ? <Message variant="info">暂无商品可显示</Message> : (
                        <ListGroup variant='flush'>
                        {products.map((item, id) => (
                            <ListGroup.Item key={id}>
                                <Row>
                                    <Col md={1} className="d-flex justify-content-end">
                                    <Image src={item.image} alt={item.name} width="0"
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
                        </ListGroup>)}
                </Row>
                )}
            </Col>
            <Col md={6}>
                <Row>
                    <Col md={6}><h2>订单</h2></Col>
                    <Col md={3}><Button onClick={() => download()}>下载订单信息</Button></Col>
                    <Col md={3}><Button onClick={() => verifyAll()}>刷新支付状态</Button></Col>
                </Row>
                {loadingOrder ? <Loader /> : orders.length === 0 ? <Message variant="info">暂无订单可显示</Message> : (
                    <Table striped responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>订单号</th>
                                <th>日期</th>
                                <th>金额</th>
                                <th>付款日期</th>
                                <th>签收日期</th>
                                <th>更多</th>
                            </tr>
                        </thead>

                        <tbody>
                        {orders.filter(order => order.isPaid).sort((a: Order, b: Order) => {
                                if (Number(b.isPaid) !== Number(a.isPaid)) {
                                    return Number(b.isPaid) - Number(a.isPaid); // Paid orders first
                                }
                                if (a.isPaid && b.isPaid) {
                                    return new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(); // Earlier paid first
                                }
                                return Number(a._id) - Number(b._id); // Lower _id first
                            })
                            .map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>¥{order.totalPrice}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}</td>
                                    <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}</td>
                                    <td>
                                        <Link href={`/order/${order._id}`}>
                                            <Button className='btn-sm'>订单详情</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    </div>
    : <Message variant="danger">您未获得权限</Message>
}
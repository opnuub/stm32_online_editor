"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Form, Button, Row, Col, Table } from "react-bootstrap"
import { jwtDecode } from "jwt-decode"

import Loader from "@/app/components/Loader"
import Message from "@/app/components/Message"

type Stock = {
    id: number,
    size: number,
    countInStock: number,
    product: number,
}

export default function AdminProduct(
    {
        params
    }: {
        params: {id: string}
    }
) {
    const [name, setName] = useState("")
    const [minSize, setMinSize] = useState(0)
    const [maxSize, setMaxSize] = useState(0)
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stocks, setStocks] = useState<Stock[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [success, setSuccess] = useState(false)
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
                    fetch(`${process.env.SERVER}/api/products/${params.id}/`).then((res) => {
                        if (res.ok) {
                            res.json().then((data) => {
                                setName(data.name);
                                setMinSize(data.min_size);
                                setMaxSize(data.max_size)
                                setDescription(data.description);
                                setPrice(data.price);
                                setStocks(data.stocks);
                                setLoading(false);
                            })
                        } else {
                            setErrorMessage(res.statusText)
                            setError(true)
                            setLoading(false)
                        }
                    })
                } else {
                    setIsAdmin(false)
                    setLoading(false);
                }})
        } else {
            router.back();
        }
    }, [params.id, router])

    const uploadFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (!e.target.files || !userInfo) return;
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        formData.append('id', params.id)
        fetch(`${process.env.SERVER}/api/products/upload/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${JSON.parse(userInfo).token}`,
            },
            body: formData
        })
    }
    
    const updateProduct = (e: React.FormEvent<HTMLFormElement>) => {
        setSuccess(false)
        e.preventDefault()
        const userInfo = localStorage.getItem("userInfo")
        if (isAdmin && userInfo) {
            fetch(`${process.env.SERVER}/api/products/updateProduct/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                },
                body: JSON.stringify({
                    id: params.id,
                    name: name,
                    min_size: minSize,
                    max_size: maxSize,
                    description: description,
                    price: price,
                })
            }).then((res) => {
                if (res.ok) {
                    res.json().then(() => {
                        setSuccess(true)
                        setError(false)
                    })
                } else {
                    setError(true)
                    setSuccess(false)
                    setErrorMessage(res.statusText)
                }
            })
        } else {
            router.push('/login')
        }
    }
    
    const updateStock = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSuccess(false)
        const userInfo = localStorage.getItem("userInfo")
        if (isAdmin && userInfo) {
            fetch(`${process.env.SERVER}/api/products/updateStock/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(userInfo).token}`,
                },
                body: JSON.stringify({
                    stocks: stocks,
                })
            }).then((res) => {
                if (res.ok) {
                    res.json().then(() => {
                        setSuccess(true)
                        setError(false)
                    })
                } else {
                    setError(true)
                    setSuccess(false)
                    setErrorMessage(res.statusText)
                }
            })
        } else {
            router.push('/login')
        }
    }

    return loading ? <Loader /> : error ? <Message variant="danger">{errorMessage}</Message> : isAdmin ? (
        <Row>
            <Col md={6}>
                <h2>商品信息</h2>
                <Form onSubmit={(e) => updateProduct(e)}>
                    <Form.Group controlId='name'>
                        <Form.Label>名称</Form.Label>
                        <Form.Control type='text' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='image'>
                        <Form.Label>选择新照片</Form.Label>
                        <Form.Control type='file' onChange={uploadFileHandler}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='minSize'>
                        <Form.Label>最小尺寸</Form.Label>
                        <Form.Control type='text' value={minSize} onChange={(e) => setMinSize(parseInt(e.target.value))}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='maxSize'>
                        <Form.Label>最大尺寸</Form.Label>
                        <Form.Control type='text' value={maxSize} onChange={(e) => setMaxSize(parseInt(e.target.value))}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='description'>
                        <Form.Label>商品信息</Form.Label>
                        <Form.Control as='textarea' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='price'>
                        <Form.Label>价格</Form.Label>
                        <Form.Control type='text' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary' className="my-2">更新商品信息</Button>
                </Form>
                { error && <Message variant="danger">{errorMessage}</Message>}
                { success && <Message variant="success">货品信息已更新</Message>}
            </Col>
            <Col md={6}>
                <h2>存货</h2>
                <Form onSubmit={(e) => updateStock(e)}>
                    <Table striped responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>尺寸</th>
                                <th>库存</th>   
                            </tr>
                        </thead>
                        <tbody>
                        {[...stocks].sort((a, b) => a.size - b.size).map(stock => (
                            <tr key={stock.id}>
                                <td>{stock.size}</td>
                                <td>
                                    <Form.Group controlId={stock.size.toString()}>
                                        <Form.Control
                                            type="text"
                                            value={stock.countInStock}
                                            onChange={(e) => {
                                                const newStocks = stocks.map(s => 
                                                    s.id === stock.id ? { ...s, countInStock: Number(e.target.value) || 0 } : s
                                                );
                                                setStocks(newStocks);
                                            }}
                                        />
                                    </Form.Group>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Button type='submit' variant='primary' className="my-2">更新库存信息</Button>
                </Form>
                { error && <Message variant="danger">{errorMessage}</Message>}
                { success && <Message variant="success">货品信息已更新</Message>}
            </Col>
        </Row>
    ) : <Message variant="danger">您未获得权限</Message>
}
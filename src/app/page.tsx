"use client"

import { useState, useEffect } from "react";
import { Row, Col, Button, ButtonGroup } from "react-bootstrap";
import Product from "./components/ProductCard"
import Loader from "./components/Loader";
import Message from "./components/Message";
import Footer from "./components/Footer";

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

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState('全部');
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(1);
    
    useEffect(() => {
        fetch(`${process.env.SERVER}/api/products/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: filter,
                page: page,
            })
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setProducts(data);
                    setLoading(false);
                })
            } else {
                setErrorMessage(res.statusText);
                setError(true)
                setLoading(false);
            }
        })
    }, [filter, page])

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
            setLoading(true)
            setError(false)
        }
      };
    
    const handleNext = () => {
        if (page < 6) {
            setPage(page + 1);
            setLoading(true)
            setError(false)
        }
    };

    return (
            <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "90vh",
            }}
            >
            <div style={{flex: 1}}>
                <h2>商品目录</h2>
                <div><ButtonGroup style={{ width: '100%' }}>
                    {['全部', '小学部', '中学部', '侨小', '侨中'].map((category) => (
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
                    {isLoading ? <div className="py-5"><Loader /></div>
                    : error ?<div className="py-2"><Message variant="danger">{errorMessage}</Message></div>
                    :
                    <Row>
                        {products.map((product: Product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    }
                    {filter === "全部" && (
                        <div
                            className="pagination-buttons"
                            style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                            }}
                        >
                            <Button
                            variant="secondary"
                            onClick={handlePrev}
                            disabled={page === 1}
                            >
                            上一页
                            </Button>
                            <span style={{ margin: "0 10px" }}>
                            第{page}页, 共6页
                            </span>
                            <Button
                            variant="secondary"
                            onClick={handleNext}
                            disabled={page === 6}
                            >
                            下一页
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
import { Card } from "react-bootstrap"
import Image from 'next/image'

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

export default function Product({
    product,
} : {
    product: Product
}) {
    return (
        <Card className="my-3 p-3 rounded">
            <a href={`/product/${product._id}`}>
                <Image src={`${process.env.SERVER}/static${product.image}`} alt={product.name} width="0"
                height="0"
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }} unoptimized /> 
            </a>
            <Card.Body>
                <a href={`/product/${product._id}`} style={{
                color: 'black',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                }}>
                    <Card.Title style={{ color: 'black'}}>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </a>
                <Card.Text as="h3">
                    ¥{product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

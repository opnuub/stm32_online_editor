import { Card } from "react-bootstrap"
import Image from 'next/image'

type Product = {
    _id: string;
    name: string;
    image: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
}

export default function Product({
    product,
} : {
    product: Product
}) {
    return (
        <Card className="my-3 p-3 rounded">
            <a href={`/shop/${product._id}`}>
                <Image src={`${process.env.SERVER}${product.image}`} alt={product.name} width="0"
                height="0"
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }} /> 
            </a>
            <Card.Body>
                <a href={`/shop/${product._id}`}>
                    <Card.Title>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </a>
                <Card.Text as="h3">
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}
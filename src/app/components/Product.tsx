import { Card } from "react-bootstrap"
import Image from 'next/image'

export default function Product({
    product,
} : {
    product: any
}) {
    return (
        <Card className="my-3 p-3 rounded">
            <a href={`/product/${product._id}`}>
                <Image src={product.image} alt={product.name} width="0"
                height="0"
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }} /> 
            </a>
            <Card.Body>
                <a href={`/product/${product._id}`}>
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
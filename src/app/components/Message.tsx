import { Alert } from "react-bootstrap";

export default function Message({ 
    variant, 
    children 
}: {
    variant: string, 
    children: string
}) {
    return (
        <Alert variant={variant}>
            {children}
        </Alert>
    )
}
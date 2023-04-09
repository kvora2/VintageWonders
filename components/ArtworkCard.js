import { Card } from "react-bootstrap";
import useSWR from 'swr'
import Error from "next/error"
import Button from "next/link"
import Link from "next/link"

export default function ArtworkCard(prop) {

    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${prop.objectID}`)

    let link = "/artwork/" + (prop.objectID).toString()
    if (error) {
        return <Error statusCode={404} />
    }

    if (!data) {
        return null
    }

    return (
        <>
            <Card style={{ width: '18rem' }}>
                {data.primaryImageSmall ? (
                    <Card.Img variant="top" src={data.primaryImageSmall} />
                ) : (
                    <Card.Img variant="top" src="https://via.placeholder.com/375x375.png?text=[+Not+Available+]" />
                )
                }
                <Card.Body>
                    <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
                    <Card.Text>
                        <strong>Date:</strong> {data.objectDate ? data.objectDate : "N/A"}
                        <br />
                        <strong>Classification:</strong> {data.classification ? data.classification : "N/A"}
                        <br />
                        <strong>Medium:</strong> {data.medium ? data.medium : "N/A"}
                    </Card.Text>
                    <Link href={link} passHref legacyBehavior><Button variant="outline-secondary">ID: {prop.objectID}</Button></Link>
                </Card.Body>
            </Card>
        </>
    )
}
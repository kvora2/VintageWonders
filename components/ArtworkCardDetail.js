import { Card } from "react-bootstrap";
import useSWR from 'swr'
import Error from "next/error"
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { useState, useEffect } from "react";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

export default function ArtworkCardDetail(prop) {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);
    const { data, error } = useSWR(prop.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${prop.objectID}` : null)

    if (error) {
        return <Error statusCode={404} />
    }

    if (!data) {
        return null
    }

    async function favouritesClicked() {
        if (showAdded) {
            setFavouritesList(await removeFromFavourites(prop.objectID));
            setShowAdded(false)
        }
        else {
            setFavouritesList(await addToFavourites(prop.objectID));
            setShowAdded(true)
        }
    }

    useEffect(() => {
        setShowAdded(favouritesList?.includes(prop.objectID))
    }, [favouritesList])

    return (
        <>
            <Card>
                {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
                <Card.Body>
                    <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
                    <Card.Text>
                        <strong>Date:</strong> {data.objectDate ? data.objectDate : "N/A"}
                        <br />
                        <strong>Classification:</strong> {data.classification ? data.classification : "N/A"}
                        <br />
                        <strong>Medium:</strong> {data.medium ? data.medium : "N/A"}
                        <br /><br />
                        <strong>Artist: </strong>{data.artistDisplayName && data.artistDisplayName} {data.artistDisplayName ? <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" className="wiki">(wiki)</a> : "N/A"}
                        <br />
                        <strong>Credit Line: </strong>{data.creditLine ? data.creditLine : "N/A"}
                        <br />
                        <strong>Dimensions: </strong>{data.dimensions ? data.dimensions : "N/A"}
                        <br /><br />
                        <button variant={showAdded ? "primary" : "outline-primary"} onClick={favouritesClicked}><strong>+ Favourite {showAdded && "(added)"}</strong></button>
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}
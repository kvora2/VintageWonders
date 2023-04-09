/*********************************************************************************
*  BTI425 – Assignment 5
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Kelvin Vora Student ID: 157616210 Date: 24th March, 2023
*
********************************************************************************/ 

import { useRouter } from "next/router"
import useSWR from 'swr'
import { useState, useEffect } from 'react';
import ArtworkCard from "@/components/ArtworkCard.js";
import {Row, Col} from 'react-bootstrap'
import { Pagination } from "react-bootstrap";
import validObjectIDList from "@/public/data/validObjectIDList.json";

export default function Artwork() {
    const PER_PAGE = 12
    const [artworkList, setArtworkList] = useState([])
    const [page, setPage] = useState(1)

    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`)
    function previousPage() {
        if (page > 1) setPage(page - 1)
    }

    function nextPage() {
        if (page < artworkList.length) setPage(page + 1)
    }

    useEffect(() => {
        if (data) {
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            let results = []
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }
            setArtworkList(results);
            setPage(1)
        }
    }, [data])
    
    if (error) {
        return <Error statusCode={404} />
    }
    
    if (!data) {
        return null
    }
    
    return (
        <>
        <br/><br/>
            {artworkList && (
                <Row className="gy-4">
                    {artworkList.length > 0 ?
                        artworkList[page - 1].map((e) => (
                            <Col lg={3} key={e}>
                                <ArtworkCard objectID={e}/>
                            </Col>
                        ))
                        :
                        <div className="container">
                            <div className="card">
                                <div className="card-body">
                                    <>
                                        <h4>Nothing Here</h4> Try searching for something else
                                    </>
                                </div>
                            </div>
                        </div>
                    }
                </Row>
            )}
            {artworkList.length > 0 && (
                <Row>
                    <Col>
                        <Pagination>
                            <Pagination.Prev onClick={previousPage} />
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={nextPage} />
                        </Pagination>
                    </Col>
                </Row>
            )}
            {!artworkList && (null)}
        </>
    )
}
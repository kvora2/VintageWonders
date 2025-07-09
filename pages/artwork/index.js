import { useRouter } from "next/router"
import useSWR from 'swr'
import { useState, useEffect } from 'react';
import ArtworkCard from "@/components/ArtworkCard.js";
import {Row, Col, Container} from 'react-bootstrap'
import { Pagination } from "react-bootstrap";
import validObjectIDList from "@/public/data/validObjectIDList.json";

// Custom fetcher with retry logic and proper headers
const fetcher = async (url) => {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                return await response.json();
            } else if (response.status === 403) {
                // Wait before retrying on 403
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                retryCount++;
                continue;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            if (retryCount === maxRetries - 1) {
                throw error;
            }
            retryCount++;
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        }
    }
};

export default function Artwork() {
    const PER_PAGE = 12
    const [artworkList, setArtworkList] = useState([])
    const [page, setPage] = useState(1)

    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];
    const { data, error, isLoading } = useSWR(
        finalQuery ? `/api/artworks/search?${finalQuery}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            retryInterval: 5000,
            dedupingInterval: 10000,
        }
    )
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
        const isRateLimit = error.message.includes('403') || error.message.includes('rate');
        return (
            <Container fluid className="px-2 px-sm-3 px-md-4 px-lg-5 px-xl-6">
                <div style={{ 
                    paddingTop: '1.5rem', 
                    paddingBottom: '2rem',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    <Row>
                        <Col xs={12}>
                            <div className="text-center py-5">
                                <div 
                                    className="card shadow-sm mx-auto" 
                                    style={{ 
                                        maxWidth: '500px',
                                        border: 'none',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <div className="card-body p-4 p-md-5">
                                        <div className="mb-3">
                                            <i className={`fas ${isRateLimit ? 'fa-clock' : 'fa-exclamation-triangle'} fa-3x text-warning`}></i>
                                        </div>
                                        <h4 className="card-title text-warning mb-3">
                                            {isRateLimit ? 'Too Many Requests' : 'Oops! Something went wrong'}
                                        </h4>
                                        <p className="card-text text-muted">
                                            {isRateLimit 
                                                ? 'The museum API is busy right now. Please wait a moment and try again.'
                                                : 'We couldn\'t load the artwork. Please try again later.'
                                            }
                                        </p>
                                        <button 
                                            className="btn btn-outline-primary mt-3" 
                                            onClick={() => window.location.reload()}
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }
    
    if (isLoading) {
        return (
            <Container fluid className="px-2 px-sm-3 px-md-4 px-lg-5 px-xl-6">
                <div style={{ 
                    paddingTop: '1.5rem', 
                    paddingBottom: '2rem',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    <Row>
                        <Col xs={12}>
                            <div className="text-center py-5">
                                <div className="mb-3">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                <h5 className="text-muted">Loading artwork...</h5>
                                <p className="text-muted">Please wait while we fetch the latest pieces.</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }
    
    if (!data) {
        return null
    }
    
    return (
        <Container fluid className="px-2 px-sm-3 px-md-4 px-lg-5 px-xl-6">
            <div style={{ 
                paddingTop: '1.5rem', 
                paddingBottom: '2rem',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {artworkList && (
                    <Row className="g-4">
                        {artworkList.length > 0 ?
                            artworkList[page - 1].map((e) => (
                                <Col 
                                    xs={12} 
                                    sm={6} 
                                    md={6} 
                                    lg={4} 
                                    xl={4}
                                    key={e}
                                    className="d-flex mb-4"
                                >
                                    <div className="w-100 artwork-card-wrapper">
                                        <ArtworkCard objectID={e}/>
                                    </div>
                                </Col>
                            ))
                            :
                            <Col xs={12}>
                                <div className="text-center py-5">
                                    <div 
                                        className="card shadow-sm mx-auto" 
                                        style={{ 
                                            maxWidth: '500px',
                                            border: 'none',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <div className="card-body p-4 p-md-5">
                                            <div className="mb-3">
                                                <i className="fas fa-search fa-3x text-muted"></i>
                                            </div>
                                            <h4 className="card-title text-muted mb-3">Nothing Here</h4>
                                            <p className="card-text text-muted">
                                                Try searching for something else or adjust your search criteria
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        }
                    </Row>
                )}
                
                {artworkList.length > 0 && (
                    <Row className="mt-5">
                        <Col xs={12}>
                            <div className="d-flex justify-content-center">
                                <Pagination className="mb-0">
                                    <Pagination.Prev 
                                        onClick={previousPage} 
                                        disabled={page === 1}
                                        className="mx-1"
                                    />
                                    <Pagination.Item active className="mx-1">
                                        {page}
                                    </Pagination.Item>
                                    <Pagination.Next 
                                        onClick={nextPage} 
                                        disabled={page >= artworkList.length}
                                        className="mx-1"
                                    />
                                </Pagination>
                            </div>
                            <div className="text-center mt-3">
                                <small className="text-muted">
                                    Page {page} of {artworkList.length}
                                </small>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        </Container>
    )
}
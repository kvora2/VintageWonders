import { Row, Col } from 'react-bootstrap'
import { favouritesAtom } from '@/store'
import { useAtom } from 'jotai'
import ArtworkCard from "@/components/ArtworkCard.js";

export default function Favourites() {
    const [list, setList] = useAtom(favouritesAtom)

    if(!list) return null;
    

    return (
        <>
            <br /><br />
            {list && (
                <Row className="gy-4">
                    {list.length > 0 ?
                        list.map((e) => (
                            <Col lg={3} key={e}>
                                <ArtworkCard objectID={e} />
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
        </>
    )
}
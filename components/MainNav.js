import { Button, Container, Nav, Navbar } from "react-bootstrap"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import { NavDropdown } from "react-bootstrap";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
// import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [searchVal, setIt] = useState('');
    const [isExpanded, setisExpanded] = useState(false);
    const router = useRouter();
    // const token = readToken();
    // console.log("token --> ", token)

    async function SearchForm(e) {
        e.preventDefault();
        setisExpanded(false)
        if (searchVal != "") {
            router.push(`/artwork?title=true&q=${searchVal}`)
            setIt("");
        }
        let queryString = `title=true&q=${searchVal}`;
        setSearchHistory(await addToHistory(queryString))
    }

    function handleSearchChange(event) {
        setIt(event.target.value);
    }

    function toggleExpanded() {
        setisExpanded(!isExpanded)
    }

    function handleClickin() {
        setisExpanded(false)
    }

    function logout() {
        setisExpanded(false);
        removeToken();
        router.push('/login');
    }

    return (
        <>
            <Navbar className="fixed-top" bg="primary" expand="lg" variant="dark" expanded={isExpanded}>
                <Container>
                    <Navbar.Brand>Kelvin Vora</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleExpanded} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto" onClick={handleClickin}>
                            <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"}>Home</Nav.Link></Link>
                            <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link>
                        </Nav>
                        <Form className="d-flex" onSubmit={SearchForm}>
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                onChange={handleSearchChange}
                                value={searchVal}
                            />
                            <Button type="submit" variant="outline-light">Search</Button>
                        </Form>
                        <Nav>
                            <NavDropdown title="User Name" id="basic-nav-dropdown" onClick={handleClickin}>
                                <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item></Link>
                                <Link href="/history" passHref legacyBehavior><NavDropdown.Item active={router.pathname === "/history"}>Search History</NavDropdown.Item></Link>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br /><br /><br /><br />
        </>
    )
}
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { NavDropdown } from "react-bootstrap";
import { useAtom } from "jotai";
import { searchHistoryAtom, favouritesAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [favouritesList, setFavouritesList] = useState(favouritesAtom);
  const [searchVal, setIt] = useState("");
  const [isExpanded, setisExpanded] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  console.log("token userName --> ", userName);

  console.log("searchHistory 2--> ", searchHistory);

  async function SearchForm(e) {
    e.preventDefault();
    setisExpanded(false);
    if (searchVal != "") {
      router.push(`/artwork?title=true&q=${searchVal}`);
      setIt("");
    }
    let queryString = `title=true&q=${searchVal}`;
    setSearchHistory(await addToHistory(queryString));
  }

  function handleSearchChange(event) {
    setIt(event.target.value);
  }

  function toggleExpanded() {
    setisExpanded(!isExpanded);
  }

  function handleClickin() {
    setisExpanded(false);
  }

  function logout() {
    setisExpanded(false);
    removeToken();
    setUserName("");
    setFavouritesList();
    setSearchHistory();
    router.push("/");
  }

  useEffect(() => {
    // get the token from local storage and set the userName
    const token = readToken();
    if (token) {
      setUserName(token.userName);
    }
    console.log("searchHistory 1--> ", searchHistory);
  }, [searchHistory]);

  return (
    <>
      <Navbar
        className="fixed-top"
        bg="primary"
        expand="lg"
        variant="dark"
        expanded={isExpanded}
      >
        <Container>
          <Navbar.Brand>Kelvin Vora</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleExpanded}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" onClick={handleClickin}>
              <Link href="/" passHref legacyBehavior>
                <Nav.Link active={router.pathname === "/"}>Home</Nav.Link>
              </Link>
              {userName && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link active={router.pathname === "/search"}>
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            {userName ? (
              <>
                <Form className="d-flex" onSubmit={SearchForm}>
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={handleSearchChange}
                    value={searchVal}
                  />
                  <Button type="submit" variant="outline-light">
                    Search
                  </Button>
                </Form>
                <Nav>
                  <NavDropdown
                    title={userName}
                    id="basic-nav-dropdown"
                    onClick={handleClickin}
                    className="mx-4"
                  >
                    <Link href="/favourites" passHref legacyBehavior>
                      <NavDropdown.Item
                        active={router.pathname === "/favourites"}
                      >
                        Favourites
                      </NavDropdown.Item>
                    </Link>
                    <Link href="/history" passHref legacyBehavior>
                      <NavDropdown.Item active={router.pathname === "/history"}>
                        Search History
                      </NavDropdown.Item>
                    </Link>
                    {userName && (
                      <NavDropdown.Item onClick={logout}>
                        Logout
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                </Nav>
              </>
            ) : (
              <Nav className="d-flex" onClick={handleClickin}>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link
                    className="mx-4"
                    active={router.pathname === "/register"}
                  >
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link active={router.pathname === "/login"}>
                    Login
                  </Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

/*********************************************************************************
*  BTI425 – Assignment 4
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Kelvin Vora Student ID: 157616210 Date: 10th March 2023
*
********************************************************************************/

import { Row, Col, Image } from 'react-bootstrap';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <Image src="https://upload.wikimedia.org/wikipedia/commons/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg" fluid rounded />
      <Row>
        <Col md={6}>
          <h2>Metropolitan Museum of Art</h2>
          <p>The Metropolitan Museum of Art in New York City, colloquially "the Met",[a] is the largest art museum in the Americas and the most-visited museum in the Western Hemisphere. Its permanent collection contains over two million works,[1] divided among 17 curatorial departments. The main building at 1000 Fifth Avenue, along the Museum Mile on the eastern edge of Central Park on Manhattan's Upper East Side, is by area one of the world's largest art museums. The first portion of the approximately 2-million-square-foot (190,000 m2) building was built in 1880. A much smaller second location, The Cloisters at Fort Tryon Park in Upper Manhattan, contains an extensive collection of art, architecture, and artifacts from medieval Europe.</p>
        </Col>
        <Col md={6}>
          <p>The permanent collection contains over two million works, divided among seventeen curatorial departments. The main building at 1000 Fifth Avenue, along the Museum Mile on the eastern edge of Central Park in Manhattan's Upper East Side, is by area one of the world's largest art galleries. A much smaller second location, The Cloisters at Fort Tryon Park in Upper Manhattan, contains an extensive collection of art, architecture, and artifacts from Medieval Europe.</p>
          <a href="https://en.wikipedia.org/wiki/Metropolitan_Museum_of_Art" target="_blank" rel="noreferrer">Learn more on Wikipedia</a>
        </Col>
      </Row>
    </div>
  )
}

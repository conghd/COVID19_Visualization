import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from "d3"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState, useEffect } from 'react';
import MyMap from './components/MyMap';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
  });

  return (
    <Container fluid={true} className="vh-100">
      <Row style={{height: "15%" }}>
        <Col className='h-100'>COVID-19 DASHBOARD</Col>
      </Row>
      <Row style={{height: "60%"}}>
        <Col sm={6} className="h-100"><MyMap/></Col>
        <Col sm={6} className="h-100"></Col>
      </Row>
      <Row style={{height:"25%"}}>
        <Col sm={8}>
        </Col>
        <Col sm={4}>Others</Col>
      </Row>
    </Container>
  );
}

export default App;

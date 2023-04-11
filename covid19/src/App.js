import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from "d3"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState, useEffect, useRef, createContext } from 'react';
import MyMap from './components/MyMap';

const AppContext = createContext();

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/cases")
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      }).then(data => {
        setCountries(data);
      }).catch (error => {
        console.log("error")
      })
  }, []);

  const myFunc = (result) => {
    console.log("myFunc: " + result);
  }

  return (
    <AppContext.Provider value={{ countries, setCountries }}>
    <Container fluid={true} className="vh-100">
      <Row style={{height: "15%" }}>
        <Col className='h-100'>COVID-19 DASHBOARD</Col>
      </Row>
      <Row style={{height: "60%"}}>
        <Col sm={6} className="h-100"><MyMap data={countries} myFunc={myFunc}/></Col>
        <Col sm={6} className="h-100"></Col>
      </Row>
      <Row style={{height:"25%"}}>
        <Col sm={8}>
        </Col>
        <Col sm={4}>Others</Col>
      </Row>
    </Container>
    </AppContext.Provider>
  );
}

export default App;

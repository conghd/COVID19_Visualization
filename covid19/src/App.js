import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from "d3"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState, useEffect, useRef, createContext } from 'react';
import MyMap from './components/MyMap';
import CaseChart from './components/CaseChart';
import DeathChart from './components/DeathChart';
import Timeline from './components/Timeline';

const AppContext = createContext();

function App() {
  const [countries, setCountries] = useState([]);
  const [cases, setCases] = useState([])
  const [deaths, setDeaths] = useState([])
  const [regionId, setRegionId] = useState(0);
  const [from, setFrom] = useState("2023-01-01")
  const [to, setTo] = useState("2023-03-09")
  const [totalCases, setTotalCases] = useState(0)
  const [totalDeaths, setTotalDeaths] = useState(0)

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

      fetch("http://localhost:3001/totalcases/" + regionId + "/" + from + "/" + to)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      }).then(data => {
        console.log(data)
        setCases(data);
      }).catch (error => {
        console.log("error")
      })

      fetch("http://localhost:3001/totaldeaths/" + regionId + "/" + from + "/" + to)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      }).then(data => {
        console.log(data)
        setDeaths(data);
      }).catch (error => {
        console.log("error")
      })

  }, [regionId, from, to]);

  const myFunc = (result) => {
    console.log("myFunc: " + result);
  }

  return (
    <AppContext.Provider value={{ countries, setCountries }}>
    <Container fluid={true} className="vh-100 align-items-center">
      <Row style={{height: "15%", alignItems: "center", marginTop: "30px" }}>
        <Col sm={4} className='h-100 align-items-center'>COVID-19 DASHBOARD</Col>
        <Col sm={4} className='h-100' style={{alignItems: "center"}}>Total cases: {totalCases}</Col>
        <Col sm={4} className='h-100'>Total deaths: {totalDeaths}</Col>
      </Row>
      <Row style={{height: "85%"}}>
        <Col sm={7} className="h-100">
          <Row style={{height: "70%"}}>
            <Col><MyMap data={countries} myFunc={myFunc}/></Col>
          </Row>
          <Row style={{height: "30%"}}>
            <Timeline data={countries}/> 
          </Row>
        </Col>
        <Col sm={5} className="h-100">
          <Row style={{height:"40%"}}>
            <Col><CaseChart data={cases} />
              <center><p>Confirmed cases</p></center>
            </Col>
          </Row>
          <Row style={{height:"40%", marginTop: "50px"}}>
            <Col><DeathChart data={deaths} />
              <center><p>Number of deaths</p></center>
            </Col>
          </Row>
          <Row style={{height:"10%"}}>
            <Col>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
    </AppContext.Provider>
  );
}

export default App;

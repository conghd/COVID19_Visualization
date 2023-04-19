import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from "d3"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
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
  const [caseRegion, setCaseRegion] = useState("world");
  const [deathRegion, setDeathRegion] = useState("world");
  const [region, setRegion] = useState("world");
  const [from, setFrom] = useState("2020-01-20")
  const [to, setTo] = useState("2023-03-09")
  const [totalCases, setTotalCases] = useState(762201169)
  const [totalDeaths, setTotalDeaths] = useState(6893190)

  
  let fm = d3.format(".2s")
  useEffect(() => {
    fetch("http://localhost:3001/cases2")
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      }).then(data => {
        setCountries(data);
      }).catch (error => {
        //console.log("error")
      })

      fetch("http://localhost:3001/totalcases2/" + region + "/" + from + "/" + to)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      }).then(data => {
        //console.log(data)
        setCases(data);
        setCaseRegion(region);
        console.log("setcases");
      }).catch (error => {
        console.log("error")
      })

      fetch("http://localhost:3001/totaldeaths2/" + region + "/" + from + "/" + to)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      }).then(data => {
        //console.log(data)
        setDeaths(data);
        setDeathRegion(region);
        console.log("setdeaths");
      }).catch (error => {
        console.log("error")
      })

  }, [region, from, to]);

  const myFunc = (result) => {
    console.log("myFunc: " + result);
  }

  return (
    <AppContext.Provider value={{ countries, setCountries }}>
    <Container fluid={true} className="vh-100 align-items-center">
      <Row style={{height: "15%", alignItems: "center", marginTop: "30px" }}>
        <Col sm={4} className='h-100 align-items-center'>COVID-19 DASHBOARD {region} </Col>
        <Col sm={4} className='h-100' style={{alignItems: "center"}}>Total cases: {fm(totalCases)}</Col>
        <Col sm={4} className='h-100'>Total deaths: {fm(totalDeaths)}</Col>
      </Row>
      <Row style={{height: "85%"}}>
        <Col sm={7} className="h-100">
          <Row style={{height: "70%"}}>
            <Col style={{height: "100%"}}><MyMap data={countries} myFunc={setRegion}/></Col>
          </Row>
          <Row style={{height: "30%"}}>
            <Col className="timeline">
              <Card><Timeline data={countries}/></Card>
            </Col>
          </Row>
        </Col>
        <Col sm={5} className="h-100">
          <Row style={{height:"40%"}}>
            <Col><CaseChart data={cases} caseRegion={caseRegion}/>
              <center><p>Confirmed cases</p></center>
            </Col>
          </Row>
          <Row style={{height:"40%", marginTop: "50px"}}>
            <Col><DeathChart data={deaths} deathRegion={deathRegion} />
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

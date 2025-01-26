import React, { useState, useEffect } from "react";
import "./ViewStadium.css";
import { Container, Row, Col } from "react-bootstrap";
import CreateStadium from "../CreateStadium/CreateStadium";
import axios from "axios";
function ViewStadium(props) {
  const [stadiumes, setStadiumData] = useState([]);
  const apiUrl = "http://localhost:3000/getStadiums"; // Replace with your actual API endpoint

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json", // Adjust content type as needed
          },
        });
        setStadiumData(response.data);
      } catch (error) {
        console.error("Error fetching match details:", error);
        alert(error.response.data.error);
      }
    };

    fetchData();
  }, [apiUrl]);

  function changeStadiums(updatedStadium) {
    console.log("inchange");
    console.log("stadium",updatedStadium);
    setStadiumData((prevStadiums) => [...prevStadiums, updatedStadium]);

  }
  return (
    <div>
      <Container className="stadiumes-container">
        <Row className="stadiumes-header">
          <Col className="stadiumes-header-column">
            <h1>Stadium</h1>
            {props.userType == "Manager" && (
              <CreateStadium change={changeStadiums}></CreateStadium>
            )}
          </Col>
        </Row>
        <Row className="stadiumes">
          {stadiumes.map((item, i) => {
            return (
              <Col md={3} key={i}>
                <div className="stadium">
                  <h1>{item.name}</h1>
                  <div className="stadium-seats">
                    <p>{item.vipRows * item.vipSeatsPerRow} seats</p>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

      </Container>
    </div>
  );
}

export default ViewStadium;

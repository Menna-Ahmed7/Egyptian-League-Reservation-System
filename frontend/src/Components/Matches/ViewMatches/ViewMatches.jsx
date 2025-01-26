import React, { useState, useEffect } from "react";
import "./ViewMatches.css";
import { Container, Row, Col } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import CreateMatches from "../CreateMatches/CreateMatches.jsx";
import EditMatches from "../EditMatches/EditMatches.jsx";
import axios from "axios";
import { PiPersonSimpleRunBold } from "react-icons/pi";
import { FaRunning } from "react-icons/fa";
import Ahly from "../../Assets/logos/Ahly.png";
import Zamalek from "../../Assets/logos/Zamalek.png";
import Pyramids from "../../Assets/logos/Pyramids.png";
import Smouha from "../../Assets/logos/Smouha.png";
import Masry from "../../Assets/logos/Masry.png";
import Ismaily from "../../Assets/logos/Ismaily.png";
import Enppi from "../../Assets/logos/Enppi.png";
import GhazlElMahalla from "../../Assets/logos/GhazlElMahalla.png";
import CeramicaCleopatra from "../../Assets/logos/CeramicaCleopatra.png";
import Gouna from "../../Assets/logos/Gouna.png";
import BankAhly from "../../Assets/logos/BankAhly.png";
import MisrLelMakkasa from "../../Assets/logos/MisrLelMakkasa.png";
import WadiDegla from "../../Assets/logos/WadiDegla.png";
import ElEntagElHarby from "../../Assets/logos/ElEntagElHarby.png";
import AlMokawloonAlArab from "../../Assets/logos/AlMokawloonAlArab.png";
import HarasElHodood from "../../Assets/logos/HarasElHodood.png";
import Aswan from "../../Assets/logos/Aswan.png";
import Ittihad from "../../Assets/logos/Ittihad.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faUserTie,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";



export default function ViewMatches(props) {
  const [matches, setMatchData] = useState([]);
  const apiUrl = "http://localhost:3000/getmatches"; // Replace with your actual API endpoint

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get(apiUrl
        //   , {
        //   headers: {
        //     Authorization: `Bearer ${storedToken}`,
        //     "Content-Type": "application/json", // Adjust content type as needed
        //   },
        // }
      );

        //setMatchData(response.data.data);
        setMatchData(response.data);
        console.log("data",response.data)
      } catch (error) {
        console.error("Error fetching match details:", error);
        alert(error.response.data.error);
      }
    };

    fetchData();
  }, [apiUrl]);

  function changeMatches(updatedmatch) {
    console.log("after change", updatedmatch.id);
    setMatchData((prevMatches) => {
      return prevMatches.map((match) => {
        if (match.id === updatedmatch.id) {
          return { ...match, ...updatedmatch };
        } else {
          return match;
        }
      });
    });
  }
  function changeMatcheCreate(updatedMatch) {
    console.log("updates match", updatedMatch)
    setMatchData((prevMatches) => [...prevMatches, updatedMatch]);
  }
  const handleChildClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div>
      <Container className="matches-container">
        <Row className="matches-header">
          <Col className="matches-header-column">
            <p>Egyptian League Matches</p>
            {props.userType === "Manager" && (
              <CreateMatches change={changeMatcheCreate}></CreateMatches>
            )}
          </Col>
        </Row>
        <Row className="matches justify-content-start">
          {matches.map((item, i) => (
            <Col lg={6} md={12} key={i}>
              <div className="match">
                <div className="view-match-edit" onClick={handleChildClick}>
                  {props.userType === "Manager" && (
                    <EditMatches
                      matchId={item.id}
                      change={changeMatches}
                    ></EditMatches>
                  )}
                </div>
                <a
                  href={
                    localStorage.getItem("userType") === "guest" ||
                    localStorage.getItem("userType") === null
                      ? "/signin"
                      : `/MatchDetails/${item.id}`
                  }
                >
                  <div className="match-teams">
                    <div className="match-team match-team-left">
                      <img
                        src={require(`../../Assets/logos/${item.HomeTeam}.png`)}
                        alt=""
                      />
                      <p className="team-name">{item.HomeTeam}</p>
                    </div>
                    <div className="match-day-time">
                      <p className="match-time">
                        {new Date(item.date_time).getHours().toString().padStart(2, "0")}:
                        {new Date(item.date_time).getMinutes().toString().padStart(2, "0")}
                      </p>
                      <p className="match-day">
                        {new Date(item.date_time).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="match-team match-team-right">
                      <img
                        src={require(`../../Assets/logos/${item.AwayTeam}.png`)}
                        alt=""
                      />
                      <p className="team-name">{item.AwayTeam}</p>
                    </div>
                  </div>
                  <div className="match-location">
                    <p>
                      <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" />
                      {` ${item.stadium.name}`}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faUserTie} size="sm" />
                      {` ${item.Refree}`}
                    </p>
                    <div className="view-matches-linesmans">
                      <p>
                        <FontAwesomeIcon icon={faRunning} size="sm" />
                        {` ${item.linesman1}`}
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faRunning} size="sm" />
                        {` ${item.linesman2}`}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};
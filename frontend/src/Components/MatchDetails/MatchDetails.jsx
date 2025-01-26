import React, { useEffect, useState } from "react";
import "./MatchDetails.css";
import Seats from "../seats/seats";
import Ticket from "./Ticket";
import { Container, Row, Col } from "react-bootstrap";
import DeleteTicketPopUp from "./deleteTicketPopUp";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MatchDetails(props) {
  console.log("usertype in match details" + props.userType);
  const [columns, setColumns] = useState(10);
  const [rows, setRows] = useState(5);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [purchase, setPurchase] = useState(false);
  const [seatDetails, setSeatDetails] = useState([]);
  const [match, setMatch] = useState({});
  const { matchid } = useParams();


  const apiUrll = `http://localhost:3000/getSeatsDetails/${matchid}`;

  useEffect(() => {
    const fetchSeatDetails = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        console.log("token" , storedToken)
        const response = await axios.get(apiUrll, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        setSeatDetails(response.data.seatDetails);
        console.log("#columns",response.data.stadiumDetails.vipSeatsPerRow)
        
        setColumns(response.data.stadiumDetails.vipSeatsPerRow);
        setRows(response.data.stadiumDetails.vipRows);
      } catch (error) {
        console.error("Error fetching seat details:", error);
      }
    };

    fetchSeatDetails();
  }, [apiUrll]);

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
    } else {
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  function deleteTicket(label) {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.filter((id) => id !== label)
    );
  }

  const purchase_request = async (e) => {
    for (var i = 0; i < selectedSeats.length; i++) {
      const body = {
        matchId: matchid,
        rowNumber: Number(selectedSeats[i][0]),
        seatNumber: Number(selectedSeats[i][1]),
      };
      console.log(body);
      try {
        // const id = props.matchId;
        const storedToken = localStorage.getItem("token");
        console.log("token",storedToken);
        const response = await axios.post(
          `http://localhost:3000/reserveSeat`,
          body,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json", // Adjust content type as needed
            },
          }
        );
        // Check if the request was successful
        if (response.status === 201) {
          console.log("purchased successfully!");
        } else {
          console.error("purchase item:", response.statusText);
        }  
    } catch (error) {
        console.error("Error submitting form:", error);
        alert(error.response.data.error);
      }
    }
  };


  const apiUrl = `http://localhost:3000/getMatchById/${matchid}`;

  useEffect(() => {
    console.log("HERE" , matchid);
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setMatch(response.data);
        console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching match details:", error);
      }
    };

    fetchData();
  }, [apiUrl]);
  
  
  
  
  return (
    <div className="match-details">
      {purchase ? (
        <div className="overlay">
          <DeleteTicketPopUp
            price={selectedSeats.length * 200}
            closeWindow={setPurchase}
            purchase_request={purchase_request}
          />
        </div>
      ) : null}
      {Object.keys(match).length != 0 ? (
        <Container className="container-fluid match-details-container">
          <Row className="match-details-row">
            <Col className="match-details-teams">
              <div>
                <p>{match.HomeTeam}</p>
              </div>
              <div className="match-details-day-time">
                <p className="match-details-time">
                  {new Date(match.date_time).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
                <p className="match-details-day">
                  {new Date(match.date_time).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p>{match.AwayTeam}</p>
              </div>
            </Col>
          </Row>
          <Row className="match-details-row">
            <Col className="seats-col">
              <Seats
                userType={props.userType}
                columns={columns}
                rows={rows}
                seatDetails={seatDetails}
                onSeatClick={handleSeatClick}
                selectedSeats={selectedSeats}
              ></Seats>
            </Col>
            <Col className="tickets-col">
              {selectedSeats.length == 0 ? null : (
                <div className="match-details-tickets-header">
                  <h1>Tickets:</h1>
                </div>
              )}
              <div className="match-details-tickets">
                {selectedSeats.map((item, i) => (
                  <Ticket
                    key={item*i}
                    label={item}
                    price="200"
                    deleteTicket={deleteTicket}
                  ></Ticket>
                ))}
              </div>
              {selectedSeats.length > 0 && (
                <div className="purchase-button-container">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setPurchase(true)}
                  >
                    Purchase
                  </button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      ) : null}
    </div>
  );
};  

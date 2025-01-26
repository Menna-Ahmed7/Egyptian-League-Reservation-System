import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import "./ViewTickets.css";
export default function ViewTickets() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/getUserInfo", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });
        setMatches(response.data.tickets);
      } catch (error) {
        console.error("Error fetching user tickets:", error);
        alert(error.response.data.error);
      }
    };
    fetchData();
  }, []);

  const cancelReservation = async (ticketId) => {
    try {
      const storedToken = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/cancelReservation/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });
      // Remove the canceled ticket from the UI
      setMatches((prev) => prev.filter((ticket) => ticket.id !== ticketId));
    } catch (error) {
      console.error("Error canceling reservation:", error.message);
      alert(error.response.data.error);
    }
  };

  const isDateWithinThreeDays = (matchDateString) => {
    const today = new Date();
    const matchDate = new Date(matchDateString);
    const timeDifference = matchDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    // Allow cancelation only if the event is more than 3 days away
    return daysDifference <= 3;
  };

  return (
    <div>
      <Container className="matches-container">
        <Row className="matches-header">
          <Col className="matches-header-column">
            <p>Tickets</p>
          </Col>
        </Row>
        <Row className="matches justify-content-start">
          {matches.map((ticket, i) => (
            <Col md={3} key={ticket.id}>
              <div className="match">
                <div className="match-teams">
                  <div className="match-team match-team-left">
                    <p>{ticket.match.HomeTeam}</p>
                  </div>
                  <div className="match-day-time">
                    <p className="match-time">
                      {new Date(ticket.match.date_time).getHours() < 10
                        ? "0"
                        : ""}
                      {new Date(ticket.match.date_time).getHours()}:
                      {new Date(ticket.match.date_time).getMinutes() < 10
                        ? "0"
                        : ""}
                      {new Date(ticket.match.date_time).getMinutes()}
                    </p>
                    <p className="match-day">
                      {new Date(ticket.match.date_time).getMonth() + 1 < 10
                        ? "0"
                        : ""}
                      {new Date(ticket.match.date_time).getMonth() + 1}/
                      {new Date(ticket.match.date_time).getDate() < 10
                        ? "0"
                        : ""}
                      {new Date(ticket.match.date_time).getDate()}/
                      {new Date(ticket.match.date_time).getFullYear()}
                    </p>
                  </div>
                  <div className="match-team match-team-right">
                    <p>{ticket.match.AwayTeam}</p>
                  </div>
                </div>
                <div className="match-location">
                  <p>Seat: Row {ticket.seat.rowNumber}, Seat {ticket.seat.seatNumber}</p>
                  <p>{ticket.match.stadium.name}</p>
                </div>
                {
                    isDateWithinThreeDays(ticket.match.date_time) ? null : (
                      <div className="cancel-container">
                        <button
                          className="ticket-cancel"
                          onClick={() => cancelReservation(ticket.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    )
                  }

              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}


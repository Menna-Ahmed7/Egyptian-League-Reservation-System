import React, { useState } from "react";
import { FaChair } from "react-icons/fa";
import "./seat.css";
import { useNavigate } from "react-router-dom";

export default function Seat(props) {
  console.log("usertype",props.userType);
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (props.userType === "guest") {
      navigate("/Signup"); // Redirect guests to signup
    } else if (!props.reserved) {
      props.onSeatClick(props.id); // Allow other users to select the seat
    }
  };

  return (
    <div onClick={handleRedirect}>
      <FaChair
        size={50}
        className={
          props.reserved
            ? "reserved icon"
            : props.selected
            ? "selected icon"
            : "not-selected icon"
        }
      />
    </div>
  );
}



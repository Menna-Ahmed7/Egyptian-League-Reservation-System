import React from "react";
import "./UserProfileCard.css";
import profile_icon from "../Assets/user.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faIdCard,
  faMapMarkerAlt,
  faCity,
  faVenusMars,
  faUserShield,
  faBirthdayCake,
} from "@fortawesome/free-solid-svg-icons";

const UserProfileCard = (props) => {
  return (
    <div className="upc">
      <div className="gradiant"></div>
      <div className="profile-down">
        <img src={profile_icon} alt="" />
        <div className="profile-title">
          <FontAwesomeIcon icon={faUser} /> {props.data.username}
        </div>
        <div className="profile-button">
          <FontAwesomeIcon icon={faEnvelope} /> {props.data.emailAddress}
        </div>
        <div className="profile-button">
          <FontAwesomeIcon icon={faIdCard} /> {props.data.firstName}
        </div>
        <div className="profile-button">
          <FontAwesomeIcon icon={faIdCard} /> {props.data.lastName}
        </div>
        <div className="profile-button">
          <FontAwesomeIcon icon={faMapMarkerAlt} /> {props.data.Address}
        </div>
        <div className="profile-button">
          <FontAwesomeIcon icon={faCity} /> {props.data.City}
        </div>
        <div className="profile-button">
          <FontAwesomeIcon icon={faVenusMars} /> {props.data.gender}
        </div>
        <div className="profile-button">
          <FontAwesomeIcon icon={faUserShield} /> {props.data.role}
        </div>
        <div className="profile-button">
          <FontAwesomeIcon icon={faBirthdayCake} />{" "}
          {new Date(props.data.birthDate).getMonth() + 1 < 10 ? "0" : ""}
          {new Date(props.data.birthDate).getMonth() + 1}/
          {new Date(props.data.birthDate).getDate() < 10 ? "0" : ""}
          {new Date(props.data.birthDate).getDate()}/
          {new Date(props.data.birthDate).getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;

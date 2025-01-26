import classes from "./EditMatches.module.css";
import { BiCalendar, BiCheck, BiX } from "react-icons/bi";
import Button from "react-bootstrap/Button";

import React, { useState } from "react";
import axios from "axios";
import { BiPencil } from "react-icons/bi";
const EditMatches = (props) => {
  const today = new Date().toISOString().slice(0, 16);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    stadiumName: undefined,
    date_time: undefined,
    Refree: undefined,
    linesman1: undefined,
    linesman2: undefined,
    HomeTeam: undefined,
    AwayTeam: undefined,
  });

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Format the date to ISO 8601 with milliseconds and Z suffix
    const formattedFormData = {
      ...formData,
      date_time: formData.date_time
        ? new Date(formData.date_time).toISOString()
        : undefined,
    };

    console.log("Form submitted:", formattedFormData);
    setPopupVisible(false);

    try {
      const id = props.matchId;
      const storedToken = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:3000/editMatch/${id}`,
        formattedFormData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      props.change(response.data);
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response.data.error);
    }
  };

  return (
    <div>
      <button className={classes.popup_button} onClick={togglePopup}>
        <BiPencil size={23} />
      </button>
      {isPopupVisible && (
        <div className={classes.popup}>
          <div className={classes.headers}>
            <h3>Fill Match Details</h3>
            <button className={classes.close_button} onClick={togglePopup}>
              <BiX />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={classes.form_rows}>
              <div className={classes.form_columns}>
                <div className={classes.column1}>
                  <div>
                    <label>
                      stadiumName:
                      <input
                        type="text"
                        name="stadiumName"
                        value={formData.stadiumName}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Date & Time:
                      <input
                        type="datetime-local"
                        name="date_time"
                        value={formData.date_time}
                        onChange={handleChange}
                        min={today}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Main Referee:
                      <input
                        type="text"
                        name="Refree"
                        value={formData.Refree}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Linesman 1:
                      <input
                        type="text"
                        name="linesman1"
                        value={formData.linesman1}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Linesman 2:
                      <input
                        type="text"
                        name="linesman2"
                        value={formData.linesman2}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Home Team:
                      <input
                        type="text"
                        name="HomeTeam"
                        value={formData.HomeTeam}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Away Team:
                      <input
                        type="text"
                        name="AwayTeam"
                        value={formData.AwayTeam}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <Button
                className={classes.sumbit_button}
                type="submit"
                variant="success"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};



export default EditMatches;

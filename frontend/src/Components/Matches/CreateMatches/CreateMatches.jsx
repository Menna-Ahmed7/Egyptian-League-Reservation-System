import classes from "./CreateMatches.module.css";
import { BiCalendar, BiCheck, BiX } from "react-icons/bi";
import Button from "react-bootstrap/Button";

import React, { useState } from "react";
import axios from "axios";

const CreateMatches = (props) => {
  const today = new Date().toISOString().slice(0, 16);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    HomeTeam: "",
    AwayTeam: "",
    stadiumName: "",
    date_time: "",
    Refree: "",
    linesman1: "",
    linesman2: "",
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
    // console.log('Form submitted:', formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Close the popup after form submission
    setPopupVisible(false);
    try {
      const storedToken = localStorage.getItem("token");
      console.log("tokeeen", storedToken)
      console.log("body",formData)
      
      const response = await axios.post(
        "http://localhost:3000/addMatch",
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        }
      );
      
      props.change(response.data);
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error.error);
      alert(error.response.data.error);
    }
  };

  const teams = [
    "Ahly", "Zamalek", "Pyramids", "Smouha", "Masry", 
    "Ismaily", "Enppi", "GhazlElMahalla", "CeramicaCleopatra", 
    "Gouna", "BankAhly", "MisrElMakkasa", "WadiDegla", 
    "ElEntagElHarby", "MokawloonAlArab", "HarasElHodood", 
    "Aswan", "Ittihad"
  ];
  
  return (
    <div>
      <Button
        className={classes.popup_button}
        variant="success"
        onClick={togglePopup}
      >
        Add Match
      </Button>
  
      {
      isPopupVisible && (
        <div className={classes.popup}>
          <div className={classes.headers}>
            <h3>Set Match Details</h3>
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
                      Home Team:
                      <select
                        name="HomeTeam"
                        value={formData.HomeTeam}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Home Team
                        </option>
                        {teams.map((team) => (
                          <option 
                            key={team} 
                            value={team} 
                            disabled={formData.AwayTeam === team} // Disable if selected as AwayTeam
                          >
                            {team}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Away Team:
                      <select
                        name="AwayTeam"
                        value={formData.AwayTeam}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Away Team
                        </option>
                        {teams.map((team) => (
                          <option 
                            key={team} 
                            value={team} 
                            disabled={formData.HomeTeam === team} // Disable if selected as HomeTeam
                          >
                            {team}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Stadium:
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
                        min={today}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
                <div className={classes.column2}>
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

export default CreateMatches;

import classes from "./CreateStadium.module.css";
import { BiCalendar, BiCheck, BiX } from "react-icons/bi";
import Button from "react-bootstrap/Button";

import React, { useState } from "react";
import axios from "axios";

const CreateStadium = (props) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    vipRows: 0,
    vipSeatsPerRow: 0,
  });

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Parse to integer if the field is a number
    setFormData({
      ...formData,
      [name]: name === "vipRows" || name === "vipSeatsPerRow" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    setPopupVisible(false);
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/addStadium",
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      props.change(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response.data.error);
    }
  };

  return (
    <div>
      <Button
        className={classes.popup_button}
        variant="success"
        onClick={togglePopup}
      >
        Add Stadium
      </Button>

      {isPopupVisible && (
        <div className={classes.popup}>
          <div className={classes.headers}>
            <h3>Fill Stadium Details</h3>
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
                      Name:
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Row:
                      <input
                        type="number"
                        name="vipRows"
                        min="0"
                        value={formData.vipRows}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Column:
                      <input
                        type="number"
                        name="vipSeatsPerRow"
                        min="0"
                        value={formData.vipSeatsPerRow}
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


export default CreateStadium;

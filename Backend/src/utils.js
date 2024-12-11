const validator = require("validator");

const isValidDate=(date)=>{
    const matchDate = new Date(date);
    if (validator.isDate(matchDate)) {
      return { error: "Invalid date_time" };
    }
    // Check if the date_time is in the past
    const currentDate = new Date();
    if (matchDate < currentDate) {
      return { error: "The match date cannot be in the past" };
    }
    return true
  
}
module.exports=isValidDate
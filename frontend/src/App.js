import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginSignup/LoginSignup";
import MatchDetails from "./Components/MatchDetails/MatchDetails";
import ViewStadium from "./Components/Stadium/ViewStadium/ViewStadium";
import ViewTickets from "./Components/ViewTickets/ViewTickets";
import DeleteUser from "./Components/User/DeleteUser/DeleteUser";
import UserRequest from "./Components/User/Requests/UserRequest";
import Signup from "./Components/Signup/Signup";
import Home from "./Components/Home/Home.jsx";
import Profile from "./Components/ProfilePage/profile.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
function App() {
  const user = (localStorage.getItem("userType") != undefined) ? localStorage.getItem("userType"):"guest";

  console.log("getitem",  user);
  // localStorage.clear();
  let links;
  switch (user) {
    case "guest":
      links = [
        { path: "/", label: "Home" },
        { path: "/Signup", label: "SignUp" },
        { path: "/Signin", label: "SignIn" },
      ];
      break;
    case "Fan":
      links = [
        { path: "/", label: "Home" },
        { path: "/Profile", label: "Profile" },
        { path: "/Tickets", label: "Tickets" },
      ];
      break;
    case "Manager":
      links = [
        { path: "/", label: "Home" },
        { path: "/ViewStadium", label: "ViewStadium" },
      ];
      break;
    case "Admin":
      links = [
        { path: "/UserRequest", label: "User Request" },
        { path: "/DeleteUser", label: "Delete User" },
      ];
      break;
  }
  const navbarConfig = {
    logo: "Egyptian Premier League",
    links: links,
  };

  return (
    <div className="App">
      <Navbar {...navbarConfig} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home userType={user}></Home>} />
          <Route path="/Signup" element={<Signup></Signup>} />
          <Route path="/Signin" element={<Login></Login>} />
          <Route
            path="/MatchDetails/:matchid"
            element={<MatchDetails userType={user}></MatchDetails>}
          />
          <Route path="/Profile" element={<Profile></Profile>} />
          <Route
            path="/ViewStadium"
            element={<ViewStadium userType={user}></ViewStadium>}
          />
          <Route path="/Tickets" element={<ViewTickets></ViewTickets>} />
          <Route path="/UserRequest" element={<UserRequest></UserRequest>} />
          <Route path="/DeleteUser" element={<DeleteUser></DeleteUser>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

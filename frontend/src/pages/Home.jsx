import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import Login from "../components/Login";
import Register from "../components/Register";
import { UserContext } from "../components/UserContext";
import React, { useContext } from "react";
import LoginPage from "./LoginPage";


const Home = () => {
    const [token, setToken] = useContext(UserContext);              //This checks to see if there's currently a login
    const [ object, setObject ] = useState( [] );
    const navigate = useNavigate();

    useEffect( () => {
        if (token){
            console.log("There is a user logged in");
        }
        else{
            console.log("There is no user logged in");
        }
    }, [token] );

    /*const print_info = (value, idx) => {
        return <p key={idx}> {idx + 1}. {value.f_name} {value.l_name} </p>
    };*/

    return (
        <>
        <div>
            
            <h1 className='Header text-[#dc2626] text-3xl font-bold hover:underline hover:text-[#fbbf24]'>
                Welcome to Trackage where we definitely care about our project!  </h1>
                <br />
                <div>
                    <h3 className="text-3xl font-bold underline"> We currently have 4 paths:</h3>
                   <h4 className="text-1xl font-bold underline">
                    1. "/" which renders Home (this page: Home)
                    <br></br>
                    2. "/login" which renders Tofu's Login Page template (LoginPage)
                    <br></br>
                    3. "/loginModule" which renders White_Mages functional login module (Login)
                    <br></br>
                    4. "/DBTesting" which renders White_Mages Fast API access point (limited to api/show_users)
                    <br />
                    5. "/reg" which renders White_Mages functional user registration module (Register) 
                    <br />
                    </h4>
                </div>
        </div>

        <br></br>
        <hr></hr>

            <button className="logout_btn" 
                        onClick={ () => { setToken(null) } } >
                        Logout
                </button>
        <div>
            
        {!token ? (                                                         //Conditional Renderer (1st if for no log in)
            <div>Not Logged in
                <div className="entryHandler">
                    <Login></Login>
                    <Register></Register>
                </div>
            </div>
        ) : ( 
            <div>
                <LoginPage></LoginPage>
                Add Entry Page (redirection?) Here
                <p> You did log in congrats </p>
            </div>
        )}
        </div>
        </>
        
    );
}
export default Home;
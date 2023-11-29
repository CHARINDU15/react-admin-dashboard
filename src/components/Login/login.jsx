import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "font-awesome/css/font-awesome.min.css";
import imgesvg from "./Untitled design (30).png";

import {
  faUser,
  faEnvelope,
  faLock,
  faTwitter,
  faGoogle,
  faLinkedinIn,
  faSquareFacebook,
} from "@fortawesome/free-brands-svg-icons";
import "./login.css"; // Make sure to import your CSS file

import { useNavigate } from "react-router-dom";
import supabase from "../supabase/config";
const Login = ({ handleLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [containerClass, setContainerClass] = useState("container");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nic, setNIC] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null); // Add this line to manage user data
  const [errors, setErrors] = useState({});

  

  const validateEmail = () => {
    const newErrors = { ...errors };
    if (!/\S+@\S+\.\S+/.test(username)) {
      newErrors.username = '**Please enter a valid email address**';
    } else {
      delete newErrors.username;
    }
    setErrors(newErrors);
  };


  const validateContactNo = () => {
    const newErrors = { ...errors };
    if (!/^\d{10,12}$/.test(contactNo)) {
      newErrors.contactNo = 'Please enter a valid contact number (between 10 to 12 digits)';
    } else {
      delete newErrors.contactNo;
    }
    setErrors(newErrors);
  };

  const validateName = () => {
    const newErrors = { ...errors };
    const lettersRegex = /^[A-Za-z]+$/; 
    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }else if (!lettersRegex.test(name)) {
      newErrors.name = 'Name should contain only letters';
    }  else {
      delete newErrors.name;
    }
    setErrors(newErrors);
  };

  const validateNIC = () => {
    const newErrors = { ...errors };
    if (!/^\d{9}[VvXx]?$|^\d{12}$/.test(nic)) {
      newErrors.nic = 'Please enter a valid NIC number';
    } else {
      delete newErrors.nic;
    }
    setErrors(newErrors);
  };

  const validatePassword = () => {
    const newErrors = { ...errors };
    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
      newErrors.password =
        'Password must contain at least one number, one uppercase and lowercase letter, and at least 8 characters';
    } else {
      delete newErrors.password;
    }
    setErrors(newErrors);
  };

  const displayErrors = (field) => {
    return errors[field] ? (
      <p className="error-msg" style={{ color: 'red' }}>
        {errors[field]}
      </p>
    ) : null;
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };
  useEffect(() => {
    if (isSignIn) {
      setContainerClass("containerlg");
    } else {
      setContainerClass("containerlg sign-up-mode");
    }
  }, [isSignIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if username and password are not empty
    if (username === "" || password === "") {
      setError("Please enter both username and password");
      return;
    }else{
        try {
            const { data, error } = await supabase
              .from('Vendors')
              .select("*")
      
              .eq("email", username)
              .eq("NIC", password); // Replace with the condition you need
      
            if (error) {
              throw error;
            }
      
            if (data.length === 1) {
              handleLogin();
              
              localStorage.setItem('userData', JSON.stringify(data[0]));
              setUserData(data[0]);
              console.log(data);
            } else {
              setError("User not found");
              window.alert("Invalid username or password");

               // Handle case where user wasn't found
            }
          } catch (error) {
            console.error("Error fetching user data:", error.message);
            setError("An error occurred while fetching user data");
          }

  

    }

    
    
    
  };


 

  const handleSinup = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (username === "" || password === "") {
      setError("Please enter both username and password");
      return;
    }

    // Email validation
   
  else{

      try{
        const { data, error } = await supabase.auth.signUp({
          email: username,
          password: password,
          options: {
            emailRedirectTo: "/home",
          },
        });
        if (error){
          throw error
        } 
        else {
          alert('Check Your email for verification link');
          const newUser = data.user;
          const { id } = newUser;

          try {
            const { data, error } = await supabase
              .from("Customer")
              .insert([
                {
                  CustomerID: id,
                  Name: name,
                  ContactNumber: contactNo,
                  NIC: nic,
                },
              ])
              .select();
    
            if (error) {
              throw error;
            }
            else if (data.length === 1)
            {
              console.log(data);
              console.log("sucessfully add customer");
              navigate("/");
            }
    
            
           } catch (error) {
            alert.error("Error authenticating:", error.message);
            setError("An error occurred while authenticating");
          }

        }
        
       
      } catch(error){
        alert(error);

      }
      
  
    }

   
    if (userType === "Customer") {
      
    } else if (userType === "Vendor") {
      try {
        const { data, error } = await supabase
          .from("Vendors")
          .insert([
            {
              VendorsName: name,
              ContatNo: contactNo,
              NIC: nic,
            },
          ])
          .select();

        if (error) {
          throw error;
        }

        if (data.length === 1) {
          // Successful login, navigate to the next page
          fetchUserData();
          navigate("/home"); // Adjust the path to your desired destination
        } else {
          setError("Invalid username or password");
        }
      } catch (error) {
        alert.error("Error authenticating:", error.message);
        setError("An error occurred while authenticating");
      }
    } else if (userType === "Admin") {
      try {
        const { data, error } = await supabase
          .from("ADMIN_PANEL")
          .insert([
            {
              Name: name,
              ContactNo: contactNo,
              NIC: nic,
            },
          ])
          .select();

        if (error) {
          throw error;
        }

        if (data.length === 1) {
          // Successful login, navigate to the next page
          fetchUserData();
          navigate("/home"); // Adjust the path to your desired destination
        } else {
          setError("Invalid username or password");
        }
      } catch (error) {
        alert.error("Error authenticating:", error.message);
        setError("An error occurred while authenticating");
      }
    }

    // Authenticate user with Supabase
  };

  const fetchUserData = async ( username, password) => {
    try {
      const { data, error } = await supabase
        .from('Vendors')
        .select("*")

        .eq("email", username)
        .eq("NIC", password); // Replace with the condition you need

      if (error) {
        throw error;
      }

      if (data.length === 1) {
        handleLogin();
        setUserData(data[0]);
      } else {
        setError("User not found"); // Handle case where user wasn't found
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setError("An error occurred while fetching user data");
    }
  };

 

  return (
    <div className={containerClass}>
      <div className="forms-container">
        <div className="signin-signup">
          {isSignIn ? (
            // Sign In Formz
            <form action="#" className="sign-in-form">
              <h2 class="title">Sign in</h2>

              <div class="inputlg-fieldlg">
                <i className="fa fa-user icon"></i>
                <input
                  className="lg"
                  type="text"
                  placeholder="Email"
                  
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div class="inputlg-fieldlg">
                <i className="fa fa-lock icon"></i>
                <input
                  className="lg"
                  type="password"
                  placeholder="Password"
                  
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <input
                type="submit"
                value="Login"
                class="btnn solid"
                onClick={handleSubmit}
              />
              <p class="social-text">Or Sign in with social platforms</p>
              <div class="social-media">
                <a href="#" class="social-icon">
                  <FontAwesomeIcon
                    icon={faSquareFacebook}
                    beat
                    size="2lg"
                    style={{ color: "#000000" }}
                  />
                </a>
                <a href="#" class="social-icon">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    beat
                    style={{ color: "#000000" }}
                  />
                </a>
                <a href="#" class="social-icon">
                  <FontAwesomeIcon
                    icon={faGoogle}
                    beat
                    style={{ color: "#000000" }}
                  />
                </a>
                <a href="#" class="social-icon">
                  <FontAwesomeIcon
                    icon={faLinkedinIn}
                    beat
                    style={{ color: "#000000" }}
                  />
                </a>
              </div>
              <button
                className="btnn transparent"
                onClick={toggleForm}
                id="sign-up-btnn"
              >
                Sign up
              </button>
            </form>
          ) : (
            // Sign Up Form
            <form action="#" className="sign-up-form">
              <h2 class="title">Sign up</h2>

              <div class="inputlg-fieldlg">
                <i class="fa fa-envelope icon"></i>
                <input
                  className="lg"
                  type="email"
                  id="email"
                  placeholder="Email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
                  required
                  onBlur={validateEmail}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="error-container">{displayErrors('username')}</div>
               
              </div>
              <div class="inputlg-fieldlg">
                <i className="fa fa-phone icon"></i>
                <input
                  className="lg"
                  type="int"
                  id="contactNo"
                  placeholder="Contact No"
                  maxlength="12"
                  minlength="10"
                  required
                  onBlur={validateContactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
                <div className="error-container">{displayErrors('contactNo')}</div>
              </div>
              <div class="inputlg-fieldlg">
                <i className="fa fa-user icon"></i>
                <input
                  className="lg"
                  type="text"
                  id="name"
                  placeholder="Name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  onBlur={validateName}
                />
                 <div className="error-container">{displayErrors('name')}</div>
              </div>
              <div class="inputlg-fieldlg">
                <i className="fa fa-credit-card"></i>
                <input
                  className="lg"
                  id="nic"
                  type="NIC"
                  placeholder="NIC"
                  required
                  onChange={(e) => setNIC(e.target.value)}
                  onBlur={validateNIC}
                />
                <div className="error-container">{displayErrors('nic')}</div>
              </div>
              <div class="inputlg-fieldlg">
                <i class="fa fa-lock icon"></i>
                <input
                  className="lg"
                  type="password"
                  placeholder="Password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                  maxlength="100"
                  minlength="8"
                  id="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                />
                <div className="error-container">{displayErrors('password')}</div>
              </div>
              <input
                type="submit"
                class="btnn"
                value="Sign up"
                onClick={handleSinup}
              />
              <p class="social-text">Or Sign up with social platforms</p>
              <div class="social-media">
                <a href="#" class="social-icon">
                  <FontAwesomeIcon
                    icon={faSquareFacebook}
                    beat
                    size="2lg"
                    style={{ color: "#000000" }}
                  />
                </a>
                <a href="#" class="social-icon">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    beat
                    style={{ color: "#000000" }}
                  />
                </a>
                <a href="#" class="social-icon">
                  <FontAwesomeIcon
                    icon={faGoogle}
                    beat
                    style={{ color: "#000000" }}
                  />
                </a>
                <a href="#" class="social-icon">
                  <FontAwesomeIcon
                    icon={faLinkedinIn}
                    beat
                    style={{ color: "#000000" }}
                  />
                </a>
              </div>
              <button
                className="btnn transparent"
                onClick={toggleForm}
                id="sign-in-btnn"
              >
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="panels-containerlg">
        {/* Left Panel */}
        <div className="panel left-panel">
          <div className="content">
            <h3></h3>
            <p>
              
            </p>
            
          </div>
          <img src={imgesvg} className="image" alt="" />
        </div>

        {/* Right Panel */}
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button
              class="btnn transparentlg"
              onClick={toggleForm}
              id="sign-in-btnn"
            >
              Sign in
            </button>
          </div>
          <img src={''} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;

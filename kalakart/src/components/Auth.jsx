import { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";


function Auth() {

  const navigate = useNavigate();


  const [isLogin, setIsLogin] = useState(true);

  const [showPassword, setShowPassword] = useState(false);


  // ================================
  // LOGIN DATA
  // ================================

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });


  // ================================
  // SIGNUP DATA
  // ================================

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // ================================
  // JWT USER ID
  // ================================

  const getUserIdFromToken = (token) => {

    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return payload.userId;

    } catch (error) {

      console.error(
        "Unable to decode token:",
        error
      );

      return null;
    }
  };


  // ================================
  // LOGIN
  // ================================

  const handleLogin = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    try {

     const response = await fetch(
  "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        }
      );


      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);


      if (!response.ok) {

        setError(
          data.message || "Login failed"
        );

        return;
      }


      // ================================
      // TOKEN
      // ================================

      localStorage.setItem(
        "token",
        data.token
      );


      // ================================
      // USER ID
      // ================================

      const userId =
        getUserIdFromToken(data.token);


      if (!userId) {

        setError(
          "Login successful but user ID was not found."
        );

        return;
      }


      localStorage.setItem(
        "userId",
        userId
      );


      // ================================
      // USER DETAILS
      // ================================

      const loggedInUser = {

        _id:
          data.user?._id ||
          userId,

        firstName:
          data.user?.firstName ||
          data.firstName ||
          "",

        lastName:
          data.user?.lastName ||
          data.lastName ||
          "",

        email:
          data.user?.email ||
          data.email ||
          loginData.email,

      };


      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );


      console.log(
        "USER SAVED:",
        loggedInUser
      );


      setMessage(
        "Login successful! 🎉"
      );


      // ================================
      // HOME
      // ================================

      setTimeout(() => {

        navigate("/", {
          replace: true,
        });

      }, 500);


    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        "Unable to connect to server. Make sure backend is running."
      );
    }
  };


  // ================================
  // SIGNUP
  // ================================

  const handleSignup = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    if (
      signupData.password !==
      signupData.confirmPassword
    ) {

      setError(
        "Passwords do not match"
      );

      return;
    }


    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firstName:
              signupData.firstName,

            lastName:
              signupData.lastName,

            email:
              signupData.email,

            password:
              signupData.password,
          }),
        }
      );


      const data = await response.json();

      console.log(
        "SIGNUP RESPONSE:",
        data
      );


      if (!response.ok) {

        setError(
          data.message ||
          "Registration failed"
        );

        return;
      }


      // ================================
      // TOKEN
      // ================================

      localStorage.setItem(
        "token",
        data.token
      );


      // ================================
      // USER ID
      // ================================

      const userId =
        getUserIdFromToken(data.token);


      if (!userId) {

        setError(
          "Account created but user ID could not be found."
        );

        return;
      }


      localStorage.setItem(
        "userId",
        userId
      );


      // ================================
      // SAVE USER
      // ================================

      const newUser = {

        _id: userId,

        firstName:
          data.user?.firstName ||
          signupData.firstName,

        lastName:
          data.user?.lastName ||
          signupData.lastName,

        email:
          data.user?.email ||
          signupData.email,

      };


      localStorage.setItem(
        "user",
        JSON.stringify(newUser)
      );


      setMessage(
        "Account created successfully! 🎉"
      );


      // ================================
      // HOME
      // ================================

      setTimeout(() => {

        navigate("/", {
          replace: true,
        });

      }, 500);


    } catch (error) {

      console.error(
        "SIGNUP ERROR:",
        error
      );

      setError(
        "Unable to connect to server. Make sure backend is running."
      );
    }
  };


  // ================================
  // UI
  // ================================

  return (

    <div className="auth-page">


      {/* ================================
          LEFT IMAGE
      ================================= */}

      <div className="auth-image-section">

        <div className="image-overlay">

          <div className="brand-message">

            <h1>KalaKart</h1>

            <h2>
              Crafted by Tradition.
              <br />
              Chosen by You.
            </h2>

            <p>
              Discover India's timeless
              handlooms, handcrafted treasures
              and artistic heritage.
            </p>

          </div>

        </div>

      </div>


      {/* ================================
          RIGHT SIDE
      ================================= */}

      <div className="auth-form-section">

        <div className="auth-container">


          {/* LOGO */}

          <div className="auth-logo">

            <span>✦</span>

            <h1>
              KalaKart
            </h1>

          </div>


          {/* LOGIN / SIGNUP SWITCH */}

          <div className="auth-switch">

            <button
              type="button"

              className={
                isLogin
                  ? "active"
                  : ""
              }

              onClick={() => {

                setIsLogin(true);

                setError("");
                setMessage("");

              }}
            >
              Login
            </button>


            <button
              type="button"

              className={
                !isLogin
                  ? "active"
                  : ""
              }

              onClick={() => {

                setIsLogin(false);

                setError("");
                setMessage("");

              }}
            >
              Sign Up
            </button>

          </div>


          {/* SUCCESS */}

          {message && (

            <div className="success-message">
              {message}
            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="error-message">
              {error}
            </div>

          )}


          {/* ================================
              LOGIN
          ================================= */}

          {isLogin ? (

            <div className="auth-content">

              <h2>
                Welcome Back
              </h2>

              <p className="auth-subtitle">
                Continue your journey through
                India's finest crafts.
              </p>


              <form
                onSubmit={handleLogin}
              >


                {/* EMAIL */}

                <div className="input-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"

                    value={
                      loginData.email
                    }

                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        email:
                          e.target.value,
                      })
                    }

                    required
                  />

                </div>


                {/* PASSWORD */}

                <div className="input-group">

                  <label>
                    Password
                  </label>


                  <div className="password-input">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      placeholder="Enter your password"

                      value={
                        loginData.password
                      }

                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password:
                            e.target.value,
                        })
                      }

                      required
                    />


                    <button
                      type="button"
                      className="password-toggle"

                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword
                        ? "🙈"
                        : "👁"}
                    </button>

                  </div>

                </div>


                {/* FORGOT */}

                <div className="forgot-password">

                  <button
                    type="button"
                  >
                    Forgot password?
                  </button>

                </div>


                {/* LOGIN */}

                <button
                  type="submit"
                  className="auth-button"
                >
                  Login
                </button>

              </form>


              <div className="divider">
                <span>or</span>
              </div>


              <button
                type="button"
                className="google-button"
              >
                <span>G</span>
                Continue with Google
              </button>


              <p className="switch-text">

                Don't have an account?

                <button
                  type="button"

                  onClick={() => {

                    setIsLogin(false);

                    setError("");
                    setMessage("");

                  }}
                >
                  Sign Up
                </button>

              </p>

            </div>

          ) : (


            /* ================================
               SIGNUP
            ================================= */

            <div className="auth-content">

              <h2>
                Create Your Account
              </h2>

              <p className="auth-subtitle">
                Join KalaKart and discover
                authentic Indian craftsmanship.
              </p>


              <form
                onSubmit={handleSignup}
              >


                {/* NAME */}

                <div className="name-row">

                  <div className="input-group">

                    <label>
                      First Name
                    </label>

                    <input
                      type="text"
                      placeholder="First name"

                      value={
                        signupData.firstName
                      }

                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          firstName:
                            e.target.value,
                        })
                      }

                      required
                    />

                  </div>


                  <div className="input-group">

                    <label>
                      Last Name
                    </label>

                    <input
                      type="text"
                      placeholder="Last name"

                      value={
                        signupData.lastName
                      }

                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          lastName:
                            e.target.value,
                        })
                      }

                      required
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div className="input-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"

                    value={
                      signupData.email
                    }

                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        email:
                          e.target.value,
                      })
                    }

                    required
                  />

                </div>


                {/* PASSWORD */}

                <div className="input-group">

                  <label>
                    Password
                  </label>

                  <div className="password-input">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      placeholder="Create a password"

                      value={
                        signupData.password
                      }

                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password:
                            e.target.value,
                        })
                      }

                      required
                    />


                    <button
                      type="button"
                      className="password-toggle"

                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword
                        ? "🙈"
                        : "👁"}
                    </button>

                  </div>

                </div>


                {/* CONFIRM PASSWORD */}

                <div className="input-group">

                  <label>
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    placeholder="Confirm your password"

                    value={
                      signupData.confirmPassword
                    }

                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword:
                          e.target.value,
                      })
                    }

                    required
                  />

                </div>


                {/* SIGNUP */}

                <button
                  type="submit"
                  className="auth-button"
                >
                  Create Account
                </button>

              </form>


              <p className="switch-text">

                Already have an account?

                <button
                  type="button"

                  onClick={() => {

                    setIsLogin(true);

                    setError("");
                    setMessage("");

                  }}
                >
                  Login
                </button>

              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Auth;
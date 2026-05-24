import { useState } from "react";
import moneyHouse from "../assets/house-money.png";

const API_URL = "http://localhost:8080/api/v1/user";

function RegisterPage({ onGoToLogin, onRegisterSuccess }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function isValidEmail(value) {
    return value.includes("@") && value.includes(".");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    const formData = new URLSearchParams();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch(`${API_URL}/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });

      if (response.status === 201) {
        localStorage.setItem("userEmail", email);
        onRegisterSuccess(email);
        return;
      }

      if (response.status === 409) {
        setMessage("This email is already used");
        return;
      }

      setMessage("Account creation failed");
    } catch (error) {
      setMessage("Unable to contact the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>

      <style>
        {`
          .auth-wrapper {
            width: 100%;
            min-height: 100vh;
            display: flex;
            overflow-x: hidden;
          }

          .left-panel,
          .right-panel {
            min-width: 0;
          }

          .left-panel {
            flex: 1;
          }

          .right-panel {
            flex: 1;
          }

          .form-container {
            width: 100%;
            max-width: 430px;
          }

          .auth-form input,
          .auth-btn {
            width: 100%;
          }

          .image-box {
            max-width: 100%;
          }

          .left-image {
            max-width: 100%;
            height: auto;
          }

          @media (max-width: 900px) {
            .auth-wrapper {
              flex-direction: column;
              min-height: 100vh;
            }

            .left-panel {
              width: 100%;
              min-height: 300px;
              padding: 30px 20px;
            }

            .right-panel {
              width: 100%;
              padding: 35px 22px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .left-content {
              width: 100%;
              max-width: 520px;
              margin: 0 auto;
              text-align: center;
            }

            .left-title {
              font-size: 42px;
              line-height: 1.1;
              text-align: center;
            }

            .image-box {
              margin: 25px auto 0;
              max-width: 300px;
            }

            .form-container {
              max-width: 480px;
            }
          }

          @media (max-width: 520px) {
            .auth-wrapper {
              background: #ffffff;
            }

            .left-panel {
              min-height: 220px;
              padding: 24px 16px;
            }

            .right-panel {
              padding: 28px 16px;
            }

            .left-title {
              font-size: 32px;
            }

            .image-box {
              max-width: 210px;
              margin-top: 18px;
            }

            .form-container {
              width: 100%;
              max-width: 100%;
              padding: 0;
            }

            .form-title {
              font-size: 30px;
              margin-bottom: 22px;
              text-align: center;
            }

            .auth-form {
              width: 100%;
              gap: 14px;
            }

            .auth-form input {
              height: 52px;
              font-size: 15px;
              border-radius: 16px;
              padding: 0 16px;
            }

            .auth-switch {
              font-size: 14px;
              text-align: center;
              line-height: 1.5;
            }

            .auth-btn {
              height: 52px;
              font-size: 16px;
              border-radius: 16px;
            }

            .auth-message {
              text-align: center;
              font-size: 14px;
            }
          }

          @media (max-width: 360px) {
            .left-panel {
              min-height: 190px;
            }

            .left-title {
              font-size: 28px;
            }

            .image-box {
              max-width: 170px;
            }

            .right-panel {
              padding: 24px 12px;
            }

            .form-title {
              font-size: 27px;
            }

            .auth-form input,
            .auth-btn {
              height: 48px;
            }
          }


          @media (max-width: 520px) {
            .auth-wrapper {
              min-height: 100vh;
              height: auto;
            }

            .left-panel {
              min-height: 0;
              height: auto;
              padding: 22px 16px 18px;
            }

            .left-content {
              max-width: 100%;
            }

            .left-title {
              font-size: 30px;
              line-height: 1.15;
              margin-bottom: 12px;
            }

            .image-box {
              max-width: 150px;
              margin: 10px auto 0;
            }

            .left-image {
              width: 150px;
              max-height: 180px;
              object-fit: contain;
            }

            .right-panel {
              min-height: 0;
              padding: 24px 18px;
            }

            .form-title {
              font-size: 30px;
              margin-bottom: 22px;
            }

            .auth-form {
              gap: 14px;
            }

            .auth-form input {
              height: 50px;
            }

            .auth-btn {
              height: 50px;
            }
          }

          @media (max-width: 380px) {
            .left-panel {
              padding: 18px 14px 14px;
            }

            .left-title {
              font-size: 26px;
            }

            .image-box {
              max-width: 120px;
            }

            .left-image {
              width: 120px;
              max-height: 140px;
            }

            .right-panel {
              padding: 20px 14px;
            }

            .form-title {
              font-size: 27px;
              margin-bottom: 18px;
            }

            .auth-form input,
            .auth-btn {
              height: 46px;
            }
          }



          @media (min-width: 521px) and (max-width: 900px) {
            .auth-wrapper {
              min-height: 100vh;
              display: grid;
              grid-template-rows: 42vh 58vh;
              overflow: hidden;
            }

            .left-panel {
              height: 42vh;
              min-height: 0;
              padding: 26px 20px 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }

            .left-content {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }

            .left-title {
              font-size: 38px;
              line-height: 1.1;
              margin-bottom: 12px;
            }

            .image-box {
              max-width: 240px;
              max-height: 240px;
              margin: 0 auto;
              overflow: hidden;
            }

            .left-image {
              width: 240px;
              height: 240px;
              object-fit: contain;
              display: block;
            }

            .right-panel {
              height: 58vh;
              min-height: 0;
              padding: 26px 22px;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }

            .form-container {
              max-width: 520px;
              width: 100%;
            }

            .form-title {
              font-size: 42px;
              margin-bottom: 28px;
              text-align: center;
            }

            .auth-form {
              gap: 18px;
            }

            .auth-form input {
              height: 56px;
            }

            .auth-btn {
              height: 58px;
            }
          }

          @media (max-width: 520px) {
            .auth-wrapper {
              min-height: 100vh;
              display: grid;
              grid-template-rows: auto 1fr;
              overflow-x: hidden;
            }

            .left-panel {
              min-height: 0;
              height: auto;
              padding: 18px 16px 14px;
              overflow: hidden;
            }

            .left-content {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            .left-title {
              font-size: 28px;
              line-height: 1.12;
              margin-bottom: 10px;
            }

            .image-box {
              max-width: 130px;
              max-height: 130px;
              margin: 0 auto;
              overflow: hidden;
            }

            .left-image {
              width: 130px;
              height: 130px;
              object-fit: contain;
              display: block;
            }

            .right-panel {
              min-height: 0;
              padding: 24px 18px;
              display: flex;
              align-items: flex-start;
              justify-content: center;
            }

            .form-container {
              width: 100%;
              max-width: 100%;
            }

            .form-title {
              font-size: 30px;
              margin-bottom: 20px;
              text-align: center;
            }

            .auth-form {
              gap: 13px;
            }

            .auth-form input,
            .auth-btn {
              height: 48px;
            }
          }



          body {
            overflow: hidden;
          }

          .auth-wrapper {
            height: 100vh;
            min-height: 100vh;
            max-height: 100vh;
            overflow: hidden;
          }

          .left-panel,
          .right-panel {
            height: 100vh;
            max-height: 100vh;
            overflow: hidden;
          }

          .left-panel {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 36px 28px;
          }

          .left-content {
            width: 100%;
            height: 100%;
            max-height: 650px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .left-title {
            font-size: clamp(42px, 5vw, 66px);
            line-height: 1.1;
            margin-bottom: 22px;
          }

          .image-box {
            width: min(62%, 430px);
            height: min(52vh, 390px);
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .left-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
          }

          .right-panel {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 36px 32px;
          }

          .form-container {
            max-width: 430px;
          }

          .form-title {
            font-size: clamp(40px, 4vw, 54px);
            margin-bottom: 28px;
          }

          .auth-form {
            gap: 16px;
          }

          .auth-form input {
            height: 56px;
          }

          .auth-btn {
            height: 56px;
          }

          @media (max-width: 900px) {
            body {
              overflow: auto;
            }

            .auth-wrapper {
              height: auto;
              min-height: 100vh;
              max-height: none;
              overflow-x: hidden;
              overflow-y: auto;
            }

            .left-panel,
            .right-panel {
              height: auto;
              max-height: none;
            }
          }

          @media (min-width: 901px) and (max-height: 760px) {
            .left-panel {
              padding: 24px 24px;
            }

            .left-title {
              font-size: 52px;
              margin-bottom: 14px;
            }

            .image-box {
              width: min(58%, 390px);
              height: min(48vh, 340px);
            }

            .form-title {
              font-size: 48px;
              margin-bottom: 24px;
            }

            .auth-form input,
            .auth-btn {
              height: 54px;
            }

            .auth-switch {
              margin: 0;
            }
          }

        `}
      </style>

    <div className="auth-wrapper">
      <div className="left-panel">
        <div className="left-content">
          <h1 className="left-title">
            Manage
            <br />
            your money
          </h1>

          <div className="image-box">
            <img src={moneyHouse} alt="Money house" className="left-image" />
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <h2 className="form-title">Sign Up</h2>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            <p className="auth-switch">
              Already have an account?{" "}
              <span onClick={onGoToLogin}>Click here</span>
            </p>

            {message && <p className="auth-message">{message}</p>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default RegisterPage;

import { useEffect, useState } from "react";
import "./index.css";
import { useRef } from "react";

import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function App() {
  const phoneRef = useRef();
  const otpRef = useRef();
  const [cooldown, setCooldown] = useState(false);
  const [count, setCount] = useState(20);

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha",
        {
          size: "invisible",
        },
        auth
      );
    }
  };

  const sendOTP = () => {
    const phone = phoneRef.current.value;
    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
    }, 20000);
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const verifyOtp = () => {
    let otp = otpRef.current.value;
    if (otp.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          let user = result.user;
          console.log(user);
          alert("User signed in successfully");
        })
        .catch((error) => {
          alert("User couldn't sign in (bad verification code?)");
        });
    }
  };

  useEffect(()=>{
    generateRecaptcha();
  },[]);

  useEffect(() => {
    if (cooldown) {
      const timer = count > 0 && setInterval(() => setCount(count - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCount(20);
    }
  }, [cooldown, count]);

  return (
    <>
      <div className="app-container">
        <input ref={phoneRef} type="text" placeholder="Phone number..." />
        {cooldown ? (
          <div>Try after {count} seconds</div>
        ) : (
          <div onClick={sendOTP}>Send OTP</div>
        )}

        <input ref={otpRef} type="text" placeholder="Enter OTP..." />
        <div onClick={verifyOtp}>Verify OTP</div>
      </div>
      <div id="recaptcha"></div>
    </>
  );
}

export default App;

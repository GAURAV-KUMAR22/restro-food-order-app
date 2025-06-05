import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { auth } from "../../firebase";
import toast from "react-hot-toast";

export const PhoneVerify = ({ phone, setPhone, code, setCode, onVerified }) => {
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null);

  // Setup reCAPTCHA only once
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved - maybe auto-send OTP
          },
          "expired-callback": () => {
            toast.error("reCAPTCHA expired. Please refresh and try again.");
            window.recaptchaVerifier.clear();
            delete window.recaptchaVerifier;
          },
        }
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  }, []);

  // Send OTP
  const sendOTP = async (e) => {
    e.preventDefault();

    if (!phone.startsWith("+"))
      return toast.error("Include country code e.g. +91");

    try {
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP: " + error.message);
      // Optional: Reset captcha
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!confirmationResult) return toast.error("Please request OTP first.");
    if (!code) return toast.error("Enter the OTP.");

    try {
      await confirmationResult.confirm(code);
      toast.success("Phone number verified!");
      onVerified();
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Invalid OTP. Try again.");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Verify Phone</h3>
      <input
        type="tel"
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full h-10 border rounded pl-2 mb-2"
      />
      <button
        onClick={sendOTP}
        className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
      >
        Send OTP
      </button>

      <div ref={recaptchaRef} id="recaptcha-container" className="my-2" />

      <input
        type="text"
        placeholder="Enter OTP"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-10 border rounded pl-2 mb-2"
      />
      <button
        onClick={verifyOTP}
        className="bg-green-500 text-white px-4 py-1 rounded"
      >
        Verify OTP
      </button>
    </div>
  );
};

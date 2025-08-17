import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onGoogleClickHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const results = await signInWithPopup(auth, provider);
      console.log(results);
      const body = JSON.stringify({
        name: results.user.displayName,
        email: results.user.email,
        photo: results.user.photoURL,
      });

      const res = await fetch("http://localhost:5000/api1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
        credentials: "include"
      });
      const data = await res.json();

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.log("Unable to connect with google" + err.message);
    }
  };
  return (
    <button
      type="button"
      onClick={onGoogleClickHandler}
      className="bg-red-700 text-white hover:opacity-95 cursor-pointer w-full p-3 my-2 rounded-md disabled:opacity-80 uppercase"
    >
      continue with google
    </button>
  );
}


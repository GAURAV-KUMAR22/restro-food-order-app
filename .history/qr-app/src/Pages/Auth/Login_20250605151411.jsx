import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import { ReverseButton } from "../../components/Client/ReverseButton";
import { useAuth } from "../../../Context/AuthProvider";

export const Login = () => {
  const { setAuthenticated } = useAuth();
  const naviagate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setErrors] = useState({});

  const validate = () => {
    const formError = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;

    if (!emailRegex.test(form.email)) {
      formError.email = "Email is required and must me correct";
    }
    const passwordRezax =
      /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@*$%&+=!]).{8,}$/;

    if (!passwordRezax.test(form.password)) {
      formError.password =
        "Password must be Atleat one Uppercase later and one lowerCase and one symbol";
    }
    setErrors(formError);

    return Object.keys(formError).length === 0;
  };

  async function handleForm(e) {
    e.preventDefault();
    if (validate()) {
      const resoponce = await PrivateAxios.post("/auth/login", form);
      if (resoponce.status !== 200) {
        throw new Error({ message: "Respocne Failed" });
      }
      localStorage.setItem("token", resoponce.data.token);
      setAuthenticated(true);
      naviagate("/admin");
    }
  }

  function handleInput(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
  return (
    <div className="min-w-[375px] ml-2 mr-2 h-full overflow-x-hidden items-center relative">
      <div className="mt-3">
        <ReverseButton
          route={"/"}
          routeName={"Home"}
          css={"flex justify-start"}
        />
      </div>
      <div className="mt-10 flex flex-col items-center">
        <h2 className="flex justify-center text-2xl font-semibold">
          Login Form
        </h2>
        <form
          onSubmit={handleForm}
          className="w-full sm:w-full md:w-[50%] lg:w-[40%] m-3 shadow-md rounded-md flex flex-col justify-center"
        >
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="m-2 border border-gray-400 pl-2 h-12 rounded-md "
              onChange={handleInput}
            />
            {error.email && <p className="text-red-800">{error.email}</p>}
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="m-2 border border-gray-400 pl-2 h-12 rounded-md "
              onChange={handleInput}
            />
            {error.password && (
              <p className="text-red-800 text-center">{error.password}</p>
            )}
          </div>
          <div className="ml-2 mr-2">
            <button
              type="submit"
              className="w-full bg-[#5780FA]  text-white font-semibold h-12 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </div>

          <p className="m-2 flex justify-center">
            {" "}
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-blue-600">
              Signup
            </Link>{" "}
          </p>
        </form>
      </div>
    </div>
  );
};

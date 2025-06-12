import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import publicAxios from "../../Services/PublicAxios";
import { ReverseButton } from "../../components/Client/ReverseButton";
export const Signup = () => {
  const naviagate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.name) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;

    if (!form.email.trim() || !emailRegex.test(form.email)) {
      newErrors.email = "Email is not correct";
    }

    const passwordRezax =
      /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@*$%&+=!]).{8,}$/;

    if (!form.password.trim() || !passwordRezax.test(form.password)) {
      newErrors.password =
        "Password must be Atleats One upparcase later and one lowercase and any symbol";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleForm(e) {
    e.preventDefault();
    if (validate()) {
      const resoponce = await publicAxios.post("/auth/signup", form);
      if (!resoponce.status === 201) {
        throw new Error({ message: "Responce Failed" });
      }
      naviagate("/login");
    }
  }

  function handleInput(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
  return (
    <div className="  my-0  relative">
      <div className="flex justify-start w-[98%] mx-auto mt-3">
        <ReverseButton route={"/"} routeName={"Home"} css={"text-left"} />
      </div>
      <div className="mt-10 flex flex-col items-center ">
        <h2 className="flex justify-center text-2xl font-semibold">
          Ragistration Form
        </h2>
        <form
          onSubmit={handleForm}
          className="w-full sm:w-full md:w-[50%] lg:w-[40%] m-3 shadow-md rounded-md flex flex-col justify-center"
        >
          <div className="flex flex-col">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="m-2 border border-gray-400 pl-2 h-12 rounded-md"
              onChange={handleInput}
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          </div>
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="m-2 border border-gray-400 pl-2 h-12 rounded-md"
              onChange={handleInput}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="m-2 border border-gray-400 pl-2 h-12 rounded-md"
              onChange={handleInput}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}
          </div>

          {/* 🛠 No extra div! Directly button */}
          <button
            type="submit"
            className="m-2 bg-[#5780FA] text-white font-semibold h-12 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Signup
          </button>

          <p className="flex justify-center mt-4">
            Already have an account?
            <Link className="text-blue-500 ml-1" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

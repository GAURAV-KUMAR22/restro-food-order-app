import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import { ReverseButton } from "../../components/Client/ReverseButton";
import { useAuth } from "../../../Context/AuthProvider";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/Fetures/authSlice";
import { Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const { setAuthenticated } = useAuth();
  const naviagate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

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
        toast.error("Response Failed");
        throw new Error({ message: "Respocne Failed" });
      }

      if (resoponce.data.content.isApproved === false) {
        return toast.error("You are not approved for this Service");
      }
      dispatch(
        loginSuccess({
          token: resoponce.data.token,
          user: resoponce.data.content.user,
          role: resoponce.data.content.role,
        })
      );
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
          <div className="flex justify-between items-center border border-gray-400 rounded-md m-2 px-2 h-12 ">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleInput}
              className="flex-grow outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="ml-2 text-gray-500 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

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
          <p className="text-center text-blue-400">
            <Link to={"/login/superadmin"}>SuperAdmin-Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

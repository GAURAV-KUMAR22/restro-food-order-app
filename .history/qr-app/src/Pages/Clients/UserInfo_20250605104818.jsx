import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import publicAxios from "../../Services/PublicAxios";
import { useSelector } from "react-redux";
import { ReverseButton } from "../../components/Client/ReverseButton";
import { PhoneVerify } from "../../components/Admin/PhoneVerify";
import ErrorBoundary from "../../Util/ErrorBoundry";

export const UserInfo = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams ? searchParams.get("userId") : null;
  const [error, setErrors] = useState({});
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState(null);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    table: user?.table || "",
  });
  const [isEditMode, setIsEditMode] = useState(!user);
  // const [phone, setPhone] = useState();
  // const [code, setCode] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInput = async () => {
    const formError = {};
    if (!form.name || form.name.trim() === "") {
      formError.name = "Name field is required";
    }
    const phoneStr = String(form.phone);

    const phoneRegex = /^[0-9]{10}$/;

    if (!form.phone || !phoneRegex.test(form.phone)) {
      formError.phone = "Phone number must be exactly 10 digits";
    }
    if (!form.table || isNaN(form.table) || Number(form.table) <= 0) {
      formError.table = "Table must be a positive number";
    }
    setErrors(formError);
    return Object.keys(formError).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = await validateInput(); // ✅ await used
    if (isValid) {
      try {
        const response = user
          ? await publicAxios.put("/auth/user", form)
          : await publicAxios.post("/auth/user", form);
        if (response.status === 200) {
          const updatedUser = response.data.user;
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setIsEditMode(false);
          navigate(`/cart-bill/?userId=${response.data.user._id}`);
        }
      } catch (error) {
        throw new Error({ message: "Api req failed", error });
      }
    }
  };

  const itemData = cartItems.map((item) => ({
    productId: item._id,
    quantity: item.quantity,
  }));

  async function handleCartDeta() {
    const cartData = {
      userId: userId ? user._id : userId,
      items: itemData,
    };
    try {
      const responce = cart
        ? null
        : await publicAxios.post("/carts/add-cart", cartData);

      if (responce.statusText !== "Created") {
        throw new Error({ message: "responce failed" });
      }
      setCart(responce.data.content);
    } catch (error) {
      throw new Error({ message: "Api req failed", error });
    }
  }

  if (cartItems.length == 0) {
    navigate("/");
    return null;
  }

  return (
    <div className="mx-2">
      <div className="w-[100%] h-[58px] flex items-center">
        <ReverseButton route={"/cart"} routeName={"User Details"} />
      </div>

      <div className="relative flex flex-col">
        <h2 className="my-4 text-2xl text-center font-semibold">
          User Details
        </h2>

        {isEditMode ? (
          <>
            <label htmlFor="name" className="text-xl font-semibold ml-1 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              required
              onChange={handleChange}
              value={form.name}
              className="w-full h-10 border rounded-md pl-1 border-gray-500"
            />
            {error.name && (
              <p className="text-red-800 w-[98%] mx-auto">{error.name}</p>
            )}
            {/* <ErrorBoundary>
              <PhoneVerify
                phone={phone}
                setPhone={setPhone}
                code={code}
                setCode={setCode}
                onVerified={() => setForm((prev) => ({ ...prev, phone }))}
              />
            </ErrorBoundary> */}
            <label htmlFor="name" className="text-xl font-semibold ml-1 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter Your Number"
              required
              onChange={handleChange}
              value={form.phone}
              className="w-full h-10 border rounded-md pl-1 border-gray-500"
            />
            {error.phone && (
              <p className="text-red-800 w-[98%] mx-auto">{error.phone}</p>
            )}

            <label
              htmlFor="table"
              className="font-semibold ml-1 mb-1 mt-2 text-xl"
            >
              Table
            </label>
            <input
              type="number"
              name="table"
              placeholder="Enter Table Number"
              required
              onChange={handleChange}
              value={form.table}
              className="w-full h-10 border rounded-md pl-1 border-gray-500"
            />
            {error.table && (
              <p className="text-red-800 w-[98%] mx-auto">{error.table}</p>
            )}

            <div className="w-full flex gap-2 mt-4">
              <Link
                className="bg-gray-300 w-1/2 py-2 rounded flex justify-center"
                onClick={() => setIsEditMode(false)}
                to={"/cart"}
              >
                Cancel
              </Link>
              <button
                className="bg-amber-400 w-1/2 py-2 rounded"
                onClick={() => {
                  handleSubmit();
                  handleCartDeta();
                }}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">👤 Name: {user.name}</p>
            <p className="text-lg font-medium mt-2">📞 Phone: {user.phone}</p>
            <button
              className="mt-4 bg-blue-400 text-white py-2 px-4 rounded"
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </button>
            <Link
              className="mt-4 bg-blue-400 text-white py-2 px-4 rounded flex justify-center  items-center"
              to={`/cart-bill/?userId=${userId ? userId : user._id}`}
              onClick={() => {
                handleCartDeta();
              }}
            >
              Bill Details
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

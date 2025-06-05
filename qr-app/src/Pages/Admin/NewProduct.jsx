import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import { Model } from "../../components/Model";
import { ReverseButton } from "../../components/Client/ReverseButton";
import publicAxios from "../../Services/PublicAxios";
import toast from "react-hot-toast";

export const NewProduct = () => {
  const [catgory, setCategoryOption] = useState([]);
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showImage, setShowImage] = useState(true);
  const [image, setImageUrl] = useState();
  const navigate = useNavigate();
  const [error, setErrors] = useState({});
  const location = useLocation();
  let product = location?.state?.product;

  const BackendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
  });

  // validate inputs
  const validateInput = async () => {
    const formError = {};

    if (!form.name) {
      formError.name = "Name Field is required";
    }
    if (!form.description) {
      formError.description = "Description Field is required";
    }
    if (!form.category) {
      formError.category = "Category Field is required";
    }
    if (!form.price) {
      formError.price = "Price Field is required";
    }
    if (!form.quantity) {
      formError.quantity = "Quantity Field is required";
    }

    setErrors(formError);
    return Object.keys(formError).length === 0;
  };

  // Edit product value
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        category: product.categoryId?.name || "",
        price: product.price || "",
        quantity: product.totelQuantity || "",
      });
    }
  }, [product]);

  // Fetch Category
  useEffect(() => {
    const controller = new AbortController();

    async function fetched() {
      try {
        const response = await PrivateAxios.get("/products/category", {
          signal: controller.signal,
        });

        if (response.status === 200) {
          setCategoryOption(response.data.content);
        } else {
          throw new Error("Response failed"); // FIXED: now it's a string
        }
      } catch (error) {
        throw new Error("Response failed", error.message || error);
      }
    }

    fetched();

    return () => {
      controller.abort();
    };
  }, []);

  // setImageUrl and  setPicutreDetails
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  };

  // Form save in the form state
  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // post request for new Product save
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidate = await validateInput();
    if (isValidate) {
      let data = new FormData();
      data.append("picture", picture); // match backend field
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("price", form.price);
      data.append("quantity", form.quantity);

      const responce = product
        ? await PrivateAxios.put(`/products/${product._id}`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await PrivateAxios.post("/products/new-product", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      if (responce.status === 201 || responce.status === 200) {
        setForm({
          name: "",
          description: "",
          category: "",
          price: "",
        });
        setPicture(null);
        toast.success("New product Added");
        navigate("/admin");
      }
    }
  };

  // for All filed reset
  const handleDiscard = () => {
    setForm({
      productName: "",
      shortDesc: "",
      category: "",
      prices: "",
      qty: "",
    });
    setPicture(null);
    navigate("/admin");
  };

  // uploaded imaged toggle
  function handlePreviewImage() {
    if (picture) {
      const imageUrl = URL.createObjectURL(picture);
      setShowImage((prev) => !prev);
      setPreview(imageUrl);
    }
  }

  // Delete specifc product
  async function handleDelete(productId) {
    const responce = await publicAxios.delete(`/products/${productId}`);
    if (responce.status === 200) {
      toast.success("Product deleted succussfully");
      navigate("/admin");
    }
  }

  return (
    <div className="w-[100%] flex flex-col">
      <div className="flex text-left mb-4 ">
        <ReverseButton routeName={"Add Product"} route={"/admin"} />
      </div>

      {preview && showImage && (
        <Model
          children={
            <img
              src={preview}
              alt="Preview"
              className="w-64 h-64 object-cover rounded-md border mb-4"
            />
          }
          onClose={() => setShowImage(false)}
        />
      )}

      {/* Form fields */}
      <div className="w-[98%] sm:w-[50%] sm:mx-auto mx-2">
        <div className="w-full flex flex-col mx-auto sm:w-[70%]">
          <div className="flex flex-col mx-auto w-full sm:flex-row  justify-between gap-4 lg:items-center">
            <div className="flex justify-start items-center">
              <div className="mr-5">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className=" bg-gray-600 w-[50px] h-[50px] object-contain rounded-full items-center justify-center flex ">
                    {image && picture ? (
                      <img
                        src={image}
                        alt="file upload"
                        className="w-[50px] h-[50px] object-cover rounded-full"
                      />
                    ) : product ? (
                      <img
                        src={`${BackendUrl}/${product.imageUrl}`}
                        alt="file upload"
                        className="w-[50px] h-[50px] object-cover rounded-full"
                      />
                    ) : (
                      <img src="/public/assets/Vector2.png" alt="file upload" />
                    )}
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="file"
                  hidden
                  onChange={handleImage}
                  required
                />
                {error.picture && (
                  <p className="text-red-800 w-[98%] mx-auto">
                    {error.picture}
                  </p>
                )}
              </div>
              <div className="flex flex-col mx-auto my-auto sm:flex-row gap-2">
                <button
                  onClick={handlePreviewImage}
                  className="bg-[#F9D718] p-1  flex font-light items-center justify-center text-center rounded-md overflow-y-hidden"
                >
                  {picture && picture.name ? picture.name : "Uploaded Image"}
                </button>
                {picture && (
                  <button
                    className="bg-[#F9D718] p-1  flex font-light items-center justify-center text-center rounded-md  overflow-y-hidden"
                    onClick={() => setPicture(null)}
                    type="button"
                  >
                    Discard
                  </button>
                )}
                {product && (
                  <div className="bg-red-700 p-1  flex font-light items-center justify-center text-center rounded-md overflow-y-hidden">
                    <button onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col  ">
          <div className=" h-[67px] flex flex-col mb-2">
            <label className="min-h-5">Product Name</label>
            <input
              type="text"
              name="name"
              onChange={handleForm}
              value={form.name}
              placeholder="Chinese Burger"
              required
              className="bg-[#F9F9F9] min-h-[40px] px-2"
            />
            {error.name && (
              <p className="text-red-800 w-[98%] mx-auto">{error.name}</p>
            )}
          </div>

          <div className="w-full h-[67px] flex flex-col m-1">
            <label className="min-h-5">Short Description</label>
            <input
              type="text"
              name="description"
              onChange={handleForm}
              value={form.description}
              placeholder="Tasty and spicy"
              required
              className="bg-[#F9F9F9] min-h-[40px] px-2"
            />
            {error.description && (
              <p className="text-red-800 w-[98%] mx-auto">
                {error.description}
              </p>
            )}
          </div>

          <div className="w-full h-[67px] flex flex-col m-1">
            <label className="min-h-5">Category</label>
            <select
              className="bg-[#F9F9F9] min-h-[40px] px-2"
              name="category"
              onChange={handleForm}
              value={form.category} // Ensure the select value is controlled by form.state
              required
            >
              {error.category && (
                <p className="text-red-800 w-[98%] mx-auto">{error.category}</p>
              )}
              {/* "Choose Category" option */}
              <option value={product?.categoryId?.name}>
                {product ? product.categoryId?.name : "choose Category"}
              </option>
              {/* Render categories only if `catgory` has items */}
              {catgory.length > 0 &&
                catgory.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="w-full h-[67px] flex flex-col m-1">
            <label className="min-h-5">Quantity</label>
            <input
              type="number"
              name="quantity"
              onChange={handleForm}
              value={form.quantity}
              placeholder="e.g. 10"
              required
              className="bg-[#F9F9F9] min-h-[40px] px-2"
            />
            {error.quantity && (
              <p className="text-red-800 w-[98%] mx-auto">{error.quantity}</p>
            )}
          </div>
          <div className="w-full h-[67px] mb-15 flex flex-col m-1">
            <label className="min-h-5">Prices (Rs.)</label>
            <input
              type="number"
              name="price"
              onChange={handleForm}
              value={form.price}
              placeholder="e.g. 149"
              required
              className="bg-[#F9F9F9] min-h-[40px] px-2"
            />
            {error.price && (
              <p className="text-red-800 w-[98%] mx-auto">{error.price}</p>
            )}
          </div>
          <div className="w-full flex justify-between min-h-[48px] mt-28 fixed bottom-2 left-0 right-0 bg-white shadow-md px-4 gap-4">
            <button
              onClick={handleDiscard}
              className="w-[50%] bg-[#F2EFE3] rounded-md "
              type="button"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#F9D718] w-[50%]  rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Action Buttons */}
    </div>
  );
};

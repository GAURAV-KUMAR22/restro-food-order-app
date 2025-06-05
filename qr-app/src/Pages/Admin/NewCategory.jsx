import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import { MdAttachFile } from "react-icons/md";
import { Model } from "../../components/Model";

export const NewCategory = () => {
  const naviagate = useNavigate();
  const [category, setCategory] = useState("");
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    category: "",
    description: "",
  });

  function handleImage(e) {
    const file = e.target.files[0];
    setPicture(file);
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  }

  function handleFormDate(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit() {
    const Form = new FormData();

    Form.append("picture", picture);
    Form.append("name", form.category);
    Form.append("description", form.description);
    try {
      const responce = await PrivateAxios.post("/products/new-category", Form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (responce.status === 201) {
        setCategory(responce.data.content);
        naviagate("/admin");
      }
    } catch (error) {
      throw new Error({ message: "responce Failed", error });
    }
  }

  function handlePreviewImage() {
    if (picture) {
      const imageUrl = URL.createObjectURL(picture);
      setShowImage((prev) => !prev);
      setPreview(imageUrl);
    }
  }

  return (
    <div className="flex flex-col box-border">
      {/* Top nav */}
      <div className="flex text-left p-4">
        <img
          src="/assets/back.png"
          alt="back"
          className="shadow-sm rounded-full"
        />
        <Link to="/admin" className="ml-2 font-semibold">
          Add Product
        </Link>
      </div>

      <div className="flex justify-between m-4 flex-col items-center">
        <div className="flex justify-start items-center">
          <div className="mr-5">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className=" bg-gray-600 w-[50px] h-[50px] object-contain rounded-full items-center justify-center flex ">
                {image ? (
                  <img
                    src={image}
                    alt="file upload"
                    className="w-[50px] h-[50px] object-contain rounded-full"
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
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePreviewImage}
              className="bg-[#F9D718] w-32 flex font-light items-center justify-center text-center rounded-md h-8 overflow-y-hidden"
            >
              {picture && picture.name ? picture.name : "Uploaded image"}
            </button>
            <button
              className="bg-gray-400 border rounded-md px-5"
              onClick={() => setPicture(null)}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div></div>
      {preview && showImage && (
        <Model
          children={
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md border"
            />
          }
          onClose={() => setShowImage(false)}
        />
      )}
      <form
        className="flex flex-col justify-center items-center w-full m-4"
        onSubmit={handleSubmit}
      >
        <div className="w-[90%] max-w-md h-[90px] flex flex-col m-1 overflow-x-hidden">
          <label className="p-1">Category</label>
          <input
            type="text"
            name="category"
            placeholder="Chinese Burger"
            onChange={handleFormDate}
            className="bg-[#F9F9F9] min-h-[40px] rounded-md px-2"
          />
        </div>

        <div className="w-[90%] max-w-md h-[90px] flex flex-col m-1 overflow-x-hidden">
          <label className="p-1">Description</label>
          <input
            type="text"
            name="description"
            placeholder="Description"
            onChange={handleFormDate}
            className="bg-[#F9F9F9] min-h-[40px] rounded-md px-2"
          />
        </div>
      </form>

      <div className="flex justify-between w-[99%]  min-h-[48px] mt-28 fixed bottom-0 gap-3 ml-2 mr-2  ">
        <button
          onClick={() => naviagate("/admin")}
          className="bg-[#F2EFE3] w-[50%] rounded-md min-w-[164px]"
        >
          Discard
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-[#F9D718] w-[50%] min-w-[164px] rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import publicAxios from "../../Services/PublicAxios";
import { socket } from "../../Services/Socket";
import { playNotificationSound } from "../../Util/PlaySound";

import { CardDetails } from "../../components/CardDetails";
import { StatCard } from "../../components/Admin/StatCard";
import { CardView } from "../../components/Client/CardView";

import { BsBoxArrowInDownLeft, BsBoxArrowInUp } from "react-icons/bs";
import { TbCategoryPlus } from "react-icons/tb";
import { MdAttachMoney } from "react-icons/md";
import { useAuth } from "../../../Context/AuthProvider";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Edit2Icon, Menu } from "lucide-react";
import { logout } from "../../Redux/Fetures/authSlice";

export const DashBoardPage = () => {
  const [products, setProducts] = useState([]);
  const [AllOrders, setAllOrders] = useState([]);
  const [AllSales, setAllSales] = useState([]);
  const [AllCategory, setAllCategory] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [SelingData, setSellingData] = useState([]);

  const [coverImageModel, setCoverImageModel] = useState(false);
  const [coverUpdatedImage, setUpdatedCoverImage] = useState(true);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const toggleMenu = () => setShowMenu(!showMenu);
  const token = useSelector((state) => state.auth.token);
  const adminProfile = useSelector((state) => state.auth);
  console.log(adminProfile);

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  useEffect(() => {
    if (!token) {
      toast.error("you are not Authentic");
      navigate("/login");
    }
  }, []);

  // ----------Fetch Products
  useEffect(() => {
    socket.emit("join-admin");
    const fetchProducts = async () => {
      try {
        const response = await PrivateAxios.get("/products");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch best selling products
  useEffect(() => {
    const fetchSellingData = async () => {
      const response = await PrivateAxios.get("/sales/best-selling-item");
      if (response.status === 200) {
        setSellingData(response.data.content);
      }
    };
    fetchSellingData();
  }, []);

  const updatedSellingData = SelingData.map((item) => ({
    ...item,
    category: "Best-Selling",
    categoryId: { ...item.categoryId, name: "Best-Selling" },
  }));

  const grouped = updatedSellingData.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    acc[category] = acc[category] || [];
    acc[category].push(item);
    return acc;
  }, {});

  // Fetch Active Orders
  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        const response = await PrivateAxios.get("/orders/active-orders", {
          signal: controller.signal,
        });
        setAllOrders(response.data.content);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching orders:", err);
        }
      }
    };

    fetchOrders();
    socket.on("placed-order", () => {
      playNotificationSound();
      fetchOrders();
    });

    return () => {
      controller.abort();
      socket.off("placed-order");
    };
  }, []);

  // Fetch Sales
  useEffect(() => {
    const controller = new AbortController();
    const fetchSales = async () => {
      try {
        const response = await PrivateAxios.get("/sales", {
          signal: controller.signal,
        });
        setAllSales(response.data.content);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };
    fetchSales();
    return () => controller.abort();
  }, []);

  // Fetch category
  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      try {
        const response = await PrivateAxios.get("/products/category", {
          signal: controller.signal,
        });
        setAllCategory(response.data.content);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
    return () => controller.abort();
  }, []);

  // Fetch Today orders
  useEffect(() => {
    const fetchTodayOrders = async () => {
      try {
        const response = await PrivateAxios.get("/orders/today-orders");
        setTodayOrders(response.data.content);
      } catch (error) {
        console.error("Error fetching today's orders:", error);
      }
    };
    fetchTodayOrders();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todaysOrders = todayOrders.filter(
    (order) => new Date(order.placedAt).toISOString().split("T")[0] === today
  );

  const categorywise = todaysOrders.reduce((acc, item) => {
    const status = item.status;
    acc[status] = acc[status] || [];
    acc[status].push(item);
    return acc;
  }, {});

  const pendingOrders = AllOrders.filter((order) =>
    ["pending", "processing"].includes(order.status)
  );

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.categoryId?.name || "Uncategorized";
    acc[category] = acc[category] || [];
    acc[category].push(product);
    return acc;
  }, {});

  async function uploadCoverImage(e) {
    e.preventDefault();
    const Form = new FormData();
    Form.append("image", coverUpdatedImage);
    const response = await PrivateAxios.post("/auth/CoverImage", Form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      toast.success("Cover-Image updated Successfully");
      setCoverImageModel(false);
    }
  }

  return (
    <div className="min-w-[375px] h-auto relative">
      {adminProfile.user.coverImage ? (
        <img
          src={`${backendUrl}/${adminProfile.user.coverImage}`}
          alt="logo"
          className="w-full object-cover max-h-[250px]"
        />
      ) : (
        <img
          src="/assets/image1.jpg"
          alt="logo"
          className="w-full object-cover max-h-[250px]"
        />
      )}

      <div className="absolute right-0 top-55 border border-white rounded-md">
        <button onClick={() => setCoverImageModel((prev) => !prev)}>
          <Edit2Icon size={20} color="white" className="bg-black text-white" />
        </button>
      </div>
      {coverImageModel && (
        <div className="fixed inset-0 z-50 flex justify-center items-center rounded-md">
          <div className="absolute inset-0 drop-shadow-2xl bg-opacity-30 backdrop-blur-sm"></div>
          <div className="absolute w-[600px] h-[300px] bg-white px-4 rounded-md">
            <h1 className="text-center mt-5 text-xl font-semibold">
              Update Cover Image
            </h1>
            <p className="text-center text-red text-sm">
              After update cover image login Required
            </p>
            <div className="flex justify-center items-center mx-auto ">
              <input
                type="file"
                name="file"
                id=""
                onChange={(e) => setUpdatedCoverImage(e.target.files[0])}
                className="border mt-5 p-2"
              />
            </div>
            <button
              className="mt-10 border p-2 w-full bg-amber-400"
              onClick={uploadCoverImage}
            >
              Upload Image
            </button>
          </div>
        </div>
      )}
      <div className="absolute left-0 top-2">
        <button onClick={toggleMenu}>
          <Menu size={40} color="gray" />
        </button>
        {showMenu && (
          <div className="mt-2 bg-white shadow-lg rounded-md py-2 w-20 border">
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => navigate("/admin/settings")}
            >
              Settings
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-600"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="w-[98%] grid grid-cols-2 md:grid-cols-4 md:justify-center sm:gap-6 mt-5 mb-4 mx-auto relative">
        <StatCard
          name="Today Orders"
          value={todaysOrders}
          imageName={<BsBoxArrowInUp size={40} />}
          route="/admin/today-orders"
          items={categorywise}
        />
        <StatCard
          name="Pending Orders"
          value={pendingOrders}
          imageName={<BsBoxArrowInDownLeft size={40} />}
          route="/admin/pending-orders"
        />
        <StatCard
          name="Total Sale"
          value={AllSales || 0}
          imageName={<MdAttachMoney size={40} />}
          route="/admin/totelsale"
        />
        <StatCard
          name="Total Category"
          value={AllCategory || 0}
          imageName={<TbCategoryPlus size={40} />}
          route="/admin/Category"
        />
      </div>

      <CardView
        products={grouped}
        hideAddToCard={true}
        cardCss="h-[250px]"
        css=" h-auto"
      />
      <CardView
        products={groupedProducts}
        hideAddToCard={true}
        cardCss="h-[261px]"
        css=" h-auto"
      />

      <div className=" sticky bottom-0 left-0 right-0  ">
        <div className="min-w-[343px] lg:w-[98%] mx-auto flex flex-col">
          <Link
            to="/admin/createProduct"
            className="bg-[#F9D718] h-[48px] p-1 text-center rounded font-semibold flex justify-center items-center"
          >
            Create New Item
          </Link>
          <Link
            to="/admin/category"
            className="bg-gray-200 mt-1 h-[48px] p-2 text-center rounded font-semibold flex justify-center items-center"
          >
            Create New Category
          </Link>
        </div>
      </div>
    </div>
  );
};

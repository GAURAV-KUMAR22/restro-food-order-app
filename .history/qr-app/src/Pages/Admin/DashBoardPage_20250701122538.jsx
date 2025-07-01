import React, { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
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
import { loginSuccess, logout } from "../../Redux/Fetures/authSlice";
import { ImSpinner9 } from "react-icons/im";

export const DashBoardPage = () => {
  const [products, setProducts] = useState([]);
  const [AllOrders, setAllOrders] = useState([]);
  const [AllSales, setAllSales] = useState([]);
  const [AllCategory, setAllCategory] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [SelingData, setSellingData] = useState([]);

  const [coverImageModel, setCoverImageModel] = useState(false);
  const [coverUpdatedImage, setUpdatedCoverImage] = useState(null); // ✅ FIXED
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toggleMenu = () => setShowMenu(!showMenu);
  const token = useSelector((state) => state.auth.token);
  const adminProfile = useSelector((state) => state.auth);
  const [uploadProgress, setUploadProgress] = useState(0);
  console.log(uploadProgress);
  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  useEffect(() => {
    if (!token) {
      toast.error("you are not Authentic");
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await PrivateAxios.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    socket.emit("join-admin");
    fetchProducts();
  }, [fetchProducts]);

  const fetchSellingData = useCallback(async () => {
    try {
      const response = await PrivateAxios.get("/sales/best-selling-item");
      if (response.status === 200) {
        setSellingData(response.data.content);
      }
    } catch (err) {
      console.error("Error fetching selling data:", err);
    }
  }, []);

  useEffect(() => {
    fetchSellingData();
  }, [fetchSellingData]);

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

  const fetchOrders = useCallback(async (controller) => {
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
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller);
    socket.on("placed-order", () => {
      playNotificationSound();
      fetchOrders(controller);
    });
    return () => {
      controller.abort();
      socket.off("placed-order");
    };
  }, [fetchOrders]);

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
  const todaysOrders =
    todayOrders?.filter(
      (order) => new Date(order.placedAt).toISOString().split("T")[0] === today
    ) || [];

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

    if (!coverUpdatedImage) {
      toast.error("Please select an image before uploading.");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const form = new FormData();
    form.append("image", coverUpdatedImage);

    try {
      const response = await PrivateAxios.post("/auth/CoverImage", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      if (response.status === 200) {
        setUploadProgress(100);
        toast.success("Cover-Image updated successfully");

        setTimeout(() => {
          dispatch(
            loginSuccess({
              ...adminProfile,
              user: {
                ...adminProfile.user,
                coverImage: response.data.content.coverImage,
              },
            })
          );
          resetModal();
        }, 800);
      }
    } catch (error) {
      toast.error("Upload failed");
      console.error("Cover image upload error:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetModal() {
    setCoverImageModel(false);
    setUpdatedCoverImage(null);
    setUploadProgress(0);
  }

  function handleLogout() {
    dispatch(logout());
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ImSpinner9 className="animate-spin" size={70} />
      </div>
    );
  }

  return (
    <div className="min-w-[375px] h-auto relative">
      <div className="w-[98%] justify-center items-center grid grid-cols-2 md:grid-cols-4 sm:gap-6 mt-5 mb-4 mx-auto">
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
      <div className="sticky bottom-0 left-0 right-0">
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

import React, { useEffect, useState } from "react";
import "./Home.css";
import { CardItem } from "../../components/CardItem";
import { CardDetails } from "../../components/CardDetails";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/Cart/index";
import EventEmitter from "events";
import { CategoryCard } from "../../components/Client/CategoryCard";
import OrderStatusCard from "../../components/Client/OrderStatusCard";
import publicAxios from "../../Services/PublicAxios";
import { socket } from "../../Services/Socket";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import PrivateAxios from "../../Services/PrivateAxios";
import { SearchInput } from "../../components/Client/SearchInput";
import { CardView } from "../../components/Client/CardView";

export const Home = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => (state ? state.cart.cartItems : []));
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [latestOrder, setLatestOrder] = useState([]);
  const [popup, setPopup] = useState(false);
  const [user, setUser] = useState({});

  const [SelingData, setSellingData] = useState([]);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars

  // Fetch Best Selling Item
  useEffect(() => {
    const fetchedBestSellingItem = async () => {
      const response = await publicAxios.get("/sales/best-selling-item");

      if (response.status === 200) {
        setSellingData(response.data.content);
      }
    };
    fetchedBestSellingItem();
  }, []);

  // Best Selling Item Logic
  const updatedSellingData = SelingData.map((item) => {
    return {
      ...item,
      category: "Best-Selling", // ✅ Adds a new field
      // or override nested field:
      categoryId: {
        ...item.categoryId,
        name: "Best-Selling", // ✅ Updates the existing nested name
      },
    };
  });
  let grouped = updatedSellingData.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = []; // ✅ Initialize array
    }
    acc[category].push(item); // ✅ Now safely push the item
    return acc; // ✅ Don't forget to return accumulator
  }, {});

  // Get products
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await publicAxios.get("/products");

        if (response.status !== 200) {
          throw new Error("Response is not okay");
        }
        setProducts(response.data.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Fetch error:", error.message);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      controller.abort();
    };
  }, []);

  // products with category
  const groupedProducts = products?.reduce((acc, product) => {
    const categoryName = product.categoryId?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  const uniqueCategories = [
    ...new Map(
      products.map((item) => [item?.categoryId?.name, item.categoryId])
    ).values(),
  ];

  // Add to card functionality
  const addToCarts = async (product) => {
    if (product.quantity > 0) {
      toast.success("Product added to cart successfully!");
      dispatch(addToCart(product));
    }
  };

  // Calculate total quantity in cart
  const totalQty = cartItems.reduce(
    (sum, item) => sum + (item.quantity ? item.quantity : 0),
    0
  );

  // search functionality
  const filteredGroupedProducts = Object.keys(groupedProducts).reduce(
    (acc, categoryName) => {
      const filteredProducts = groupedProducts[categoryName].filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.categoryId?.name.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredProducts.length > 0) {
        acc[categoryName] = filteredProducts;
      }
      return acc;
    },
    {}
  );

  // Update Order
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const existingUser = storedUser ? JSON.parse(storedUser) : null;

    setUser(existingUser);

    async function fetched(userId) {
      try {
        const res = await publicAxios.get(`/orders/${userId}`);

        if (res.status !== 200) {
          throw new Error("Response failed");
        }

        const orders = res.data.content;

        // Get today's start and end timestamps
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

        // Filter today's orders
        const filteredOrders = orders.filter((order) => {
          const orderDate = new Date(order.placedAt).getTime();
          return orderDate >= startOfDay && orderDate <= endOfDay;
        });

        setLatestOrder(filteredOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        throw new Error("Some error occurred while fetching orders");
      }
    }

    if (existingUser?._id) {
      fetched(existingUser._id);
      socket.emit("join-admin");

      const handleOrderUpdate = (data) => {
        playNotificationSound();
        fetched(existingUser._id);
      };

      socket.on("order-updated-status", handleOrderUpdate);

      return () => {
        socket.off("order-updated-status");
      };
    }
  }, []);

  // Logout User after order
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const allDelivered = latestOrder.every(
        (order) => order.status === "delivered"
      );

      if (allDelivered) {
        const delay = 50 * 60 * 1000;

        setTimeout(() => {
          localStorage.removeItem("user");
          setUser(null);
        }, delay);
      }
    }
  }, [latestOrder]);

  // Best Selling Item fetched
  useEffect(() => {
    const fetchedBestSellingItem = async () => {
      const response = await publicAxios.get("/sales/best-selling-item");
      if (response.status === 200) {
        setSellingData(response.data.content);
      }
    };
    fetchedBestSellingItem();
  }, []);

  // Show Order Status Button
  function handleShowOrder() {
    setPopup((prev) => !prev);
  }
  return (
    <div
      className=" max-w-[100%] mx-auto hide-scrollbar"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Cover Image */}

      <div className="w-full ">
        <img
          src="/assets/cover.png"
          alt="coverimage"
          className="w-full h-full object-cover min-w-[100%] max-h-[500px]"
        />
      </div>

      {/* Show popup If User Logged In */}
      {user && (
        <div className="fixed right-0 top-5 w-14 h-8 bg-yellow-300 rounded-full object-contain flex justify-center items-center text-center ">
          <button onClick={handleShowOrder} className="">
            Order
          </button>
          {popup &&
            latestOrder?.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <OrderStatusCard orderStatus={item} onClose={handleShowOrder} />
              </motion.div>
            ))}
        </div>
      )}

      {/* Search Input */}
      <SearchInput setSearch={setSearch} />

      {/* Category image and name */}
      <CategoryCard uniqueCategories={uniqueCategories} products={products} />

      {/* Search Items */}
      {search && <CardView products={filteredGroupedProducts} />}

      <div className="mb-14">
        <CardView
          products={grouped}
          addToCarts={addToCarts}
          cardCss={"h-[220px]"}
          css={"h-auto"}
        />
        <CardView
          products={groupedProducts}
          addToCarts={addToCarts}
          cardCss={"h-[220px]"}
        />
      </div>

      <div className="fixed bottom-1 left-0 right-0 mx-auto bg-yellow-300 w-[98%] h-[48px] flex justify-center items-center mt-20">
        <Link
          className="flex items-center justify-center text-center gap-1"
          to={"/cart"}
          state={{ cartItems }}
        >
          <span>
            <img
              src="/assets/cart.svg"
              alt="cart"
              className="w-[18px] h-[18px] font-semibold"
            />
          </span>
          Cart
          <span className="font-semibold ml-1 text-center flex justify-center">
            {totalQty}
          </span>
        </Link>
      </div>
    </div>
  );
};

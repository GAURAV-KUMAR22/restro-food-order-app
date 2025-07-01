const Package = () => {
  const [packageItems, setPackageItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const userId = user._id;
  const adminId = user._id;
  const navigate = useNavigate(); // ✅ Hook at the top level of component

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  const handleFetchData = useCallback(async () => {
    try {
      const response = await PrivateAxios.get("/subscription/package");
      if (response.status === 200) {
        setPackageItems(response.data.content);
      } else {
        toast.error("Failed to fetch packages");
      }
    } catch (error) {
      toast.error("An error occurred while fetching packages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  const handleCheckout = async (pkg) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + pkg.durationInDays);

      const { data: orderData } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        {
          amount: pkg.offerPrice || pkg.price,
          packageTitle: pkg.title,
          packageId: pkg._id,
          userId,
          adminId,
          durationInDays: pkg.durationInDays,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      );

      const { id: order_id, amount, currency } = orderData;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Your App Name",
        description: pkg.title,
        order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                packageId: pkg._id,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              }
            );

            if (
              verifyRes.data.message === "Payment verified and plan updated"
            ) {
              toast.success("✅ Payment Successful");
              navigate("/payment-success"); // ✅ Safe to use now
            } else {
              toast.error("❌ Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("❌ Verification error");
          }
        },
        prefill: {
          name: user.name || "User",
          email: user.email || "user@example.com",
        },
        theme: {
          color: "#007BFF",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function () {
        toast.error("❌ Payment failed or cancelled");
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("❌ Failed to initiate payment");
    }
  };

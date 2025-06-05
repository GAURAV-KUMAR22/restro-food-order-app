import axios from 'axios';
import loadRazorpayScript from './LoadRazorPayScript';

const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
        alert("Razorpay SDK failed to load");
        return;
    }

    // Step 1: Create order from backend
    const orderRes = await axios.post('/api/payment/create-order', { amount: 500 });

    const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // frontend Razorpay key
        amount: orderRes.data.amount,
        currency: "INR",
        order_id: orderRes.data.id,
        handler: async function (response) {
            // Step 2: Verify payment
            const verifyRes = await axios.post('/api/payment/verify', response);
            alert(verifyRes.data.message);
        },
        prefill: {
            name: "Gaurav",
            email: "gaurav@example.com",
            contact: "9999999999",
        },
        theme: {
            color: "#3399cc",
        },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
};

import mongoose from "mongoose";

const AdminSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { Timestamp: true });

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;

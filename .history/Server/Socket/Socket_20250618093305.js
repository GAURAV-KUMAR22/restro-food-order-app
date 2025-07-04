export default function socketIo(io) {
  io.on("connection", (socket) => {
    // superAdmin Join Room

    socket.on("join-superadmin", () => {
      socket.join("superadmin-room");
    });

    socket.on("notification", () => {
      io.to("superadmin-room").emit("notification-receved");
    });

    // Admin joins admin room
    socket.on("join-admin", () => {
      socket.join("admin-room");
    });

    // Notify admins about a new order
    socket.on("order-placed", () => {
      io.to("admin-room").emit("placed-order", () => {});
    });

    // Notify admins about order status update
    socket.on("order-updated", () => {
      io.to("admin-room").emit("order-updated-status");
    });

    socket.on("disconnect", () => {});
  });
}

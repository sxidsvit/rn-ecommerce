import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import cors from "cors";

import { functions, inngest } from "./src/config/inngest.js";

import { ENV } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";

import adminRoutes from "./src/routes/admin.route.js";
import userRoutes from "./src/routes/user.route.js";
import orderRoutes from "./src/routes/order.route.js";
import reviewRoutes from "./src/routes/review.route.js";
import productRoutes from "./src/routes/product.route.js";
import cartRoutes from "./src/routes/cart.route.js";

connectDB();

const app = express();


app.use(express.json());
app.use(clerkMiddleware()); // adds auth object under the req => req.auth
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      ENV.CLIENT_URL,
      // Explicitly allow the admin frontend URL which was blocked
      "https://rn-ecommerce-admin.vercel.app",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Allow all .vercel.app subdomains and Inngest for webhooks
      if (origin.endsWith(".vercel.app") || origin.includes("inngest.com")) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`), false);
      }
    }
  },
  credentials: true,
  // Crucial for Vercel/serverless environments to ensure the preflight OPTIONS request returns a 200 OK
  optionsSuccessStatus: 200
})); // credentials: true allows the browser to send the cookies to the server with the request

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success", headers: JSON.stringify(req.headers, null, 2) });
});

// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
//   } catch (error) {
//     console.error("💥 Error starting the server", error);
//   }
// };

// startServer();

export default app;
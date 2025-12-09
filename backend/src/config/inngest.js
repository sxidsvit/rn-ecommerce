import { Inngest } from "inngest";
// import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "rn-ecommerce" });

const syncUser = inngest.createFunction(
  { id: "sync-user", name: "Sync User from Clerk" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    console.log("--- Starting syncUser function ---");
    console.log("Received Clerk event data:", event.data);

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: name,
      imageUrl: image_url,
      addresses: [],
      wishlist: [],
    };

    console.log("New user data prepared:", newUser);

    const createdUser = await User.create(newUser);

    console.log("User successfully created in MongoDB:", createdUser._id);

    return { success: true, userId: createdUser._id };
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserFromDB];

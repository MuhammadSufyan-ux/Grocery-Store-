import dotenv from "dotenv";
import connectDB from "../config/database.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to database
        await connectDB();

        // Default admin credentials
        const adminData = {
            name: "Admin User",
            email: "admin@grocerystore.com",
            password: "admin123",
            role: "admin",
            isActive: true,
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            console.log("Admin user already exists!");
            console.log("Email:", adminData.email);
            console.log("To reset password, delete the user from database and run this script again.");
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create(adminData);

        console.log("=".repeat(50));
        console.log("Admin user created successfully!");
        console.log("=".repeat(50));
        console.log("Email:", admin.email);
        console.log("Password: admin123");
        console.log("Role:", admin.role);
        console.log("=".repeat(50));
        console.log("Please change the password after first login!");
        console.log("=".repeat(50));

        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();


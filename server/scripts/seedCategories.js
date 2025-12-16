import dotenv from "dotenv";
import connectDB from "../config/database.js";
import Category from "../models/Category.js";

dotenv.config();

const categories = [
    {
        name: "Fruits",
        description: "Fresh fruits and organic produce",
        image: "https://via.placeholder.com/300x300.png?text=Fruits",
        order: 1,
    },
    {
        name: "Vegetables",
        description: "Fresh vegetables and greens",
        image: "https://via.placeholder.com/300x300.png?text=Vegetables",
        order: 2,
    },
    {
        name: "Dairy & Eggs",
        description: "Milk, cheese, yogurt, and eggs",
        image: "https://via.placeholder.com/300x300.png?text=Dairy",
        order: 3,
    },
    {
        name: "Meat & Seafood",
        description: "Fresh meat, poultry, and seafood",
        image: "https://via.placeholder.com/300x300.png?text=Meat",
        order: 4,
    },
    {
        name: "Bakery",
        description: "Fresh bread, pastries, and baked goods",
        image: "https://via.placeholder.com/300x300.png?text=Bakery",
        order: 5,
    },
    {
        name: "Beverages",
        description: "Drinks, juices, and beverages",
        image: "https://via.placeholder.com/300x300.png?text=Beverages",
        order: 6,
    },
    {
        name: "Snacks",
        description: "Chips, crackers, and snack items",
        image: "https://via.placeholder.com/300x300.png?text=Snacks",
        order: 7,
    },
    {
        name: "Pantry Staples",
        description: "Rice, pasta, canned goods, and essentials",
        image: "https://via.placeholder.com/300x300.png?text=Pantry",
        order: 8,
    },
];

const subCategories = {
    "Fruits": [
        { name: "Apples", order: 1 },
        { name: "Bananas", order: 2 },
        { name: "Citrus Fruits", order: 3 },
        { name: "Berries", order: 4 },
        { name: "Tropical Fruits", order: 5 },
        { name: "Stone Fruits", order: 6 },
    ],
    "Vegetables": [
        { name: "Leafy Greens", order: 1 },
        { name: "Root Vegetables", order: 2 },
        { name: "Tomatoes & Peppers", order: 3 },
        { name: "Cruciferous", order: 4 },
        { name: "Squash & Gourds", order: 5 },
        { name: "Onions & Garlic", order: 6 },
    ],
    "Dairy & Eggs": [
        { name: "Milk", order: 1 },
        { name: "Cheese", order: 2 },
        { name: "Yogurt", order: 3 },
        { name: "Butter & Margarine", order: 4 },
        { name: "Eggs", order: 5 },
        { name: "Cream", order: 6 },
    ],
    "Meat & Seafood": [
        { name: "Beef", order: 1 },
        { name: "Chicken", order: 2 },
        { name: "Pork", order: 3 },
        { name: "Lamb", order: 4 },
        { name: "Fish", order: 5 },
        { name: "Seafood", order: 6 },
    ],
    "Bakery": [
        { name: "Bread", order: 1 },
        { name: "Pastries", order: 2 },
        { name: "Cakes", order: 3 },
        { name: "Cookies", order: 4 },
        { name: "Bagels", order: 5 },
        { name: "Muffins", order: 6 },
    ],
    "Beverages": [
        { name: "Juices", order: 1 },
        { name: "Soft Drinks", order: 2 },
        { name: "Water", order: 3 },
        { name: "Tea", order: 4 },
        { name: "Coffee", order: 5 },
        { name: "Energy Drinks", order: 6 },
    ],
    "Snacks": [
        { name: "Chips", order: 1 },
        { name: "Nuts & Seeds", order: 2 },
        { name: "Crackers", order: 3 },
        { name: "Candy & Chocolate", order: 4 },
        { name: "Popcorn", order: 5 },
        { name: "Dried Fruits", order: 6 },
    ],
    "Pantry Staples": [
        { name: "Rice & Grains", order: 1 },
        { name: "Pasta", order: 2 },
        { name: "Canned Goods", order: 3 },
        { name: "Oils & Vinegars", order: 4 },
        { name: "Spices & Seasonings", order: 5 },
        { name: "Flour & Baking", order: 6 },
    ],
};

const seedCategories = async () => {
    try {
        // Connect to database
        await connectDB();

        console.log("Starting category seeding...");

        // Clear existing categories
        await Category.deleteMany({});
        console.log("Cleared existing categories");

        // Create main categories
        const createdMainCategories = {};
        for (const categoryData of categories) {
            // Check if category already exists
            const existing = await Category.findOne({ name: categoryData.name });
            if (existing) {
                console.log(`Category "${categoryData.name}" already exists, skipping...`);
                createdMainCategories[categoryData.name] = existing;
                continue;
            }

            const category = await Category.create(categoryData);
            createdMainCategories[categoryData.name] = category;
            console.log(`✓ Created main category: ${category.name}`);
        }

        // Create sub-categories
        let subCategoryCount = 0;
        for (const [parentName, subs] of Object.entries(subCategories)) {
            const parentCategory = createdMainCategories[parentName];
            if (!parentCategory) {
                console.log(`⚠ Parent category "${parentName}" not found, skipping sub-categories...`);
                continue;
            }

            for (const subData of subs) {
                // Check if sub-category already exists
                const existing = await Category.findOne({
                    name: subData.name,
                    parentCategory: parentCategory._id,
                });
                if (existing) {
                    console.log(`  Sub-category "${subData.name}" already exists, skipping...`);
                    continue;
                }

                await Category.create({
                    name: subData.name,
                    description: `${subData.name} under ${parentName}`,
                    parentCategory: parentCategory._id,
                    order: subData.order,
                    // Sub-categories don't require images, so we omit the image field
                });
                subCategoryCount++;
                console.log(`  ✓ Created sub-category: ${subData.name} (under ${parentName})`);
            }
        }

        // Summary
        const totalMainCategories = Object.keys(createdMainCategories).length;
        const totalCategories = await Category.countDocuments();

        console.log("\n" + "=".repeat(50));
        console.log("Category seeding completed!");
        console.log("=".repeat(50));
        console.log(`Main Categories: ${totalMainCategories}`);
        console.log(`Sub-Categories: ${subCategoryCount}`);
        console.log(`Total Categories: ${totalCategories}`);
        console.log("=".repeat(50));

        process.exit(0);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
};

seedCategories();


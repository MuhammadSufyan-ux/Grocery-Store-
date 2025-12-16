import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        paymentMethods: {
            bankTransfer: {
                enabled: {
                    type: Boolean,
                    default: false,
                },
                label: {
                    type: String,
                    default: "Bank Local Transfer",
                },
                bankDetails: {
                    accountName: { type: String, default: "" },
                    accountNumber: { type: String, default: "" },
                    bankName: { type: String, default: "" },
                    iban: { type: String, default: "" },
                    swiftCode: { type: String, default: "" },
                    branchName: { type: String, default: "" },
                    routingNumber: { type: String, default: "" },
                    additionalInfo: { type: String, default: "" },
                },
            },
            cod: {
                enabled: {
                    type: Boolean,
                    default: true, // COD is enabled by default
                },
                label: {
                    type: String,
                    default: "Cash on Delivery",
                },
                instructions: {
                    type: String,
                    default: "",
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({
            paymentMethods: {
                bankTransfer: {
                    enabled: false,
                    label: "Bank Local Transfer",
                    bankDetails: {
                        accountName: "",
                        accountNumber: "",
                        bankName: "",
                        iban: "",
                        swiftCode: "",
                        branchName: "",
                        routingNumber: "",
                        additionalInfo: "",
                    },
                },
                cod: {
                    enabled: true,
                    label: "Cash on Delivery",
                    instructions: "",
                },
            },
        });
    }
    return settings;
};

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;


import Settings from "../models/Settings.js";

// @desc    Get settings
// @route   GET /api/settings
// @access  Public (for checkout page)
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();

        res.status(200).json({
            success: true,
            settings: {
                paymentMethods: settings.paymentMethods,
            },
        });
    } catch (error) {
        console.error("Get settings error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private (Admin only)
export const updateSettings = async (req, res) => {
    try {
        const { paymentMethods } = req.body;

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({
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

        // Update payment methods if provided
        if (paymentMethods) {
            if (paymentMethods.bankTransfer !== undefined) {
                // Deep merge bank details
                if (paymentMethods.bankTransfer.bankDetails !== undefined) {
                    settings.paymentMethods.bankTransfer.bankDetails = {
                        ...settings.paymentMethods.bankTransfer.bankDetails,
                        ...paymentMethods.bankTransfer.bankDetails,
                    };
                }
                // Update other bank transfer fields
                if (paymentMethods.bankTransfer.enabled !== undefined) {
                    settings.paymentMethods.bankTransfer.enabled = paymentMethods.bankTransfer.enabled;
                }
                if (paymentMethods.bankTransfer.label !== undefined) {
                    settings.paymentMethods.bankTransfer.label = paymentMethods.bankTransfer.label;
                }
            }
            if (paymentMethods.cod !== undefined) {
                settings.paymentMethods.cod = {
                    ...settings.paymentMethods.cod,
                    ...paymentMethods.cod,
                };
            }
        }

        await settings.save();

        res.status(200).json({
            success: true,
            settings: {
                paymentMethods: settings.paymentMethods,
            },
            message: "Settings updated successfully",
        });
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


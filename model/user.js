import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["startup", "investor"],
      required: true,
    },

    // Basic Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },

    // Startup-specific fields
    startup: {
      companyName: String,
      industry: String,
      fundingStage: String,
      companyDescription: String,
      website: String,
      foundedYear: Number,
      teamSize: String,
      location: String,
      businessLogo: String,
      targetFund: String,
      pan: String,
      evaluation: String,
      taxclearance: String,
      bankstatement: String,
      auditreport: String,
    },

    // Investor-specific fields
    investor: {
      investorType: String,
      investmentRange: String,
      preferredSectors: [String],
      investmentExperience: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);

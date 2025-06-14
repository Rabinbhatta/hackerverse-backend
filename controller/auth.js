import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    role,
    // Startup fields
    companyName,
    industry,
    fundingStage,
    companyDescription,
    website,
    foundedYear,
    teamSize,
    location,
    targetFund,
    pan,
    evaluation,
    // Investor fields
    investorType,
    investmentRange,
    preferredSectors,
    investmentExperience,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Build the user object dynamically based on the role
    const userData = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
    };

    if (role === "startup") {
      userData.startup = {
        companyName,
        industry,
        fundingStage,
        companyDescription,
        website,
        foundedYear: foundedYear ? Number(foundedYear) : undefined,
        teamSize: teamSize ? Number(teamSize) : undefined,
        location,
        targetFund: targetFund ? Number(targetFund) : undefined,
        pan,
        evaluation: evaluation ? Number(evaluation) : undefined,
      };

      const files = req.files || {};
      const uploadPromises = [];

      // Generic upload function
      if (files.businessLogo) {
        console.log(files.businessLogo.tempFilePath);
        const business_url = await cloudinary.v2.uploader.upload(
          files.businessLogo.tempFilePath
        );
        if (business_url) {
          userData.startup = { businessLogo: business_url.url };
        }
      }
    }

    if (role === "investor") {
      userData.investor = {
        investorType,
        investmentRange,
        preferredSectors: preferredSectors
          ? JSON.parse(preferredSectors)
          : undefined,
        investmentExperience,
      };
    }

    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: `${role} registered successfully.` });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

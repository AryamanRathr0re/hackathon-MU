import express from "express";
import { body, validationResult } from "express-validator";
import Lead from "../models/Lead.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/leads
// @desc    Get all leads
// @access  Private
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      source,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = { owner: req.user._id };

    if (status) {
      query.status = status;
    }
    if (source) {
      query.source = source;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const leads = await Lead.find(query)
      .populate("owner", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   GET /api/leads/:id
// @desc    Get single lead
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check if user owns the lead or is admin/manager
    if (
      lead.owner._id.toString() !== req.user._id.toString() &&
      !["admin", "manager"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this lead",
      });
    }

    res.json({
      success: true,
      ...lead.toObject(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   POST /api/leads
// @desc    Create new lead
// @access  Private
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("status")
      .optional()
      .isIn([
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost",
      ])
      .withMessage("Invalid status"),
    body("source")
      .optional()
      .isIn(["website", "referral", "social_media", "email", "phone", "other"])
      .withMessage("Invalid source"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const leadData = {
        ...req.body,
        owner: req.user._id,
      };

      const lead = await Lead.create(leadData);
      await lead.populate("owner", "name email");

      res.status(201).json({
        success: true,
        ...lead.toObject(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
);

// @route   PUT /api/leads/:id
// @desc    Update lead
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check if user owns the lead or is admin/manager
    if (
      lead.owner.toString() !== req.user._id.toString() &&
      !["admin", "manager"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this lead",
      });
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("owner", "name email");

    res.json({
      success: true,
      ...lead.toObject(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check if user owns the lead or is admin/manager
    if (
      lead.owner.toString() !== req.user._id.toString() &&
      !["admin", "manager"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this lead",
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

export default router;

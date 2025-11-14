import express from "express";
import { body, validationResult } from "express-validator";
import Activity from "../models/Activity.js";
import Lead from "../models/Lead.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/activities/lead/:leadId
// @desc    Get all activities for a lead
// @access  Private
router.get("/lead/:leadId", async (req, res) => {
  try {
    // Check if lead exists and user has access
    const lead = await Lead.findById(req.params.leadId);
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
        message: "Not authorized to access this lead's activities",
      });
    }

    const activities = await Activity.find({ lead: req.params.leadId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   POST /api/activities
// @desc    Create new activity
// @access  Private
router.post(
  "/",
  [
    body("type")
      .isIn(["note", "call", "meeting", "email", "task"])
      .withMessage("Invalid activity type"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("lead").notEmpty().withMessage("Lead ID is required"),
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

      // Check if lead exists and user has access
      const lead = await Lead.findById(req.body.lead);
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
          message: "Not authorized to create activity for this lead",
        });
      }

      const activityData = {
        ...req.body,
        createdBy: req.user._id,
      };

      const activity = await Activity.create(activityData);
      await activity.populate("createdBy", "name email");
      await activity.populate("lead", "name email");

      res.status(201).json({
        success: true,
        ...activity.toObject(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
);

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Check if user created the activity or is admin/manager
    if (
      activity.createdBy.toString() !== req.user._id.toString() &&
      !["admin", "manager"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this activity",
      });
    }

    activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name email")
      .populate("lead", "name email");

    res.json({
      success: true,
      ...activity.toObject(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Check if user created the activity or is admin/manager
    if (
      activity.createdBy.toString() !== req.user._id.toString() &&
      !["admin", "manager"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this activity",
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

export default router;

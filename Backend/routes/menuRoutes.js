const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const verifyAdmin = require("../middleware/authMiddleware");

// GET ALL MENU ITEMS
router.get("/menu", async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({
      category: 1,
      createdAt: 1,
    });

    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu:", error);

    res.status(500).json({
      message: "Failed to fetch menu.",
    });
  }
});


// ADD NEW DISH
router.post("/menu", verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      available,
    } = req.body;

    const menuItem = new Menu({
      name,
      description,
      price,
      category,
      image,
      available,
    });

    await menuItem.save();

    res.status(201).json(menuItem);

  } catch (error) {
    console.error("Error adding menu item:", error);

    res.status(500).json({
      message: "Failed to add menu item.",
    });
  }
});


// UPDATE DISH
router.patch("/menu/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: "Menu item not found.",
      });
    }

    res.json(updatedItem);

  } catch (error) {
    console.error("Error updating menu item:", error);

    res.status(500).json({
      message: "Failed to update menu item.",
    });
  }
});


// DELETE DISH
router.delete("/menu/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(
      req.params.id
    );

    if (!deletedItem) {
      return res.status(404).json({
        message: "Menu item not found.",
      });
    }

    res.json({
      message: "Menu item deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting menu item:", error);

    res.status(500).json({
      message: "Failed to delete menu item.",
    });
  }
});


module.exports = router;
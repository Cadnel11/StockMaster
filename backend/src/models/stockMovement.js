const mongoose = require("mongoose");


const StockMovementSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    type: {
      type: String,
      enum: ["add", "remove"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "La quantité doit être positive"],
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("stockMovement", StockMovementSchema);
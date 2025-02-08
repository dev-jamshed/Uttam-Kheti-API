import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../../controllers/customer/wishlist.controller.js";
import validate from "../../middlewares/validation/validation.middleware.js";
import { addToWishlistSchema } from "../../validations/wishlist/addToWishlist.validation.js";
import { verifyCustomer } from "../../middlewares/customer/verifyCustomer.middleware.js";

const router = express.Router();

router.post("/", verifyCustomer, validate(addToWishlistSchema), addToWishlist);
router.get("/", verifyCustomer, getWishlist);
router.delete("/:id", verifyCustomer, removeFromWishlist);

export default router;

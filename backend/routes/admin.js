const express = require("express");
const authenticateAdmin = require("../middleware/auth");

const router = express.Router();

router.post("/login", authenticateAdmin, (req, res) => {
  res.json({ success: true, message: "Login bem-sucedido!" });
});

module.exports = router;

const ADMIN_USER = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

module.exports = function authenticateAdmin(req, res, next) {
  const { email, password } = req.body;

  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    next();
  } else {
    res
      .status(401)
      .json({ success: false, message: "Email ou senha incorretos." });
  }
};

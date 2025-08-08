const path = require("path");

module.exports.validateCadastro = (req, res, next) => {
  const requiredFields = [
    "nome",
    "email",
    "data",
    "senha",
    "confirmarSenha",
    "telefone",
    "cpf",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ error: `Campo obrigatório faltando: ${field}` });
    }
  }

  if (req.body.senha !== req.body.confirmarSenha) {
    return res.status(400).json({ error: "As senhas não coincidem." });
  }

  next();
};

module.exports.fileUploadFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    cb(new Error("Apenas arquivos PDF são permitidos."));
  } else {
    cb(null, true);
  }
};

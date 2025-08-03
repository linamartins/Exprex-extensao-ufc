// Importa as dependências
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware para permitir requisições de outras origens
app.use(cors());

// Middleware para processar JSON no corpo da requisição
app.use(express.json());

// Dados de administrador fixos (simulando um banco de dados)
const ADMIN_USER = {
  email: "admin@exprex.com",
  password: "senhaSegura123",
};

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Arquivo para armazenar os editais
const editaisFilePath = path.join(__dirname, "editais.json");
if (!fs.existsSync(editaisFilePath)) {
  fs.writeFileSync(editaisFilePath, JSON.stringify([]));
}

// ---- ROTAS DA API ----
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    res.status(200).json({ success: true, message: "Login bem-sucedido!" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Email ou senha incorretos." });
  }
});

app.post("/publicar-edital", upload.single("arquivoEdital"), (req, res) => {
  const {
    titulo,
    orientador,
    dataPublicacao,
    inscricoesAte,
    localizacao,
    periodo,
    vagasRemuneradas,
    vagasVoluntarias,
    cursos,
    contato,
    descricao,
  } = req.body;
  const pdfFile = req.file;

  if (
    !titulo ||
    !orientador ||
    !dataPublicacao ||
    !inscricoesAte ||
    !localizacao ||
    !periodo ||
    !vagasRemuneradas ||
    !vagasVoluntarias ||
    !cursos ||
    !contato ||
    !descricao ||
    !pdfFile
  ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const novoEdital = {
    id: Date.now(),
    titulo,
    orientador,
    dataPublicacao,
    inscricoesAte,
    localizacao,
    periodo,
    vagasRemuneradas,
    vagasVoluntarias,
    cursos,
    contato,
    descricao,
    pdf_url: `/uploads/${pdfFile.filename}`,
  };

  try {
    const editais = JSON.parse(fs.readFileSync(editaisFilePath, "utf-8"));
    editais.push(novoEdital);
    fs.writeFileSync(editaisFilePath, JSON.stringify(editais, null, 2));
    res
      .status(201)
      .json({ message: "Edital publicado com sucesso!", edital: novoEdital });
  } catch (error) {
    console.error("Erro ao salvar o edital:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao salvar o edital." });
  }
});

app.get("/editais", (req, res) => {
  try {
    const editais = JSON.parse(fs.readFileSync(editaisFilePath, "utf-8"));
    res.status(200).json(editais);
  } catch (error) {
    console.error("Erro ao ler o arquivo de editais:", error);
    res.status(200).json([]); // Retorna array vazio em caso de erro
  }
});

// ---- ROTA DE EXCLUSÃO ----
app.delete("/editais/:id", (req, res) => {
  const editalId = parseInt(req.params.id);

  try {
    let editais = JSON.parse(fs.readFileSync(editaisFilePath, "utf-8"));

    const editalParaExcluir = editais.find((edital) => edital.id === editalId);

    if (!editalParaExcluir) {
      return res.status(404).json({ error: "Edital não encontrado." });
    }

    editais = editais.filter((edital) => edital.id !== editalId);
    fs.writeFileSync(editaisFilePath, JSON.stringify(editais, null, 2));

    const pdfPath = path.join(__dirname, editalParaExcluir.pdf_url);
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    res.status(200).json({ message: "Edital excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir o edital:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao excluir o edital." });
  }
});

// Servir arquivos estáticos (páginas HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "/")));

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

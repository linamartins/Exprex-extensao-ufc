const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const editaisFilePath = path.join(__dirname, "../data/editais.json");


// Implementado filtro no back
module.exports = (upload) => {
  router.get("/", (req, res) => {
  const editais = JSON.parse(fs.readFileSync(editaisFilePath, "utf-8") || "[]");
  const termo = req.query.q?.toLowerCase();

  if (termo) {
    const filtrados = editais.filter((edital) =>
      edital.titulo.toLowerCase().includes(termo) ||
      edital.orientador.toLowerCase().includes(termo) ||
      edital.descricao.toLowerCase().includes(termo) ||
      edital.cursos.toLowerCase().includes(termo)
    );
    return res.json(filtrados);
  }

  res.json(editais);
});

  router.post("/publicar", upload.single("arquivoEdital"), (req, res) => {
    const camposObrigatorios = [
      "titulo",
      "orientador",
      "dataPublicacao",
      "inscricoesAte",
      "localizacao",
      "periodo",
      "vagasRemuneradas",
      "vagasVoluntarias",
      "cursos",
      "contato",
      "descricao",
    ];

    for (const campo of camposObrigatorios) {
      if (!req.body[campo]) {
        return res
          .status(400)
          .json({ error: `Faltando o campo obrigatório: ${campo}` });
      }
    }

    const edital = {
      ...req.body,
      id: Date.now(),
      pdf_url: `/uploads/${req.file.filename}`,
    };

    const editais = JSON.parse(
      fs.readFileSync(editaisFilePath, "utf-8") || "[]"
    );
    editais.push(edital);
    fs.writeFileSync(editaisFilePath, JSON.stringify(editais, null, 2));

    res.status(201).json({ message: "Edital publicado com sucesso!", edital });
  });

  router.delete("/:id", (req, res) => {
    let editais = JSON.parse(fs.readFileSync(editaisFilePath, "utf-8") || "[]");
    const editalId = parseInt(req.params.id);
    const editalIndex = editais.findIndex((e) => e.id === editalId);

    if (editalIndex === -1) {
      return res.status(404).json({ error: "Edital não encontrado." });
    }

    const [editalRemovido] = editais.splice(editalIndex, 1);
    fs.writeFileSync(editaisFilePath, JSON.stringify(editais, null, 2));

    const pdfPath = path.join(__dirname, "../", editalRemovido.pdf_url);
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);

    res.json({ message: "Edital excluído com sucesso!" });
  });

  return router;
};

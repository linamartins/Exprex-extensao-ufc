# Exprex

Este repositório contém o código de uma aplicação desenvolvida na disciplina de Projeto Integrado I, com o objetivo de divulgar os editais da PREX/UFC. A aplicação visa facilitar o compartilhamento e o acesso a esses editais, bem como às oportunidades de participação disponíveis para docentes da Universidade Federal do Ceará.

O sistema foi projetado para apoiar a organização e a publicação dos editais, promovendo maior transparência e acessibilidade. Além disso, oferece às alunas informações importantes sobre cronogramas, materiais de apoio e demais conteúdos relacionados às atividades e processos seletivos vinculados ao projeto.

---

## 👩‍💻 Autores

- **Arthur Hugo Alves Lima** — Sistemas e Mídias Digitais, UFC
- **Lina dos Santos Martins** — Sistemas e Mídias Digitais, UFC
- **Joao Pedro Mesquita Abreu** — Sistemas e Mídias Digitais, UFC
- **Sofia Leandra Da Silva Viana** — Sistemas e Mídias Digitais, UFC

---

## 🚀 Sobre

**Exprex** é uma aplicação que visa facilitar o compartilhamento e o acesso a editais.

- **Backend**: `Node.js` + `Express`
- **Upload**: `Multer`
- **Frontend**: `Vanilla JavaScript` (JavaScript puro)
- **Armazenamento de Dados**: Arquivo `db.json`

---

## ✅ Requisitos Funcionais

| ID   | Título                               | Backend                                                            | Frontend                                                                                                    | Comunicação (API)                             | Prioridade |
| :--- | :----------------------------------- | :----------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :--------- |
| RF01 | Abrir modal de projeto               | N/A                                                                | Clique em "Ver mais" exibe modal com informações detalhadas.                                                | `GET` para `http://localhost:3000/editais/:id`| Alta       |
| RF02 | Fechar modal ao clicar fora ou ESC   | N/A                                                                | Modal se fecha ao clicar fora do conteúdo ou ao pressionar a tecla ESC.                                     | N/A                                           | Alta       |
| RF03 | Abrir modal de login                 | N/A                                                                | Clique em "Área Administrativa" abre o modal de login.                                                      | N/A                                           | Alta       |
| RF04 | Alternar entre login e cadastro      | N/A                                                                | O botão "Cadastrar" redireciona para a página de cadastro (`cadastrar.html`), não alterna dentro do modal.   | N/A                                           | Média      |
| RF05 | Simular autenticação (login)         | Verificação de credenciais fixas.                                  | Salva `isLoggedIn: true` no `localStorage`.                                                                 | `POST` para `http://localhost:3000/admin/login`| Alta       |
| RF06 | Redirecionar após login              | N/A                                                                | Após login, a tela é atualizada para exibir as opções de admin.                                             | N/A                                           | Alta       |
| RF07 | Proteger acesso ao painel            | N/A                                                                | A interface de `index.html` exibe botões de admin apenas se o `localStorage` contiver o `isLoggedIn`.       | N/A                                           | Alta       |
| RF08 | Logout do sistema                    | N/A                                                                | O botão "Sair" limpa o `localStorage` e recarrega a página.                                                 | N/A                                           | Alta       |
| RF09 | Adicionar edital                     | Adiciona o edital ao arquivo `db.json` e o PDF na pasta `uploads`. | N/A                                                                                                         | `POST` para `http://localhost:3000/publicar-edital`| Alta       |
| RF10 | Destaque visual nos botões           | N/A                                                                | O `hover` muda a cor de fundo dos botões para reforçar a ação do usuário.                                   | N/A                                           | Média      |
| RF11 | Proteger acesso via `localStorage`   | N/A                                                                | O `script.js` verifica o `localStorage` ao carregar a página para controlar a exibição dos botões de admin. | N/A                                           | Alta       |
| RF12 | Excluir edital                       | Remove o edital do arquivo `db.json`.                              | N/A                                                                                                         | `DELETE` para `http://localhost:3000/editais/:id`| Alta       |
| RF13 | Listar editais                       | O servidor responde à requisição com todos os editais.             | A página carrega todos os editais disponíveis ao ser aberta.                                                | `GET` para `http://localhost:3000/editais`    | Alta       |
| RF14 | Pesquisar editais                    | O servidor filtra os editais com base no termo de busca.           | O formulário de busca envia o termo para a API e exibe os resultados.                                       | `GET` para `http://localhost:3000/editais?q=termo_busca`| Média      |

---

### 🛠 Tecnologias Detalhadas

- **Backend**: `Node.js` + `Express`
  - **O que fazemos:** Usamos o Express para criar o servidor e definir as rotas que gerenciam a busca, publicação e exclusão dos editais.
- **Upload de arquivos**: `Multer`
  - **O que fazemos:** Usamos o Multer para processar os arquivos PDF enviados pelo formulário. Ele garante que os arquivos sejam salvos corretamente na pasta `uploads`.
- **Armazenamento de Dados**: Arquivo `db.json`
  - **O que fazemos:** Em vez de usar um banco de dados tradicional (como SQL ou NoSQL), o projeto utiliza um arquivo JSON simples (`db.json`) para persistir e armazenar os dados dos editais. Ele funciona como o banco de dados do projeto.
- **Frontend**: `Vanilla JavaScript` (JavaScript puro)
  - **O que fazemos:** Toda a lógica para abrir e fechar modais, carregar os cards e gerenciar os eventos de clique é feita com JavaScript puro.
- **Autenticação**: Lógica de login manual
  - **O que fazemos:** O login é um processo simples onde o email e a senha são comparados a valores fixos no código do backend, sem o uso de tokens.

---

## ⚙️ Como Rodar o Projeto

Siga estes passos para configurar e executar a aplicação em sua máquina local.

### Pré-requisitos

Certifique-se de ter o `Node.js` e o `npm` (gerenciador de pacotes do Node) instalados.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/linamartins/Exprex-extensao-ufc.git](https://github.com/linamartins/Exprex-extensao-ufc.git)
    cd Exprex-extensao-ufc
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor:**
    ```bash
    npm start
    ```
    Ou, se preferir:
    ```bash
    node server.js
    ```
    O servidor será iniciado e ficará disponível em `http://localhost:3000`.

4.  **Acesse o frontend:**
    Abra o arquivo `index.html` em seu navegador web preferido.

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

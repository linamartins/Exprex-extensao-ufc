document.addEventListener("DOMContentLoaded", function () {
  // --- Funções Comuns ---
  function updateAdminUI() {
    const adminOptions = document.getElementById("admin-options");
    const openAdminLoginBtn = document.getElementById("open-admin-login");
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (adminOptions && openAdminLoginBtn) {
      if (loggedIn) {
        adminOptions.classList.remove("hidden");
        openAdminLoginBtn.classList.add("hidden");
      } else {
        adminOptions.classList.add("hidden");
        openAdminLoginBtn.classList.remove("hidden");
      }
    }
  }

  // Lógica para a página inicial (index.html)
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
  ) {
    const adminLoginModal = document.getElementById("admin-login-modal");
    const openAdminLoginBtn = document.getElementById("open-admin-login");
    const adminLoginForm = document.getElementById("admin-login-form");
    const adminLoginError = document.getElementById("admin-login-error");
    const adminOptions = document.getElementById("admin-options");
    const adminGreeting = document.getElementById("admin-greeting");
    const adminMenuDropdown = document.getElementById("admin-menu-dropdown");
    const sairBtn = document.getElementById("btn-sair");
    const publicarEditalBtn = document.getElementById("btn-publicar-edital");
    const cadastrarBtn = document.getElementById("btn-cadastrar");
    const closeButton = document.querySelector(
      "#admin-login-modal .close-button"
    );
    const containerCards = document.getElementById("container-cards");
    const searchForm = document.querySelector(".search-form");
    const searchInput = document.getElementById("search-input");

    let allEditais = [];

    function renderizarEditais(editaisParaExibir) {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      containerCards.innerHTML = "";
      if (editaisParaExibir.length === 0) {
        containerCards.innerHTML = "<p>Nenhum edital encontrado.</p>";
      } else {
        editaisParaExibir.forEach((edital) => {
          const card = document.createElement("div");
          card.className = "card";

          const adminActions = loggedIn
            ? `<button class="delete-button action-button" data-id="${edital.id}">Excluir</button>`
            : "";

          card.innerHTML = `
            <div class="card-content">
              <span class="card-title">${edital.titulo}</span>
              <div class="card-info">
                <span>Orientador: ${edital.orientador}</span>
                <span>Inscrições até: ${edital.inscricoesAte}</span>
              </div>
              <div class="card-bottom">
                <div class="card-location">
                  <img src="img/location_on.png" alt="Localização">
                  <span>${edital.localizacao.split("-")[0]}</span>
                </div>
                <div class="admin-actions">
                  <button class="card-link action-button" data-id="${
                    edital.id
                  }">Ver mais</button>
                  ${adminActions}
                </div>
              </div>
            </div>
          `;
          containerCards.appendChild(card);
        });
      }
    }

    async function carregarEditais() {
      if (!containerCards) return;

      try {
        const response = await fetch("http://localhost:3000/editais");
        if (!response.ok) {
          throw new Error(`Erro de rede: ${response.status}`);
        }
        allEditais = await response.json();
        renderizarEditais(allEditais);
      } catch (error) {
        console.error("Erro ao carregar editais:", error);
        containerCards.innerHTML =
          "<p>Não foi possível carregar os editais.</p>";
      }
    }

    if (searchForm) {
      searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const termoBusca = searchInput.value.toLowerCase();

        const editaisFiltrados = allEditais.filter((edital) => {
          return (
            edital.titulo.toLowerCase().includes(termoBusca) ||
            edital.orientador.toLowerCase().includes(termoBusca) ||
            edital.descricao.toLowerCase().includes(termoBusca) ||
            edital.cursos.toLowerCase().includes(termoBusca)
          );
        });

        renderizarEditais(editaisFiltrados);
      });
    }

    if (openAdminLoginBtn) {
      openAdminLoginBtn.addEventListener("click", () =>
        adminLoginModal.classList.remove("hidden")
      );
    }
    function closeAdminModal() {
      if (adminLoginModal) {
        adminLoginModal.classList.add("hidden");
        if (adminLoginError) adminLoginError.textContent = "";
      }
    }
    if (closeButton) {
      closeButton.addEventListener("click", closeAdminModal);
    }
    if (adminLoginModal) {
      adminLoginModal.addEventListener("click", (e) => {
        if (e.target === adminLoginModal) closeAdminModal();
      });
    }

    if (adminLoginForm) {
      // Seletor corrigido para o link "Esqueceu sua senha?"
      const forgotPasswordLink = document.querySelector(
        '.admin-form a[href="#"]'
      );
      if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", (e) => {
          e.preventDefault();
          alert(
            "Para recuperar sua senha, por favor, entre em contato pelo e-mail: prex.gabinete@gmail.com"
          );
        });
      }

      adminLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = adminLoginForm.querySelector('input[type="email"]').value;
        const password = adminLoginForm.querySelector(
          'input[type="password"]'
        ).value;

        try {
          const response = await fetch("http://localhost:3000/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const result = await response.json();
          if (response.ok) {
            localStorage.setItem("isLoggedIn", "true");
            closeAdminModal();
            updateAdminUI(); // Atualiza a UI sem recarregar
            carregarEditais(); // Recarrega os cards
          } else {
            adminLoginError.textContent =
              result.message || "Email ou senha incorretos.";
          }
        } catch (error) {
          adminLoginError.textContent =
            "Erro ao conectar com o servidor. Tente novamente.";
        }
      });
    }

    if (adminGreeting) {
      adminGreeting.addEventListener("click", () =>
        adminMenuDropdown.classList.toggle("hidden")
      );
    }
    if (sairBtn) {
      sairBtn.addEventListener("click", async () => {
        // Envia a requisição de logout para o servidor, se necessário
        try {
          await fetch("http://localhost:3000/logout", {
            method: "POST",
          });
        } catch (error) {
          console.error("Erro ao fazer logout no servidor:", error);
        }
        localStorage.setItem("isLoggedIn", "false");
        updateAdminUI(); // Atualiza a UI sem recarregar
        if (adminMenuDropdown) adminMenuDropdown.classList.add("hidden");
        carregarEditais(); // Recarrega os cards
      });
    }
    if (publicarEditalBtn) {
      publicarEditalBtn.addEventListener(
        "click",
        () => (window.location.href = "publicar.html")
      );
    }

    if (cadastrarBtn) {
      cadastrarBtn.addEventListener("click", () => {
        window.location.href = "cadastrar.html";
      });
    }

    const editalModal = document.getElementById("edital-modal");
    const modalCloseBtn = document.querySelector(".modal-close-button");
    const modalBackBtn = document.getElementById("modal-back-button");

    containerCards.addEventListener("click", async (e) => {
      const link = e.target.closest(".card-link");
      const deleteButton = e.target.closest(".delete-button");

      if (link) {
        e.preventDefault();
        const editalId = parseInt(link.getAttribute("data-id"));
        const edital = allEditais.find((e) => e.id === editalId);

        if (edital) {
          document.getElementById("modal-titulo").textContent = edital.titulo;
          document.getElementById("modal-orientador").textContent =
            edital.orientador;
          document.getElementById("modal-bolsista").textContent =
            "Não informado";
          document.getElementById(
            "modal-vagas"
          ).textContent = `${edital.vagasRemuneradas} (Remuneradas) + ${edital.vagasVoluntarias} (Voluntárias)`;
          document.getElementById("modal-carga-horaria").textContent =
            "20h semanais";
          document.getElementById("modal-data-publicacao").textContent =
            edital.dataPublicacao;
          document.getElementById(
            "modal-periodo-inscricao"
          ).textContent = `Até ${edital.inscricoesAte}`;
          document.getElementById("modal-localizacao").textContent =
            edital.localizacao;
          document.getElementById("modal-objetivos").textContent =
            "Não informado";
          document.getElementById("modal-descricao").textContent =
            edital.descricao;

          const downloadLink = document.getElementById("modal-download-link");
          downloadLink.href = edital.pdf_url;

          editalModal.classList.remove("hidden");
        }
      }

      if (deleteButton) {
        const editalId = deleteButton.getAttribute("data-id");
        const confirmacao = confirm(
          "Tem certeza que deseja excluir este edital?"
        );

        if (confirmacao) {
          try {
            const response = await fetch(
              `http://localhost:3000/editais/${editalId}`,
              {
                method: "DELETE",
              }
            );

            if (response.ok) {
              alert("Edital excluído com sucesso!");
              carregarEditais();
            } else {
              const errorData = await response.json();
              alert(errorData.error || "Ocorreu um erro ao excluir o edital.");
            }
          } catch (error) {
            console.error("Erro na exclusão:", error);
            alert(
              "Ocorreu um erro de conexão com o servidor. Verifique se o servidor está rodando."
            );
          }
        }
      }
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", () => {
        editalModal.classList.add("hidden");
      });
    }

    if (modalBackBtn) {
      modalBackBtn.addEventListener("click", () => {
        editalModal.classList.add("hidden");
      });
    }

    if (editalModal) {
      editalModal.addEventListener("click", (e) => {
        if (e.target === editalModal) {
          editalModal.classList.add("hidden");
        }
      });
    }

    updateAdminUI();
    carregarEditais();
  }

  // Lógica para a página de publicação (publicar.html)
  if (window.location.pathname.endsWith("publicar.html")) {
    const publicarEditalForm = document.getElementById("editalForm");

    if (publicarEditalForm) {
      publicarEditalForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(publicarEditalForm);

        try {
          const response = await fetch(
            "http://localhost:3000/publicar-edital",
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            alert("Edital publicado com sucesso!");
            publicarEditalForm.reset();
            setTimeout(() => {
              window.location.href = "index.html";
            }, 2000);
          } else {
            const errorData = await response.json();
            alert(errorData.error || "Ocorreu um erro ao publicar o edital.");
          }
        } catch (error) {
          console.error("Erro na publicação:", error);
          alert(
            "Ocorreu um erro de conexão com o servidor. Verifique se o servidor está rodando."
          );
        }
      });
    }
  }
});

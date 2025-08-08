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
    let lastFocusedElement = null;

    // Função para abrir a modal
    function openAdminModal() {
      adminLoginModal.classList.remove("hidden");
      document.body.classList.add("modal-open");
      lastFocusedElement = document.activeElement;

      // Focar no primeiro campo de input
      const firstInput = adminLoginForm.querySelector('input[type="email"]');
      if (firstInput) firstInput.focus();
    }

    // Função para fechar a modal
    function closeAdminModal() {
      adminLoginModal.classList.add("hidden");
      document.body.classList.remove("modal-open");
      if (adminLoginError) adminLoginError.textContent = "";

      // Retornar o foco para o elemento que abriu a modal
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }

    // Evento para abrir modal
    if (openAdminLoginBtn) {
      openAdminLoginBtn.addEventListener("click", openAdminModal);
    }

    // Evento para fechar modal ao clicar no botão de fechar
    if (closeButton) {
      closeButton.addEventListener("click", closeAdminModal);
    }

    // Evento para fechar modal ao pressionar ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !adminLoginModal.classList.contains("hidden")) {
        e.preventDefault();
        const confirmExit = confirm("Deseja realmente cancelar o login?");
        if (confirmExit) {
          closeAdminModal();
        }
      }
    });

    // Evento para impedir fechamento ao clicar fora do conteúdo
    adminLoginModal.addEventListener("click", (e) => {
      if (e.target === adminLoginModal) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Evento para o link "Esqueceu sua senha?"
    const forgotPasswordLink = document.querySelector(".forgot-password-link");
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        alert(
          "Para recuperar sua senha, por favor, entre em contato pelo e-mail: prex.gabinete@gmail.com"
        );
      });
    }

    // Evento de submit do formulário de login
    if (adminLoginForm) {
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
            updateAdminUI();
            if (containerCards) carregarEditais();
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

    //Funções para o botão do administrador (Cadastrar, Publicar e Sair)
    //Apenas para mover a seta e abrir as opçoes
    if (adminGreeting) {
      adminGreeting.addEventListener("click", () => {
        adminMenuDropdown.classList.toggle("hidden");
        adminGreeting.classList.toggle("open");
    });
    }
    if (sairBtn) {
      sairBtn.addEventListener("click", () => {
  mostrarConfirmacao((confirmado) => {
    if (confirmado) {
      fetch("http://localhost:3000/logout", {
        method: "POST",
      }).catch((error) => {
        console.error("Erro ao fazer logout no servidor:", error);
      });

      localStorage.setItem("isLoggedIn", "false");
      updateAdminUI();
      if (adminMenuDropdown) adminMenuDropdown.classList.add("hidden");
      carregarEditais();
    }
  }, "Tem certeza que deseja sair do modo administrador?");
});
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
  }

    // Função para renderizar os editais
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

    // Função para carregar editais do servidor
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

    // Evento de pesquisa
    if (searchInput) {
    searchInput.addEventListener("input", () => {
    const termoBusca = searchInput.value.toLowerCase().trim();

    if (!termoBusca) {
      renderizarEditais(allEditais); // Campo limpo → mostra todos
      return;
    }

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
    function openEditalModal(edital) {
      const editalModal = document.getElementById("edital-modal");

      document.getElementById("modal-titulo").textContent = edital.titulo;
      document.getElementById("modal-orientador").textContent =
        edital.orientador;
      document.getElementById("modal-bolsista").textContent = "Não informado";
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
      document.getElementById("modal-objetivos").textContent = "Não informado";
      document.getElementById("modal-descricao").textContent = edital.descricao;

      const downloadLink = document.getElementById("modal-download-link");
      downloadLink.href = edital.pdf_url;

      editalModal.classList.remove("hidden");
      document.body.classList.add("modal-open");
    }

    // Modifique o evento de clique no containerCards
    // Adicionado Modal para a exclusão de um edital
    // Adicionado Modal para saída da área do administrador
    if (containerCards) {
    function mostrarConfirmacao(callback) {
    const modal = document.getElementById("confirm-modal");
    const btnSim = document.getElementById("confirm-btn-yes");
    const btnNao = document.getElementById("confirm-btn-no");

    modal.classList.remove("hidden");

    btnSim.onclick = () => {
    modal.classList.add("hidden");
    callback(true);
  };

  btnNao.onclick = () => {
    modal.classList.add("hidden");
    callback(false);
  };
}
    function mostrarConfirmacao(callback, mensagem = "Tem certeza que deseja continuar?") {
    const modal = document.getElementById("confirm-modal");
    const btnSim = document.getElementById("confirm-btn-yes");
    const btnNao = document.getElementById("confirm-btn-no");
    const msg = document.querySelector(".custom-modal-message");

    msg.textContent = mensagem;
    modal.classList.remove("hidden");

    btnSim.onclick = () => {
    modal.classList.add("hidden");
    callback(true);
  };

    btnNao.onclick = () => {
    modal.classList.add("hidden");
    callback(false);
  };
}
      containerCards.addEventListener("click", async (e) => {
        const link = e.target.closest(".card-link");
        const deleteButton = e.target.closest(".delete-button");

        if (link) {
          e.preventDefault();
          const editalId = parseInt(link.getAttribute("data-id"));
          const edital = allEditais.find((e) => e.id === editalId);

          if (edital) {
            openEditalModal(edital);
          }
        }

        if (deleteButton) {
          const editalId = deleteButton.getAttribute("data-id");

          mostrarConfirmacao(async (confirmado) => {
          if (!confirmado) return;
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
                alert(
                  errorData.error || "Ocorreu um erro ao excluir o edital."
                );
              }
            } catch (error) {
              console.error("Erro na exclusão:", error);
              alert(
                "Ocorreu um erro de conexão com o servidor. Verifique se o servidor está rodando."
              );
            }
          }
        )
      }
    });
  }

    const editalModal = document.getElementById("edital-modal");
    const modalCloseBtn = document.querySelector(
      "#edital-modal .modal-close-button"
    );
    const modalBackBtn = document.getElementById("modal-back-button");

    function closeEditalModal() {
      editalModal.classList.add("hidden");
      document.body.classList.remove("modal-open");
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeEditalModal);
    }

    if (modalBackBtn) {
      modalBackBtn.addEventListener("click", closeEditalModal);
    }

    if (editalModal) {
      editalModal.addEventListener("click", (e) => {
        if (e.target === editalModal) {
          closeEditalModal();
        }
      });
    }

    // Inicialização
    updateAdminUI();
    if (containerCards) carregarEditais();
  }
});

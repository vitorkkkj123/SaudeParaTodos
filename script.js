/* ==========================================================================
   SAÚDE PARA TODOS — script.js
   JavaScript puro (Vanilla). Controla:
   1) Tamanho de fonte (A- / A / A+) com limites seguros
   2) Modo Alto Contraste (com aria-pressed)
   3) Persistência das preferências via localStorage
   4) Menu de navegação responsivo (aria-expanded)
   5) Integração do formulário com Google Sheets e feedback acessível
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Configurações e Constantes
     ------------------------------------------------------------------ */
  const URL_GOOGLE_SCRIPT = "https://script.google.com/macros/s/AKfycbwZR8gXvlYlPaeuzgT1Zr-oG-a7xjxg-y5FQ8eVRFUH7bbvcEoviMl3V_cPOQPGMLGm/exec";
  const CHAVE_FONTE = "saudeParaTodos:tamanhoFonte";
  const CHAVE_CONTRASTE = "saudeParaTodos:altoContraste";

  const TAMANHO_MINIMO = 87.5;   // 87.5% (~14px) — limite seguro mínimo
  const TAMANHO_MAXIMO = 150;    // 150% (~24px) — limite seguro máximo
  const TAMANHO_PADRAO = 100;    // 100% (~16px)
  const PASSO = 10;              // incremento/decremento por clique (%)

  const elementoHtml = document.documentElement;
  const corpo = document.body;

  /* ------------------------------------------------------------------
     Elementos da Interface
     ------------------------------------------------------------------ */
  const btnAumentar = document.getElementById("btn-aumentar-fonte");
  const btnDiminuir = document.getElementById("btn-diminuir-fonte");
  const btnResetar = document.getElementById("btn-resetar-fonte");
  const btnContraste = document.getElementById("btn-alto-contraste");
  const navToggle = document.getElementById("nav-toggle");
  const navPrincipal = document.getElementById("nav-principal");
  const formAgendamento = document.getElementById("form-agendamento");
  const statusFormulario = document.getElementById("status-formulario");

  /* ==================================================================
     1) CONTROLE DE TAMANHO DE FONTE
     ================================================================== */
  function obterTamanhoAtual() {
    const valorSalvo = window.localStorage.getItem(CHAVE_FONTE);
    const tamanho = valorSalvo ? parseInt(valorSalvo, 10) : TAMANHO_PADRAO;
    return Number.isNaN(tamanho) ? TAMANHO_PADRAO : tamanho;
  }

  function aplicarTamanhoFonte(tamanho) {
    const tamanhoSeguro = Math.min(TAMANHO_MAXIMO, Math.max(TAMANHO_MINIMO, tamanho));
    elementoHtml.style.fontSize = tamanhoSeguro + "%";

    try {
      window.localStorage.setItem(CHAVE_FONTE, String(tamanhoSeguro));
    } catch (erro) {
      console.warn("Não foi possível salvar a preferência de fonte.", erro);
    }

    atualizarEstadoBotoesFonte(tamanhoSeguro);
  }

  function atualizarEstadoBotoesFonte(tamanho) {
    if (btnAumentar) btnAumentar.disabled = tamanho >= TAMANHO_MAXIMO;
    if (btnDiminuir) btnDiminuir.disabled = tamanho <= TAMANHO_MINIMO;
  }

  if (btnAumentar) {
    btnAumentar.addEventListener("click", function () {
      aplicarTamanhoFonte(obterTamanhoAtual() + PASSO);
    });
  }

  if (btnDiminuir) {
    btnDiminuir.addEventListener("click", function () {
      aplicarTamanhoFonte(obterTamanhoAtual() - PASSO);
    });
  }

  if (btnResetar) {
    btnResetar.addEventListener("click", function () {
      aplicarTamanhoFonte(TAMANHO_PADRAO);
    });
  }

  /* ==================================================================
     2) MODO ALTO CONTRASTE
     ================================================================== */
  function aplicarContraste(ativo) {
    corpo.classList.toggle("alto-contraste", ativo);
    if (btnContraste) {
      btnContraste.setAttribute("aria-pressed", String(ativo));
    }

    try {
      window.localStorage.setItem(CHAVE_CONTRASTE, String(ativo));
    } catch (erro) {
      console.warn("Não foi possível salvar a preferência de contraste.", erro);
    }
  }

  if (btnContraste) {
    btnContraste.addEventListener("click", function () {
      const estaAtivo = corpo.classList.contains("alto-contraste");
      aplicarContraste(!estaAtivo);
    });
  }

  /* ==================================================================
     3) MENU DE NAVEGAÇÃO RESPONSIVO
     ================================================================== */
  if (navToggle && navPrincipal) {
    navToggle.addEventListener("click", function () {
      const expandido = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expandido));
      navPrincipal.classList.toggle("nav-principal--aberto", !expandido);
    });

    navPrincipal.addEventListener("click", function (evento) {
      if (evento.target.tagName === "A") {
        navToggle.setAttribute("aria-expanded", "false");
        navPrincipal.classList.remove("nav-principal--aberto");
      }
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        navToggle.setAttribute("aria-expanded", "false");
        navPrincipal.classList.remove("nav-principal--aberto");
        navToggle.focus();
      }
    });
  }

  /* ==================================================================
     4) FORMULÁRIO DE AGENDAMENTO & GOOGLE SHEETS
     ================================================================== */
  function definirStatusFormulario(mensagem, tipo) {
    if (!statusFormulario) return;
    statusFormulario.textContent = mensagem;
    statusFormulario.classList.remove("formulario__status--sucesso", "formulario__status--erro");
    if (tipo) {
      statusFormulario.classList.add("formulario__status--" + tipo);
    }
  }

  function validarCampoObrigatorio(campo, mensagemErro, listaErros) {
    if (!campo || !campo.value || campo.value.trim() === "") {
      listaErros.push(mensagemErro);
      if (campo) campo.setAttribute("aria-invalid", "true");
      return false;
    }
    campo.removeAttribute("aria-invalid");
    return true;
  }

  function validarFormulario(dados) {
    const erros = [];
    validarCampoObrigatorio(dados.nome, "Informe seu nome completo.", erros);
    validarCampoObrigatorio(dados.telefone, "Informe um telefone ou WhatsApp para contato.", erros);
    validarCampoObrigatorio(dados.especialidade, "Selecione a especialidade desejada.", erros);
    return erros;
  }

  function enviarAgendamento(dadosFormulario) {
    const formData = new FormData();
    formData.append("nome", dadosFormulario.nome);
    formData.append("telefone", dadosFormulario.telefone);
    formData.append("especialidade", dadosFormulario.especialidade);
    formData.append("acessibilidade", dadosFormulario.acessibilidade);

    return fetch(URL_GOOGLE_SCRIPT, {
      method: "POST",
      mode: "no-cors",
      body: formData
    })
    .then(() => true)
    .catch((erro) => {
      console.error("Erro no envio:", erro);
      return false;
    });
  }

  if (formAgendamento) {
    formAgendamento.addEventListener("submit", function (evento) {
      evento.preventDefault();

      const campos = {
        nome: document.getElementById("campo-nome"),
        telefone: document.getElementById("campo-telefone"),
        especialidade: document.getElementById("campo-especialidade"),
        acessibilidade: document.getElementById("campo-acessibilidade")
      };

      const erros = validarFormulario(campos);

      if (erros.length > 0) {
        definirStatusFormulario(
          "Não foi possível enviar: " + erros.join(" "),
          "erro"
        );
        if (campos.nome && campos.nome.value.trim() === "") {
          campos.nome.focus();
        } else if (campos.telefone && campos.telefone.value.trim() === "") {
          campos.telefone.focus();
        } else if (campos.especialidade) {
          campos.especialidade.focus();
        }
        return;
      }

      definirStatusFormulario("Enviando sua solicitação...", null);

      const dadosFormulario = {
        nome: campos.nome ? campos.nome.value.trim() : "",
        telefone: campos.telefone ? campos.telefone.value.trim() : "",
        especialidade: campos.especialidade ? campos.especialidade.value : "",
        acessibilidade: campos.acessibilidade ? campos.acessibilidade.value.trim() : ""
      };

      enviarAgendamento(dadosFormulario).then(function (sucesso) {
        if (sucesso) {
          definirStatusFormulario(
            "Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve para confirmar o horário.",
            "sucesso"
          );
          formAgendamento.reset();
        } else {
          definirStatusFormulario(
            "Não foi possível enviar sua solicitação agora. Tente novamente ou fale conosco pelo WhatsApp.",
            "erro"
          );
        }
      });
    });
  }

  /* ==================================================================
     5) INICIALIZAÇÃO
     ================================================================== */
  function iniciar() {
    aplicarTamanhoFonte(obterTamanhoAtual());

    let contrasteSalvo = false;
    try {
      contrasteSalvo = window.localStorage.getItem(CHAVE_CONTRASTE) === "true";
    } catch (erro) {
      console.warn("Não foi possível ler a preferência de contraste.", erro);
    }
    aplicarContraste(contrasteSalvo);
  }

  iniciar();
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Erro ao registrar Service Worker:', err);
    });
  });
}
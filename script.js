const input = document.getElementById("pergunta");
const chatBox = document.getElementById("chat");
const botao = document.getElementById("enviar");

function appendMessage(msg, classe = "user") {
  const div = document.createElement("div");
  div.className = classe;

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = classe === "bot"
    ? "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
    : "https://cdn-icons-png.flaticon.com/512/4712/4712040.png";

  const mensagem = document.createElement("div");
  mensagem.className = "msg";
  mensagem.innerHTML = classe === "bot" ? marked.parse(msg) : msg;

  div.appendChild(avatar);
  div.appendChild(mensagem);

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

let sessionID = localStorage.getItem("session") || Date.now().toString();
localStorage.setItem("session", sessionID);

function salvarHistorico() {
  localStorage.setItem("chatHistorico", chatBox.innerHTML);
}

function carregarHistorico() {
  const salvo = localStorage.getItem("chatHistorico");
  if (salvo) chatBox.innerHTML = salvo;
}

async function enviarPergunta() {
  const pergunta = input.value.trim();
  if (!pergunta) return;

  appendMessage(pergunta, "user");
  appendMessage("Prof. IA está pensando...", "bot");
  input.value = "";
  salvarHistorico();

  try {
    const response = await fetch("https://segredos123.app.n8n.cloud/webhook-test/pataforma-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta, sessionId: sessionID })
    });

    const data = await response.json();
    const mensagensBot = document.querySelectorAll(".bot .msg");
    const ultimaMensagem = mensagensBot[mensagensBot.length - 1];

    if (data.resposta && data.resposta.length > 1) {
      ultimaMensagem.innerHTML = marked.parse(data.resposta);
    } else {
      ultimaMensagem.textContent = "Desculpe, não consegui entender sua pergunta.";
    }
  } catch (err) {
    console.error(err);
    const mensagensBot = document.querySelectorAll(".bot .msg");
    const ultimaMensagem = mensagensBot[mensagensBot.length - 1];
    ultimaMensagem.textContent = "Erro ao se comunicar com a IA.";
  }

  salvarHistorico();
}

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarPergunta();
  }
});

botao.addEventListener("click", () => {
  enviarPergunta();
});

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function iniciarChat() {
  document.getElementById("tela-inicial").style.display = "none";
  document.getElementById("chat-container").style.display = "block";
  carregarHistorico();
}

function limparConversa() {
  chatBox.innerHTML = "";
  localStorage.removeItem("chatHistorico");
}

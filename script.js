// =========================
// CONFIGURAÇÕES
// =========================
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Estado local dos livros
let livros = [];
let editandoId = null;

// Elementos da página
const listaLivros = document.getElementById("listaLivros");
const formulario = document.getElementById("formularioLivro");
const alerta = document.getElementById("alerta");
const carregando = document.getElementById("carregando");

const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputDescricao = document.getElementById("descricao");
const inputId = document.getElementById("livroId");

const erroTitulo = document.getElementById("erroTitulo");
const erroAutor = document.getElementById("erroAutor");

const btnSubmit = document.getElementById("btnSubmit");
const btnCancelar = document.getElementById("btnCancelar");

// =========================
// 1. LISTAR LIVROS (GET)
// =========================
async function carregarLivros() {
    carregando.style.display = "flex";

    try {
        const resposta = await fetch(API_URL + "?_limit=10");
        const dados = await resposta.json();

        livros = dados.map(l => ({
            id: l.id,
            titulo: l.title,
            autor: "Autor desconhecido",
            descricao: l.body
        }));

        renderizarLista();
    } catch (erro) {
        mostrarAlerta("Erro ao carregar os livros!", "erro");
        console.error(erro);
    } finally {
        carregando.style.display = "none";
    }
}

// =========================
// 2. ADICIONAR LIVRO (POST)
// =========================
async function adicionarLivro(livro) {
    const tempId = "tmp_" + Date.now();
    const novoLivro = { id: tempId, ...livro };
    livros.unshift(novoLivro);
    renderizarLista();
    mostrarAlerta("Livro adicionado localmente...", "sucesso");

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        });

        const criado = await resposta.json();

        // troca id temporário pelo id real
        const index = livros.findIndex(l => l.id === tempId);
        if (index >= 0) livros[index].id = criado.id;

        mostrarAlerta("Livro salvo no servidor!", "sucesso");
    } catch (erro) {
        livros = livros.filter(l => l.id !== tempId);
        mostrarAlerta("Erro ao salvar livro no servidor!", "erro");
    }

    renderizarLista();
}

// =========================
// 3. EDITAR LIVRO (PUT)
// =========================
async function salvarEdicao(id, dados) {
    const livroOriginal = livros.find(l => l.id === id);
    const backup = { ...livroOriginal };

    Object.assign(livroOriginal, dados);
    renderizarLista();
    mostrarAlerta("Alteração salva localmente...", "sucesso");

    try {
        await fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livroOriginal)
        });

        mostrarAlerta("Livro atualizado no servidor!", "sucesso");
    } catch (erro) {
        Object.assign(livroOriginal, backup);
        mostrarAlerta("Erro ao atualizar no servidor! Alteração revertida.", "erro");
    }

    renderizarLista();
}

// =========================
// 4. EXCLUIR LIVRO (DELETE)
// =========================
async function excluirLivro(id) {
    const backup = [...livros];

    livros = livros.filter(l => l.id !== id);
    renderizarLista();
    mostrarAlerta("Livro removido localmente...", "sucesso");

    try {
        await fetch(API_URL + "/" + id, { method: "DELETE" });
        mostrarAlerta("Exclusão confirmada no servidor", "sucesso");
    } catch (erro) {
        livros = backup;
        mostrarAlerta("Erro ao excluir no servidor!", "erro");
    }

    renderizarLista();
}

// =========================
// RENDERIZAÇÃO DA LISTA
// =========================
function renderizarLista() {
    listaLivros.innerHTML = "";

    if (livros.length === 0) {
        listaLivros.innerHTML = "<p>Nenhum livro cadastrado.</p>";
        return;
    }

    livros.forEach(livro => {
        const card = document.createElement("div");
        card.className = "item-livro";

        card.innerHTML = `
            <h3>${livro.titulo}</h3>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p>${livro.descricao || "Sem descrição."}</p>

            <div class="acoes">
                <button class="botao botao-secundario" onclick="editarLivro(${JSON.stringify(livro).replace(/"/g, '&quot;')})">Editar</button>
                <button class="botao botao-perigo" onclick="excluirLivro(${livro.id})">Excluir</button>
            </div>
        `;

        listaLivros.appendChild(card);
    });
}

// =========================
// EDITAR
// =========================
function editarLivro(livro) {
    editandoId = livro.id;

    inputId.value = livro.id;
    inputTitulo.value = livro.titulo;
    inputAutor.value = livro.autor;
    inputDescricao.value = livro.descricao;

    btnSubmit.textContent = "Salvar Alterações";
    btnCancelar.style.display = "inline-block";
}

// =========================
// CANCELAR EDIÇÃO
// =========================
btnCancelar.addEventListener("click", () => {
    formulario.reset();
    editandoId = null;

    btnSubmit.textContent = "Adicionar Livro";
    btnCancelar.style.display = "none";
});

// =========================
// FORMULÁRIO
// =========================
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const descricao = inputDescricao.value.trim();

    let valido = true;

    // validação
    erroTitulo.style.display = titulo.length >= 3 ? "none" : "block";
    erroAutor.style.display = autor.length > 0 ? "none" : "block";

    if (titulo.length < 3 || autor.length === 0) {
        return;
    }

    const dados = { title: titulo, body: descricao, autor, descricao, titulo };

    if (editandoId) {
        salvarEdicao(editandoId, {
            titulo,
            autor,
            descricao
        });
    } else {
        adicionarLivro({
            title: titulo,
            body: descricao,
            titulo,
            autor,
            descricao
        });
    }

    formulario.reset();
    editandoId = null;

    btnSubmit.textContent = "Adicionar Livro";
    btnCancelar.style.display = "none";
});

// =========================
// ALERTAS
// =========================
function mostrarAlerta(msg, tipo) {
    alerta.textContent = msg;
    alerta.className = "alerta " + tipo;

    setTimeout(() => {
        alerta.textContent = "";
        alerta.className = "alerta";
    }, 3000);
}

// =========================
// INICIALIZAÇÃO
// =========================
carregarLivros();

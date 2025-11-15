// =========================
// CONFIGURAÇÕES
// =========================
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Estado local dos livros - Iniciando com 3 livros conhecidos
let livros = [
    {
        id: 1,
        titulo: "O Príncipe",
        autor: "Nicolau Maquiavel",
        descricao: "Obra clássica sobre filosofia política e estratégia de poder, escrita no século XVI."
    },
    {
        id: 2,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        descricao: "Romance que narra a história de Bentinho e Capitu, explorando temas como ciúme e incerteza."
    },
    {
        id: 3,
        titulo: "1984",
        autor: "George Orwell",
        descricao: "Distopia sobre um regime totalitário que controla todos os aspectos da vida dos cidadãos."
    }
];

let editandoId = null;
let proximoId = 4; // Próximo ID para novos livros

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
// 1. CARREGAR LIVROS INICIAIS
// =========================
function carregarLivros() {
    renderizarLista();
    mostrarAlerta("Biblioteca carregada com sucesso!", "sucesso");
}

// =========================
// 2. ADICIONAR LIVRO (POST)
// =========================
async function adicionarLivro(livro) {
    // Adiciona com ID único
    const novoLivro = { 
        id: proximoId++, 
        ...livro 
    };
    
    livros.unshift(novoLivro);
    renderizarLista();
    mostrarAlerta("Livro adicionado com sucesso!", "sucesso");

    // Simula requisição à API (opcional)
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        });
        console.log("Livro enviado para API (simulação)");
    } catch (erro) {
        console.error("Erro na simulação de envio:", erro);
    }
}

// =========================
// 3. EDITAR LIVRO (PUT)
// =========================
async function salvarEdicao(id, dados) {
    const livroOriginal = livros.find(l => l.id === id);
    
    if (!livroOriginal) {
        mostrarAlerta("Livro não encontrado!", "erro");
        return;
    }

    const backup = { ...livroOriginal };

    Object.assign(livroOriginal, dados);
    renderizarLista();
    mostrarAlerta("Livro atualizado com sucesso!", "sucesso");

    // Simula requisição à API (opcional)
    try {
        await fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livroOriginal)
        });
        console.log("Atualização enviada para API (simulação)");
    } catch (erro) {
        console.error("Erro na simulação de atualização:", erro);
    }
}

// =========================
// 4. EXCLUIR LIVRO (DELETE)
// =========================
async function excluirLivro(id) {
    if (!confirm('Tem certeza que deseja excluir este livro?')) {
        return;
    }

    livros = livros.filter(l => l.id !== id);
    renderizarLista();
    mostrarAlerta("Livro excluído com sucesso!", "sucesso");

    // Simula requisição à API (opcional)
    try {
        await fetch(API_URL + "/" + id, { 
            method: "DELETE" 
        });
        console.log("Exclusão enviada para API (simulação)");
    } catch (erro) {
        console.error("Erro na simulação de exclusão:", erro);
    }
}

// =========================
// RENDERIZAÇÃO DA LISTA
// =========================
function renderizarLista() {
    listaLivros.innerHTML = "";

    if (livros.length === 0) {
        listaLivros.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">Nenhum livro cadastrado. Adicione seu primeiro livro!</p>';
        return;
    }

    livros.forEach(livro => {
        const card = document.createElement("div");
        card.className = "item-livro";

        card.innerHTML = `
            <h3 class="titulo-livro">${livro.titulo}</h3>
            <p class="autor-livro"><strong>Autor:</strong> ${livro.autor}</p>
            <p class="descricao-livro">${livro.descricao || "Sem descrição."}</p>

            <div class="acoes-livro">
                <button class="botao botao-secundario" onclick="editarLivro(${livro.id})">Editar</button>
                <button class="botao botao-perigo" onclick="excluirLivro(${livro.id})">Excluir</button>
            </div>
        `;

        listaLivros.appendChild(card);
    });
}

// =========================
// EDITAR
// =========================
function editarLivro(id) {
    const livro = livros.find(l => l.id === id);
    
    if (!livro) {
        mostrarAlerta('Livro não encontrado', 'erro');
        return;
    }

    editandoId = livro.id;

    inputId.value = livro.id;
    inputTitulo.value = livro.titulo;
    inputAutor.value = livro.autor;
    inputDescricao.value = livro.descricao;

    btnSubmit.textContent = "Salvar Alterações";
    btnCancelar.style.display = "inline-block";

    // Scroll suave para o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================
// CANCELAR EDIÇÃO
// =========================
btnCancelar.addEventListener("click", () => {
    formulario.reset();
    editandoId = null;

    btnSubmit.textContent = "Adicionar Livro";
    btnCancelar.style.display = "none";
    
    // Limpa mensagens de erro
    erroTitulo.style.display = "none";
    erroAutor.style.display = "none";
});

// =========================
// FORMULÁRIO
// =========================
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const descricao = inputDescricao.value.trim();

    // Validação
    let valido = true;
    
    if (titulo.length < 3) {
        erroTitulo.style.display = "block";
        valido = false;
    } else {
        erroTitulo.style.display = "none";
    }

    if (autor.length === 0) {
        erroAutor.style.display = "block";
        valido = false;
    } else {
        erroAutor.style.display = "none";
    }

    if (!valido) {
        mostrarAlerta("Por favor, corrija os erros no formulário", "erro");
        return;
    }

    const dados = {
        titulo,
        autor,
        descricao
    };

    if (editandoId) {
        await salvarEdicao(editandoId, dados);
    } else {
        await adicionarLivro(dados);
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
    alerta.className = "alerta alerta-" + tipo;

    setTimeout(() => {
        alerta.textContent = "";
        alerta.className = "alerta";
    }, 3000);
}

// =========================
// INICIALIZAÇÃO
// =========================
// Carrega os livros ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
});
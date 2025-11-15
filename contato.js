// Script para página de contato

const formularioContato = document.getElementById('formularioContato');

// Event listener para o formulário
formularioContato.addEventListener('submit', (evento) => {
    evento.preventDefault();
    
    // Captura os dados do formulário
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    
    // Validação básica
    if (!nome || !email || !mensagem) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    // Validação de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert('Por favor, insira um email válido!');
        return;
    }
    
    // Simulação de envio (em um projeto real, aqui seria feita a requisição para o servidor)
    alert(`Mensagem enviada com sucesso!\n\nNome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}\n\nEntraremos em contato em breve!`);
    
    // Limpa o formulário
    formularioContato.reset();
});
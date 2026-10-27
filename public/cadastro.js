const form = document.getElementById('form-cadastro');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const dados = {
    nome: document.getElementById('nome').value.trim(),
    email: document.getElementById('email').value.trim(),
    senha: document.getElementById('senha').value,
  };

  try {
    const resposta = await fetch('/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.message || 'Erro ao cadastrar');
    }

    mostrarMensagem('Cadastro feito! Redirecionando para o login...', 'sucesso');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
  }
});

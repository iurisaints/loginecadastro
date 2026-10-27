const form = document.getElementById('form-login');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const dados = {
    email: document.getElementById('email').value.trim(),
    senha: document.getElementById('senha').value,
  };

  try {
    const resposta = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.message || 'Erro ao fazer login');
    }

    mostrarMensagem(resultado.message, 'sucesso');
    window.location.href = 'usuario.html';
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
  }
});

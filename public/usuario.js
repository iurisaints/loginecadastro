const dadosUsuario = document.getElementById('dados-usuario');
const mensagem = document.getElementById('mensagem');
const botaoSair = document.getElementById('botao-sair');

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function formatarData(valor) {
  if (!valor) return '-';
  return new Date(valor).toLocaleString('pt-BR');
}

async function carregarUsuario() {
  try {
    const resposta = await fetch('/api/usuario');

    if (resposta.status === 401) {
      window.location.href = 'index.html';
      return;
    }

    const usuario = await resposta.json();

    if (!resposta.ok) {
      throw new Error(usuario.message || 'Erro ao carregar usuário');
    }

    dadosUsuario.innerHTML = `
      <p><strong>ID:</strong> ${usuario.id}</p>
      <p><strong>Nome:</strong> ${usuario.nome}</p>
      <p><strong>E-mail:</strong> ${usuario.email}</p>
      <p><strong>Criado em:</strong> ${formatarData(usuario.criado_em)}</p>
    `;
  } catch (error) {
    dadosUsuario.innerHTML = '<p>Não foi possível carregar os dados.</p>';
    mostrarMensagem(error.message, 'erro');
  }
}

botaoSair.addEventListener('click', async () => {
  try {
    const resposta = await fetch('/api/logout', { method: 'POST' });
    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.message || 'Erro ao sair');
    }

    window.location.href = 'index.html';
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
  }
});

carregarUsuario();

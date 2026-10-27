const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'chave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
    },
  })
);

// Frontend estático (pasta public)
app.use(express.static(path.join(__dirname, '..', 'public')));

function exigirLogin(req, res, next) {
  if (!req.session.usuarioId) {
    return res.status(401).json({ message: 'Faça login para continuar' });
  }
  next();
}

app.get('/api', (req, res) => {
  res.json({ message: 'API de cadastro e login' });
});

// Cadastro
app.post('/api/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios' });
    }

    if (senha.length < 4) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 4 caracteres' });
    }

    const [existentes] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);

    if (existentes.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [resultado] = await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    res.status(201).json({
      id: resultado.insertId,
      nome,
      email,
      message: 'Cadastro realizado com sucesso',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    const usuario = usuarios[0];
    const senhaOk = await bcrypt.compare(senha, usuario.senha);

    if (!senhaOk) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    req.session.usuarioId = usuario.id;

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      message: 'Login realizado com sucesso',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Dados do usuário logado
app.get('/api/usuario', exigirLogin, async (req, res) => {
  try {
    const [usuarios] = await db.query(
      'SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?',
      [req.session.usuarioId]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(usuarios[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((erro) => {
    if (erro) {
      return res.status(500).json({ message: 'Erro ao sair' });
    }

    res.clearCookie('connect.sid');
    res.json({ message: 'Logout realizado com sucesso' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

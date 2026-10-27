# Sistema de cadastro e login

Projeto simples com Express, MySQL e frontend estático.

## Estrutura

```text
sistema-login/
├── public/          ← frontend (HTML, CSS, JS)
│   ├── index.html       login
│   ├── cadastro.html    cadastro
│   ├── usuario.html     tela do usuário logado
│   ├── style.css
│   ├── login.js
│   ├── cadastro.js
│   └── usuario.js
├── src/             ← backend
│   ├── server.js
│   └── database.js
├── schema.sql
├── .env
└── package.json
```

## Como rodar

1. Configure o `.env` com os dados do MySQL.
2. Crie o banco:

```bash
mysql -u root -p < schema.sql
```

3. Instale e inicie:

```bash
npm install
npm run dev
```

4. Abra no navegador:

```text
http://localhost:3000
```

O Express serve a pasta `public` e as rotas da API em `/api`.

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/cadastro` | Cria usuário (senha com bcrypt) |
| `POST` | `/api/login` | Faz login e cria sessão |
| `GET` | `/api/usuario` | Retorna dados do usuário logado |
| `POST` | `/api/logout` | Encerra a sessão |

### Exemplos de body

**Cadastro**

```json
{
  "nome": "Ana Silva",
  "email": "ana@email.com",
  "senha": "1234"
}
```

**Login**

```json
{
  "email": "ana@email.com",
  "senha": "1234"
}
```

## Fluxo

1. Cadastre em `/cadastro.html`
2. Faça login em `/` (`index.html`)
3. Veja os dados em `/usuario.html`
4. Clique em **Sair** para encerrar a sessão

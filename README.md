# Biblioteca Virtual — pitch do projeto

## O problema

O controle de uma biblioteca pequena (usuários, livros, autores, categorias e
empréstimos) ainda passa por papel, planilhas ou WhatsApp. Resultado: livro
emprestado que ninguém lembra de devolver, cadastro duplicado e zero visibilidade
do acervo.

## A solução

Um sistema web simples e direto, em português, para cadastrar e acompanhar o
acervo da biblioteca: usuários, livros, autores, categorias e empréstimos com
prazo máximo de 7 dias. O painel administrativo exige login a cada acesso, e a
validação acontece tanto no navegador (resposta imediata) quanto no servidor
(PHP, antes de qualquer escrita no banco).

## Para quem é

Bibliotecas de escola, clubes de leitura, igrejas e pequenos acervos que precisam
de controle básico sem instalar sistema pesado.

## Funcionalidades

| Área | O que faz |
|---|---|
| Usuários | Cadastro com CPF (11 dígitos), e-mail válido, endereço e senha mínima de 8 caracteres |
| Livros | Título, ISBN (10 ou 13 dígitos), ano de publicação, categoria, estoque e capa |
| Autores | Nome, nacionalidade, nascimento, e-mail e biografia; grava no PostgreSQL via PDO com prepared statement |
| Categorias | Código, status (ativa/inativa) e localização física |
| Empréstimos | Usuário + livro + datas; o sistema calcula o prazo e bloqueia acima de 7 dias |
| Painel admin | Login obrigatório em cada acesso; sessão só vale após validação no servidor |

## Stack

- **Front-end:** HTML5 + CSS3 + JavaScript puro (sem framework)
- **Back-end:** PHP 8 com PDO (PostgreSQL)
- **Banco:** PostgreSQL (`Biblioteca`)
- **Deploy local:** Apache (`/ProvaN1/src/`) ou `php -S` para testes

## Estrutura

```text
ProvaN1/
├── .env.example              modelo das credenciais (copie para .env nesta raiz)
├── router.php                router do servidor embutido (php -S ... router.php)
├── index.html                redireciona para src/ se a raiz for servida por engano
```
ProvaN1/
├── src/                      aplicação (versão implantada)
│   ├── index.html / admin.html   páginas inicial e painel administrativo
│   ├── www/                  formulários (usuário, livro, autor, categoria, empréstimo)
│   ├── js/                   validações e UI (tpi2-ui.js, admin.js, um JS por formulário)
│   ├── php/                  endpoints (login, usuario, livro, autor, categoria, emprestimo, conexao)
│   └── css/estilo.css        identidade visual (vinho/dourado/areia)
├── sql/schema.sql            schema PostgreSQL do banco `biblioteca`
├── legacy/                   versão plana original da prova (histórico; html/, php/, js/, css/)
└── docs/                     relatórios e guias (.md) com evidências em docs/evidencias/
```

A versão plana original da prova (pastas `html/`, `php/`, `js/`, `css/`)
está preservada em `legacy/`; relatórios, guias e evidências estão em
`docs/` (com imagens e trabalhos em `docs/evidencias/`). Se a raiz for
servida por engano, o `index.html` dela redireciona para `src/` (DocumentRoot
correto). O `.env` fica na raiz do projeto, fora de `src/`.
servida por engano, o `.htaccess` dela bloqueia `legacy/`, `docs/`, `sql/`
e o `src/php/.env`.

## Segurança

- Credenciais do banco e do admin **fora do código e fora do DocumentRoot**:
  arquivo `.env` na raiz do projeto (fora de `src/`, ignorado pelo git),
  carregado por `php/config.php` (com fallback para `src/php/.env`); o
  `.env.example` na raiz documenta as chaves e como gerar um hash novo. No
  `php -S` o `router.php` bloqueia o download desses arquivos; no Apache com
  `AllowOverride All`, as regras comentadas nos `.htaccess` podem ser
  descomentadas para 403 explícito.
- O `login.php` **falha fechado**: sem `ADMIN_USER`/`ADMIN_PASS_HASH` no `.env`,
  nenhum login é aceito (não existe hash reserva no código).
- Conexão PDO com `ERRMODE_EXCEPTION`, `EMULATE_PREPARES = false`, fetch
  associativo e `client_encoding UTF8`.
- Erros de banco vão para o `error_log` e o usuário recebe mensagem genérica
  (nada de vazar host/SQL no navegador).
- Login server-side: `password_verify` contra hash bcrypt, comparação
  `hash_equals` para o usuário, sessão PHP com cookie `HttpOnly` +
  `SameSite=Strict`, `session.use_strict_mode` e `session_regenerate_id`;
  resposta em JSON com código HTTP correto. Limite de 5 tentativas a cada
  60 segundos (bloqueio temporário em sessão).
- Endpoints administrativos (`autor.php`, `categoria.php`, `emprestimo.php`)
  exigem `$_SESSION['tipo'] === 'admin'` **e** token CSRF por POST
  (`php/csrf.php` entrega o token; `php/logout.php` destrói a sessão no
  servidor). `livro.php` e `usuario.php` são cadastros públicos.
- Headers de segurança enviados via PHP (`php/seguranca.php`) e via meta CSP
  nos HTML: CSP, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy` e `Permissions-Policy` — funcionam em qualquer servidor,
  sem depender de `mod_headers` ou de `.htaccess`.
- Validação de CPF com dígitos verificadores, e limites de tamanho (`mb_strlen`)
  em todos os campos de texto.
- Nada de senha no navegador: o cadastro de usuário não guarda senha em
  `localStorage`/`sessionStorage`.

Limitações conhecidas (escopo da disciplina): a "conta" do usuário comum ainda
é apenas um marcador de sessão no cliente (sem senha envolvida); o registro de
empréstimo exige sessão de administrador no servidor; os cadastros públicos
(`usuario.php`, `livro.php`) não têm rate limit próprio; e ainda não há CRUD de
listagem/edição — próximos passos naturais.

## Como rodar

O projeto **não depende de `.htaccess`**: os arquivos `.htaccess` estão só com
comentários, portanto não ocorre erro 500 ("RewriteEngine not allowed here")
em Apache com `AllowOverride` restrito (padrão de vários XAMPP). Todas as
opções abaixo funcionam em Windows, Linux e macOS:

### Opção 1 — servidor embutido do PHP (mais simples, zero configuração)

```bash
# 1. Na raiz do projeto, crie o .env (uma vez por máquina):
cp .env.example .env        # Windows: copy .env.example .env
#    edite DB_PASS e ADMIN_PASS_HASH dentro do .env

# 2. Suba o PostgreSQL com o banco "biblioteca" e rode o servidor:
php -S 127.0.0.1:8000 -t src router.php
# abra http://127.0.0.1:8000/
```

O `router.php` bloqueia o acesso a `.env`, `config.php`, `conexao.php` e
outros arquivos sensíveis (o `php -S` ignora `.htaccess`).

### Opção 2 — XAMPP ou Apache puro (sem mexer em AllowOverride)

O Apache desses pacotes serve os arquivos; o banco continua sendo o
PostgreSQL que o phpPgAdmin administra (`biblioteca`, porta 5433). O MariaDB
do XAMPP **não** é usado.

1. Copie a pasta `ProvaN1` inteira para a raiz do Apache:
   - Windows: `C:\xampp\htdocs\ProvaN1\`
   - Linux: `/opt/lampp/htdocs/ProvaN1/`
   - macOS: `/Applications/XAMPP/htdocs/ProvaN1/`
2. Crie o `.env` na raiz do projeto a partir do `.env.example` e garanta que o
   PostgreSQL esteja no ar (o mesmo serviço que o phpPgAdmin usa), com
   `DB_HOST`, `DB_PORT=5433`, `DB_NAME=biblioteca`, `DB_USER`, `DB_PASS`.
3. Importe o schema uma única vez (se o banco ainda não existir):
   crie o banco `biblioteca` no phpPgAdmin e rode o conteúdo de `sql/schema.sql`.
4. Inicie o Apache pelo painel e acesse:
   `http://localhost/ProvaN1/src/index.html` (painel admin: `admin.html`).
   Se acessar `http://localhost/ProvaN1/`, o `index.html` da raiz redireciona
   para `src/`.

**Não precisa habilitar `mod_rewrite` nem alterar `AllowOverride`**: o projeto
não usa mais diretivas de `.htaccess`, então não dá erro 500 em nenhuma
configuração de Apache. O DocumentRoot continua sendo `src/`; o `.env` fica
na raiz do projeto, fora de `src/`, e não pode ser baixado pela web.

### Opção 3 — Apache com AllowOverride All (camada extra opcional)

Se quiser 403 explícito ao acessar `.env`, `config.php`, `conexao.php`,
`auth.php` etc. pelo navegador: habilite `mod_rewrite` e `AllowOverride All`
no `httpd.conf` para o diretório do projeto e **descomente** as regras nos
`.htaccess` (raiz, `src/`, `src/php/`). Com AllowOverride restrito, deixe
comentado — o projeto funciona do mesmo jeito.

### Rodar com XAMPP (mesmo banco PostgreSQL do phpPgAdmin)

O XAMPP fornece o Apache; o banco continua sendo o PostgreSQL que o phpPgAdmin
administra (`biblioteca`, porta 5433). O MariaDB do XAMPP **não** é usado.

1. Copie a pasta `ProvaN1` inteira para a raiz do Apache do XAMPP:
   - Windows: `C:\xampp\htdocs\ProvaN1\`
   - Linux: `/opt/lampp/htdocs/ProvaN1/`
2. Garanta que o PostgreSQL esteja no ar (o mesmo serviço que o phpPgAdmin usa)
   e que `src/php/.env` aponte para ele (`DB_HOST`, `DB_PORT=5433`,
   `DB_NAME=biblioteca`, `DB_USER`, `DB_PASS`).
3. Habilite o `mod_headers` e `mod_rewrite` no Apache do XAMPP (botão
   `Config` → `httpd.conf`): descomente
   `LoadModule headers_module modules/mod_headers.so` e
   `LoadModule rewrite_module modules/mod_rewrite.so`, e permita
   `AllowOverride All` no diretório `htdocs`.
4. Importe o schema uma única vez (se o banco ainda não existir):
   crie o banco `biblioteca` no phpPgAdmin e rode o conteúdo de `sql/schema.sql`.
5. Inicie o Apache pelo painel do XAMPP e acesse:
   `http://localhost/ProvaN1/src/index.html` (painel admin: `admin.html`).

Atenção: o servidor embutido `php -S` **não** lê `.htaccess` e expõe o
`src/php/.env` na rede local — para visualizar o projeto, prefira sempre o
Apache do XAMPP.

Para gerar um hash de senha para o `.env`:

```bash
php -r "echo password_hash('sua-senha', PASSWORD_DEFAULT), PHP_EOL;"
```

## Próximos passos

1. Migrar a autenticação de usuários comuns para o servidor (login na tabela
   `usuario` com `password_hash`, sessão PHP nos endpoints de usuário).
2. CRUD completo (listar/editar/excluir) para livros, autores e empréstimos.
3. Upload real da capa do livro com validação de tipo/tamanho no PHP
   (campo hoje removido do formulário até lá).

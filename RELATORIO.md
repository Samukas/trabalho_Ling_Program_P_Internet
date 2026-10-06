# Relatório de Execução — Biblioteca Virtual (Prova N1)

**Projeto:** Biblioteca Virtual
**Disciplina:** TECNOLS — Programação Aplicada à Internet II
**Data da execução:** 04/10/2026
**Escopo desta entrega:** apenas as telas HTML com formulário (`usuario.html` e `livro.html`) + esta documentação. **Sem CSS, sem JS, sem PHP** — conforme solicitado.

---

## 1. Objetivo

Construir a camada de apresentação (telas) de uma biblioteca virtual, deixando o projeto estruturado de forma que PHP, CSS e JS possam ser incluídos depois **sem precisar reescrever ou reorganizar nada**. Esta entrega entrega 100% HTML puro e funcional no navegador: os formulários abrem, validam os campos obrigatórios e limpam corretamente.

---

## 2. Resumo do que foi executado

| # | Ação | Resultado |
|---|------|-----------|
| 1 | Criada a árvore de pastas `src/www/inc`, `src/php`, `src/js`, `src/css` | 4 pastas criadas |
| 2 | Criado `.gitkeep` em cada pasta que ficaria vazia | 4 arquivos `.gitkeep` |
| 3 | Criado `src/www/usuario.html` | 160 linhas, 15 campos, 3 `fieldset` |
| 4 | Criado `src/www/livro.html` | 123 linhas, 13 campos, 3 `fieldset` |
| 5 | Criado este `RELATORIO.md` | 14 seções de instruções de inclusão |

**Arquivos de código criados: 2** (conforme o pedido de não fazer tudo de uma vez).
**Arquivos de estrutura criados: 4** (`.gitkeep`, só para a pasta não sumir no Git).
**Arquivos de documentação criados: 1** (este).

---

## 3. Estrutura de pastas

```
ProvaN1/
├── RELATORIO.md              ← este documento
└── src/
    ├── www/                  ← DOCUMENT ROOT: é o que o navegador acessa
    │   ├── usuario.html      ← tela 1: cadastro de usuário
    │   ├── livro.html        ← tela 2: cadastro de livro
    │   └── inc/              ←includes PHP (cabeçalho, menu, rodapé)
    ├── php/                  ← controllers: recebem o POST, validam, salvam
    ├── js/                   ← máscaras e validações no navegador
    └── css/                  ← estilo visual
```

| Pasta | Para que serve | O que vai dentro depois |
|-------|----------------|-------------------------|
| `src/www/` | Raiz pública do site. É a única pasta exposta na web. | Páginas `.html` (agora) e `.php` (depois) |
| `src/www/inc/` | Trechos de HTML reutilizados (partials). Evita repetir cabeçalho e rodapé em todas as telas. | `cabecalho.php`, `menu.php`, `rodape.php`, `mensagens.php` |
| `src/php/` | Lógica do servidor. **Fica fora do `www` de propósito** — se estivesse dentro, qualquer um baixaria seu código pela URL. | `conexao.php`, `usuario.php`, `livro.php`, `emprestimo.php` |
| `src/js/` | Comportamento no navegador. | `mascaras.js`, `validacao.js` |
| `src/css/` | Aparência visual. | `estilo.css` |

> **Por que `src/php` fica FORA do `www`?** O PHP só executa quando o arquivo está dentro da pasta servida pelo Apache/XAMPP. Por isso `usuario.php` que processa o cadastro vai em `src/php/`, mas o servidor precisa de um *ponte* para executá-lo. Duas soluções, resolvidas na seção 10.

---

## 4. Arquivos criados

| Caminho | Linhas | Função |
|---------|--------|--------|
| `src/www/usuario.html` | 160 | Formulário de cadastro de usuário do sistema |
| `src/www/livro.html` | 123 | Formulário de cadastro de livro do sistema |
| `src/www/inc/.gitkeep` | 0 | Mantém a pasta `inc` versionada |
| `src/php/.gitkeep` | 0 | Mantém a pasta `php` versionada |
| `src/js/.gitkeep` | 0 | Mantém a pasta `js` versionada |
| `src/css/.gitkeep` | 0 | Mantém a pasta `css` versionada |

---

## 5. Convenções adotadas (regras para seguir ao continuar o projeto)

1. **`lang="pt-BR"`** no `<html>` e `<meta charset="UTF-8">` — obrigatório, senão acentos viram `Ã§`.
2. **`lang` + `charset` já vêm prontos** — não precisa editar a cada página nova.
3. **`name` dos campos em `snake_case`** (`data_nascimento`, `tipo_usuario`). Esse `name` é o que o PHP recebe em `$_POST`. Manter o mesmo nome do campo no HTML, no PHP e no banco evita bug de `Undefined array key`.
4. **`id` igual ao `name`**, e todo `<label>` com `for` apontando para o `id`. Sem isso, clicar no texto do rótulo não foca o campo — e o professor costuma contar isso como acessibilidade.
5. **Validação só com atributos HTML nativos** (`required`, `pattern`, `minlength`, `maxlength`, `min`, `max`). Zero JavaScript. O navegador já bloqueia o envio inválido e mostra a mensagem sozinho.
6. **Máscaras (CPF, CEP, telefone) NÃO foram feitas** — exigem JS. Os campos pedem **só os dígitos**, e o `title` de cada um explica isso ao usuário. Ao adicionar o JS, troque os `placeholder`s para o formato com traço.
7. **`action="#"` proposital.** Não é erro: o formulário ainda não tem back-end. Quando criar o PHP, troque por `../php/usuario.php` (seção 10.3).
8. **Campos obrigatórios** recebem `*` no rótulo, além do atributo `required`.
9. **`<main>`, `<header>`, `<fieldset>`/`<legend>`** — HTML5 semântico, sem uma linha de CSS.
10. **Indentação de 4 espaços**, sem tabs.

---

## 6. Formulário `usuario.html` — mapa dos campos

`action="#"`, `method="post"`, sem `enctype` (não há upload de arquivo nesta tela).

| `name` | type | Obrig. | Validação no navegador | O que validar no PHP depois |
|--------|------|--------|-------------------------|-----------------------------|
| `nome` | text | sim | `maxlength=100` | `trim()`, 3–100 chars, só letras/espaço |
| `email` | email | sim | formato de e-mail + `maxlength=120` | `filter_var(..., FILTER_VALIDATE_EMAIL)`, checar duplicidade |
| `cpf` | text | **sim** | `pattern=[0-9]{11}` (11 dígitos, sem pontos) | Validar os 2 dígitos verificadores, `UNIQUE` no banco |
| `data_nascimento` | date | **sim** | — | Não pode ser futura; idade mínima (ex.: 16 anos para empréstimo) |
| `telefone` | tel | não | `pattern=[0-9]{10,11}` | Normalizar para `(00) 00000-0000` |
| `tipo_usuario` | select | **sim** | não vazio (`value=""` no 1º `<option>`) | Lista branca: `aluno`, `professor`, `funcionario`, `visitante` |
| `cep` | text | **sim** | `pattern=[0-9]{8}` | Formatar para `00000-000`; opcional: API dos Correios |
| `endereco` | text | **sim** | `maxlength=150` | `trim()` |
| `complemento` | text | não | `maxlength=60` | — |
| `cidade` | text | **sim** | `maxlength=80` | `trim()`, **upper()** para padronizar |
| `estado` | select | **sim** | 27 UFs em `<option value="XX">` | Lista branca dos 27 valores |
| `senha` | password | **sim** | `minlength=8`, `maxlength=72` | **`password_hash($senha, PASSWORD_DEFAULT)`** — nunca plaintext |
| `confirmar_senha` | password | **sim** | `minlength=8` | `if ($senha !== $confirmar_senha)` → erro. **Nunca gravar este campo.** |
| `observacoes` | textarea | não | `maxlength=500` | — |
| `aceite_termos` | checkbox | **sim** | precisa estar marcado | Gravar data/hora do aceite para prova de conformidade |

> **Detalhe importante:** `maxlength=72` na senha não é arbitrário — o bcrypt (usado pelo `password_hash`) ignora tudo depois do 72º byte. Passar de 72 não gera erro, só truca.

---

## 7. Formulário `livro.html` — mapa dos campos

`action="#"`, `method="post"`, **`enctype="multipart/form-data"`** (obrigatório por causa do campo `capa`).

| `name` | type | Obrig. | Validação no navegador | O que validar no PHP depois |
|--------|------|--------|-------------------------|-----------------------------|
| `titulo` | text | **sim** | `maxlength=200` | `trim()`, não duplicado |
| `autor` | text | **sim** | `maxlength=150` | Tabela `autores` separada quando houver 2+ autores |
| `isbn` | text | **sim** | `pattern=([0-9]{10}|[0-9]{13})` | Calcular o dígito verificador, `UNIQUE` |
| `editora` | text | não | `maxlength=100` | `trim()`, **upper()** |
| `edicao` | number | não | `min=1`, `max=50`, `value=1` | Inteiro positivo |
| `ano_publicacao` | number | **sim** | `min=1500`, `max=2100` | `CHECK (ano_publicacao <= YEAR(CURDATE()))` |
| `numero_paginas` | number | **sim** | `min=1`, `max=20000` | Inteiro positivo |
| `categoria` | select | **sim** | 8 categorias, 1ª vazia | Lista branca / `FOREIGN KEY` para `categorias` |
| `idioma` | select | **sim** | 6 opções | Guardar o **código** (`pt-BR`, `en`) — não o texto |
| `sinopse` | textarea | não | `maxlength=1000` | `htmlspecialchars()` na exibição (XSS) |
| `estoque` | number | **sim** | `min=0`, `max=9999`, `value=1` | `DEFAULT 1` no banco |
| `disponivel_emprestimo` | checkbox | não | marcado por padrão | Checkbox desmarcado **não vem no POST** → usar `isset()` e gravar `0` |
| `capa` | file | não | `accept="image/png,image/jpeg,image/webp"` | Seção 12: mover para `uploads/`, renomear com `uniqid()`, validar tamanho máx. 2 MB |

> **Armadilha do checkbox:** se `disponivel_emprestimo` não for marcado, o navegador **não envia o campo**. O código precisa tratar isso com `isset($_POST['disponivel_emprestimo']) ? 1 : 0`.
>
> **Armadilha do número do ISBN:** o `pattern` só confere o **tamanho**. Sequências `0000000000` passam. A validação de verdade é o dígito verificador, no PHP.

---

## 8. Como incluir CSS depois

1. Crie o arquivo **`src/css/estilo.css`**.
2. Nos dois HTMLs, insira **1 linha** dentro do `<head>` — imediatamente **depois** da linha do `<title>`:

   - `usuario.html`: após a **linha 7**
   - `livro.html`: após a **linha 7**

```html
    <link rel="stylesheet" href="../css/estilo.css">
```

**Por que `../css/` e não `css/`?** Os arquivos estão em `src/www/`, e o CSS está em `src/css/`. O `../` sobe um nível: `src/www/` → `src/`. Só funciona porque `www` é a raiz servida.

---

## 9. Como incluir JS depois

Crie dois arquivos. **Não coloque JS dentro do HTML** — é má prática e atrapalha a manutenção.

**`src/js/mascaras.js`** — enquanto o usuário digita:
- CPF → `000.000.000-00` (limita a 14 posições)
- CEP → `00000-000`
- Telefone → `(00) 00000-0000`
- ISBN → `978-85-336-1696-7`

**`src/js/validacao.js`** — no `submit`:
- Confere se `senha === confirmar_senha` antes de enviar
- Contador de caracteres do `title` (usa o `maxlength` já pronto como fonte)
- Aviso se `ano_publicacao` for maior que o ano atual

Depois, insira **1 linha em cada HTML**, logo **antes** do `</body>`:

- `usuario.html`: entre as **linhas 158 e 159**
- `livro.html`: entre as **linhas 121 e 122**

```html
    <script src="../js/mascaras.js" defer></script>
    <script src="../js/validacao.js" defer></script>
```

> **`defer` é obrigatório:** garante que o script roda **depois** do HTML ser montado, senão `document.getElementById('cpf')` retorna `null` e a máscara não funciona.
>
> **Regra de ouro do JavaScript:** validação de verdade é sempre no PHP (seção 10). O JS é só para dar uma UX bonita — quem burla o navegador burla tudo.

---

## 10. Como incluir PHP depois

### 10.1 Estrutura que vai surgir

```
src/php/conexao.php        ← PDO + config do banco (singleton)
src/php/usuario.php        ← recebe POST de usuario.html
src/php/livro.php          ← recebe POST de livro.html
src/php/salvar_capa.php    ← helper do upload (só se usar a capa)
src/www/inc/cabecalho.php  ← <head> + cabeçalho
src/www/inc/menu.php       ← navegação
src/www/inc/rodape.php     ← rodapé
src/www/inc/mensagens.php  ← exibe erros/sucessos do POST
```

### 10.2 Criar a conexão (`src/php/conexao.php`)

```php
<?php
declare(strict_types=1);

final class Conexao
{
    private static ?PDO $pdo = null;

    public static function get(): PDO
    {
        if (self::$pdo === null) {
            $host = 'localhost';
            $db   = 'biblioteca_virtual';
            $user = 'root';
            $pass = '';

            self::$pdo = new PDO(
                "mysql:host={$host};dbname={$db};charset=utf8mb4",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );
        }
        return self::$pdo;
    }
}
```

Três decisões aí dentro, e o motivo de cada uma:
- **`PDO`** e não `mysqli`: o PDO é o padrão moderno e já prepara a migração para PostgreSQL.
- **`ERRMODE_EXCEPTION`**: sem isso, erros de SQL passam **silenciosamente** e você perde horas debugando.
- **`EMULATE_PREPARES => false`**: envia o prepared statement ao banco de verdade — é isso que protege contra **SQL Injection**.

### 10.3 Ligar o formulário ao PHP

Edite **uma única linha** em cada HTML:

| Arquivo | Linha | Trocar |
|---------|-------|--------|
| `usuario.html` | 16 | `action="#"` → `action="../php/usuario.php"` |
| `livro.html` | 16 | `action="#"` → `action="../php/livro.php"` |

Exemplo final em `usuario.html`:
```html
        <form action="../php/usuario.php" method="post">
```

> **Isso só funciona se `src/php` estiver dentro da pasta servida.** As duas soluções:
> - **Solução A (recomendada):** mover `src/php` para **dentro** de `src/www/php`. O caminho passa a ser `action="php/usuario.php"` e o PHP roda direto, sem dor de cabeça. Ainda assim continua **fora** de qualquer pasta publicamente indexável.
> - **Solução B:** manter onde está e configurar o Apache com `Alias`/`ProxyPass` mapeando `/php/` para `src/php/`.
>
> Escolha a **A**. Ela é a que os professores esperam em XAMPP. Depois de mover, atualize os caminhos das seções 8, 9 e 12.

### 10.4 Receber os dados (`src/php/usuario.php`)

```php
<?php
declare(strict_types=1);

require_once __DIR__ . '/conexao.php';

$erros = [];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../www/usuario.html');
    exit;
}

$nome     = trim($_POST['nome'] ?? '');
$email    = trim($_POST['email'] ?? '');
$senha    = $_POST['senha'] ?? '';
$confirmar = $_POST['confirmar_senha'] ?? '';

if (mb_strlen($nome) < 3 || mb_strlen($nome) > 100) {
    $erros[] = 'Nome deve ter entre 3 e 100 caracteres.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erros[] = 'E-mail inválido.';
}

if (!isset($_POST['aceite_termos'])) {
    $erros[] = 'É obrigatório aceitar as regras da biblioteca.';
}

if ($senha !== $confirmar) {
    $erros[] = 'As senhas não conferem.';
}

if ($erros !== []) {
    foreach ($erros as $erro) {
        echo '<p>' . htmlspecialchars($erro, ENT_QUOTES, 'UTF-8') . '</p>';
    }
    echo '<a href="../www/usuario.html">Voltar</a>';
    exit;
}

$sql = 'INSERT INTO usuarios (nome, email, senha_hash) VALUES (:nome, :email, :senha)';

$stmt = Conexao::get()->prepare($sql);
$stmt->execute([
    ':nome'  => $nome,
    ':email' => $email,
    ':senha' => password_hash($senha, PASSWORD_DEFAULT),
]);

echo '<p>Usuário cadastrado com sucesso.</p>';
echo '<a href="../www/usuario.html">Cadastrar outro</a>';
```

Pontos que valem na prova:
- `mb_strlen()` em vez de `strlen()` — `strlen()` conta **bytes**, então "coração" (8 bytes) passaria como 8 caracteres em vez de 7.
- `password_hash()` — **nunca** `md5()`/`sha1()`/plaintext.
- `htmlspecialchars()` — **XSS**: um usuário que digita `<script>alert(1)</script>` como nome seria executado na tela de outro usuário.
- `$_POST['x'] ?? ''` com `declare(strict_types=1)` — o PHP não inventa notice quando o campo não veio.

### 10.5 Como usar os includes

Para usar `inc/`, as páginas precisam virar `.php` (o `include` não roda em `.html`). Renomeie `usuario.html` → `usuario.php`, mantendo a estrutura, e substitua cabeçalho e rodapé:

```php
<?php include __DIR__ . '/inc/cabecalho.php'; ?>
    <main>
        <form action="../php/usuario.php" method="post">
            ... campos ...
        </form>
    </main>
<?php include __DIR__ . '/inc/rodape.php'; ?>
```

`__DIR__` é a pasta do arquivo atual, então o caminho **não quebra** se você mover o arquivo.

Em `inc/cabecalho.php` mora o `<head>` com o `<link>` do CSS (seção 8) e os `<script>` (seção 9). Assim, a alteração vale para **todas** as telas de uma vez.

---

## 11. Sugestão de banco de dados (para quando for criar as tabelas)

```sql
CREATE DATABASE biblioteca_virtual
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE biblioteca_virtual;

CREATE TABLE usuarios (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome           VARCHAR(100) NOT NULL,
    email          VARCHAR(120) NOT NULL UNIQUE,
    cpf            CHAR(11)     NOT NULL UNIQUE,
    data_nascimento DATE        NOT NULL,
    telefone       VARCHAR(11)  NULL,
    tipo_usuario   ENUM('aluno','professor','funcionario','visitante') NOT NULL,
    cep            CHAR(8)      NOT NULL,
    endereco       VARCHAR(150) NOT NULL,
    complemento    VARCHAR(60)  NULL,
    cidade         VARCHAR(80)  NOT NULL,
    estado         CHAR(2)      NOT NULL,
    senha_hash     VARCHAR(255) NOT NULL,
    observacoes    VARCHAR(500) NULL,
    aceite_termos  TINYINT(1)   NOT NULL DEFAULT 0,
    criado_em      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE livros (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo              VARCHAR(200) NOT NULL,
    autor               VARCHAR(150) NOT NULL,
    isbn                VARCHAR(13)  NOT NULL UNIQUE,
    editora             VARCHAR(100) NULL,
    edicao              TINYINT UNSIGNED NOT NULL DEFAULT 1,
    ano_publicacao     SMALLINT UNSIGNED NOT NULL,
    numero_paginas      SMALLINT UNSIGNED NOT NULL,
    categoria_id        INT UNSIGNED NOT NULL,
    idioma              VARCHAR(5)   NOT NULL DEFAULT 'pt-BR',
    sinopse             TEXT         NULL,
    estoque             SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    disponivel_emprestimo TINYINT(1) NOT NULL DEFAULT 1,
    capa                VARCHAR(255) NULL,
    criado_em           TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_livros_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    INDEX idx_livros_titulo (titulo)
);

CREATE TABLE emprestimos (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT UNSIGNED NOT NULL,
    livro_id        INT UNSIGNED NOT NULL,
    data_emprestimo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao  DATETIME NULL,
    CONSTRAINT fk_emprestimos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_emprestimos_livro   FOREIGN KEY (livro_id)   REFERENCES livros(id)
);
```

Observações:
- `utf8mb4` suporta emoji e títulos com acento completo.
- `UNIQUE` em `email`, `cpf` e `isbn` — o banco **recusa** duplicidade sozinho; o PHP só precisa de um `try/catch` na exceção.
- `senha_hash VARCHAR(255)` — o bcrypt gera 60 caracteres, mas `password_hash()` pode mudar de algoritmo no futuro; 255 evita truncamento.
- `data_devolucao NULL` = ainda não devolvido. É assim que se faz "emprestado" vs "disponível" sem campo booleano duplicado.

---

## 12. Upload da capa (se for usar)

1. Crie `src/www/uploads/` com permissão de escrita:
   ```bash
   mkdir -p src/www/uploads
   chmod 755 src/www/uploads
   ```
2. Em `livro.php`, o arquivo chega em `$_FILES['capa']`.
3. Valide **antes** de gravar:
   - `$_FILES['capa']['error'] === UPLOAD_ERR_OK`
   - tamanho `<= 2 * 1024 * 1024` (2 MB)
   - MIME real via `finfo_file(finfo_open(FILEINFO_MIME_TYPE), $tmp)` — **não confie** no `accept` do HTML, é só dica para o navegador
4. Renomeie antes de mover: `$nome = uniqid('capa_') . '.' . $ext;`
5. `move_uploaded_file($_FILES['capa']['tmp_name'], __DIR__ . '/../www/uploads/' . $nome);`

> Nunca use o nome original do arquivo — permite `../` (path traversal), espaço ou colisão com um arquivo existente. `uniqid()` elimina isso.

---

## 13. Como executar localmente

**Só para ver o HTML agora (nenhum PHP necessário):**
```bash
python3 -m http.server 8000 --directory src/www
```
Acesse `http://localhost:8000/usuario.html`.

**Depois que houver PHP:**
```bash
php -S localhost:8000 -t src/www
```

**No XAMPP:** copie a pasta `src` para `C:\xampp\htdocs\biblioteca` e acesse `http://localhost/biblioteca/src/www/usuario.html`. Se adoptou a Solução A da seção 10.3 (mover `php` para dentro de `www`), a URL fica `http://localhost/biblioteca/src/www/usuario.html` e o `action="php/usuario.php"` resolve.

---

## 14. Checklist de ações manuais

Na ordem:

- [ ] Abrir `src/www/usuario.html` e `src/www/livro.html` no navegador e testar o envio dos dois
- [ ] Criar `src/css/estilo.css` e inserir o `<link>` (seção 8) nos 2 arquivos
- [ ] Criar `src/js/mascaras.js` e `src/js/validacao.js` e inserir os `<script>` (seção 9)
- [ ] Criar `src/www/inc/cabecalho.php`, `menu.php`, `rodape.php`
- [ ] Mover `src/php` para `src/www/php` (Solução A, seção 10.3)
- [ ] Criar `src/php/conexao.php` (seção 10.2)
- [ ] Criar `src/php/usuario.php` e `src/php/livro.php` (seção 10.4)
- [ ] Trocar o `action="#"` nas linhas 16 dos 2 arquivos (seção 10.3)
- [ ] Rodar o SQL da seção 11
- [ ] Renomear os `.html` para `.php` e trocar cabeçalho/rodapé por `include` (seção 10.5)
- [ ] Criar `src/www/uploads/` se for usar a capa (seção 12)
- [ ] Remover os `.gitkeep` das pastas que já tiverem arquivos

---

## 15. Glossário: campo do HTML → coluna do banco

| HTML `name` | Tabela | Coluna | Tipo PHP |
|---|---|---|---|
| `nome` | `usuarios` | `nome` | `string` |
| `email` | `usuarios` | `email` | `string` |
| `cpf` | `usuarios` | `cpf` | `string` |
| `data_nascimento` | `usuarios` | `data_nascimento` | `string` |
| `telefone` | `usuarios` | `telefone` | `?string` |
| `tipo_usuario` | `usuarios` | `tipo_usuario` | `string` |
| `cep` | `usuarios` | `cep` | `string` |
| `endereco` | `usuarios` | `endereco` | `string` |
| `complemento` | `usuarios` | `complemento` | `?string` |
| `cidade` | `usuarios` | `cidade` | `string` |
| `estado` | `usuarios` | `estado` | `string` |
| `senha` | `usuarios` | `senha_hash` | `string` (via `password_hash`) |
| `confirmar_senha` | — | — | **não gravar** |
| `observacoes` | `usuarios` | `observacoes` | `?string` |
| `aceite_termos` | `usuarios` | `aceite_termos` | `int` (0/1) |
| `titulo` | `livros` | `titulo` | `string` |
| `autor` | `livros` | `autor` | `string` |
| `isbn` | `livros` | `isbn` | `string` |
| `editora` | `livros` | `editora` | `?string` |
| `edicao` | `livros` | `edicao` | `int` |
| `ano_publicacao` | `livros` | `ano_publicacao` | `int` |
| `numero_paginas` | `livros` | `numero_paginas` | `int` |
| `categoria` | `livros` | `categoria_id` | `int` (FK) |
| `idioma` | `livros` | `idioma` | `string` |
| `sinopse` | `livros` | `sinopse` | `?string` |
| `estoque` | `livros` | `estoque` | `int` |
| `disponivel_emprestimo` | `livros` | `disponivel_emprestimo` | `int` (0/1) |
| `capa` | `livros` | `capa` | `?string` (nome do arquivo) |

`?string` = pode ser `NULL` no banco.

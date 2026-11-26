<?php


function carregarEnv($arquivo) {
    if (!is_readable($arquivo)) {
        return;
    }
    $linhas = file($arquivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($linhas as $linha) {
        $linha = trim($linha);
        if ($linha === '' || $linha[0] === '#' || strpos($linha, '=') === false) {
            continue;
        }
        list($chave, $valor) = explode('=', $linha, 2);
        $chave = trim($chave);
        if ($chave !== '' && getenv($chave) === false) {
            putenv($chave . '=' . trim($valor));
        }
    }
}

// O .env fica na raiz do projeto (fora do DocumentRoot src/), para nao ser
// baixado pela web mesmo quando o .htaccess nao esta valendo (AllowOverride
// restrito) ou no servidor embutido do PHP. O caminho antigo continua valendo
// como fallback para quem ja tem o .env dentro de src/php/.
carregarEnv(__DIR__ . '/../../.env');
carregarEnv(__DIR__ . '/.env');

<?php

// Router pro servidor embutido do PHP (ele nao le .htaccess):
//
//     php -S 127.0.0.1:8000 -t src router.php
//
// Bloqueia arquivos sensiveis e devolve o resto pro servidor. Rode o comando
// acima na raiz do projeto (ProvaN1/).

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$caminho = rawurldecode($uri ?: '/');

$padraoBloqueio = '/(^|\/)(\.env|config\.php|conexao\.php|auth\.php|seguranca\.php|csrf\.php|teste_conexao\.php|router\.php)$|\.(sql|log|ini|bak|md)$/i';

if (preg_match($padraoBloqueio, $caminho)) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    exit('Acesso negado.');
}

// So deixa servir o que existe dentro de src/ (DocumentRoot).
$raizDoc = realpath(__DIR__ . '/src');
$alvo = realpath(__DIR__ . '/src' . $caminho);
if ($alvo === false || $raizDoc === false || strpos($alvo, $raizDoc) !== 0) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    exit('Nao encontrado.');
}

// O servidor embutido cuida do resto (HTML/CSS/JS/PHP publico).
return false;

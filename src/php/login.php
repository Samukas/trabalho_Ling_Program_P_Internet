<?php

$usuario = $_POST["usuario"] ?? "";
$senha = $_POST["senha"] ?? "";


if ($usuario == "" || $senha == "") {
    echo "Preencha o usuário e a senha.";
    exit;
}


if ($usuario == "admin" && $senha == "1234") {
    echo "Login realizado com sucesso!";
} else {
    echo "Usuário ou senha incorretos.";
}

?>
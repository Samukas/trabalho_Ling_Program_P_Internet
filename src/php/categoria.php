<?php

$nome = $_POST["nome"] ?? "";
$descricao = $_POST["descricao"] ?? "";
$codigo = $_POST["codigo"] ?? "";
$status = $_POST["status"] ?? "";
$localizacao = $_POST["localizacao"] ?? "";


if (
    $nome == "" ||
    $descricao == "" ||
    $codigo == "" ||
    $status == "" ||
    $localizacao == ""
) {
    echo "Preencha todos os campos da categoria.";
    exit;
}


if ($status != "ativa" && $status != "inativa") {
    echo "Selecione um status válido.";
    exit;
}


if (strlen($codigo) < 2) {
    echo "O código da categoria deve possuir pelo menos 2 caracteres.";
    exit;
}


echo "Categoria cadastrada com sucesso!";

?>
<?php

$titulo = $_POST["titulo"] ?? "";
$isbn = $_POST["isbn"] ?? "";
$ano = $_POST["ano"] ?? "";
$autor = $_POST["autor"] ?? "";
$categoria = $_POST["categoria"] ?? "";


if (
    $titulo == "" ||
    $isbn == "" ||
    $ano == "" ||
    $autor == "" ||
    $categoria == ""
) {
    echo "Preencha todos os campos do livro.";
    exit;
}


if (!is_numeric($ano)) {
    echo "O ano deve ser um número.";
    exit;
}


$anoAtual = date("Y");

if ($ano < 1000 || $ano > $anoAtual) {
    echo "Digite um ano de publicação válido.";
    exit;
}


echo "Livro cadastrado com sucesso!";

?>
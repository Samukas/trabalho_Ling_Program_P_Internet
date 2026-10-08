<?php

$nome = $_POST["nome"] ?? "";
$nacionalidade = $_POST["nacionalidade"] ?? "";
$dataNascimento = $_POST["dataNascimento"] ?? "";
$email = $_POST["email"] ?? "";
$biografia = $_POST["biografia"] ?? "";


if (
    $nome == "" ||
    $nacionalidade == "" ||
    $dataNascimento == "" ||
    $email == "" ||
    $biografia == ""
) {
    echo "Preencha todos os campos do autor.";
    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Digite um e-mail válido.";
    exit;
}


$data = strtotime($dataNascimento);

if ($data === false || $data > time()) {
    echo "A data de nascimento é inválida.";
    exit;
}


echo "Autor cadastrado com sucesso!";

?>
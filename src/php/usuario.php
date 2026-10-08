<?php

$nome = $_POST["nome"] ?? "";
$cpf = $_POST["cpf"] ?? "";
$email = $_POST["email"] ?? "";
$telefone = $_POST["telefone"] ?? "";
$dataNascimento = $_POST["data_nascimento"] ?? "";


if (
    $nome == "" ||
    $cpf == "" ||
    $email == "" ||
    $telefone == "" ||
    $dataNascimento == ""
) {
    echo "Preencha todos os campos do usuário.";
    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Digite um e-mail válido.";
    exit;
}


if (strlen($cpf) < 11) {
    echo "Digite um CPF válido.";
    exit;
}


echo "Usuário cadastrado com sucesso!";

?>
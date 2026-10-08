<?php

$usuario = $_POST["usuario"] ?? "";
$livro = $_POST["livro"] ?? "";
$dataEmprestimo = $_POST["dataEmprestimo"] ?? "";
$dataDevolucao = $_POST["dataDevolucao"] ?? "";
$observacao = $_POST["observacao"] ?? "";


if (
    $usuario == "" ||
    $livro == "" ||
    $dataEmprestimo == "" ||
    $dataDevolucao == "" ||
    $observacao == ""
) {
    echo "Preencha todos os campos do empréstimo.";
    exit;
}


$inicio = strtotime($dataEmprestimo);
$fim = strtotime($dataDevolucao);


if ($inicio === false || $fim === false) {
    echo "Digite datas válidas.";
    exit;
}


if ($fim < $inicio) {
    echo "A data de devolução não pode ser anterior à data do empréstimo.";
    exit;
}


$diferenca = $fim - $inicio;

$dias = $diferenca / (60 * 60 * 24);


if ($dias > 7) {
    echo "O empréstimo não pode ultrapassar 7 dias.";
    exit;
}


echo "Empréstimo registrado com sucesso!";

?>
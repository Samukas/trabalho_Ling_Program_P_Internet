(function () {
    'use strict';

    var nucleo = window.TPI2;
    if (!nucleo) {
        return;
    }

    function elemento(id) {
        return document.getElementById(id);
    }

    function render() {
        var login = elemento('tpi2-login');
        var painel = elemento('tpi2-painel');
        if (!login || !painel) {
            return;
        }
        var admin = nucleo.ehAdmin();
        login.hidden = admin;
        painel.hidden = !admin;

        var campo = elemento('loginAdmin');
        var senha = elemento('senhaAdmin');
        if (campo && !campo.value) {
            campo.value = nucleo.ADMIN_NOME;
        }
        if (senha) {
            senha.value = '';
        }
    }

    function liberar() {
        nucleo.entrarAdmin();
        render();
        nucleo.atualizarSessao();
        nucleo.toast('Acesso ao painel liberado.');
    }

    function falharLogin(msg, campo) {
        nucleo.marcarErro(campo);
        nucleo.toast(msg, 'erro');
        var botao = elemento('btnEntrarAdmin');
        if (botao) {
            botao.disabled = false;
        }
        var senha = elemento('senhaAdmin');
        if (senha) {
            senha.value = '';
            senha.focus();
        }
    }

    function loginLocal(identidade, senha) {
        var registro = identidade.trim().toLowerCase();
        var nomeOk = registro === nucleo.ADMIN_NOME || registro === nucleo.ADMIN_EMAIL;
        return nomeOk && senha === nucleo.ADMIN_SENHA;
    }

    function entrar(identidade, senha) {
        var url = (nucleo.base ? nucleo.base + '/' : '') + 'php/login.php';
        var corpo = 'usuario=' + encodeURIComponent(nucleo.ADMIN_NOME) +
                    '&senha=' + encodeURIComponent(senha);

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: corpo
        })
            .then(function (resposta) {
                return resposta.text();
            })
            .then(function (texto) {
                if (texto.trim() === 'Login realizado com sucesso!') {
                    liberar();
                } else {
                    falharLogin('Usuário ou senha incorretos.', 'senhaAdmin');
                }
            })
            .catch(function () {
                if (loginLocal(identidade, senha)) {
                    liberar();
                } else {
                    falharLogin('Usuário ou senha incorretos.', 'senhaAdmin');
                }
            });
    }

    function iniciarAdmin() {
        nucleo.sair();
        nucleo.atualizarSessao();

        var form = elemento('formLoginAdmin');
        if (form) {
            form.addEventListener('submit', function (evento) {
                evento.preventDefault();

                var identidade = elemento('loginAdmin').value;
                var senha = elemento('senhaAdmin').value;

                if (!identidade.trim()) {
                    falharLogin('Informe o usuário do administrador.', 'loginAdmin');
                    return;
                }
                if (!senha) {
                    falharLogin('Informe a senha do administrador.', 'senhaAdmin');
                    return;
                }

                var botao = elemento('btnEntrarAdmin');
                if (botao) {
                    botao.disabled = true;
                }
                nucleo.toast('Verificando credenciais...');
                entrar(identidade, senha);
            });
        }

        var botaoSair = elemento('btnSairAdmin');
        if (botaoSair) {
            botaoSair.addEventListener('click', function () {
                nucleo.sair();
                render();
                nucleo.atualizarSessao();
                nucleo.toast('Sessão encerrada.');
            });
        }

        var botaoVoltar = elemento('btnVoltarLogin');
        if (botaoVoltar) {
            botaoVoltar.addEventListener('click', function () {
                nucleo.voltar();
            });
        }

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarAdmin);
    } else {
        iniciarAdmin();
    }
}());

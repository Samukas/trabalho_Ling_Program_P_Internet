(function () {
    'use strict';

    var config = window.TPI2_CONFIG || {};

    var base = '';
    var eu = document.currentScript;
    if (eu && eu.src) {
        var parte = eu.src.split('?')[0];
        base = parte.replace(/\/js\/tpi2-ui\.js$/, '');
    }

    var CHAVE_SESSAO = 'tpi2_sessao';
    var CHAVE_CONTAS = 'tpi2_contas';
    var CHAVE_NAVEGACAO = 'tpi2_navegacao';
    var ADMIN_NOME = 'admin';
    var ADMIN_EMAIL = 'admin007@admin.com';
    var ADMIN_SENHA = '1234';

    function injetarCss() {
        var jaExiste = document.querySelector('link[data-tpi2]');
        if (jaExiste) {
            return;
        }
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = (base ? base + '/' : '') + 'css/estilo.css';
        link.setAttribute('data-tpi2', 'estilo');
        document.head.appendChild(link);
    }

    function toast(mensagem, tipo) {
        var caixa = document.createElement('div');
        caixa.className = 'tpi2-toast' + (tipo === 'erro' ? ' tpi2-toast-erro' : '');
        caixa.setAttribute('role', 'alert');
        caixa.textContent = mensagem;
        document.body.appendChild(caixa);

        setTimeout(function () {
            caixa.classList.add('saindo');
            setTimeout(function () {
                if (caixa.parentNode) {
                    caixa.parentNode.removeChild(caixa);
                }
            }, 350);
        }, 3200);
    }

    function limparErros(form) {
        var comErro = form.querySelectorAll('.tpi2-erro');
        for (var i = 0; i < comErro.length; i++) {
            comErro[i].classList.remove('tpi2-erro');
        }
    }

    function marcarErro(idCampo) {
        var campo = document.getElementById(idCampo);
        if (campo) {
            campo.classList.remove('tpi2-erro');
            void campo.offsetWidth;
            campo.classList.add('tpi2-erro');
            campo.focus();
            campo.addEventListener('input', function () {
                campo.classList.remove('tpi2-erro');
            }, { once: true });
        }
    }

    function lerJson(alvo, chave, padrao) {
        try {
            var bruto = alvo.getItem(chave);
            return bruto ? JSON.parse(bruto) : padrao;
        } catch (erro) {
            return padrao;
        }
    }

    function salvarJson(alvo, chave, valor) {
        try {
            alvo.setItem(chave, JSON.stringify(valor));
        } catch (erro) {
            return;
        }
    }

    function sessaoAtual() {
        return lerJson(sessionStorage, CHAVE_SESSAO, null);
    }

    function temSessao() {
        return !!sessaoAtual();
    }

    function ehAdmin() {
        var sessao = sessaoAtual();
        return !!sessao && sessao.tipo === 'admin';
    }

    function entrarAdmin() {
        salvarJson(sessionStorage, CHAVE_SESSAO, {
            tipo: 'admin',
            nome: ADMIN_NOME,
            email: ADMIN_EMAIL
        });
    }

    function sair() {
        sessionStorage.removeItem(CHAVE_SESSAO);
    }

    function registrarConta(nome, email, senha) {
        var contas = lerJson(localStorage, CHAVE_CONTAS, []);
        var registro = email.trim().toLowerCase();
        var existente = null;

        for (var i = 0; i < contas.length; i++) {
            if (contas[i].email === registro) {
                existente = contas[i];
                break;
            }
        }

        if (existente) {
            existente.nome = nome.trim();
            existente.senha = senha;
        } else {
            contas.push({ nome: nome.trim(), email: registro, senha: senha });
        }

        salvarJson(localStorage, CHAVE_CONTAS, contas);
        return { nome: nome.trim(), email: registro };
    }

    function entrarUsuario(email, senha) {
        var contas = lerJson(localStorage, CHAVE_CONTAS, []);
        var registro = email.trim().toLowerCase();

        for (var i = 0; i < contas.length; i++) {
            if (contas[i].email === registro && contas[i].senha === senha) {
                salvarJson(sessionStorage, CHAVE_SESSAO, {
                    tipo: 'usuario',
                    nome: contas[i].nome,
                    email: registro
                });
                return true;
            }
        }

        return false;
    }

    function paginaAtual() {
        return location.pathname.split('?')[0].split('#')[0];
    }

    function paginaInicial() {
        return (base ? base + '/' : '') + 'index.html';
    }

    function registrarNavegacao() {
        var pilha = lerJson(sessionStorage, CHAVE_NAVEGACAO, []);
        var atual = paginaAtual();

        if (pilha[pilha.length - 1] !== atual) {
            pilha.push(atual);
            if (pilha.length > 20) {
                pilha.shift();
            }
            salvarJson(sessionStorage, CHAVE_NAVEGACAO, pilha);
        }
    }

    function voltar() {
        var pilha = lerJson(sessionStorage, CHAVE_NAVEGACAO, []);
        pilha.pop();
        var alvo = pilha.pop();
        salvarJson(sessionStorage, CHAVE_NAVEGACAO, pilha);
        location.href = alvo ? alvo : paginaInicial();
    }

    function naPaginaInicial() {
        var caminho = paginaAtual();
        return caminho === '/' || /\/$/.test(caminho) || /(^|\/)index\.html$/.test(caminho);
    }

    function criarLinkVoltar() {
        var opcao = document.createElement('a');
        opcao.href = paginaInicial();
        opcao.textContent = 'Voltar';
        opcao.className = 'tpi2-link-voltar';
        opcao.addEventListener('click', function (evento) {
            evento.preventDefault();
            voltar();
        });
        return opcao;
    }

    function injetarVoltar() {
        if (naPaginaInicial()) {
            return;
        }
        var nav = document.querySelector('menutpi2 nav');
        if (nav) {
            if (nav.querySelector('.tpi2-link-voltar')) {
                return;
            }
            nav.insertBefore(criarLinkVoltar(), nav.firstChild);
            return;
        }
        if (document.querySelector('.tpi2-voltar-solto')) {
            return;
        }
        var corpo = document.querySelector('main') || document.body;
        var linha = document.createElement('p');
        linha.className = 'tpi2-voltar-solto';
        linha.appendChild(criarLinkVoltar());
        corpo.appendChild(linha);
    }

    function injetarSessao() {
        var menu = document.querySelector('menutpi2') || document.querySelector('header');
        if (!menu) {
            return;
        }
        var antiga = menu.querySelector('.tpi2-sessao');
        if (antiga) {
            antiga.parentNode.removeChild(antiga);
        }
        var sessao = sessaoAtual();
        if (!sessao) {
            return;
        }
        var caixa = document.createElement('div');
        caixa.className = 'tpi2-sessao';
        var texto = document.createElement('span');
        texto.textContent = 'Sessão: ' + sessao.nome + (sessao.tipo === 'admin' ? ' (administrador)' : '');
        var botao = document.createElement('button');
        botao.type = 'button';
        botao.textContent = 'Sair';
        botao.className = 'tpi2-btn-sair';
        botao.addEventListener('click', function () {
            sair();
            location.href = paginaInicial();
        });
        caixa.appendChild(texto);
        caixa.appendChild(botao);
        menu.appendChild(caixa);
    }

    function injetarAvisoEmprestimo() {
        var form = document.getElementById('formEmprestimo');
        if (!form || temSessao() || document.getElementById('tpi2-aviso-conta')) {
            return;
        }
        var aviso = document.createElement('div');
        aviso.id = 'tpi2-aviso-conta';
        aviso.className = 'tpi2-aviso';

        var texto = document.createElement('p');
        texto.textContent = 'Para registrar um empréstimo você precisa de uma conta. Crie a sua ou entre com o e-mail e a senha cadastrados.';

        var criar = document.createElement('p');
        var linkCriar = document.createElement('a');
        linkCriar.href = (base ? base + '/' : '') + 'www/usuario.html';
        linkCriar.textContent = 'Criar conta';
        criar.appendChild(linkCriar);

        var rapido = document.createElement('div');
        rapido.className = 'tpi2-login-rapido';
        var email = document.createElement('input');
        email.type = 'email';
        email.id = 'tpi2-conta-email';
        email.placeholder = 'E-mail da conta';
        email.autocomplete = 'email';
        var senha = document.createElement('input');
        senha.type = 'password';
        senha.id = 'tpi2-conta-senha';
        senha.placeholder = 'Senha';
        senha.autocomplete = 'current-password';
        var entrar = document.createElement('button');
        entrar.type = 'button';
        entrar.textContent = 'Entrar';

        entrar.addEventListener('click', function () {
            if (entrarUsuario(email.value, senha.value)) {
                aviso.parentNode.removeChild(aviso);
                injetarSessao();
                toast('Bem-vindo(a)!');
            } else {
                marcarErro('tpi2-conta-email');
                toast('E-mail ou senha incorretos.', 'erro');
            }
        });
        senha.addEventListener('keydown', function (evento) {
            if (evento.key === 'Enter') {
                entrar.click();
            }
        });

        rapido.appendChild(email);
        rapido.appendChild(senha);
        rapido.appendChild(entrar);
        aviso.appendChild(texto);
        aviso.appendChild(criar);
        aviso.appendChild(rapido);
        form.parentNode.insertBefore(aviso, form);
    }

    function interceptarCadastroUsuario() {
        var form = document.querySelector('form[action$="usuario.php"]');
        if (!form || form.getAttribute('data-tpi2-conta')) {
            return;
        }
        form.setAttribute('data-tpi2-conta', 'sim');
        form.addEventListener('submit', function () {
            var nome = form.querySelector('#nome');
            var email = form.querySelector('#email');
            var senha = form.querySelector('#senha');
            if (nome && email && senha && nome.value && email.value && senha.value) {
                var conta = registrarConta(nome.value, email.value, senha.value);
                salvarJson(sessionStorage, CHAVE_SESSAO, {
                    tipo: 'usuario',
                    nome: conta.nome,
                    email: conta.email
                });
            }
        });
    }

    function exigirConta(form) {
        if (form.id !== 'formEmprestimo' || temSessao()) {
            return false;
        }
        toast('Crie uma conta para registrar um empréstimo.', 'erro');
        setTimeout(function () {
            location.href = (base ? base + '/' : '') + 'www/usuario.html';
        }, 900);
        return true;
    }

    function enviarAoPhp(form) {
        if (!config.phpScript) {
            return;
        }
        form.action = (base ? base + '/' : '') + 'php/' + config.phpScript;
        form.method = 'post';

        toast('Enviando ao servidor...');
        var desabilitar = form.querySelectorAll('button');
        for (var i = 0; i < desabilitar.length; i++) {
            desabilitar[i].disabled = true;
        }

        setTimeout(function () {
            form.submit();
        }, 700);
    }

    function iniciar() {
        injetarCss();
        registrarNavegacao();
        injetarVoltar();
        injetarSessao();
        injetarAvisoEmprestimo();
        interceptarCadastroUsuario();

        var form = config.formId ? document.getElementById(config.formId) : null;
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (evento) {
            evento.preventDefault();
            limparErros(form);

            if (exigirConta(form)) {
                return;
            }

            var erro = config.validar ? config.validar(form) : null;

            if (erro) {
                marcarErro(erro.campo);
                toast(erro.msg, 'erro');
                return;
            }

            enviarAoPhp(form);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }

    window.TPI2 = {
        toast: toast,
        marcarErro: marcarErro,
        sessaoAtual: sessaoAtual,
        ehAdmin: ehAdmin,
        entrarAdmin: entrarAdmin,
        entrarUsuario: entrarUsuario,
        sair: sair,
        atualizarSessao: injetarSessao,
        voltar: voltar,
        base: base,
        ADMIN_NOME: ADMIN_NOME,
        ADMIN_EMAIL: ADMIN_EMAIL,
        ADMIN_SENHA: ADMIN_SENHA
    };
}());

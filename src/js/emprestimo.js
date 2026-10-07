var UM_DIA_MS = 24 * 60 * 60 * 1000;

function diferencaEmDias() {
    var inicio = document.getElementById('dataEmprestimo');
    var fim = document.getElementById('dataDevolucao');

    if (!inicio || !fim || !inicio.value || !fim.value) {
        return null;
    }

    var dataInicio = new Date(inicio.value + 'T00:00:00');
    var dataFim = new Date(fim.value + 'T00:00:00');

    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
        return null;
    }

    return Math.round((dataFim - dataInicio) / UM_DIA_MS);
}

function atualizarContador() {
    var campoFim = document.getElementById('dataDevolucao');
    if (!campoFim) {
        return;
    }

    var contador = document.getElementById('tpi2-contador');
    if (!contador) {
        contador = document.createElement('p');
        contador.id = 'tpi2-contador';
        contador.className = 'tpi2-info';
        campoFim.parentNode.insertBefore(contador, campoFim.nextSibling);
    }

    var dias = diferencaEmDias();

    if (dias === null) {
        contador.textContent = 'Escolha as duas datas para ver o prazo.';
        contador.classList.remove('tpi2-info-alerta');
        return;
    }

    if (dias < 0) {
        contador.textContent = 'A devolução está antes do empréstimo (' + dias + ' dia(s).)';
        contador.classList.add('tpi2-info-alerta');
        return;
    }

    contador.textContent = 'Prazo do empréstimo: ' + dias + ' dia(s) — limite de 7.';
    contador.classList.toggle('tpi2-info-alerta', dias > 7);
}

(function () {
    ['dataEmprestimo', 'dataDevolucao'].forEach(function (id) {
        var campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('change', atualizarContador);
        }
    });
    atualizarContador();
}());

window.TPI2_CONFIG = {
    formId: 'formEmprestimo',
    phpScript: 'emprestimo.php',

    validar: function () {
        var valor = function (id) {
            var campo = document.getElementById(id);
            return campo ? campo.value.trim() : '';
        };

        var campos = ['usuario', 'livro', 'dataEmprestimo', 'dataDevolucao', 'observacao'];
        for (var i = 0; i < campos.length; i++) {
            if (valor(campos[i]) === '') {
                return { campo: campos[i], msg: 'Preencha todos os campos do empréstimo.' };
            }
        }

        var dias = diferencaEmDias();
        if (dias === null) {
            return { campo: 'dataEmprestimo', msg: 'Digite datas válidas.' };
        }

        if (dias < 0) {
            return { campo: 'dataDevolucao', msg: 'A data de devolução não pode ser anterior à data do empréstimo.' };
        }

        if (dias > 7) {
            return { campo: 'dataDevolucao', msg: 'O empréstimo não pode ultrapassar 7 dias.' };
        }

        return null;
    }
};

(function () {
    var nucleo = document.createElement('script');
    nucleo.src = '../js/tpi2-ui.js';
    document.body.appendChild(nucleo);
}());

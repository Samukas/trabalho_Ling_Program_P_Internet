window.TPI2_CONFIG = {
    formId: 'formCategoria',
    phpScript: 'categoria.php',

    validar: function () {
        var valor = function (id) {
            var campo = document.getElementById(id);
            return campo ? campo.value.trim() : '';
        };

        var campos = ['nome', 'descricao', 'codigo', 'status', 'localizacao'];
        for (var i = 0; i < campos.length; i++) {
            if (valor(campos[i]) === '') {
                return { campo: campos[i], msg: 'Preencha todos os campos da categoria.' };
            }
        }

        var status = valor('status');
        if (status !== 'ativa' && status !== 'inativa') {
            return { campo: 'status', msg: 'Selecione um status válido.' };
        }

        if (valor('codigo').length < 2) {
            return { campo: 'codigo', msg: 'O código da categoria deve possuir pelo menos 2 caracteres.' };
        }

        return null;
    }
};

(function () {
    var nucleo = document.createElement('script');
    nucleo.src = '../js/tpi2-ui.js';
    document.body.appendChild(nucleo);
}());

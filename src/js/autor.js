window.TPI2_CONFIG = {
    formId: 'formAutor',
    phpScript: 'autor.php',

    validar: function () {
        var valor = function (id) {
            var campo = document.getElementById(id);
            return campo ? campo.value.trim() : '';
        };

        var campos = ['nome', 'nacionalidade', 'dataNascimento', 'email', 'biografia'];
        for (var i = 0; i < campos.length; i++) {
            if (valor(campos[i]) === '') {
                return { campo: campos[i], msg: 'Preencha todos os campos do autor.' };
            }
        }

        var email = valor('email');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { campo: 'email', msg: 'Digite um e-mail válido.' };
        }

        var nascimento = new Date(valor('dataNascimento') + 'T00:00:00');
        var hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        if (isNaN(nascimento.getTime()) || nascimento > hoje) {
            return { campo: 'dataNascimento', msg: 'A data de nascimento é inválida.' };
        }

        return null;
    }
};

(function () {
    var nucleo = document.createElement('script');
    nucleo.src = '../js/tpi2-ui.js';
    document.body.appendChild(nucleo);
}());

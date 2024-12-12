document.addEventListener('DOMContentLoaded', function () {
    var conteudo = document.querySelector(".conteudo");
    let professores = []; // Armazenar a lista de professores

    // Função para buscar todos os professores
    const fetchProfessores = async () => {
        try {
            const response = await fetch('http://localhost:8080/Professores/TodosProfessores', {
                method: 'GET'
            });
    
            if (response.ok) {
                professores = await response.json();
                console.log('Dados dos Professores:', professores);
            } else {
                console.log('Erro ao acessar os dados:', response.status);
            }
    
        } catch (error) {
            console.log('Erro na requisição:', error);
        }
    };

    // Função que será chamada após o carregamento da página
    setTimeout(() => {
        conteudo.classList.add('fadeOut');
    }, 1000);

    setTimeout(() => {
        conteudo.innerHTML = `
        <div class="fundoLogin">
            <div class="caixalogin">
                <h1 class="textoLogin">Login</h1>
                <div class="inputs">
                    <input type="text" name="user" id="user" placeholder="Usuário">
                    <input type="password" name="password" id="password" placeholder="Senha">
                </div>
                <input class="BtnLogin" type="submit" name="entrar" value="Entrar">
            </div>
            <div class="imagem">
                <img src="../img/logo.png" alt="Imagem de exemplo">
            </div>
        </div>
        `;
        conteudo.classList.remove('fadeOut');
        conteudo.classList.add('fadeIn');

        // Aguardar o click no botão de login
        document.querySelector('input[name=entrar]').addEventListener('click', (event) => {
            event.preventDefault();

            var user = document.getElementById('user').value;
            var password = document.getElementById('password').value;

            // Validar se ambos os campos foram preenchidos
            if (user === '' || password === '') {
                alert("Por favor, preencha ambos os campos.");
            } else {
                // Encontrar o professor que corresponde ao nome e senha
                const professor = professores.find(p => p.nome_Professor === user && p.senha_Professor === password);
                
                if (professor) {
                    sessionStorage.setItem('user', user);
                    window.location.href = 'TelaTurmas.html';
                } else {
                    alert("Login não efetuado. Verifique suas credenciais.");
                }
            }
        });
    }, 2000);

    // Chama a função de fetch para buscar professores
    fetchProfessores();
});

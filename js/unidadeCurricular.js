let unidadeCurricular = [];
const icones = ["img/iconLivro.png", "img/iconLivroAberto.png", "img/marcador.png"]; // Array com os ícones

// Função para embaralhar os ícones
const embaralharIcones = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const fetchUnidadeCurricular = async () => {
    try {
        const response = await fetch('http://localhost:8080/UnidadeCurricular/TodasUnidadesCurriculares', {
            method: 'GET'
        });

        if (response.ok) {
            unidadeCurricular = await response.json();
            console.log('Dados das Unidades Curriculares:', unidadeCurricular);

            const idTurma = Number(sessionStorage.getItem('idTurma'));
            if (!idTurma) {
                alert("Turma não autenticada. Redirecionando...");
                window.location.href = "index.html";
                return;
            }

            const unidadeCurricularProfessor = unidadeCurricular.filter(uc => uc.id_Turma === idTurma);

            if (unidadeCurricularProfessor.length > 0) {
                const containerImagens = document.querySelector(".containerImagens");

                // Embaralha os ícones
                const iconesAleatorios = embaralharIcones([...icones]);

                unidadeCurricularProfessor.forEach((unidade_Curricular, index) => {
                    // Usa um ícone diferente para cada unidade curricular, reinicia o ciclo se necessário
                    const icone = iconesAleatorios[index % iconesAleatorios.length];

                    containerImagens.innerHTML += `
                       <div class="item" data-name="${unidade_Curricular.nome_Curso}" data-id="${unidade_Curricular.id_curso}" style="visibility: hidden; opacity: 0;">
                            <a href="#"><img src="${icone}" alt="Ícone Livro"></a>
                            <p>${unidade_Curricular.nome_Curso}</p>
                        </div>
                    `;
                });

                // Captura cliques nos itens
                document.querySelectorAll(".item").forEach(item => {
                    item.addEventListener("click", (event) => {
                        event.preventDefault();
                        const idCurso = item.getAttribute('data-id')
                        const nomeUnidade = item.getAttribute('data-name');

                        if (nomeUnidade) {
                            console.log(`Item clicado, nome da Unidade Curricular: ${nomeUnidade}`);
                            sessionStorage.setItem('nomeUnidade', nomeUnidade);
                            sessionStorage.setItem('idDoCurso',idCurso)
                            sessionStorage.setItem('IdTurma',idTurma)
                            window.location.href = "materia.html";
                        } else {
                            console.error("Atributo data-name não encontrado no item clicado.");
                        }
                    });
                });

                mostrarItensSequencialmente();
            } else {
                console.log("Nenhuma unidade curricular encontrada para a turma:", idTurma);
            }
        } else {
            console.log('Erro ao acessar os dados:', response.status);
        }
    } catch (error) {
        console.log('Erro na requisição:', error);
    }
};

const mostrarItensSequencialmente = () => {
    const items = document.querySelectorAll(".item");
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.visibility = 'visible';
            item.style.opacity = '1';
            item.style.transition = 'opacity 1s linear';
        }, index * 500);
    });
};

// Chama a função de fetch
fetchUnidadeCurricular();

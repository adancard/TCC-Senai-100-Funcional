const idCurso = Number(sessionStorage.getItem('idDoCurso'))
const idTurma = Number(sessionStorage.getItem('IdTurma'))
let AlunoCriterio = []
let Alunos = []
let allCriterios = []
let criterio = []


const fetchAlunoCriterios = async () => {
    try {
        const response = await fetch(`http://localhost:8080/Aluno_Criterio/TodosAvaliados`, {
            method: 'GET'
        });
        if (response.ok) {
            AlunoCriterio = await response.json();
            console.log('Dados dos AlunoCriterio', AlunoCriterio);
        }
    } catch (error) {
        console.log('Erro na requisição:', error);
    }
};

const fetchCriterios = async () => {
    try {
        const response = await fetch(`http://localhost:8080/Criterios/BuscarCriterios`, {
            method: 'GET'
        });
        if (response.ok) {
            allCriterios = await response.json();
            console.log('Dados dos criterios', allCriterios);

            criterio = {
                desejados: allCriterios.filter(c => c.tipo === 'Desejada' && c.id_curso === idCurso),
                criticos: allCriterios.filter(c => c.tipo === 'Critica' && c.id_curso === idCurso)
            };
            console.log('Critérios separados:', criterio);
        }
    } catch (error) {
        console.log('Erro na requisição:', error);
    }
};

const fetchAlunos = async () => {
    try {
        const response = await fetch(`http://localhost:8080/Aluno/alunos`, {
            method: 'GET'
        });
        if (response.ok) {
            Alunos = await response.json();
            console.log('Dados dos alunos', Alunos);
        }

        const alunosFiltrados = Alunos.filter(a => a.id_turma === idTurma);
        const tabela = document.querySelector('tbody');

        if (alunosFiltrados.length === 0) {
            alert("Nenhum Aluno encontrado para esta Unidade");
            return;
        }

        alunosFiltrados.forEach((aluno) => {
            // Filtrar os critérios avaliados para o aluno atual
            const alunoCriteriosFiltrados = AlunoCriterio.filter(ac => ac.id.id_aluno === aluno.id_aluno);

            // Calcular a soma de critérios atingidos (desejados e críticos)
            const somaDesejados = (criterio.desejados || []).reduce((total, c) =>
                total + (alunoCriteriosFiltrados.some(ac => ac.id.id_criterio === c.id_criterio && ac.avaliacao === 'Atingiu') ? 1 : 0)
                , 0);

            const somaCriticos = (criterio.criticos || []).reduce((total, c) =>
                total + (alunoCriteriosFiltrados.some(ac => ac.id.id_criterio === c.id_criterio && ac.avaliacao === 'Atingiu') ? 1 : 0)
                , 0);

            // Adicionar linha na tabela com os resultados
            const linha = document.createElement('tr');
            linha.dataset.idAluno = aluno.id_aluno; // Armazena o ID do aluno na linha
            linha.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${somaCriticos}</td>
                <td>${somaDesejados}</td>
                <td><input type="text" placeholder="Nota" class="inputNota"></td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.log('Erro na requisição:', error);
    }
};


const capturarNotas = () => {

    const linhas = document.querySelectorAll('tbody tr');
    const Notas = [];


    linhas.forEach(linha => {
        const idAluno = linha.dataset.idAluno;
        const inputNota = linha.querySelector('.inputNota').value;
        const aluno = Alunos.find(a => a.id_aluno === Number(idAluno));

        Notas.push({
            nota: inputNota,
            id_alunoNota: idAluno,
            nomeAluno: aluno.nome
        });
    });

    if (Notas.length === 0) {
        alert("Nenhum aluno foi avaliado!");
        return [];
    }
    console.log("Estados coletados: ", Notas);  // Aqui você verifica os estados coletados
    return Notas;

}

document.querySelector(".btn-confirmar").addEventListener('click', async () => {
    const estados = capturarNotas();

    if (estados.length === 0) {
        alert("Nenhum aluno foi avaliado!");
        return;
    }

    try {
        for (const estado of estados) {
            const { nota, id_alunoNota, nomeAluno } = estado; // Inclua o nome do aluno
            const response = await fetch(`http://localhost:8080/NotaAluno/lancarNotas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([{
                    nota: nota,
                    id_alunoNota: id_alunoNota,
                    data_avaliacao: new Date().toISOString(),
                    nomeAluno: nomeAluno // Envie o nome do aluno
                }])
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("Erro na resposta do servidor:", error);
                alert("Erro ao enviar os dados.");
                return;
            }
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert("Erro ao enviar as avaliações.");
    }



});

// Função principal para carregar os dados
const carregarDados = async () => {
    try {
        await Promise.all([fetchCriterios(), fetchAlunoCriterios()]);
        await fetchAlunos();
    } catch (error) {
        console.log('Erro ao carregar os dados:', error);
    }
};

// Chama a função principal
carregarDados();

let Alunos = [];
let Criteiros = []
const IdTurma = Number(sessionStorage.getItem('IdTurma'));
const idCurso = Number(sessionStorage.getItem('idCurso'));
const idCompetencia = Number(sessionStorage.getItem('IdCompetencia'));
const selectDesejaveis = document.querySelector("select:nth-of-type(1)");
const selectCriticas = document.querySelector("select:nth-of-type(2)");

const resetSelects = (currentSelect) => {
    // Lista de todos os selects
    const selects = [selectDesejaveis, selectCriticas];

    // Reseta todos os selects, exceto o atual
    selects.forEach((select) => {
        if (select !== currentSelect) {
            select.value = ""; // Define o valor para o padrão (deve corresponder ao valor da opção padrão)
        }
    });
};

const preencherSelect = (selectElement, Criteiros) => {
    const defaultOption = document.createElement("option");
    defaultOption.value = ""; // Valor padrão
    defaultOption.textContent = "Selecione"; // Texto da opção padrão
    selectElement.appendChild(defaultOption);

    Criteiros.forEach((criterio) => {
        const option = document.createElement("option");
        option.value = criterio.id_criterio;
        option.textContent = criterio.nome;
        selectElement.appendChild(option);
    });
};


selectDesejaveis.addEventListener("change", (event) => {
    resetSelects(event.target); // Reseta os outros selects
    const selectedValue = event.target.value; // Acessa o valor selecionado
    console.log("Valor selecionado (Desejável):", selectedValue);
});

selectCriticas.addEventListener("change", (event) => {
    resetSelects(event.target); // Reseta os outros selects
    const selectedValue = event.target.value; // Acessa o valor selecionado
    console.log("Valor selecionado (Crítica):", selectedValue);
});


const fetchCriterios = async () => {

    try {
        const response = await fetch(`http://localhost:8080/Criterios/BuscarCriterios`, {
            method: 'GET'
        });
        if (response.ok) {
            Criteiros = await response.json();
            console.log('Dados dos Criteiros', Criteiros);
        }

        const CriteirosFiltrados = Criteiros.filter(c => c.id_competencia === idCompetencia && c.id_curso === idCurso);


        if (CriteirosFiltrados.length === 0) {
            alert("Nenhuma criticidade encontrada")
            return
        }

        const Desejavel = CriteirosFiltrados.filter((c) => c.tipo === "Desejada")
        const Critica = CriteirosFiltrados.filter((c) => c.tipo === "Critica")

        preencherSelect(selectDesejaveis, Desejavel)
        preencherSelect(selectCriticas, Critica)

    } catch (error) {
        console.log('Erro na requisição:', error);
    }
}

const fetchAlunos = async () => {
    try {
        const response = await fetch(`http://localhost:8080/Aluno/alunos`, {
            method: 'GET'
        });
        if (response.ok) {
            Alunos = await response.json();
            console.log('Dados dos alunos', Alunos);
        }

        const alunosFiltrados = Alunos.filter(a => a.id_turma === IdTurma);
        const tabela = document.querySelector('tbody');

        if (alunosFiltrados.length === 0) {
            alert("Nenhum Aluno encontrado para esta Unidade");
        } else {
            alunosFiltrados.forEach((aluno) => {
                const linha = document.createElement('tr');
                linha.dataset.idAluno = aluno.id_aluno; // Armazena o ID do aluno na linha
                linha.innerHTML = `
                    <td>${aluno.nome}</td>
                    <td><input type="button" value="Atingiu" class="btn-atingiu"></td>
                    <td><input type="button" value="Nao_atingiu" class="btn-nao-atingiu"></td>
                `;
                tabela.appendChild(linha);
            });

            // Adiciona o evento de clique para os botões
            const btnsAtingiu = document.querySelectorAll('.btn-atingiu');
            const btnsNaoAtingiu = document.querySelectorAll('.btn-nao-atingiu');

            btnsAtingiu.forEach(btn => {
                btn.addEventListener('click', () => {
                    resetButtonState(btn); // Reseta os outros botões
                    btn.style.backgroundColor = 'rgb(40, 167, 69)'; // Verde
                    btn.style.color = 'white';
                });
            });

            btnsNaoAtingiu.forEach(btn => {
                btn.addEventListener('click', () => {
                    resetButtonState(btn); // Reseta os outros botões
                    btn.style.backgroundColor = 'rgb(220, 53, 69)'; // Vermelho
                    btn.style.color = 'white';
                });
            });
        }
    } catch (error) {
        console.log('Erro na requisição:', error);
    }
};

const capturarEstados = () => {
    // Obtenha os valores dos selects
    const criterioDesejavelId = selectDesejaveis.value; 
    const criterioCriticaId = selectCriticas.value;

    // Verifique se pelo menos um dos selects está preenchido
    if (!criterioDesejavelId && !criterioCriticaId) {
        alert("Selecione pelo menos um critério (Desejável ou Crítico)!");
        return [];
    }

    const linhas = document.querySelectorAll('tbody tr');
    const estados = [];

    // Verifique todos os alunos
    linhas.forEach(linha => {
        const idAluno = linha.dataset.idAluno;
        const btnAtingiu = linha.querySelector('.btn-atingiu');
        const btnNaoAtingiu = linha.querySelector('.btn-nao-atingiu');

        let status = null;
        let idCriterio = null;

        // Se o botão "Atingiu" estiver selecionado
        if (btnAtingiu.style.backgroundColor === 'rgb(40, 167, 69)') { // Verde
            status = "Atingiu";
            // Atribua o critério do select que está preenchido
            idCriterio = criterioDesejavelId || criterioCriticaId; // Se critério desejável não estiver vazio, use-o; caso contrário, use o critério crítico.
        }
        // Se o botão "Não Atingiu" estiver selecionado
        else if (btnNaoAtingiu.style.backgroundColor === 'rgb(220, 53, 69)') { // Vermelho
            status = "Nao_atingiu";
            // Atribua o critério do select que está preenchido
            idCriterio = criterioCriticaId || criterioDesejavelId; // Se critério crítico não estiver vazio, use-o; caso contrário, use o critério desejável.
        }

        // Se o status e o critério foram definidos (ou seja, o aluno foi avaliado)
        if (status && idCriterio) {
            estados.push({
                id: {
                    id_aluno: idAluno,
                    id_criterio: idCriterio, // Passa o critério correto
                },
                avaliado: true,
                avaliacao: status, // Passa "Atingiu" ou "Nao_atingiu"
                data_avaliacao: new Date().toISOString()
            });
        }
    });

    // Verifica se há estados coletados para envio
    if (estados.length === 0) {
        alert("Nenhum aluno foi avaliado!");
        return [];
    }
    console.log("Estados coletados: ", estados);  // Aqui você verifica os estados coletados
    return estados;
};






const resetButtonState = (clickedButton) => {
    const linha = clickedButton.closest('tr');
    const botoes = linha.querySelectorAll('input[type="button"]');
    
    // Reseta todos os botões
    botoes.forEach(botao => {
        botao.style.backgroundColor = ''; // Remove a cor de fundo
        botao.style.color = ''; // Remove a cor do texto
        botao.removeAttribute("data-avaliacao"); // Remove o atributo de avaliação
    });

    // Define a cor do botão clicado e armazena a avaliação
    if (clickedButton.value === "Atingiu") {
        clickedButton.style.backgroundColor = '#28a745'; // Verde
        clickedButton.style.color = 'white';
        clickedButton.setAttribute("data-avaliacao", "Atingiu"); // Armazena a avaliação
    } else if (clickedButton.value === "Nao_atingiu") {
        clickedButton.style.backgroundColor = '#dc3545'; // Vermelho
        clickedButton.style.color = 'white';
        clickedButton.setAttribute("data-avaliacao", "Nao_atingiu"); // Armazena a avaliação
    }
};


// Adicionar o evento de clique para os botões
const btnsAtingiu = document.querySelectorAll('.btn-atingiu');
const btnsNaoAtingiu = document.querySelectorAll('.btn-nao-atingiu');

btnsAtingiu.forEach(btn => {
    btn.addEventListener('click', () => {
        resetButtonState(btn); // Reseta os outros botões
        btn.style.backgroundColor = '#28a745'; // Verde
        btn.style.color = 'white';
    });
});

btnsNaoAtingiu.forEach(btn => {
    btn.addEventListener('click', () => {
        resetButtonState(btn); // Reseta os outros botões
        btn.style.backgroundColor = '#dc3545'; // Vermelho
        btn.style.color = 'white';
    });
});

document.querySelector('.btn-confirmar').addEventListener('click', async () => {
    const criterioDesejavelId = selectDesejaveis.value;
    const criterioCriticaId = selectCriticas.value;

    if (!criterioDesejavelId && !criterioCriticaId) {
        alert("Selecione pelo menos um critério (Desejável ou Crítico) antes de enviar.");
        return;
    }

    const estados = capturarEstados();

    if (estados.length === 0) {
        alert("Nenhum aluno foi avaliado!");
        return;
    }

    try {
        // Loop sobre todos os estados para enviar as avaliações
        for (const estado of estados) {
            const { id: { id_aluno, id_criterio }, avaliacao } = estado;

            // Primeiro, verificamos se a avaliação já existe
            const responseExistente = await fetch(`http://localhost:8080/Aluno_Criterio/avaliacaoExistente/${id_aluno}/${id_criterio}`);
            const avaliacaoExistente = await responseExistente.json();

            let response;
            if (avaliacaoExistente) {
                // Se a avaliação já existir, enviamos um PUT para atualizar
                response = await fetch('http://localhost:8080/Aluno_Criterio/atualizaAvaliado', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: {
                            id_aluno: id_aluno,
                            id_criterio: id_criterio
                        },
                        avaliacao: avaliacao,
                        avaliado: true,
                        data_avaliacao: new Date().toISOString()
                    })
                });
            } else {
                // Se não existir, enviamos um POST para criar
                response = await fetch('http://localhost:8080/Aluno_Criterio/criarAvaliados', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify([{
                        id: {
                            id_aluno: id_aluno,
                            id_criterio: id_criterio
                        },
                        avaliacao: avaliacao,
                        avaliado: true,
                        data_avaliacao: new Date().toISOString()
                    }])
                });
            }

            if (!response.ok) {
                const error = await response.text();
                console.error("Erro na resposta do servidor:", error);
                alert("Erro ao enviar os dados.");
                return;
            }
        }

        alert("Avaliações enviadas com sucesso!");

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert("Erro ao enviar as avaliações.");
    }
});




fetchAlunos();
fetchCriterios();
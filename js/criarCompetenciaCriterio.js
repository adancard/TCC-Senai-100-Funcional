let criarCompetencias = [];
let Competencias = [];
let idCurso = Number(sessionStorage.getItem('idCurso'));
const selectSocioEmocionais = document.querySelector("select:nth-of-type(1)");
const selectTecnicas = document.querySelector("select:nth-of-type(2)");
const selectBasicas = document.querySelector("select:nth-of-type(3)");

const resetSelects = (currentSelect) => {
    // Lista de todos os selects
    const selects = [selectSocioEmocionais, selectTecnicas, selectBasicas];
    
    // Reseta todos os selects, exceto o atual
    selects.forEach((select) => {
        if (select !== currentSelect) {
            select.value = ""; // Define o valor para o padrão (deve corresponder ao valor da opção padrão)
        }
    });
};

const preencherSelect = (selectElement, competencias) => {
    // Adiciona a opção padrão
    const defaultOption = document.createElement("option");
    defaultOption.value = ""; // Valor padrão
    defaultOption.textContent = "Selecione"; // Texto exibido na opção padrão
    selectElement.appendChild(defaultOption);

    competencias.forEach((competencia) => {
        const option = document.createElement("option");
        option.value = competencia.id_competencia; // Substitua pelo nome correto do atributo de ID
        option.textContent = competencia.nome; // Substitua pelo nome correto do atributo
        selectElement.appendChild(option);
    });
};

// Adiciona eventos de mudança para os selects
selectSocioEmocionais.addEventListener("change", (event) => {
    resetSelects(event.target); // Reseta os outros selects
    const selectedValue = selectSocioEmocionais.value; // Valor selecionado
    console.log("Valor selecionado (Socioemocional):", selectedValue);
});

selectTecnicas.addEventListener("change", (event) => {
    resetSelects(event.target); // Reseta os outros selects
    const selectedValue = selectTecnicas.value; // Valor selecionado
    console.log("Valor selecionado (Técnica):", selectedValue);
});

selectBasicas.addEventListener("change", (event) => {
    resetSelects(event.target); // Reseta os outros selects
    const selectedValue = selectBasicas.value; // Valor selecionado
    console.log("Valor selecionado (Básica):", selectedValue);
});

const fetchCompetencias = async () => {
    try {
        const response = await fetch(`http://localhost:8080/Competencia/competencias`, {
            method: 'GET'
        });
        if (response.ok) {
            Competencias = await response.json();
            console.log('Dados Competencias', Competencias);
        }

        // Filtra as competências pelo idCurso
        const competenciasFiltradas = Competencias.filter(c => c.id_curso === idCurso);
        if (competenciasFiltradas.length === 0) {
            alert("Nenhuma competência encontrada para este curso");
            return;
        }

        // Filtra competências por tipo
        const socioEmocionais = competenciasFiltradas.filter((c) => c.tipo === "socioemocional");
        const tecnicas = competenciasFiltradas.filter((c) => c.tipo === "tecnica");
        const basicas = competenciasFiltradas.filter((c) => c.tipo === "basica");

        // Preenche os selects com as competências filtradas
        preencherSelect(selectSocioEmocionais, socioEmocionais);
        preencherSelect(selectTecnicas, tecnicas);
        preencherSelect(selectBasicas, basicas);

    } catch (error) {
        console.log('Erro na requisição:', error);
    }
};

// Lógica de criação de competência
document.querySelectorAll(".botao").forEach(item => {
    item.addEventListener("click", (event) => {
        event.preventDefault();
        const valorBotao = item.getAttribute('value');
        if (valorBotao) {
            localStorage.setItem('valorBotao', valorBotao);
            console.log("O valor do botao é " + valorBotao);
            console.log("Id do curso " + idCurso);
        } else {
            console.log("Nao Resgistrou");
        }
    });
});

document.querySelectorAll(".botaoDesejavel").forEach(item => {
    item.addEventListener("click", (event) => {
        event.preventDefault();
        const valorBotao = item.getAttribute('value');
        if (valorBotao) {
            localStorage.setItem('valorBotaoDesejavel', valorBotao);
            console.log("O valor do botao é " + valorBotao);
        } else {
            console.log("Nao Resgistrou");
        }
    });
});

// Lógica de confirmação para os critérios e competências
var botaoCompetencia = document.querySelectorAll('.botaoConfirmar')[0]; // Botão de Competência
var botaoCriticiadade = document.querySelectorAll('.botaoConfirmar')[1]; // Botão de Criticidade

botaoCriticiadade.addEventListener('click', async () => {
    const textoCriticidade = document.getElementById('textoCriticidade').value;
    const valorBotao = localStorage.getItem('valorBotaoDesejavel');
    // Pegar o ID da competência selecionada em um dos selects
    const idSocioemocional = selectSocioEmocionais.value;
    const idTecnico = selectTecnicas.value;
    const idBasico = selectBasicas.value;

    // Determinar qual select foi usado (considerando que apenas um será válido)
    const idCompetenciaSelecionada = idSocioemocional || idTecnico || idBasico;

    if (textoCriticidade.trim() === '' || !idCompetenciaSelecionada) {
        alert("Preencha os campos e selecione uma competência!");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/Criterios/CriarCriterio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: textoCriticidade,
                tipo: valorBotao,
                id_competencia: idCompetenciaSelecionada,
                id_curso: idCurso
            }),
        });

        if (response.ok) {
            const criarCriticidade = await response.json();
            console.log("Critério enviado com sucesso:", criarCriticidade);
            alert("Critério criado com sucesso!");

            // Limpa os campos
            document.getElementById('textoCriticidade').value = '';
        } else {
            const errorDetails = await response.json();
            console.error("Erro no servidor:", errorDetails || response.status);
            alert("Erro ao criar critério. Verifique os dados e tente novamente.");
        }
    } catch (error) {
        console.error("Erro na conexão com o servidor:", error);
        alert("Erro de conexão. Tente novamente mais tarde.");
    }
});

botaoCompetencia.addEventListener('click', async () => {
    const textoCompetencia = document.getElementById('textoCompetencia').value;
    const valorBotao = localStorage.getItem('valorBotao');

    if (textoCompetencia.trim() === '') {
        alert("Preencha os campos da competência");
        return;
    }

    try {
        // Requisição para o servidor
        const response = await fetch('http://localhost:8080/Competencia/CriarCompetencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: textoCompetencia, tipo: valorBotao, id_curso: idCurso }), // Corpo enviado
        });

        if (response.ok) {
            criarCompetencias = await response.json();
            console.log("Competência enviada com sucesso:", criarCompetencias);
            alert("Competência criada com sucesso!");

            // Limpa os campos
            document.getElementById('textoCompetencia').value = '';
            localStorage.removeItem('valorBotao');
        } else {
            const errorDetails = await response.json(); // Se o servidor envia detalhes do erro
            console.error("Erro no servidor:", errorDetails || response.status);
            alert("Erro ao criar competência. Verifique os dados e tente novamente.");
        }
    } catch (error) {
        console.error("Erro na conexão com o servidor:", error);
        alert("Erro de conexão. Tente novamente mais tarde.");
    }
});

// Chama a função para preencher os selects com as competências do curso
fetchCompetencias();

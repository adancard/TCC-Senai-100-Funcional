const idCurso = Number(sessionStorage.getItem('idCurso'));
const IdTurma = sessionStorage.getItem('IdTurma')
let Competencias = [];
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

// Lógica do botão de confirmação para selecionar a competência
document.querySelector('.ConfirmarCompetencia').addEventListener('click', () => {
    const idSocioemocional = selectSocioEmocionais.value;
    const idTecnico = selectTecnicas.value;
    const idBasico = selectBasicas.value;

    const idCompetenciaSelecionada = idSocioemocional || idTecnico || idBasico;

    if (!idCompetenciaSelecionada) {
        alert("Selecione uma competência antes de continuar.");
        return;
    }

    // Armazena o ID da competência selecionada e o ID do curso no sessionStorage
    sessionStorage.setItem('IdCompetencia', idCompetenciaSelecionada);
    sessionStorage.setItem('idCurso', idCurso);
    sessionStorage.setItem('IdTurma',IdTurma)

    // Redireciona para a página de avaliarAluno
    window.location.href = 'avaliarAluno.html';
});

// Chama a função para preencher os selects com as competências do curso
fetchCompetencias();

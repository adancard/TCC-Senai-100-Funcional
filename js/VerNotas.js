const idCurso = Number(sessionStorage.getItem('idDoCurso'))
const idTurma = Number(sessionStorage.getItem('IdTurma'))
const selectData = document.querySelector("select:nth-of-type(1)");
let Notas = [];
let Alunos = [];

// Função para converter a data para o formato ano-mês-dia (YYYY-MM-DD)
const formatarData = (data) => {
    const date = new Date(data);
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses começam de 0
    const dia = date.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

// Função para preencher o select com datas únicas
const preencherSelect = (selectElement, notas) => {
    // Adiciona a opção padrão
    const defaultOption = document.createElement("option");
    defaultOption.value = ""; // Valor padrão
    defaultOption.textContent = "Selecione"; // Texto exibido na opção padrão
    selectElement.appendChild(defaultOption);

    // Filtra as datas únicas
    const datasUnicas = [...new Set(notas.map(nota => formatarData(nota.data_avaliacao)))];

    // Adiciona as opções de datas no select
    datasUnicas.forEach((data) => {
        const option = document.createElement("option");
        option.value = data;
        option.textContent = data; // Usando data no formato YYYY-MM-DD como texto
        selectElement.appendChild(option);
    });
};

// Função para exibir o nome do aluno e a nota com base na data selecionada
const mostrarNotasPorData = (dataSelecionada) => {
    const tabela = document.querySelector('tbody');
    tabela.innerHTML = ''; // Limpa a tabela antes de exibir as notas filtradas

    const notasFiltradas = Notas.filter(nota => formatarData(nota.data_avaliacao) === dataSelecionada);

    if (notasFiltradas.length === 0) {
        alert("Nenhuma nota encontrada para a data selecionada.");
        return;
    }

    // Adiciona as notas na tabela com o nome do aluno e a nota
    notasFiltradas.forEach((nota) => {
        const aluno = Alunos.find(a => a.id_aluno === nota.id_alunoNota); // Encontrar o aluno correspondente à nota
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${aluno ? aluno.nome : 'Aluno não encontrado'}</td>
            <td>${nota.nota}</td>
        `;
        tabela.appendChild(linha);
    });
};

// Evento para capturar a data selecionada e mostrar as notas
selectData.addEventListener("change", (event) => {
    const selectedValue = selectData.value; // Valor selecionado
    console.log("Valor selecionado (Data):", selectedValue);
    mostrarNotasPorData(selectedValue);
});

// Função para buscar as notas
const fetchNotas = async () => {
    try {
        const response = await fetch(`http://localhost:8080/NotaAluno/Notas`, {
            method: 'GET'
        });
        if (response.ok) {
            Notas = await response.json();
            console.log('Dados das Notas', Notas);
        }

        preencherSelect(selectData, Notas); // Preenche o select com as datas
    } catch (error) {
        console.log('Erro na requisição:', error);
    }
};

// Função para buscar os alunos
const fetchAlunos = async () => {
    try {
        const response = await fetch(`http://localhost:8080/Aluno/alunos`, {
            method: 'GET'
        });
        if (response.ok) {
            Alunos = await response.json();
            console.log('Dados dos alunos', Alunos);
        }
    } catch (error) {
        console.log('Erro na requisição:', error);
    }
};

document.getElementById('gerarPdfBtn').addEventListener('click', async () => {
    try {
        // Fazer a requisição para gerar o PDF
        const response = await fetch('http://localhost:8080/NotaAluno/gerarPdf', {
            method: 'GET',
        });

        if (response.ok) {
            // Recebe o PDF em bytes e cria um link para fazer o download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Cria um link temporário para baixar o arquivo PDF
            const a = document.createElement('a');
            a.href = url;
            a.download = 'notas_alunos.pdf';  // Nome do arquivo para download
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Libera o objeto URL para evitar vazamento de memória
            window.URL.revokeObjectURL(url);
        } else {
            alert('Erro ao gerar o PDF');
        }
    } catch (error) {
        console.error('Erro ao enviar a solicitação para gerar o PDF:', error);
        alert('Ocorreu um erro ao tentar gerar o PDF.');
    }
});


// Função para carregar os dados iniciais
const carregarDados = async () => {
    try {
        await fetchAlunos();
        await fetchNotas();
    } catch (error) {
        console.log('Erro ao carregar os dados:', error);
    }
};

// Chama a função principal para carregar os dados
carregarDados();

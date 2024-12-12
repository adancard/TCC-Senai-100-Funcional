const nomeUnidade = sessionStorage.getItem('nomeUnidade');
const idCurso = sessionStorage.getItem('idDoCurso')
const idTurma = sessionStorage.getItem('IdTurma')
const Opcao = document.querySelectorAll('.item')
const botao = document.querySelectorAll('.botao')

console.log(idCurso)


botao[1].addEventListener('click',(event)=>{
    event.preventDefault()
    sessionStorage.setItem('idCurso',idCurso)
    sessionStorage.setItem('IdTurma',idTurma)
    window.location.href = 'darNotaAluno.html'
})

botao[2].addEventListener('click',(event)=>{
    event.preventDefault()
    sessionStorage.setItem('idCurso',idCurso)
    sessionStorage.setItem('IdTurma',idTurma)
    window.location.href = 'VerNotas.html'
})



Opcao[0].addEventListener('click',(event) =>{
    event.preventDefault()
    sessionStorage.setItem('idCurso',idCurso)
    sessionStorage.setItem('IdTurma',idTurma)
    window.location.href = 'escolherCompetencia.html'
})

Opcao[1].addEventListener('click',(event) =>{
        event.preventDefault()
        sessionStorage.setItem('idCurso',idCurso)
        window.location.href = 'criarCompetenciaCriterio.html'
})


var titulo = document.getElementsByTagName('title')
var cabecalho = document.getElementsByTagName('header')

titulo[0].innerHTML = nomeUnidade
cabecalho[0].innerHTML = `<h1>${nomeUnidade}</h1>` 


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

mostrarItensSequencialmente();
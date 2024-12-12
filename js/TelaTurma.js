let Turmas = [];
const icones = ["img/iconLivro.png", "img/iconLivroAberto.png", "img/marcador.png"]; // Array com os ícones
const movingImage = document.getElementById('movingImage');
const containerWidth = window.innerWidth;
const imageStart = "../img/baratão 1.png";
const imageMiddle = "../img/baratão fogo.png";
const imageEnd = "../img/po.png";

// Função para embaralhar os ícones
const embaralharIcones = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const fetchTurma = async () => {
    try {
        const response = await fetch('http://localhost:8080/Turmas/TodasTurmas', {
            method: 'GET'
        });

        if (response.ok) {
            Turmas = await response.json();
            console.log('Dados das Turmas:', Turmas);

            const user = sessionStorage.getItem('user');
            if (!user) {
                alert("Usuário não autenticado. Redirecionando...");
                window.location.href = "index.html";
                return;
            }

            const turmasDoProfessor = Turmas.filter(t => t.nome_Professor === user);

            var cabecalho = document.getElementsByTagName('header')
            cabecalho[0].innerHTML = "<h1>O Baratao<h1>"

            if (user === "Eduardo") {
                const containerImagens = document.querySelector(".containerImagens");
            
                // Adiciona a imagem inicial
                containerImagens.innerHTML = `
                    <img src="${imageStart}" class="moving-image" id="movingImage">
                `;
            
                const movingImage = document.getElementById('movingImage');
            
                // Configuração das imagens e da posição inicial
                const imageSequence = [imageStart, imageMiddle, imageEnd];
                let currentImageIndex = 0;
                let position = 0; // Posição inicial da imagem
                const speed = 3; // Velocidade de movimento em pixels
                const containerWidth = window.innerWidth;
            
                function moveAndChangeImage() {
                    // Atualiza a posição horizontal da imagem
                    position += speed;
            
                    // Reseta a posição quando chega ao fim da tela
                    if (position > containerWidth) {
                        position = -100; // Sai pela esquerda para reentrar na tela
                    }
            
                    // Move a imagem na direção horizontal
                    movingImage.style.left = `${position}px`;
            
                    // Troca a imagem com fade-out/fade-in ao atingir certos pontos
                    if (position > containerWidth / 4 && position <= containerWidth / 2) {
                        changeImage(1); // Troca para a imagem do meio
                    } else if (position > containerWidth / 2) {
                        changeImage(2); // Troca para a imagem final
                    } else {
                        changeImage(0); // Volta para a imagem inicial
                    }
                }
            
                function changeImage(index) {
                    if (currentImageIndex !== index) {
                        currentImageIndex = index;
            
                        // Aplica o efeito de fade-out
                        movingImage.classList.add("hidden");
            
                        // Aguarda o fade-out antes de trocar a imagem
                        setTimeout(() => {
                            movingImage.src = imageSequence[currentImageIndex];
            
                            // Aplica o efeito de fade-in ao terminar o carregamento
                            movingImage.onload = () => {
                                movingImage.classList.remove("hidden");
                            };
                        }, 500); // Tempo de fade-out no CSS
                    }
                }
            
                // Atualiza a posição da imagem continuamente
                setInterval(moveAndChangeImage, 16); // Aproximadamente 60 FPS
            }
            
            

            if (turmasDoProfessor.length > 0) {
                const containerImagens = document.querySelector(".containerImagens");

                // Embaralha os ícones
                const iconesAleatorios = embaralharIcones([...icones]);

                turmasDoProfessor.forEach((turma, index) => {
                    // Usa um ícone diferente para cada turma, reinicia o ciclo se necessário
                    const icone = iconesAleatorios[index % iconesAleatorios.length];

                    containerImagens.innerHTML += `
                        <div class="item" data-id="${turma.id_curso}" style="visibility: hidden; opacity: 0;">
                            <a href="unidadeCurricular.html"><img src="${icone}" alt="Ícone Livro"></a>
                            <p>${turma.nome_Turma}</p>
                        </div>
                    `;
                });

                document.querySelectorAll(".item").forEach(item => {
                    item.addEventListener("click", (event) => {
                        event.preventDefault(); // Caso você queira evitar o comportamento padrão
                        const idTurma = item.getAttribute("data-id"); // Pega o ID da turma clicada
                        sessionStorage.setItem('idTurma', idTurma);
                        window.location.href = 'unidadeCurricular.html';
                    });
                });

                mostrarItensSequencialmente();
            } else {
                console.log("Nenhuma turma encontrada para o professor:", user);
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
fetchTurma();

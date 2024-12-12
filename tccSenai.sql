create schema tccsenai;
use tccsenai;

create table professor(
nome_Professor varchar(100) primary key,
senha_Professor varchar(10) not null
);

create table turma(
	id_Turma integer primary key auto_increment,
	nome_Turma varchar(50) not null,
    nome_Professor varchar(100) not null,
    constraint fk_nome_Professor foreign key (nome_Professor) references professor(nome_Professor)
);

create table unidade_Curricular(
	id_curso integer primary key auto_increment,
	nome_Curso varchar(100) not null,
    id_Turma integer not null,
    constraint fk_id_Turma foreign key (id_Turma) references turma(id_Turma)
);

CREATE TABLE competencias (
	id_competencia integer auto_increment primary key,
    nome VARCHAR(100) not null,
    tipo ENUM ('socioemocional', 'basica', 'tecnica') not null,
    id_curso integer not null,
	constraint fk_id_curso foreign key (id_curso) references unidade_Curricular(id_curso)
);

CREATE TABLE criterio (
    id_criterio INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM ('Critica', 'Desejada') NOT NULL,
    nome VARCHAR(100) NOT NULL,
    id_Competencia integer NOT NULL,
    id_curso integer NOT NULL,
    CONSTRAINT fk_criterio_id_curso FOREIGN KEY (id_curso) REFERENCES unidade_Curricular(id_curso),
    CONSTRAINT fk_competencia_capacidade FOREIGN KEY (id_Competencia) REFERENCES competencias(id_competencia)
);

CREATE TABLE aluno (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY, 
    nome VARCHAR(100) NOT NULL,            
    email VARCHAR(100) UNIQUE NOT NULL,   
    id_turma INT NOT NULL,                 
    CONSTRAINT fk_aluno_turma FOREIGN KEY (id_turma) REFERENCES turma(id_turma)
);

CREATE TABLE aluno_criterio (
    id_aluno INT NOT NULL,                    
    id_criterio INT NOT NULL,                 
    data_avaliacao DATE NOT NULL,
    avaliado bool not null,
    avaliacao enum('Atingiu', 'Nao_atingiu') NOT NULL,
    observacoes TEXT,                         
    PRIMARY KEY (id_aluno, id_criterio),      
    CONSTRAINT fk_aluno FOREIGN KEY (id_aluno) REFERENCES aluno(id_aluno),
    CONSTRAINT fk_criterio FOREIGN KEY (id_criterio) REFERENCES criterio(id_criterio)
);

select * from criterio;

create table nota_aluno(
	id_nota integer auto_increment primary key,
    nota integer not null,
	data_avaliacao DATE NOT NULL,
    id_aluno_nota integer not null,
    nome_aluno varchar(100) not null,
	CONSTRAINT fk_alunoNota FOREIGN KEY (id_aluno_nota) REFERENCES aluno(id_aluno)
);

select * from nota_aluno;

insert into professor(nome_Professor,senha_Professor) 
values ('adan','123'),
('Eduardo','Baratao');

insert into turma(nome_Turma,nome_Professor)
values('Os CLT','adan'),
('Os desempregado', 'adan'),
('Não sei mais','adan');

insert into unidade_Curricular(nome_Curso,id_turma) 
values ('Como conseguir um emprego',2),
('Como não falhar na entrevista',2),
('Como Ficar no Emprego',1),
('Como nao ser Otario',1);

insert into aluno(nome,email,id_turma)
values('luis','luisAlmeida@gmail.com',2),
('Miguel','gay@gmail.com',2);

select * from aluno_criterio;

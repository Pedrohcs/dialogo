# T2S

## Sobre o projeto
Projeto com o objetivo de testar o conhecimento técnico para um processo seletivo.<br>
Neste projeto então temos o CRUD de duas entidades e a geração de um relatório final que una as duas informações, alem disso todas as funcionalidades estão disponíveis por API.

## Tecnologia utilizada
O projeto é composto majoritariamente por Javascript, utilizando o NodeJS, e usa os seguintes frameworks:
- [Express v4.17.1](https://expressjs.com)
- [Pg v8.7.3](https://node-postgres.com)

## Como começar
Para iniciar, é necessário ter em sua máquina as seguintes tecnologias:

- [Node v12.21.0](https://nodejs.org/ja/blog/release/v12.21.0/)
- [NPM v6.14.8](https://www.npmjs.com/) (Included in Node.js)
- [PostgresSQL v14.5](https://www.postgresql.org)

### Prerequisites
```
# Para verificar a instalação do Node e NPM
node -v
npm -v
```

### Banco de dados
Por ser uma aplicação mais objetiva, mais direta em sua execução. A ideia não foi realizar toda a tratativa do banco de dados na aplicação.<br>
Portanto é necessário criar seu banco de dados no PortgresSQL localmente e adicinar as duas tabelas utilizadas pelo projeto:
```
CREATE TABLE container(
	client VARCHAR(40) NOT NULL,
	identification_number VARCHAR(11) PRIMARY KEY,
	type VARCHAR(2) CHECK(type = '20' OR type = '40') NOT NULL,
	status VARCHAR(5) CHECK(status = 'Cheio' OR status = 'Vazio') NOT NULL,
	category VARCHAR(10) CHECK(category = 'Importacao' OR category = 'exportacao')
)
```
```
CREATE TABLE movement(
	code SERIAL PRIMARY KEY,
	type VARCHAR(40) NOT NULL,
	start_date TIMESTAMP NOT NULL,
	end_date TIMESTAMP CHECK(end_date > start_date),
	container VARCHAR(11) NOT NULL REFERENCES container(identification_number)
)
```

E ao criar seu banco e tabela, alterar no código a string de conexão. Fica no arquivo Server.js na linha 11:
```
const pool = new Pool({
    connectionString: 'postgres://postgres:123@localhost:5432/dialogo' //Altere aqui a sua string de conexão
})
```


### Instalação e execução
```sh
# 1. Clonar o repositorio
git clone https://github.com/Pedrohcs/t2s

# 2. Mover para o diretório clonado
cd .\t2s

# 3. Instalar os pacotes NPM
npm install

# 4. Rodar o projeto
npm start

```
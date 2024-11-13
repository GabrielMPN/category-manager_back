**🚀 Como rodar o projeto**
- Siga as etapas abaixo para configurar e rodar o projeto em sua máquina local:

1. Clonar o repositório
  - Primeiramente, faça o clone deste repositório para o seu ambiente local utilizando o Git.

2. Instalar as dependências
  - Navegue até o diretório do projeto clonado e instale as dependências necessárias com o comando:
npm install

3. Configurar as variáveis de ambiente
  - Após instalar as dependências, copie o arquivo .env.example para um novo arquivo .env. Em seguida, edite o arquivo .env com suas configurações locais.
  - Abra o arquivo .env e configure as variáveis conforme necessário:

        DB=""                  # URL do banco de dados
        DB_USER=""             # Usuário do banco de dados
        DB_PW=""               # Senha do banco de dados
        DB_HOST="localhost"    # Host do banco de dados

        BASIC_AUTH_USER=""         # Usuário para autenticação básica
        BASIC_AUTH_PASSWORD=""       # Senha para autenticação básica

        PORT=3200              # Porta em que o servidor irá rodar

4. Iniciar o servidor
  - Com as dependências instaladas e as variáveis configuradas, basta rodar o servidor de desenvolvimento: npm run dev
  - O servidor estará disponível na porta configurada (por padrão, PORT=3200).

5. Banco de Dados SQL
  - As migrações são executadas automaticamente ao iniciar o servidor, criando as tabelas necessárias no banco de dados. Não é necessário rodar comandos adicionais para isso!

6. Testes
  - Para rodar os testes basta utilizar o comando: npm test

7. Documentação
  - URL da documentação: http://localhost:3200/api-docs/#/

8. Dúvidas
  - E-mail: pantuffimpn@hotmail.com
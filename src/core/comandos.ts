import { down } from './models';
import { runCommand, renameFilesToTs } from './funcoes';

// Verificando o argumento passado via linha de comando

if (process.argv[2] === 'migrations'
    && process.argv[3] === 'down') {
    down();
} else if (process.argv[2] == 'migration:generate') {
    const dirPath = process.argv[3];  // O diretório onde a migração foi gerada
    const migrationName = process.argv[4];  // O nome da migração

    let comando = `npx sequelize-cli migration:generate --migrations-path ${dirPath} --name ${migrationName}`;

    runCommand(comando)
        .then((stdout) => {
            console.log(`Migração gerada com sucesso: ${stdout}`);

            // Após a migração ser gerada, renomeia os arquivos .js para .ts
            renameFilesToTs(dirPath);
        })
        .catch((err) => {
            console.error(err);
        });

} else {
    console.log('Argumento inválido.');
}


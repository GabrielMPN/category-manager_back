import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export const renameFilesToTs = (dirPath) => {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error(`Erro ao ler o diretório: ${err}`);
            return;
        }

        // Filtra apenas os arquivos .js
        const jsFiles = files.filter(file => file.endsWith('.js'));

        jsFiles.forEach((file) => {
            const oldPath = path.join(dirPath, file);
            const newPath = path.join(dirPath, file.replace('.js', '.ts'));

            // Renomeia o arquivo
            fs.rename(oldPath, newPath, (renameErr) => {
                if (renameErr) {
                    console.error(`Erro ao renomear o arquivo ${file}: ${renameErr}`);
                    return;
                }
                console.log(`Arquivo renomeado de ${file} para ${file.replace('.js', '.ts')}`);
            });
        });
    });
};

export const runCommand = (comando) => {
    return new Promise((resolve, reject) => {
      exec(comando, (err, stdout, stderr) => {
        if (err) {
          reject(`Erro ao executar o comando: ${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });
  };


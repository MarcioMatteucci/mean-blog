const path = require('path');

const validExtensions = ['.png', '.jpeg', '.jpg', '.gif'];

function isInvalidExtension(file) {
   const fileExtension = path.extname(file.name);
   return validExtensions.indexOf(fileExtension) === -1;
};

function isOversizeFile(file) {
   return file.truncated;
};

function renameFile(file, username) {
   return username + '-' + Date.now() + path.extname(file.name);
};

module.exports = {

   uploadFile: async (file, username) => {
      return new Promise(async (resolve, reject) => {
         try {
            // Valido
            if (isInvalidExtension(file)) {
               reject({ status: 413, msg: 'No es una extensión válida' });
            } else if (isOversizeFile(file)) {
               reject({ status: 413, msg: 'El archivo es demasiado pesado. Máximo: 5MB' });
            } else {
               const renamedFile = renameFile(file, username);
               const path = `./uploads/users/${renamedFile}`;
               // Muevo el archivo
               await file.mv(path);
               // Devuelvo el path
               resolve(path);
            }

         } catch (err) {
            reject({ status: 500, msg: 'Error al mover el archivo al path' });
         }
      });
   }

}
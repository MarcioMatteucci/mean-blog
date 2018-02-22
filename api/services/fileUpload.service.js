const path = require('path');

const validExtensions = ['.png', '.jpeg', '.jpg', '.gif'];

module.exports = {

   isValidExtension: (filename) => {
      const fileExtension = path.extname(filename);
      return validExtensions.indexOf(fileExtension) !== -1;
   },

   renameFile: (filename, username) => {
      return username + '-' + Date.now() + path.extname(filename);
   },


}
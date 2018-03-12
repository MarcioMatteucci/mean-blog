const Post = require('../models/post.model');
const User = require('../models/user.model');

module.exports = {
   searchAll: async (req, res) => {

      try {

         const searchTerms = new RegExp(req.query.searchTerms, 'i');

         const [users, posts] = await Promise.all([
            User.find({ username: searchTerms }, 'username name lastname email').exec(),
            Post.find({ title: searchTerms }, 'title user')
               .populate('user', 'username name lastname email')
               .exec()
         ]);

         res.status(200).json({
            users: {
               total: users.length,
               results: users
            },
            posts: {
               total: posts.length,
               results: posts
            }
         });

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al buscar', error: err });
      }


   }
}
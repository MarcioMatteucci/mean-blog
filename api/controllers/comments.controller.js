const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');

module.exports = {

   /*==============================
   Todos los comentarios de un post
   ==============================*/
   getCommentsByPost: async (req, res) => {

      const postId = req.params.id;

      await Post.findById(postId)
         .populate({
            path: 'comments',
            populate: {
               path: 'user',
               select: 'username'
            }
         })
         .exec()
         .then((post) => {
            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            } else {
               res.status(200).json({ comments: post.comments });
            }
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el post', error: err });
         });
   },

   /*=========================
   Crear comentario en un post
   =========================*/
   createComment: async (req, res) => {

      const postId = req.params.id;

      await Post.findById(postId)
         .exec()
         .then(async (post) => {
            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            } else {

               let userId = req.body.userId;
               let comment = req.body.comment;

               let newComment = await new Comment({ user: userId, comment });

               await newComment.save()
                  .then(async (comment) => {
                     await post.comments.push(comment._id);
                     await post.save()
                        .then((post) => {
                           Post.findOne(post)
                              .exec()
                              .then((post) => {
                                 res.status(201).json({ msg: 'Comentario creado', post, comment });
                              })
                              .catch((err) => {
                                 console.log(err);
                                 res.status(500).json({ msg: 'Error al obtener el post con el nuevo comentario', error: err });
                              });
                        })
                        .catch((err) => {
                           console.log(err);
                           res.status(500).json({ msg: 'Error al guardar el post con el nuevo comentario', error: err });
                        });
                  })
                  .catch((err) => {
                     console.log(err);
                     res.status(500).json({ msg: 'Error al guardar el nuevo comentario', error: err });
                  });
            }
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el post', error: err });
         });
   },


}
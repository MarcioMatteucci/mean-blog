const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');

module.exports = {

   /*==============================
   Obtener comentario por su id
   ==============================*/
   getCommentById: async (req, res) => {

      const id = await req.params.id;

      await Comment.findById(id)
         .populate('user', 'username')
         .populate('likedBy', 'username')
         .populate('dislikedBy', 'username')
         .exec()
         .then((comment) => {
            if (!comment) {
               return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID' });
            }

            res.status(200).json({ comment });
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el comentario', error: err });
         });
   },

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

               const userId = req.body.userId;
               const comment = req.body.comment;

               const newComment = await new Comment({ user: userId, comment });

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

   /*=========================
   Darle like a un Comentario
   =========================*/
   likeComment: async (req, res) => {

      const commentId = await req.params.id;

      await Comment.findById(commentId)
         .exec()
         .then(async (comment) => {

            if (!comment) {
               return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID' });
            } else {

               const userIdFromComment = await comment.user.toString();
               const userIdFromToken = await req.body.userId;

               // Valido que no sea un comentario del usuario
               if (userIdFromComment === userIdFromToken) {
                  return res.status(403).json({ msg: 'No puedes darle like a tu propio comentario' });
               }

               // Creo arrays con todos los usuarios que ya le dieron like y dislike
               const usersWhoLike = comment.likedBy.map(user => user.toString());
               const usersWhoDislike = comment.dislikedBy.map(user => user.toString());

               // Valido que no le haya dado like aun
               if (usersWhoLike.indexOf(userIdFromToken) !== -1) {
                  return res.status(403).json({ msg: 'Ya le has dado like' });
               }

               // Elimino el dislike del usuario si lo habia dado
               const index = usersWhoDislike.indexOf(userIdFromToken);

               if (index !== -1) {
                  await comment.set({ dislikes: comment.dislikes -= 1 });
                  await comment.dislikedBy.splice(index, 1);
               }

               // Persisto el like
               await comment.likedBy.push(userIdFromToken);
               await comment.set({ likes: comment.likes += 1 });
               await comment.save()
                  .then((comment) => {
                     Comment.findOne(comment)
                        .populate('user', 'username')
                        .populate('likedBy', 'username')
                        .populate('dislikedBy', 'username')
                        .exec()
                        .then((comment) => {
                           res.status(200).json({ msg: 'Has dado like', comment })

                        })
                        .catch((err) => {
                           console.log(err);
                           res.status(500).json({ msg: 'Error al obtener el comentario que se ha dado like', error: err });
                        });
                  })
                  .catch((err) => {
                     console.log(err);
                     res.status(500).json({ msg: 'Error al guardar el like en el comentario', error: err });
                  });
            }
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el comentario', error: err });
         });
   },

   /*===========================
   Darle dislike a un Comentario
   ============================*/
   dislikeComment: async (req, res) => {

      const commentId = await req.params.id;

      await Comment.findById(commentId)
         .exec()
         .then(async (comment) => {

            if (!comment) {
               return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID' });
            } else {

               const userIdFromComment = await comment.user.toString();
               const userIdFromToken = await req.body.userId;

               // Valido que no sea un comentario del usuario
               if (userIdFromComment === userIdFromToken) {
                  return res.status(403).json({ msg: 'No puedes darle dislike a tu propio comentario' });
               }

               // Creo arrays con todos los usuarios que ya le dieron like y dislike
               const usersWhoLike = comment.likedBy.map(user => user.toString());
               const usersWhoDislike = comment.dislikedBy.map(user => user.toString());

               // Valido que no le haya dado dislike aun
               if (usersWhoDislike.indexOf(userIdFromToken) !== -1) {
                  return res.status(403).json({ msg: 'Ya le has dado dislike' });
               }

               // Elimino el like del usuario si lo habia dado
               const index = usersWhoLike.indexOf(userIdFromToken);

               if (index !== -1) {
                  await comment.set({ likes: comment.likes -= 1 });
                  await comment.likedBy.splice(index, 1);
               }

               // Persisto el like
               await comment.dislikedBy.push(userIdFromToken);
               await comment.set({ dislikes: comment.dislikes += 1 });
               await comment.save()
                  .then((comment) => {
                     Comment.findOne(comment)
                        .populate('user', 'username')
                        .populate('likedBy', 'username')
                        .populate('dislikedBy', 'username')
                        .exec()
                        .then((comment) => {
                           res.status(200).json({ msg: 'Has dado dislike', comment })

                        })
                        .catch((err) => {
                           console.log(err);
                           res.status(500).json({ msg: 'Error al obtener el comentario que se ha dado dislike', error: err });
                        });
                  })
                  .catch((err) => {
                     console.log(err);
                     res.status(500).json({ msg: 'Error al guardar el dislike en el comentario', error: err });
                  });
            }
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el comentario', error: err });
         });
   },

   /*=======================
   Actualizar un comentario
   ========================*/
   updateComment: async (req, res) => {

      const id = await req.params.id;

      await Comment.findById(id)
         .exec()
         .then(async (comment) => {
            if (!comment) {
               return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID' });
            } else {

               // Valido que el usuario sea el creador del comentario
               const userIdFromComment = await comment.user.toString();
               const userIdFromToken = await req.body.userId;

               if (userIdFromComment !== userIdFromToken) {
                  return res.status(403).json({ msg: 'No puedes editar un comentario que no has creado' });
               }

               const newComment = await req.body.comment;

               comment.comment = newComment;

               await comment.save()
                  .then(async (comment) => {
                     await Comment.findOne(comment)
                        .populate('user', 'username')
                        .populate('likedBy', 'username')
                        .populate('dislikedBy', 'username')
                        .exec()
                        .then((comment) => {
                           res.status(200).json({ msg: 'Comentario actualizado', comment });
                        })
                        .catch((err) => {
                           console.log(err);
                           res.status(500).json({ msg: 'Error al obtener el comentario actualizado', error: err });
                        });
                  })
                  .catch((err) => {
                     console.log(err);
                     res.status(500).json({ msg: 'Error al guardar el comentario actualizado', error: err });
                  });
            }
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el comentario', error: err });
         });
   },

   /*=============================
   Eliminar comentario en un post
   ==============================*/
   deleteComment: async (req, res) => {

      const postId = await req.params.postId;

      await Post.findById(postId)
         .exec()
         .then(async (post) => {
            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            } else {
               const commentId = await req.params.commentId;

               // Creo array con todos los id de comentarios del post
               const postComments = await post.comments.map(comment => comment.toString());

               // Valido que el commentId este en el post
               const index = postComments.indexOf(commentId);
               if (index === -1) {
                  return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID en el post' });
               } else {
                  // El post existe y el comentario esta en el post

                  // Valido que el usuario sea el que escribio el comentario
                  await Comment.findById(commentId)
                     .exec()
                     .then(async (comment) => {

                        const userIdFromToken = req.body.userId;
                        const userIdFromComment = comment.user.toString();

                        if (userIdFromToken !== userIdFromComment) {
                           return res.status(403).json({ msg: 'No puedes eliminar un comentario que no has creado' });
                        }

                        // Elimino el comentario de su coleccion 
                        // y cuando termina elimino el comentario
                        // del array de comments del post
                        await comment.remove()
                           .then(async (comment) => {

                              await post.comments.splice(index, 1);
                              await post.save()
                                 .then((post) => {
                                    res.status(200).json({ msg: 'Cometario eliminado', post });
                                 })
                                 .catch((err) => {
                                    res.status(500).json({ msg: 'Error al eliminar el comentario del array de comentarios del post', error: err });
                                 });
                           })
                           .catch((err) => {
                              res.status(500).json({ msg: 'Error al eliminar el comentario', error: err });
                           });
                     })
                     .catch((err) => {
                        res.status(500).json({ msg: 'Error al obtener el comentario', error: err });
                     })
               }
            }
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el post', error: err });
         });
   },

}
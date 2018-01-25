const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');

module.exports = {

   /*==============================
   Obtener comentario por su id
   ==============================*/
   getCommentById: async (req, res) => {

      try {

         const comment = await Comment.findById(req.params.id)
            .populate('user', 'username')
            .populate('likedBy', 'username')
            .populate('dislikedBy', 'username')
            .exec();

         if (!comment) {
            return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID' });
         }

         res.status(200).json({ comment });

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al obtener el comentario', error: err });
      }

   },

   /*==============================
   Todos los comentarios de un post
   ==============================*/
   getCommentsByPost: async (req, res) => {

      try {

         const post = await Post.findById(req.params.id)
            .populate({
               path: 'comments',
               populate: {
                  path: 'user',
                  select: 'username'
               }
            })
            .exec();

         if (!post) {
            return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
         } else {
            res.status(200).json({ comments: post.comments });
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al obtener todos los comentarios', error: err });
      }

   },

   /*=========================
   Crear comentario en un post
   =========================*/
   createComment: async (req, res) => {

      try {

         const postToAddComment = await Post.findById(req.params.id).exec();

         if (!postToAddComment) {
            return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
         } else {

            // Espero hasta crear el nuevo comentario
            const newComment = await new Comment({
               user: req.body.userId,
               comment: req.body.comment
            });

            // Espero hasta guardar el comentario en su coleccion
            const comment = await newComment.save();

            // Espero hasta pushear el comentario en el array del post
            await postToAddComment.comments.push(comment._id);

            // Espero hasta guardo el post con el nuevo comentario
            const post = await postToAddComment.save();

            res.status(201).json({ msg: 'Comentario creado', post, comment });
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al guardar el nuevo comentario', error: err });
      }

   },

   /*=========================
   Darle like a un Comentario
   =========================*/
   likeComment: async (req, res) => {

      try {

         const comment = await Comment.findById(req.params.id).exec();

         if (!comment) {
            return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID' });
         } else {

            // Espero hasta obtener los ids
            const [userIdFromComment, userIdFromToken] = await Promise.all([comment.user.toString(), req.body.userId]);

            // Valido que no sea un comentario del usuario
            if (userIdFromComment === userIdFromToken) {
               return res.status(403).json({ msg: 'No puedes darle like a tu propio comentario' });
            }

            // Espero hasta crear los arrays con todos los usuarios que ya le dieron like y dislike
            const [usersWhoLike, usersWhoDislike] = await Promise.all([
               comment.likedBy.map(user => user.toString()),
               comment.dislikedBy.map(user => user.toString())
            ]);

            // Valido que no le haya dado like aun
            if (usersWhoLike.indexOf(userIdFromToken) !== -1) {
               return res.status(403).json({ msg: 'Ya le has dado like' });
            }

            // Elimino el dislike del usuario si lo habia dado
            const index = await usersWhoDislike.indexOf(userIdFromToken);

            if (index !== -1) {
               await Promise.all([
                  comment.set({ dislikes: comment.dislikes -= 1 }),
                  comment.dislikedBy.splice(index, 1)
               ]);
            }

            // Espero hasta setear el like en la coleccion
            await Promise.all([
               comment.likedBy.push(userIdFromToken),
               comment.set({ likes: comment.likes += 1 })
            ]);

            // Persisto el like
            const commentLiked = await comment.save();

            res.status(200).json({ msg: 'Has dado like', comment: commentLiked });
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al darle like al comentario', error: err });
      }

   },

   /*===========================
   Darle dislike a un Comentario
   ============================*/
   dislikeComment: async (req, res) => {

      try {

         const comment = await Comment.findById(req.params.id).exec();

         if (!comment) {
            return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID' });
         } else {

            // Espero hasta obtener los ids
            const [userIdFromComment, userIdFromToken] = await Promise.all([comment.user.toString(), req.body.userId]);

            // Valido que no sea un comentario del usuario
            if (userIdFromComment === userIdFromToken) {
               return res.status(403).json({ msg: 'No puedes darle dislike a tu propio comentario' });
            }

            // Espero hasta crear los arrays con todos los usuarios que ya le dieron like y dislike
            const [usersWhoLike, usersWhoDislike] = await Promise.all([
               comment.likedBy.map(user => user.toString()),
               comment.dislikedBy.map(user => user.toString())
            ]);

            // Valido que no le haya dado dislike aun
            if (usersWhodislike.indexOf(userIdFromToken) !== -1) {
               return res.status(403).json({ msg: 'Ya le has dado dislike' });
            }

            // Elimino el like del usuario si lo habia dado
            const index = await usersWhoLike.indexOf(userIdFromToken);

            if (index !== -1) {
               await Promise.all([
                  comment.set({ likes: comment.likes -= 1 }),
                  comment.likedBy.splice(index, 1)
               ]);
            }

            // Espero hasta setear el dislike en la coleccion
            await Promise.all([
               comment.dislikedBy.push(userIdFromToken),
               comment.set({ dislikes: comment.dislikes += 1 })
            ]);

            // Persisto el dislike
            const commentDisliked = await comment.save();

            res.status(200).json({ msg: 'Has dado dislike', comment: commentDisliked });
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al darle dislike al comentario', error: err });
      }

   },

   /*=======================
   Actualizar un comentario
   ========================*/
   updateComment: async (req, res) => {

      try {

         const commentToUpdate = await Comment.findById(req.params.id).exec();

         if (!commentToUpdate) {
            return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID' });
         } else {

            // Espero hasta obtener los user ids
            const [userIdFromPost, userIdFromToken] = await Promise.all([
               commentToUpdate.user.toString(),
               req.body.userId
            ]);

            // Valido que sea un comentario del usuario
            if (userIdFromPost !== userIdFromToken) {
               return res.status(403).json({ msg: 'No puedes editar un comentario que no has creado' });
            }

            // Espero hasta setear el comentario a actualizar
            commentToUpdate.comment = await req.body.comment;

            // Actualizo el comentario
            const commentUpdated = await commentToUpdate.save();

            // Busco el comentario actualizado para
            // mandarlo en la respuesta con los populate
            const comment = await Comment.findOne(commentUpdated)
               .populate('user', 'username')
               .populate('likedBy', 'username')
               .populate('dislikedBy', 'username')
               .exec();

            res.status(200).json({ msg: 'Comentario actualizado', comment });
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al actualizar el comentario', error: err });
      }

   },

   /*=============================
   Eliminar comentario en un post
   ==============================*/
   deleteComment: async (req, res) => {

      try {

         const post = await Post.findById(req.params.postId).exec();

         if (!post) {
            return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
         } else {

            // Creo array con todos los id de comentarios del post
            const postComments = await post.comments.map(comment => comment.toString());

            // Valido que el commentId este en el post
            const index = postComments.indexOf(req.params.commentId);
            if (index === -1) {
               return res.status(404).json({ msg: 'No se ha encontrado comentario con ese ID en el post' });
            } else {
               // El comentario existe y esta en el post

               // Valido que el usuario sea el que escribio el comentario
               const comment = await Comment.findById(req.params.commentId).exec();

               const [userIdFromToken, userIdFromComment] = await Promise.all([
                  req.body.userId,
                  comment.user.toString()
               ]);

               if (userIdFromToken !== userIdFromComment) {
                  return res.status(403).json({ msg: 'No puedes eliminar un comentario que no has creado' });
               }

               // Elimino el comentario de su coleccion y del array de comments del post en paralelo
               await Promise.all([comment.remove(), post.comments.splice(index, 1)]);

               // Guardo el post q se le quito el comentario
               const postUpdated = await post.save();

               res.status(200).json({ msg: 'Cometario eliminado', post: postUpdated });
            }
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al eliminar el comentario', error: err });
      }

   },

}
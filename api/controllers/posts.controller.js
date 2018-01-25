const Post = require('../models/post.model');
const User = require('../models/user.model');

module.exports = {

   /*==============
   Todos los Posts
   ===============*/
   getAllPosts: async (req, res) => {

      try {
         // Espero hasta q se ejecute la promesa que trae los posts
         const posts = await Post.find()
            .populate('user', 'username')
            .populate('likedBy', 'username')
            .populate('dislikedBy', 'username')
            .populate({
               path: 'comments',
               populate: {
                  path: 'user',
                  select: 'username'
               }
            })
            .sort({ createdAt: 'asc' })
            .exec()

         res.status(200).json({ total: posts.length, posts });

      } catch (err) {
         console.err(err);
         res.status(500).json({ msg: 'Error al obtener todos los posts', error: err });
      }

   },

   /*===========
   Post por Id
   ============*/
   getPostById: async (req, res) => {

      try {
         // Espero hasta que se ejecute la promesa que trae el post
         const post = await Post.findById(req.params.id)
            .populate('user', 'username')
            .populate('likedBy', 'username')
            .populate('dislikedBy', 'username')
            .populate({
               path: 'comments',
               populate: {
                  path: 'user',
                  select: 'username'
               }
            })
            .exec()

         if (!post) {
            return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
         }

         res.status(200).json({ post });

      } catch (err) {
         console.err(err);
         res.status(500).json({ msg: 'Error al obtener el post', error: err });
      }

   },

   /*===================
   Crear un nuevo Post
   ===================*/
   createPost: async (req, res) => {

      try {
         // Espero hasta crear el nuevo post
         const post = await new Post({
            title: req.body.title,
            body: req.body.body,
            user: req.body.userId
         });

         // Espero hasta guardar el nuevo post
         const newPost = await post.save();

         res.status(201).json({ msg: 'Post creado', post: newPost });

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al guardar el nuevo post', error: err })
      }

   },

   /*===================
   Darle like a un Post
   ===================*/
   likePost: async (req, res) => {

      try {
         // Espero hasta encontrar (o no) el post
         const post = await Post.findById(req.params.id).exec();

         if (!post) {
            return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
         } else {

            // Espero hasta obtener los user ids
            const [userIdFromPost, userIdFromToken] = await Promise.all([
               post.user.toString(),
               req.body.userId
            ]);

            // Valido que no sea un post del usuario
            if (userIdFromPost === userIdFromToken) {
               return res.status(403).json({ msg: 'No puedes darle like a tu propio post' });
            }

            // Espero hasta crear arrays con todos los usuarios que ya le dieron like y dislike
            const [usersWhoLike, usersWhoDislike] = await Promise.all([
               post.likedBy.map(user => user.toString()),
               post.dislikedBy.map(user => user.toString())
            ]);

            // Valido que no le haya dado like aun
            if (usersWhoLike.indexOf(userIdFromToken) !== -1) {
               return res.status(403).json({ msg: 'Ya le has dado like' });
            }

            // Elimino el dislike del usuario si lo habia dado
            const index = await usersWhoDislike.indexOf(userIdFromToken);
            if (index !== -1) {
               await Promise.all([
                  post.set({ dislikes: post.dislikes -= 1 }),
                  post.dislikedBy.splice(index, 1)
               ]);
            }

            // Espero hasta setear el like
            await Promise.all([
               post.likedBy.push(userIdFromToken),
               post.set({ likes: post.likes += 1 })
            ]);

            // Persisto el like
            const postLiked = await post.save();

            res.status(200).json({ msg: 'Has dado like', post: postLiked });
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al dar like al post', error: err });
      }

   },

   /*======================
   Darle dislike a un Post
   ======================*/
   dislikePost: async (req, res) => {

      try {
         // Espero hasta encontrar (o no) el post
         const post = await Post.findById(req.params.id).exec();

         if (!post) {
            return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
         } else {

            // Espero hasta obtener los user ids
            const [userIdFromPost, userIdFromToken] = await Promise.all([
               post.user.toString(),
               req.body.userId
            ]);

            // Valido que no sea un post del usuario
            if (userIdFromPost === userIdFromToken) {
               return res.status(403).json({ msg: 'No puedes darle dislike a tu propio post' });
            }

            // Espero hasta crear arrays con todos los usuarios que ya le dieron like y dislike
            const [usersWhoLike, usersWhoDislike] = await Promise.all([
               post.likedBy.map(user => user.toString()),
               post.dislikedBy.map(user => user.toString())
            ]);

            // Valido que no le haya dado dislike aun
            if (usersWhoDislike.indexOf(userIdFromToken) !== -1) {
               return res.status(403).json({ msg: 'Ya le has dado dislike' });
            }

            // Elimino el like del usuario si lo habia dado
            const index = await usersWhoLike.indexOf(userIdFromToken);
            if (index !== -1) {
               await Promise.all([
                  post.set({ likes: post.likes -= 1 }),
                  post.likedBy.splice(index, 1)
               ]);
            }

            // Espero hasta setear el dislike
            await Promise.all([
               post.dislikedBy.push(userIdFromToken),
               post.set({ dislikes: post.dislikes += 1 })
            ]);

            // Persisto el dislike
            const postDisliked = await post.save();

            res.status(200).json({ msg: 'Has dado dislike', post: postDisliked });
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al dar dislike al post', error: err });
      }

   },

   /*=================
   Actualizar un Post
   ==================*/
   updatePost: async (req, res) => {

      try {
         // Espero hasta encontrar (o no) el post         
         const postToUpdate = await Post.findById(req.params.id).exec();

         if (!postToUpdate) {
            return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
         } else {

            // Espero hasta obtener los user ids
            const [userIdFromPost, userIdFromToken] = await Promise.all([
               postToUpdate.user.toString(),
               req.body.userId
            ]);

            // Valido que sea un post del usuario
            if (userIdFromPost !== userIdFromToken) {
               return res.status(403).json({ msg: 'No puedes editar un post que no has creado' });
            }

            // Espero hasta setear el post a actualizar
            [postToUpdate.title, postToUpdate.body] = await Promise.all([req.body.title, req.body.body]);

            // Actualizo el post
            const postUpdated = await postToUpdate.save();

            // Busco el post acutalizado para mandarlo en
            // la respuesta con los populate
            const post = await Post.findOne(postUpdated)
               .populate('user', 'username')
               .populate('likedBy', 'username')
               .populate('dislikedBy', 'username')
               .populate({
                  path: 'comments',
                  populate: {
                     path: 'user',
                     select: 'username'
                  }
               })
               .exec()

            res.status(200).json({ msg: 'Post actualizado', post });
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al actualizar el post', error: err });
      }

   },

   /*===============
   Eliminar un Post
   ===============*/
   deletePost: async (req, res) => {

      try {
         // Espero hasta encontrar (o no) el post         
         const postToDelete = await Post.findById(req.params.id).exec();

         if (!postToDelete) {
            return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
         } else {

            // Espero hasta obtener los user ids
            const [userIdFromPost, userIdFromToken] = await Promise.all([
               postToDelete.user.toString(),
               req.body.userId
            ]);

            // Valido que sea un post del usuario
            if (userIdFromPost !== userIdFromToken) {
               return res.status(403).json({ msg: 'No puedes eliminar un post que no has creado' });
            }

            // Espero hasta eliminar el post
            const postDeleted = await postToDelete.remove();

            res.status(200).json({ msg: 'Post eliminado', postDeleted });
         }

      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Error al eliminar el post', error: err });
      }

   },



}
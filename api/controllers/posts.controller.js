const Post = require('../models/post.model');
const User = require('../models/user.model');

module.exports = {

   /*==============
   Todos los Posts
   ===============*/
   getAllPosts: async (req, res) => {

      await Post.find()
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
         .then((posts) => {
            res.status(200).json({ total: posts.length, posts });
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener todos los posts', error: err });
         });
   },

   /*===========
   Post por Id
   ============*/
   getPostById: async (req, res) => {

      const postId = await req.params.id;

      await Post.findById(postId)
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
         .then((post) => {
            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            }

            res.status(200).json({ post });
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el post', error: err });
         });
   },

   /*===================
   Crear un nuevo Post
   ===================*/
   createPost: async (req, res) => {

      // Datos del body
      const { title, body, userId } = await req.body;

      // Creo el nuevo post con los datos del body
      const newPost = await new Post({ title, body, user: userId });

      // Persistencia del nuevo post
      await newPost.save()
         .then((post) => {
            Post.findOne(post)
               .populate('user', 'username')
               .populate('likedBy', 'username')
               .populate('dislikedBy', 'username')
               .exec()
               .then((post) => {
                  res.status(201).json({ msg: 'Post creado', post })

               })
               .catch((err) => {
                  console.log(err);
                  res.status(500).json({ msg: 'Error al obtener el nuevo post', error: err });
               });
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al guardar el nuevo post', error: err });
         });
   },

   /*===================
   Darle like a un Post
   ===================*/
   likePost: async (req, res) => {

      const postId = req.params.id;
      const userId = req.body.userId;

      await Post.findById(postId)
         .exec()
         .then(async (post) => {

            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            } else {

               const userIdFromPost = post.user.toString();
               const userIdFromToken = userId;

               // Valido que no sea un post del usuario
               if (userIdFromPost === userIdFromToken) {
                  return res.status(403).json({ msg: 'No puedes darle like a tu propio post' });
               }

               // Creo arrays con todos los usuarios que ya le dieron like y dislike
               const usersWhoLike = post.likedBy.map(user => user.toString());
               const usersWhoDislike = post.dislikedBy.map(user => user.toString());

               // Valido que no le haya dado like aun
               if (usersWhoLike.indexOf(userIdFromToken) !== -1) {
                  return res.status(403).json({ msg: 'Ya le has dado like' });
               }

               // Elimino el dislike del usuario si lo habia dado
               const index = usersWhoDislike.indexOf(userIdFromToken);

               if (index !== -1) {
                  await post.set({ dislikes: post.dislikes -= 1 });
                  await post.dislikedBy.splice(index, 1);
               }

               // Persisto el like
               await post.likedBy.push(userIdFromToken);
               await post.set({ likes: post.likes += 1 });
               await post.save()
                  .then((post) => {
                     Post.findOne(post)
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
                        .then((post) => {
                           res.status(200).json({ msg: 'Has dado like', post })

                        })
                        .catch((err) => {
                           console.log(err);
                           res.status(500).json({ msg: 'Error al obtener el post que se ha dado like', error: err });
                        });
                  })
                  .catch((err) => {
                     console.log(err);
                     res.status(500).json({ msg: 'Error al guardar el like en el post', error: err });
                  });
            }
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el post', error: err });
         });
   },

   /*======================
   Darle dislike a un Post
   ======================*/
   dislikePost: async (req, res) => {

      const postId = req.params.id;
      const userId = req.body.userId;

      await Post.findById(postId)
         .exec()
         .then(async (post) => {

            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            } else {

               const userIdFromPost = post.user.toString();
               const userIdFromToken = userId;

               // Valido que no sea un post del usuario
               if (userIdFromPost === userIdFromToken) {
                  return res.status(403).json({ msg: 'No puedes darle dislike a tu propio post' });
               }

               // Creo arrays con todos los usuarios que ya le dieron like y dislike
               const usersWhoLike = post.likedBy.map(user => user.toString());
               const usersWhoDislike = post.dislikedBy.map(user => user.toString());

               // Valido que no le haya dado dislike aun
               if (usersWhoDislike.indexOf(userIdFromToken) !== -1) {
                  return res.status(403).json({ msg: 'Ya le has dado dislike' });
               }

               // Elimino el like del usuario si lo habia dado
               const index = usersWhoLike.indexOf(userIdFromToken);

               if (index !== -1) {
                  await post.set({ likes: post.likes -= 1 });
                  await post.likedBy.splice(index, 1);
               }

               // Persisto el dislike
               await post.dislikedBy.push(userIdFromToken);
               await post.set({ dislikes: post.dislikes += 1 });
               await post.save()
                  .then((post) => {
                     Post.findOne(post)
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
                        .then((post) => {
                           res.status(200).json({ msg: 'Has dado dislike', post })

                        })
                        .catch((err) => {
                           console.log(err);
                           res.status(500).json({ msg: 'Error al obtener el post que se ha dado dislike', error: err });
                        });
                  })
                  .catch((err) => {
                     console.log(err);
                     res.status(500).json({ msg: 'Error al guardar el dislike en el post', error: err });
                  });
            }
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Error al obtener el post', error: err });
         });
   },

   /*=================
   Actualizar un Post
   ==================*/
   updatePost: async (req, res) => {

      const postId = await req.params.id;
      const userId = await req.body.userId;

      await Post.findById(postId)
         .exec()
         .then(async (post) => {

            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            } else {

               // Valido que el usuario sea el creador del post
               const userIdFromPost = post.user.toString();
               const userIdFromToken = userId;

               if (userIdFromPost !== userIdFromToken) {
                  return res.status(403).json({ msg: 'No puedes editar un post que no has creado' });
               }

               const newTitle = await req.body.title;
               const newBody = await req.body.body;

               post.title = newTitle;
               post.body = newBody;

               await post.save()
                  .then((post) => {
                     Post.findOne(post)
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
                        .then((post) => {
                           res.status(200).json({ msg: 'Post actualizado', post });
                        })
                        .catch((err) => {
                           res.status(500).json({ msg: 'Error al obtener el post actualizado', error: err });
                        });
                  })
                  .catch((err) => {
                     res.status(500).json({ msg: 'Error al guardar el post actualizado', error: err });
                  });
            }
         })
         .catch((err) => {
            res.status(500).json({ msg: 'Error al obtener el post para actualizar', error: err });
         });
   },

   /*===============
   Eliminar un Post
   ===============*/
   deletePost: async (req, res) => {

      const postId = await req.params.id;
      const userId = await req.body.userId;

      await Post.findById(postId)
         .exec()
         .then(async (post) => {

            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            } else {

               // Valido que el usuario sea el creador del post
               const userIdFromPost = post.user.toString();
               const userIdFromToken = userId;

               if (userIdFromPost !== userIdFromToken) {
                  return res.status(403).json({ msg: 'No puedes eliminar un post que no has creado' });
               }

               await post.remove()
                  .then((post) => {
                     Post.findOne(post)
                        .exec()
                        .then((post) => {
                           if (post) {
                              return res.status(500).json({ msg: 'No se pudo eliminar el post', post });
                           }
                           res.status(200).json({ msg: 'Post eliminado' });
                        })
                        .catch((err) => {
                           res.status(500).json({ msg: 'Error al obtener el post eliminado', error: err });
                        });
                  })
                  .catch((err) => {
                     res.status(500).json({ msg: 'Error al eliminar el post', error: err });
                  });
            }
         })
         .catch((err) => {
            res.status(500).json({ msg: 'Error al obtener el post para eliminar', error: err });
         });
   },



}
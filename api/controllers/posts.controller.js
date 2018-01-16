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
         .sort({ createdAt: 'asc' })
         .exec()
         .then((posts) => {
            res.status(200).json({ total: posts.length, posts });
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Hay un error', error: err });
         });
   },

   /*===========
   Post por Id
   ============*/
   getPostById: async (req, res) => {

      const id = await req.params.id;

      await Post.findById(id)
         .populate('user', 'username')
         .populate('likedBy', 'username')
         .populate('dislikedBy', 'username')
         .exec()
         .then((post) => {
            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            }

            res.status(200).json({ post });
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Hay un error', error: err });
         });
   },

   /*===================
   Crear un nuevo Post
   ===================*/
   createPost: async (req, res) => {

      // Datos del body
      const { title, body, userId } = req.body;

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
                  res.status(500).json({ msg: 'Hay un error', error: err });
               });
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Hay un error', error: err });
         });
   },

   /*===================
   Darle like a un Post
   ===================*/
   likePost: async (req, res) => {

      const postId = req.params.id;
      const userId = req.body.userId;

      await Post.findById(postId)
         .populate('user', 'username')
         .populate('likedBy', 'username')
         .populate('dislikedBy', 'username')
         .exec()
         .then(async (post) => {

            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            } else {

               let userIdFromPost = post.user._id.toString();
               let userIdFromToken = userId;

               // Valido que no sea un post del usuario
               if (userIdFromPost === userIdFromToken) {
                  return res.status(403).json({ msg: 'No puedes darle like a tu propio post' });
               }

               // Creo arrays con todos los usuarios que ya le dieron like y dislike
               let usersWhoLike = post.likedBy.map(user => user._id.toString());
               let usersWhoDislike = post.dislikedBy.map(user => user._id.toString());

               // Valido que no le haya dado like aun
               if (usersWhoLike.indexOf(userIdFromToken) !== -1) {
                  return res.status(403).json({ msg: 'Ya le has dado like' });
               }

               // Elimino el dislike del usuario si lo habia dado
               let index = usersWhoDislike.indexOf(userIdFromToken);

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
                        .exec()
                        .then((post) => {
                           res.status(201).json({ msg: 'Has dado like', post })

                        })
                        .catch((err) => {
                           console.log(err);
                           res.status(500).json({ msg: 'Hay un error', error: err });
                        });
                  })
                  .catch((err) => {
                     console.log(err);
                     res.status(500).json({ msg: 'Hay un error', error: err });
                  });
            }

         })
         .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: 'Hay un error', error: err });
         });
   },

   /*======================
   Darle dislike a un Post
   ======================*/
   dislikePost: async (req, res) => {

      const postId = req.params.id;
      const userId = req.body.userId;

      await Post.findById(postId, async (err, post) => {
         if (err) {
            console.log(err);
            return res.status(500).json({ msg: 'Hay un error', error: err });
         }

         if (!post) {
            return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
         } else {

            let userIdFromPost = post.user._id.toString();
            let userIdFromToken = userId;

            // Valido que no sea un post del usuario
            if (userIdFromPost === userIdFromToken) {
               return res.status(403).json({ msg: 'No puedes darle dislike a tu propio post' });
            }

            // Creo arrays con todos los usuarios que ya le dieron like y dislike
            let usersWhoLike = post.likedBy.map(user => user._id.toString());
            let usersWhoDislike = post.dislikedBy.map(user => user._id.toString());

            // Valido que no le haya dado dislike aun
            if (usersWhoDislike.indexOf(userIdFromToken) !== -1) {
               return res.status(403).json({ msg: 'Ya le has dado dislike' });
            }

            // Elimino el like del usuario si lo habia dado
            let index = usersWhoLike.indexOf(userIdFromToken);

            if (index !== -1) {
               await post.set({ likes: post.likes -= 1 });
               await post.likedBy.splice(index, 1);
            }

            // Persisto el dislike
            await post.dislikedBy.push(userIdFromToken);
            await post.set({ dislikes: post.dislikes += 1 });
            await post.save()
               .then((post) => {
                  res.status(200).json({ msg: 'Has dado dislike', post })
               })
               .catch((err) => {
                  console.log(err);
                  res.status(500).json({ msg: 'Hay un error', error: err });
               });
         }
      });
   },




}
const Post = require('../models/post.model');

module.exports = {

   /*==============
   Todos los Posts
   ===============*/
   getAllPosts: async (req, res) => {

      await Post.find()
         .sort({ createdAt: 'asc' })
         .exec()
         .then((posts) => {
            return res.status(200).json({ total: posts.length, posts });
         })
         .catch((err) => {
            console.log(err);
            return res.status(500).json({ msg: 'Hay un error', error: err });
         });
   },

   /*===========
   Post por Id
   ============*/
   getPostById: async (req, res) => {

      const id = await req.params.id;

      await Post.findById(id).exec()
         .then((post) => {
            if (!post) {
               return res.status(404).json({ msg: 'No se ha encontrado post con ese ID' });
            }

            return res.status(200).json({ post });
         })
         .catch((err) => {
            console.log(err);
            return res.status(500).json({ msg: 'Hay un error', error: err });
         });
   },

   /*===================
   Crear un nuevo Post
   ===================*/
   createPost: async (req, res) => {

      // Datos del body
      const { title, body, user } = req.body;

      // Creo el nuevo post con los datos del body
      const newPost = await new Post({ title, body, user });

      // Persistencia del nuevo post
      await newPost.save()
         .then(async (post) => {
            return res.status(201).json({ msg: 'Usuario creado', post })
         })
         .catch(async (err) => {
            console.log(err);
            return res.status(500).json({ msg: 'Hay un error', error: err });
         });
   }




}
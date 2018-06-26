const { find, filter } = require('lodash')
const User = require('../models/user.model')
const Post = require('../models/post.model')
const Comment = require('../models/comment.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const resolvers = {
  Query: {
    user: async (_, args, { user }) => {
      let isUser = await User.findById(user._id).populate('posts')
      return isUser
    },
    posts: async () => {
      let posts = await Post.find().populate('userId').populate({
        path: 'comment',
        populate:{path:'userId'}
      }).populate('like')
      return posts
    },
   
  },
  Mutation: {
    signUp: async (_, { newUser }) => {
      await User.create(newUser)
      return newUser
    },
    signIn: async (_, { email, password }) =>{
      let salt = bcrypt.genSaltSync()
      let user = await User.findOne({email})
      let token = null
      let isUser = bcrypt.compareSync(password, user.password)
      if(isUser){
        let key = process.env.SECRET_KEY
        token = jwt.sign({
          _id: user._id,
          name: user.name,
          email,
          password
        }, key)
        return {
          message:'succes to login',
          _id: user._id,
          email,
          password,
          token
        }
      }else{
        return 'wrong password'
      }
    },
    addPost: async (_, { newPost }, { user }) => {
      if(!user) throw new Error('You are not authenticated!')
      newPost.userId = user._id
      let post = await Post.create(newPost)
      let addPostToUser = await User.findByIdAndUpdate(user._id, {
        $push:{
          posts: post._id
        }
      })
      return newPost
    },
    updatePost: async (_, { postId, updatedPost }, { user }) => {
      if(!user) throw new Error('You are not authenticated!')
      const post = await Post.findByIdAndUpdate(postId,{
        content: updatedPost.content,
        image: updatedPost.image
      })
      return updatedPost
    },
    deletePost: async(_, { postId }, { user }) => {
      if(!user) throw new Error('You are not authenticated!')
      await Post.findByIdAndRemove(postId)
      await User.findByIdAndUpdate(user._id, {
          $pull: {
            posts: postId
          }
      })
      return 'success to delete post'
    },
    addComment: async (_, { newComment, postId }, { user }) => {
      if(!user) throw new Error('You are not authenticated!')
      newComment.userId = user._id
      let comment = await Comment.create(newComment)
      let addCommentToPost = await Post.findByIdAndUpdate(postId, {
        $push:{
          comment: comment._id
        }
      })
      return newComment
    },
    updateComment: async (_, { commentId, updatedComment }, { user }) => {
      if(!user) throw new Error('You are not authenticated!')
      const comment = await Comment.findByIdAndUpdate(commentId,{
        content: updatedComment.content,
      })
      return updatedComment
    },
    deleteComment: async(_, { commentId, postId }, { user }) => {
      if(!user) throw new Error('You are not authenticated!')
      await Comment.findByIdAndRemove(commentId)
      await Post.findByIdAndUpdate(postId, {
          $pull: {
            comment: commentId
          }
      })
      return 'success to delete comment'
    },
    like: async(_, { postId }, { user }) => {
      if(!user) throw new Error('You are not authenticated!')
      let post = await Post.findById(postId).populate('like')
      let isUser = post.like.find(isUser=>{
        if(isUser._id==user._id){
          return user._id
        }
      })
      if(isUser){
        await Post.findByIdAndUpdate(postId,{
          $pull:{
            like:user._id
          }
        })
        return false
      }else{
        await Post.findByIdAndUpdate(postId,{
          $push:{
            like:user._id
          }
        })
        return true
      }
    
    },
    post: async (_, { postId }) => {
      let post= await Post.findById(postId).populate('userId').populate({
        path: 'comment',
        populate:{path:'userId'}
      })
      consol
      return post
    }
  }
}

module.exports = resolvers
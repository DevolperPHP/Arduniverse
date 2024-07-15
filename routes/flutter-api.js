const express = require("express")
const Project = require("../models/Project")
const User = require("../models/User")
const Category = require('../models/Category')
const Product = require('../models/Product')
const router = express.Router()

router.get("/home", async (req, res) => {
    try {
        const id = req.cookies.id
        const user = await User.findOne({ _id: id })
        if(user){
            const following = user.following.map(x => x.id)
            const data = await User.find({ _id: { $in: following }})
            const posts = data.map(x => x.posts)
            
            const userPosts = user.posts.map(x => x.projectImage)
            var notifications = []
            user.notifications.forEach(notify => {
                if(notify.status == "new"){
                    notifications.push(notify.status)
                }
            })
            var projects = []
    
            posts.forEach(post => {
                post.forEach(data => {
                    projects.push(data.projectImage)
                })
            })
    
            for (let i = 0; i < userPosts.length; i++) {
                projects.push(userPosts[i])
            }
    
            const project = await Project.find({ projectImage: {$in: projects}}).sort({ Date: -1 })
            const currentDate = project.reverse()
            res.json(currentDate)
        } else {
            res.redirect("/api/login")
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/shop', async (req, res) => {
    try {
        const id = req.cookies.id
        const user = await User.findOne({ _id: id })
        const products = await Product.find({}).sort({ Date: -1 })
        const category = await Category.find({}).sort({ Date: -1 })
        res.json(products)
    } catch (err) {
        console.log(err);
    }
})

router.get("/product/:name", async (req, res) => {
    try {
        const id = req.cookies.id
        const user = await User.findOne({ _id: id })
        const product = await Product.findOne({ name: req.params.name })
        res.json(product)
    } catch (err) {
        console.log(err);
    }
})

router.get("/category/:name", async (req, res) => {
    try {
        const id = req.cookies.id
        const user = await User.findOne({ _id: id })
        const products = await Product.find({ category: req.params.name })
        res.json(products)
    } catch (err) {
        console.log(err);
    }
})

module.exports = router
const blogschema = require("../models/blog")
const getuser = async(req,res)=>{
  try {
        const {title} =req.query
        if(title){
          const blogs = await blogschema.find( { title: { $regex: title, $options: "i" }} 
)
           if (blogs.length === 0) {
                return res.status(404).json({ 
                    status: false, 
                    message: "No blog found with this title" 
                });
            }
         return res.status(200).json({ status: true, message: "success", blog:blogs })
        }
        const blog = await blogschema.find()
        res.status(200).json({ status: true, message: "success", blog:blog})
    } catch (error) {
        res.status(500).json({ status: false, message: "something went wrong", error: error })
    }
}

const addUser = async()=>{

}
module.exports = {getuser,addUser}
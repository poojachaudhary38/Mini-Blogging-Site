const blogModel = require("../models/blogModel")
const Validator = require("../Validator/validation")
const authorModel = require("../models/authorModel")


const createBlog = async function (req, res) {
   try {
       const data = req.body;
       if (Object.keys(data).length == 0) {
        return res.status(400).send({ statu: false, msg: "No data in body"});
       }
       const { title, body, authorId, category } = data;
       if (!title) {
        return res.status(400).send({status: false, mag: "title is required"});
       }
       if (!body) {
        return res.status(400).send({status: false, msg: "body is reuired"});
       }
       if (!Validator.isValidObjectId(authorId)) {
        return res.status(400).send({ status: false, msg: "$(authorId) is not a valid authorId"});
       }
       if (!category) {
        return res.satus(400).send({status: false, msg: "category is required"});
       }

       const author = await authorModel.findById(authorId);
       if (!author) {
        return res.statu(400).send({ status: false, msg: "Author doesn't exists" });
       }

       const savedData = await blogModel.create(data);
       return res.status(200).send({msg: savedData});
      } catch (err){
        return res.status(500).send({status: false, msg: err.message});
      }

    };

    const getBlogs= async (req,res)=>{
    
        try
        {
        
        let id=req.query.authorid
        let category=req.query.category
        let subcategory=req.query.subcategory
        let tags=req.query.tags
          if(id){
            if(!isValidObjectId(id)){
                return res.status(400).send({status:false,msg: "Author ID is not valid"})
            }
            const validAuthorIds= (await authorModel.find().select({_id:1})).map((author)=>author._id.toString())
        
            // return res.send({msg: typeof validAuthorIds[0]})
            
            if(!validAuthorIds.includes(id)){
            return res.status(400).send({status:false,msg: "Author is not registered"})
            }
            let blog=await blogModel.find({authorId:id,isDeleted:false,isPusblished:true}).populate('authorId')
            if(blog.length==0){
                return res.status(404).send({status:false,msg:"Blog not available"})
            }
            return res.status(200).send({status:true,status:true,data:blog})
          }
      // check by category
       else  if(category){
            let allcat = await blogModel.find({category:category,isDeleted:false,published:true }).populate('authorId')
            if(allcat.length==0)
            return res.status(404).send({status:false, msg:"Blog not found"})
            else 
            return res.status(200).send({status:true,data:allcat,count:allcat.length})
        }
        // check subcategory
        else if(subcategory){
            const availableBlogs=await blogModel.find({isDeleted:false})
            if(subcategory.indexOf(',')==-1){
                subcategory=[subcategory]
            }
            else{
            subcategory=subcategory.split(",")
            }
            
            const filteredBlog=availableBlogs.filter((blog)=>{
                let status=true
                
                for(let i of subcategory){
                   if(blog.subcategory.includes(i)){
                    continue
                   }
                  status=false
                  break
                }
                return status
            })
            if(filteredBlog.length==0){
                return res.status(404).send({status:false,msg:"No blogs available with the given subcategory "})
            }
           return  res.send({status:false,msg:filteredBlog,count:filteredBlog.length})
        }
    
       
             // using tags check 
        
        else if(tags){
            const availableBlogs=await blogModel.find({isDeleted:false})
            if(tags.indexOf(',')==-1){
                tags=[tags]
            }
            else{
            tags=tags.split(",")
            }
            const filteredBlog=availableBlogs.filter((blog)=>{
                let status=true
                
                for(let i of tags){
                   if(blog.tags.includes(i)){
                    continue
                   }
                  status=false
                  break
                }
                return status
            })
            if(filteredBlog.length==0){
                return res.status(404).send({status:false,msg:"No blogs available with the given tags"})
            }
           return  res.send({status:true,msg:filteredBlog,count:filteredBlog.length})
        }
    
        else{
            const blogs=await blogModel.find({isDeleted:false,isPusblished:true})
            return res.status(200).send({status:true,msg:blogs})
        }
    
       }
    catch(error){
        res.status(500).send({status:false,"Server error":error.message})
    }
    }
    
const putBlog = async function (req, res) {
    try{
        let data = req.body;
        let authorId = req.query.authorId;
        let id = req.params.blogId;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({status: false, msg: "This key and value is not exist"});
        }
         
        if (!Validator.isValidObjectId(id)) {
            return res.status(400).send({status: false, msg: "This blogid is not exist"});
        }

        const deleteBlog = await blogModel.findById(id);

        if (deleteBlog.isDeleted == true) {
            return res.status(400).send({status: false, msg: "Blog is deleted"});
        }

        let blogFound = await blogModel.findOne({_id: id });
        if (!blogFound) {
            return res.status(400).send({status: false, msg: "Blog id is not correct"});
        }

        let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: id }, { $addToSet: { tags: data.tags, subcategor: data.subcategory },
                           $set: {title: data.title, body: data.body, category: data.category },
                        },
                        { new: true, upsert: true }
        );
        return res.status(200).send({status: true, data: updatedBlog});
    } catch (err) {
        res.status(500).send({status: false, msg: err.message});
    }
};

const deleteBlog=async function(req,res){
    
    try{

        let blog= req.params.blogId
            let findBlog= await blogModel.findOne({_id:blog,isDeleted:false})
            //console.log(blog)
        //   let blogid=findBlog._id

            if(!findBlog){
                res.status(404).send({ status: false, msg: "blog document doesn't exist" })
            }

            if(findBlog.isDeleted==true){
                res.status(404).send({ status: false, msg: "blog is deleted" })
            }
            else{
            const findToDelete= await blogModel.findOneAndUpdate(
                {_id:findBlog},
                {$set:{isDeleted:true}},
                {new:true})
                res.status(200).send({ status: true, msg: findToDelete })
        }
    
    }
catch (err) {
      res.status(500).send({ status: false, msg: err.message })
    }
};


const deleteBlogBy=async function(req,res){
    try{
        let data = req.query
        data.isDeleted=false
                
        let filterTheBlog= await blogModel.find(data)
        if(filterTheBlog.length==0){
           return res.status(404).send({ status: false, msg: "blog document does'nt exist" })
        } 

        let findToDelete= await blogModel.findOneAndUpdate(data,
            {$set:{isDeleted:true}},
            {new:true}) 

              return  res.status(200).send({ status: true, msg: findToDelete })
        }catch (err) {
      res.status(500).send({ status: false, msg: err.message })//error
    }
}


module.exports.createBlog = createBlog ;
module.exports.getBlogs = getBlogs;
module.exports.putBlog = putBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogBy = deleteBlogBy;
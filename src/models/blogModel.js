const mongoose= require('mongoose'); 
const ObjectId  = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
    { title:
        {
            type: String,
            required: true
        },
     body:
     {
        type: String,
        required: true
    },
     authorId: 
      {
        type: ObjectId,
        ref: "Author",
        required: true
     },

    tags: [String],
    category: 
       {
        type: String,
        required: true
    },
       subcategory:[String],   
        deletedAt: 
         {
            type: Date,
            default: false
            },
         isDeleted:
        {
            type: Boolean, 
            default: false
        }, 
         publishedAt:
          {
            type: Date,
            default: false
            },
          isPublished: 
          {
            type: Boolean, 
            default: false
        }
    }, {timestamps: true });

module.exports = mongoose.model('Blogs', blogSchema)

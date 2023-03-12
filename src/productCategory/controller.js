const categoryModel = require('./models')
const productmodel = require('../products/models')

const addNewCategory = async (req, res)=>{
   try {
    const newCategory = new categoryModel(req.body);
    const allProducts = await productmodel.find({});
    for(var i = 0; i< allProducts.length; i++){
      if(allProducts[i].category === newCategory.categoryName){
        newCategory.products.push(allProducts[i]);
      }
      else{
        continue;
      }
    }
    await newCategory.save()
    return res.status(201).json({
      status: 201,
      message: "Created a new cateogory",
      data: newCategory
    })
   } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error"
    })
   }
}

module.exports = {addNewCategory}
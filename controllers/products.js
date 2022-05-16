const res = require("express/lib/response");
const Product = require('../models/product');
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({price:{$gt:30}}).sort('price').select('name price');//skips first 5 documents
  //to join two or more fields use whitespace instead of commas 
  res.status(200).json({products, nbHits:products.length});
};

const getAllProducts = async (req, res) => {
  const { featured,company,name,sort,fields,numericFilters } = req.query;
  //insted of directly adding it to database it is better to create a new object 
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  //numeric filters like price>30 , rating>4
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=':'$lte'
    }
    
    //g tag is used because without it only first instance will be replaced , g tag will replace all the appearances.
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    //replaceing the regEx , calling a callback function which replaces the match with mongoose understandable regex. Addition - sign is for utility purpose
    console.log(filters);
    //options for filtering
      const options = ['price', 'rating'];
      filters = filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-')
        if (options.includes(field)) {
          queryObject[field]={[operator]:Number(value)}
        }
      })
  }

  console.log(queryObject);

  let result = Product.find(queryObject);
  //sorting all the products
  if (sort) {
    console.log(sort);
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
    //for sorting the parameters must be supplied without commas
    //so we can use spliting algorithm to remove the commas and and join them with whitespace.
    // products = products.sort();
  }
  else {
    result = result.sort('createdAt');
  }
  //selecting on the basis of fields
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  //setting up pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit;
  //pagination algorithm
  result = result.skip(skip).limit(limit);
  const products = await result;
  res.status(200).json({products, nbHits:products.length});
};
module.exports = { getAllProducts, getAllProductsStatic };

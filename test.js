const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb+srv://sebas313313313:8sR602Z6N8S2K96o@cluster0.o5p5n.mongodb.net/maquillaje?retryWrites=true&w=majority&appName=Cluster0');
  const Product = require('./server/models/Product');
  
  const allProducts = await Product.find({}).limit(3);
  const ids = allProducts.map(p => p._id.toString());
  console.log('Test IDs:', ids);
  
  try {
    const found = await Product.find({ _id: { $in: ids } });
    console.log('Found count valid:', found.length);
  } catch (e) {
    console.log('Error valid:', e.message);
  }

  process.exit(0);
}
test();

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
async function check() {
  const client = new MongoClient('mongodb://localhost:27017/festival_db');
  await client.connect();
  const db = client.db();
  const user = await db.collection('users').findOne({ email: 'admin@test.com' });
  console.log("User:", user);
  if(user) {
    const match = await bcrypt.compare('admin', user.password);
    console.log("Password match with 'admin':", match);
  }
  await client.close();
}
check();

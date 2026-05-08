const Admin = require('../models/Admin');

const seedAdmin = async () => {
  const email = process.env.DEFAULT_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('Admin seed skipped because DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD is missing');
    return;
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return;
  }

  await Admin.create({
    email,
    password,
    name: 'Admin'
  });

  console.log(`Seeded admin account: ${email}`);
};

module.exports = seedAdmin;

const mongoose = require('mongoose');
const Offline25 = require('./models/Offline25');
const Onlinereg = require('./models/onlineReg');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/technothlon25', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleData = [
  // Juniors Squad - Top performers
  {
    name1: 'Rahul Kumar',
    name2: 'Priya Sharma',
    rollNumber: 'JR25FE00100001',
    Rank: '1',
    city: 'Mumbai',
    squad: 'Juniors',
    email1: 'rahul@test.com',
    email2: 'priya@test.com',
    contact1: '9876543210',
    contact2: '9876543211',
    school1: 'Mumbai High School',
    school2: 'Mumbai High School',
    language: 'English',
    state: 'Maharashtra',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  },
  {
    name1: 'Amit Patel',
    name2: 'Neha Singh',
    rollNumber: 'JR25FE00200002',
    Rank: '2',
    city: 'Delhi',
    squad: 'Juniors',
    email1: 'amit@test.com',
    email2: 'neha@test.com',
    contact1: '9876543212',
    contact2: '9876543213',
    school1: 'Delhi Public School',
    school2: 'Delhi Public School',
    language: 'English',
    state: 'Delhi',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  },
  {
    name1: 'Vikram Malhotra',
    name2: 'Anjali Gupta',
    rollNumber: 'JR25FE00300003',
    Rank: '3',
    city: 'Bangalore',
    squad: 'Juniors',
    email1: 'vikram@test.com',
    email2: 'anjali@test.com',
    contact1: '9876543214',
    contact2: '9876543215',
    school1: 'Bangalore International School',
    school2: 'Bangalore International School',
    language: 'English',
    state: 'Karnataka',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  },
  // Hauts Squad - Top performers
  {
    name1: 'Arjun Reddy',
    name2: 'Zara Khan',
    rollNumber: 'HE25FE00100004',
    Rank: '1',
    city: 'Hyderabad',
    squad: 'Hauts',
    email1: 'arjun@test.com',
    email2: 'zara@test.com',
    contact1: '9876543216',
    contact2: '9876543217',
    school1: 'Hyderabad Central School',
    school2: 'Hyderabad Central School',
    language: 'English',
    state: 'Telangana',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  },
  {
    name1: 'Ishaan Mehta',
    name2: 'Kavya Joshi',
    rollNumber: 'HE25FE00200005',
    Rank: '2',
    city: 'Pune',
    squad: 'Hauts',
    email1: 'ishaan@test.com',
    email2: 'kavya@test.com',
    contact1: '9876543218',
    contact2: '9876543219',
    school1: 'Pune Academy',
    school2: 'Pune Academy',
    language: 'English',
    state: 'Maharashtra',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  },
  {
    name1: 'Aditya Verma',
    name2: 'Riya Kapoor',
    rollNumber: 'HE25FE00300006',
    Rank: '3',
    city: 'Chennai',
    squad: 'Hauts',
    email1: 'aditya@test.com',
    email2: 'riya@test.com',
    contact1: '9876543220',
    contact2: '9876543221',
    school1: 'Chennai Elite School',
    school2: 'Chennai Elite School',
    language: 'English',
    state: 'Tamil Nadu',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  },
  // More city toppers for Juniors
  {
    name1: 'Karan Singh',
    name2: 'Maya Patel',
    rollNumber: 'JR25FE00400007',
    Rank: '15',
    city: 'Kolkata',
    squad: 'Juniors',
    email1: 'karan@test.com',
    email2: 'maya@test.com',
    contact1: '9876543222',
    contact2: '9876543223',
    school1: 'Kolkata Modern School',
    school2: 'Kolkata Modern School',
    language: 'English',
    state: 'West Bengal',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  },
  {
    name1: 'Rohan Das',
    name2: 'Sneha Reddy',
    rollNumber: 'JR25FE00500008',
    Rank: '22',
    city: 'Ahmedabad',
    squad: 'Juniors',
    email1: 'rohan@test.com',
    email2: 'sneha@test.com',
    contact1: '9876543224',
    contact2: '9876543225',
    school1: 'Ahmedabad Premier School',
    school2: 'Ahmedabad Premier School',
    language: 'English',
    state: 'Gujarat',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  },
  // More city toppers for Hauts
  {
    name1: 'Dev Sharma',
    name2: 'Pooja Iyer',
    rollNumber: 'HE25FE00400009',
    Rank: '18',
    city: 'Jaipur',
    squad: 'Hauts',
    email1: 'dev@test.com',
    email2: 'pooja@test.com',
    contact1: '9876543226',
    contact2: '9876543227',
    school1: 'Jaipur Royal School',
    school2: 'Jaipur Royal School',
    language: 'English',
    state: 'Rajasthan',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  },
  {
    name1: 'Yash Malhotra',
    name2: 'Tanvi Shah',
    rollNumber: 'HE25FE00500010',
    Rank: '25',
    city: 'Lucknow',
    squad: 'Hauts',
    email1: 'yash@test.com',
    email2: 'tanvi@test.com',
    contact1: '9876543228',
    contact2: '9876543229',
    school1: 'Lucknow Central School',
    school2: 'Lucknow Central School',
    language: 'English',
    state: 'Uttar Pradesh',
    password: 'test123',
    mode: 'offline',
    view: 'school',
    isPaid: true
  }
];

async function populateTestData() {
  try {
    console.log('Starting to populate test data...');
    
    // Clear existing test data
    await Offline25.deleteMany({ 
      rollNumber: { $in: sampleData.map(d => d.rollNumber) }
    });
    
    // Insert new test data
    const result = await Offline25.insertMany(sampleData);
    
    console.log(`Successfully inserted ${result.length} test records`);
    console.log('Test data includes:');
    console.log('- Top 3 Juniors performers');
    console.log('- Top 3 Hauts performers');
    console.log('- Additional city toppers for both squads');
    
    // Test the results table endpoint
    console.log('\nTesting results table endpoint...');
    const testData = await Offline25.find({ 
      Rank: { $exists: true, $ne: null, $ne: 'NA' }
    }).sort({ Rank: 1 }).limit(5);
    
    console.log('Sample data in database:');
    testData.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name1} & ${item.name2} - Rank: ${item.Rank} - City: ${item.city} - Squad: ${item.squad}`);
    });
    
    console.log('\n✅ Test data populated successfully!');
    console.log('You can now test the results page at: http://localhost:3000/results');
    
  } catch (error) {
    console.error('Error populating test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
populateTestData(); 
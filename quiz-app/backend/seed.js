const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Quiz = require('./models/Quiz');

dotenv.config(); // ✅ This is correct, loads .env variables

// ❌ Original code had this:
// mongoose.connect(process.env.MONGODB_URI);
// Issue: connect is asynchronous, seedData() runs immediately
// ✅ FIX: wrap in async function and await the connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB Connected for seeding"); // ✅ Just to confirm connection
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if connection fails
  }
};

const seedData = async () => {
  try {
    // ✅ Ensure DB is connected before running queries
    await User.deleteMany(); // ✅ Clears users collection
    await Quiz.deleteMany(); // ✅ Clears quizzes collection

    // --- Creating Users ---
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });

    // --- Creating Quizzes ---
    await Quiz.create({
      title: 'General Knowledge Quiz',
      description: 'Test your general knowledge with these fun questions!',
      category: 'General Knowledge',
      difficulty: 'Easy',
      timeLimit: 5,
      createdBy: admin._id,
      questions: [
        {
          questionText: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 2,
          points: 10
        },
        {
          questionText: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 1,
          points: 10
        },
        {
          questionText: 'What is the largest mammal on Earth?',
          options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
          correctAnswer: 1,
          points: 10
        },
        {
          questionText: 'How many continents are there?',
          options: ['5', '6', '7', '8'],
          correctAnswer: 2,
          points: 10
        },
        {
          questionText: 'What is the chemical symbol for water?',
          options: ['O2', 'H2O', 'CO2', 'NaCl'],
          correctAnswer: 1,
          points: 10
        }
      ]
    });

    await Quiz.create({
      title: 'Science Quiz',
      description: 'Challenge yourself with science questions!',
      category: 'Science',
      difficulty: 'Medium',
      timeLimit: 10,
      createdBy: admin._id,
      questions: [
        {
          questionText: 'What is the powerhouse of the cell?',
          options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'],
          correctAnswer: 2,
          points: 10
        },
        {
          questionText: 'What gas do plants absorb from the atmosphere?',
          options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
          correctAnswer: 2,
          points: 10
        },
        {
          questionText: 'What is the speed of light?',
          options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
          correctAnswer: 0,
          points: 15
        },
        {
          questionText: 'What is the atomic number of Carbon?',
          options: ['4', '6', '8', '12'],
          correctAnswer: 1,
          points: 10
        }
      ]
    });

    await Quiz.create({
      title: 'Technology Quiz',
      description: 'How well do you know technology?',
      category: 'Technology',
      difficulty: 'Hard',
      timeLimit: 8,
      createdBy: admin._id,
      questions: [
        {
          questionText: 'Who is the founder of Microsoft?',
          options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Elon Musk'],
          correctAnswer: 1,
          points: 10
        },
        {
          questionText: 'What does CPU stand for?',
          options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Computer Processing Unit'],
          correctAnswer: 0,
          points: 10
        },
        {
          questionText: 'What year was the first iPhone released?',
          options: ['2005', '2006', '2007', '2008'],
          correctAnswer: 2,
          points: 15
        },
        {
          questionText: 'What programming language is known as the backbone of web development?',
          options: ['Python', 'Java', 'JavaScript', 'C++'],
          correctAnswer: 2,
          points: 10
        },
        {
          questionText: 'What does HTML stand for?',
          options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
          correctAnswer: 0,
          points: 10
        }
      ]
    });

    console.log('Data seeded successfully!');
    console.log('Admin login: admin@example.com / password123');
    console.log('User login: john@example.com / password123');
    process.exit(); // ✅ exit after seeding
  } catch (error) {
    console.error(error);
    process.exit(1); // ✅ exit on error
  }
};

// ✅ Wrapping connection and seeding in async IIFE
(async () => {
  await connectDB(); // ✅ Await DB connection
  await seedData();  // ✅ Then run seeding
})();

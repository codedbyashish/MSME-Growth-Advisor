import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import { handleChat } from './controllers/advisorController.js';

dotenv.config({ path: './.env' });

async function runChatTests() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'ashishkumarmaurya794@gmail.com' });
  if (!user) {
    console.error('Test user not found');
    process.exit(1);
  }

  const questions = [
    'Who are my customers with unpaid bills?',
    'How much does each customer owe?',
    'Show my five largest outstanding invoices.',
    'What is my total outstanding amount?',
    'Which customers have unpaid bills?',
    'Who owes me the most money?',
    'How much money do customers owe me in total?',
    'Show all pending invoices.',
    'Which customers have overdue payments?',
    'What is my total revenue this month?',
    'What are my total expenses this month?',
    'What is my actual net profit?',
    'Which sweets sell the most?',
    'Which products have low stock?',
    'Which customers purchase most frequently?',
    'Which invoices were paid recently?',
  ];

  console.log(`Running live chatbot tests for: ${user.name} (${user.email})\n`);

  for (const q of questions) {
    console.log(`================================================================`);
    console.log(`Q: "${q}"`);
    console.log(`----------------------------------------------------------------`);

    let responseData = null;
    const req = {
      body: { message: q },
      user: { _id: user._id },
    };
    const res = {
      status: (code) => ({
        json: (data) => {
          responseData = { code, ...data };
        },
      }),
    };

    await handleChat(req, res);

    console.log(`Intent Detected: ${responseData.intent}`);
    console.log(`AI Response Snippet:\n${responseData.reply.split('\n').slice(0, 8).join('\n')}`);
    if (responseData.tableData) {
      console.log(`Table Returned with ${responseData.tableData.rows.length} rows.`);
    }
    console.log(`================================================================\n`);
  }

  await mongoose.disconnect();
}

runChatTests().catch(console.error);

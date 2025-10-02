#!/usr/bin/env node

/**
 * Test script to verify MongoDB Atlas connection and basic operations
 * Run with: npm run test:connection
 */

import DatabaseConnection from './src/config/database';
import { User } from './src/models/User';

async function testConnection() {
  console.log('🧪 Testing MongoDB Atlas connection...\n');

  try {
    // Connect to database
    await DatabaseConnection.getInstance().connect();
    console.log('✅ Database connection successful\n');

    // Test creating a user
    console.log('👤 Testing user creation...');
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1234567890'
    });

    const savedUser = await testUser.save();
    console.log('✅ User created successfully:', {
      id: savedUser._id,
      name: savedUser.fullName,
      email: savedUser.email
    });

    // Test finding users
    console.log('\n🔍 Testing user retrieval...');
    const users = await User.find();
    console.log(`✅ Found ${users.length} user(s) in database`);

    // Clean up test user
    console.log('\n🧹 Cleaning up test data...');
    await User.findByIdAndDelete(savedUser._id);
    console.log('✅ Test user deleted');

    console.log('\n🎉 All tests passed! MongoDB Atlas is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    // Disconnect
    await DatabaseConnection.getInstance().disconnect();
    console.log('\n👋 Disconnected from database');
    process.exit(0);
  }
}

// Run the test
testConnection().catch(console.error);


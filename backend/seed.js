/**
 * Database Seeder
 * Creates initial admin user and sample data
 * Run: node seed.js
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Complaint = require('./models/Complaint');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin user
    const admin = await User.create({
      name: 'Station Admin',
      email: process.env.ADMIN_EMAIL || 'admin@police.gov.in',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      phone: '9876543210',
      role: 'admin',
      stationName: 'Central Police Station',
      badgeNumber: 'ADMIN-001',
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create a Police Officer
    const officer = await User.create({
      name: 'Officer Rajesh Kumar',
      email: 'officer@police.gov.in',
      password: 'Officer@123',
      phone: '9876543211',
      role: 'police',
      stationName: 'Central Police Station',
      badgeNumber: 'OFF-1042',
    });
    console.log(`✅ Officer created: ${officer.email}`);

    // Create sample citizen
    const citizen = await User.create({
      name: 'Ramesh Sharma',
      email: 'citizen@example.com',
      password: 'Citizen@123',
      phone: '9876543212',
      role: 'citizen',
      address: '123, Gandhi Nagar, Mumbai',
    });
    console.log(`✅ Citizen created: ${citizen.email}`);

    // Create sample complaints
    const sampleComplaints = [
      {
        complaintId: 'GRV-2024-000001',
        complainant: citizen._id,
        title: 'Robbery at Gandhi Nagar Market',
        description: 'Armed robbery took place at Gandhi Nagar market yesterday evening. The robbers took cash and jewelry from 3 shopkeepers.',
        category: 'robbery',
        priority: 'High',
        status: 'In Progress',
        incidentLocation: 'Gandhi Nagar Market, Mumbai',
        incidentDate: new Date('2024-01-15'),
        assignedOfficer: officer._id,
        isAlertFlagged: true,
        remarks: 'Investigation underway, CCTV footage being reviewed.',
        statusHistory: [
          { status: 'Pending', updatedBy: citizen._id, note: 'Complaint submitted' },
          { status: 'In Progress', updatedBy: officer._id, note: 'Assigned to Officer Kumar' },
        ],
      },
      {
        complaintId: 'GRV-2024-000002',
        complainant: citizen._id,
        title: 'Online Fraud - Lost ₹50,000',
        description: 'I received a call from someone claiming to be from my bank. They convinced me to share OTP and transferred ₹50,000 from my account.',
        category: 'fraud',
        priority: 'Medium',
        status: 'Pending',
        incidentLocation: 'Online - Mumbai',
        incidentDate: new Date('2024-01-18'),
        isAlertFlagged: false,
        statusHistory: [
          { status: 'Pending', updatedBy: citizen._id, note: 'Complaint submitted' },
        ],
      },
      {
        complaintId: 'GRV-2024-000003',
        complainant: citizen._id,
        title: 'Excessive Noise from Neighboring House',
        description: 'The neighbors play loud music every night after 11 PM, disturbing the entire colony. Multiple requests to stop have been ignored.',
        category: 'noise_complaint',
        priority: 'Low',
        status: 'Resolved',
        incidentLocation: 'Plot 45, Sector 7, Mumbai',
        incidentDate: new Date('2024-01-10'),
        remarks: 'Warning issued to the neighbor. Noise has stopped.',
        statusHistory: [
          { status: 'Pending', updatedBy: citizen._id, note: 'Complaint submitted' },
          { status: 'Resolved', updatedBy: officer._id, note: 'Warning issued' },
        ],
      },
    ];

    await Complaint.insertMany(sampleComplaints);
    console.log(`✅ Created ${sampleComplaints.length} sample complaints`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('─────────────────────────────────────────');
    console.log('📋 Login Credentials:');
    console.log(`Admin:   ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log(`Officer: ${officer.email} / Officer@123`);
    console.log(`Citizen: ${citizen.email} / Citizen@123`);
    console.log('─────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedData();

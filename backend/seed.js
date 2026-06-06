import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/Lead.js';
import Activity from './models/Activity.js';

// Load environment variables
dotenv.config();

const leadsData = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@tcs.com',
    phone: '+91 98765 43210',
    company: 'TATA Consultancy Services',
    status: 'Converted',
    source: 'LinkedIn',
    notes: 'Great discussion on Cloud migration project. Contract signed.',
    createdAt: new Date('2026-05-12T10:30:00Z'),
    updatedAt: new Date('2026-05-15T14:20:00Z'),
  },
  {
    name: 'Diya Patel',
    email: 'diya.patel@infosys.com',
    phone: '+91 98123 45678',
    company: 'Infosys',
    status: 'Qualified',
    source: 'Website',
    notes: 'Interested in enterprise CRM solution. Requesting demo for 10 users.',
    createdAt: new Date('2026-05-18T09:15:00Z'),
    updatedAt: new Date('2026-05-19T11:00:00Z'),
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@wipro.com',
    phone: '+91 97654 32109',
    company: 'Wipro Technologies',
    status: 'Contacted',
    source: 'Cold Outreach',
    notes: 'Sent pricing proposal for custom integration services.',
    createdAt: new Date('2026-05-25T11:45:00Z'),
    updatedAt: new Date('2026-05-26T16:30:00Z'),
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@hdfcbank.com',
    phone: '+91 95432 09877',
    company: 'HDFC Bank',
    status: 'Converted',
    source: 'Partner',
    notes: 'Completed bank-side onboarding process. Active customer.',
    createdAt: new Date('2026-05-28T14:00:00Z'),
    updatedAt: new Date('2026-05-29T10:00:00Z'),
  },
  {
    name: 'Vihaan Gupta',
    email: 'vihaan.gupta@reliance.com',
    phone: '+91 91234 56780',
    company: 'Reliance Jio',
    status: 'Lost',
    source: 'Website',
    notes: 'Pricing was too high for their internal division. Closed.',
    createdAt: new Date('2026-05-30T16:20:00Z'),
    updatedAt: new Date('2026-05-31T17:00:00Z'),
  },
  {
    name: 'Kavya Nair',
    email: 'kavya.nair@freshworks.in',
    phone: '+91 99887 76655',
    company: 'Freshworks',
    status: 'New',
    source: 'Referral',
    notes: 'Referred by senior director. Wants to check system capability.',
    createdAt: new Date('2026-06-01T10:00:00Z'),
    updatedAt: new Date('2026-06-01T10:00:00Z'),
  },
  {
    name: 'Aditya Rao',
    email: 'aditya.rao@techmahindra.com',
    phone: '+91 98765 01234',
    company: 'Tech Mahindra',
    status: 'Contacted',
    source: 'Website',
    notes: 'Product demo scheduled for next Tuesday at 3:00 PM.',
    createdAt: new Date('2026-06-02T13:30:00Z'),
    updatedAt: new Date('2026-06-03T11:00:00Z'),
  },
  {
    name: 'Ishaan Deshmukh',
    email: 'ishaan.d@zoho.com',
    phone: '+91 94561 23789',
    company: 'Zoho Corp',
    status: 'Qualified',
    source: 'LinkedIn',
    notes: 'Budget approved. Currently discussing support SLA requirements.',
    createdAt: new Date('2026-06-03T10:00:00Z'),
    updatedAt: new Date('2026-06-04T09:30:00Z'),
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@tata.com',
    phone: '+91 93216 54987',
    company: 'Tata Motors',
    status: 'Converted',
    source: 'LinkedIn',
    notes: 'Signed contract for corporate training and implementation.',
    createdAt: new Date('2026-06-04T12:00:00Z'),
    updatedAt: new Date('2026-06-05T15:00:00Z'),
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@ola.in',
    phone: '+91 97894 56123',
    company: 'Ola Mobility',
    status: 'New',
    source: 'Cold Outreach',
    notes: 'Sent initial cold email introducing our CRM capabilities.',
    createdAt: new Date('2026-06-04T14:45:00Z'),
    updatedAt: new Date('2026-06-04T14:45:00Z'),
  },
  {
    name: 'Prisha Reddy',
    email: 'prisha.reddy@paytm.com',
    phone: '+91 96325 87410',
    company: 'Paytm Payments Bank',
    status: 'Contacted',
    source: 'Partner',
    notes: 'Followed up via phone call. Left voicemail for decision maker.',
    createdAt: new Date('2026-06-05T09:00:00Z'),
    updatedAt: new Date('2026-06-05T11:20:00Z'),
  },
  {
    name: 'Kabir Malhotra',
    email: 'kabir.m@zomato.com',
    phone: '+91 95123 68740',
    company: 'Zomato',
    status: 'Qualified',
    source: 'Referral',
    notes: 'Highly interested in automated pipeline tracking. Good budget range.',
    createdAt: new Date('2026-06-05T16:00:00Z'),
    updatedAt: new Date('2026-06-06T10:00:00Z'),
  },
  {
    name: 'Riya Sen',
    email: 'riya.sen@swiggy.in',
    phone: '+91 98745 63210',
    company: 'Swiggy',
    status: 'Lost',
    source: 'Website',
    notes: 'Chose a cheaper local alternative instead. Keep on radar.',
    createdAt: new Date('2026-06-06T11:00:00Z'),
    updatedAt: new Date('2026-06-06T14:30:00Z'),
  },
  {
    name: 'Aryan Joshi',
    email: 'aryan.j@flipkart.com',
    phone: '+91 98563 21470',
    company: 'Flipkart Online',
    status: 'New',
    source: 'Website',
    notes: 'Inquiry received via website pricing page form submission.',
    createdAt: new Date('2026-06-06T15:30:00Z'),
    updatedAt: new Date('2026-06-06T15:30:00Z'),
  },
  {
    name: 'Sanya Malhotra',
    email: 'sanya.m@inmobi.com',
    phone: '+91 96541 23870',
    company: 'InMobi Technologies',
    status: 'Qualified',
    source: 'Partner',
    notes: 'Discussing enterprise integration with their ad server teams.',
    createdAt: new Date('2026-06-07T08:15:00Z'),
    updatedAt: new Date('2026-06-07T09:00:00Z'),
  },
];

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in .env');
    }

    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing leads and activities for a clean showcase, or append?
    // The user wants to "add some 10-15 enters more", so let's append!
    // But we want to ensure we don't duplicate if run twice: let's insert them!
    console.log('Seeding leads into database...');
    
    for (const lead of leadsData) {
      // Create lead in DB
      const newLead = await Lead.create(lead);
      
      // Also generate a matching activity log
      await Activity.create({
        action: 'Created',
        leadName: newLead.name,
        details: `Lead created for ${newLead.name} (${newLead.company}) from ${newLead.source}`,
        timestamp: newLead.createdAt,
      });

      if (newLead.status !== 'New') {
        await Activity.create({
          action: 'Status Change',
          leadName: newLead.name,
          details: `Lead status updated to ${newLead.status}`,
          timestamp: newLead.updatedAt,
        });
      }
    }

    console.log(`Successfully seeded ${leadsData.length} Indian leads with activity logs!`);
    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();

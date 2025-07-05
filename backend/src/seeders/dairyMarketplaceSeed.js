const mongoose = require('mongoose');
const Buyer = require('../models/Buyer');

const sampleBuyers = [
  {
    name: "Heritage Foods",
    type: "Large Processor",
    location: "Hyderabad, Telangana",
    contactInfo: {
      phone: "+91 9876543210",
      email: "procurement@heritage.com",
      address: "Heritage Foods Building, Hyderabad, Telangana 500001"
    },
    qualityRequirements: {
      minFatContent: 3.5,
      minSnfContent: 8.5,
      minVolume: 500,
      maxVolume: 5000,
      requiredCertifications: ["FSSAI", "ISO 22000"],
      additionalRequirements: "Premium quality milk with regular testing"
    },
    pricing: {
      basePrice: 38,
      premiumRates: {
        fatBonus: 2,
        snfBonus: 1.5,
        volumeBonus: 1,
        qualityBonus: 2
      },
      priceRange: {
        min: 35,
        max: 42
      }
    },
    operations: {
      pickupRadius: 50,
      pickupTimes: ["morning", "evening"],
      paymentTerms: "Weekly",
      paymentMethods: ["Bank Transfer", "UPI"],
      collectionCapacity: 10000
    },
    certifications: [
      {
        name: "FSSAI",
        number: "12345678901234",
        issuedBy: "Food Safety and Standards Authority of India",
        validUntil: new Date("2025-12-31"),
        verified: true
      },
      {
        name: "ISO 22000",
        number: "ISO22000-2023-001",
        issuedBy: "International Organization for Standardization",
        validUntil: new Date("2026-06-30"),
        verified: true
      },
      {
        name: "HACCP",
        number: "HACCP-2023-HF001",
        issuedBy: "HACCP Certification Body",
        validUntil: new Date("2025-12-31"),
        verified: true
      }
    ],
    businessInfo: {
      establishedYear: 1992,
      annualCapacity: 500000,
      processingFacilities: ["Pasteurization", "Homogenization", "Packaging", "Cold Storage", "Testing Lab"]
    },
    rating: {
      average: 4.8,
      count: 245
    },
    status: "active",
    verified: true,
    verificationDate: new Date("2023-01-15"),
    performance: {
      totalPurchases: 1250,
      averageMonthlyVolume: 45000,
      paymentReliability: 98,
      qualityCompliance: 96
    }
  },
  {
    name: "Vijaya Dairy",
    type: "Cooperative",
    location: "Vijayawada, Andhra Pradesh",
    contactInfo: {
      phone: "+91 9876543211",
      email: "milk@vijayadairy.com",
      address: "Vijaya Dairy Complex, Vijayawada, Andhra Pradesh 520001"
    },
    qualityRequirements: {
      minFatContent: 3.0,
      minSnfContent: 8.0,
      minVolume: 200,
      maxVolume: 2000,
      requiredCertifications: ["FSSAI"],
      additionalRequirements: "Consistent quality with health certificates"
    },
    pricing: {
      basePrice: 35,
      premiumRates: {
        fatBonus: 1.5,
        snfBonus: 1,
        volumeBonus: 0.5,
        qualityBonus: 1.5
      },
      priceRange: {
        min: 32,
        max: 38
      }
    },
    operations: {
      pickupRadius: 30,
      pickupTimes: ["morning", "evening"],
      paymentTerms: "Bi-weekly",
      paymentMethods: ["Bank Transfer", "UPI", "Cash"],
      collectionCapacity: 5000
    },
    certifications: [
      {
        name: "FSSAI",
        number: "12345678901235",
        issuedBy: "Food Safety and Standards Authority of India",
        validUntil: new Date("2025-12-31"),
        verified: true
      },
      {
        name: "Organic",
        number: "ORG-2023-VD001",
        issuedBy: "Organic Certification Agency",
        validUntil: new Date("2025-12-31"),
        verified: true
      }
    ],
    businessInfo: {
      establishedYear: 1985,
      annualCapacity: 200000,
      processingFacilities: ["Pasteurization", "Packaging", "Cold Storage"]
    },
    rating: {
      average: 4.6,
      count: 189
    },
    status: "active",
    verified: true,
    verificationDate: new Date("2023-02-10"),
    performance: {
      totalPurchases: 890,
      averageMonthlyVolume: 25000,
      paymentReliability: 95,
      qualityCompliance: 94
    }
  },
  {
    name: "Local Dairy Hub",
    type: "Local Dairy",
    location: "Warangal, Telangana",
    contactInfo: {
      phone: "+91 9876543212",
      email: "info@localdairyhub.com",
      address: "Local Dairy Hub, Warangal, Telangana 506001"
    },
    qualityRequirements: {
      minFatContent: 2.8,
      minSnfContent: 7.5,
      minVolume: 100,
      maxVolume: 800,
      requiredCertifications: [],
      additionalRequirements: "Fresh milk with basic quality standards"
    },
    pricing: {
      basePrice: 32,
      premiumRates: {
        fatBonus: 1,
        snfBonus: 0.5,
        volumeBonus: 0.5,
        qualityBonus: 1
      },
      priceRange: {
        min: 28,
        max: 35
      }
    },
    operations: {
      pickupRadius: 20,
      pickupTimes: ["morning"],
      paymentTerms: "Weekly",
      paymentMethods: ["Cash", "UPI"],
      collectionCapacity: 2000
    },
    certifications: [
      {
        name: "FSSAI",
        number: "12345678901236",
        issuedBy: "Food Safety and Standards Authority of India",
        validUntil: new Date("2025-12-31"),
        verified: true
      }
    ],
    businessInfo: {
      establishedYear: 2010,
      annualCapacity: 50000,
      processingFacilities: ["Pasteurization", "Packaging"]
    },
    rating: {
      average: 4.2,
      count: 67
    },
    status: "active",
    verified: false,
    performance: {
      totalPurchases: 234,
      averageMonthlyVolume: 8000,
      paymentReliability: 92,
      qualityCompliance: 88
    }
  },
  {
    name: "Global Dairy Exports Ltd.",
    type: "Export Company",
    location: "Middle East Operations, Hyderabad",
    contactInfo: {
      phone: "+91 9876543213",
      email: "exports@globaldairy.com",
      address: "Export House, Hyderabad, Telangana 500001"
    },
    qualityRequirements: {
      minFatContent: 4.0,
      minSnfContent: 9.0,
      minVolume: 1000,
      maxVolume: 10000,
      requiredCertifications: ["Organic", "Halal", "ISO 22000", "HACCP"],
      additionalRequirements: "A2 Milk, Organic Certified for Middle East export"
    },
    pricing: {
      basePrice: 70,
      premiumRates: {
        fatBonus: 3,
        snfBonus: 2,
        volumeBonus: 2,
        qualityBonus: 5
      },
      priceRange: {
        min: 65,
        max: 75
      }
    },
    operations: {
      pickupRadius: 100,
      pickupTimes: ["morning", "evening"],
      paymentTerms: "Monthly",
      paymentMethods: ["Bank Transfer"],
      collectionCapacity: 50000
    },
    certifications: [
      {
        name: "Export License",
        number: "EXP-2023-GDE001",
        issuedBy: "Directorate General of Foreign Trade",
        validUntil: new Date("2025-12-31"),
        verified: true
      },
      {
        name: "Halal",
        number: "HALAL-2023-001",
        issuedBy: "Halal Certification Authority",
        validUntil: new Date("2025-12-31"),
        verified: true
      }
    ],
    businessInfo: {
      establishedYear: 2015,
      annualCapacity: 1000000,
      processingFacilities: ["Pasteurization", "Homogenization", "Packaging", "Cold Storage", "Testing Lab"]
    },
    rating: {
      average: 4.9,
      count: 156
    },
    status: "active",
    verified: true,
    verificationDate: new Date("2023-01-01"),
    performance: {
      totalPurchases: 567,
      averageMonthlyVolume: 75000,
      paymentReliability: 99,
      qualityCompliance: 98
    }
  }
];

async function seedBuyers() {
  try {
    // Clear existing buyers
    await Buyer.deleteMany({});
    console.log('Cleared existing buyers');

    // Insert sample buyers
    const insertedBuyers = await Buyer.insertMany(sampleBuyers);
    console.log(`Inserted ${insertedBuyers.length} sample buyers`);

    console.log('Dairy marketplace seed completed successfully');
  } catch (error) {
    console.error('Error seeding dairy marketplace:', error);
  }
}

module.exports = { seedBuyers, sampleBuyers };

// Re-export all database connection functions from the new modular structure
// This file maintains backward compatibility while adding configurable logging

// Import the testing module to initialize connection testing
import './db/testing';

// Export all functions from the modular structure
export * from './db';

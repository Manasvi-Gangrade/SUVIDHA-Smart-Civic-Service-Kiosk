const mongoose = require('mongoose');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// In-memory mock database store to run completely database-free if MongoDB is unavailable
const mockDataStore = {
    citizens: [
        {
            _id: '507f1f77bcf86cd799439011',
            id: 'CIT-2026-001',
            fullName: 'Rajesh Kumar',
            aadhaar: '123456789012',
            mobile: '9876543210',
            email: 'rajesh.kumar@email.com',
            accountId: 'ACC-MH-2026-7890',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '507f1f77bcf86cd799439012',
            id: 'CIT-2026-002',
            fullName: 'Priya Sharma',
            aadhaar: '234567890123',
            mobile: '8765432109',
            email: 'priya.sharma@email.com',
            accountId: 'ACC-MH-2026-7891',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '507f1f77bcf86cd799439013',
            id: 'CIT-2026-003',
            fullName: 'Amit Patel',
            aadhaar: '345678901234',
            mobile: '7654321098',
            email: 'amit.patel@email.com',
            accountId: 'ACC-MH-2026-7892',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    civicapplications: [],
    civicgrievances: [],
    civicpayments: [],
    otpsessions: [],
    usersessions: [],
    auditlogs: []
};

const getMongoStatus = () => {
    if (process.env.LOCAL_MOCK_DB === 'true' || mongoose.connection.readyState !== 1) {
        return {
            readyState: 1,
            status: 'connected (in-memory mock)',
            host: 'localhost-mock-ram',
        };
    }

    const state = mongoose.connection.readyState;
    const labels = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };

    return {
        readyState: state,
        status: labels[state] || 'unknown',
        host: mongoose.connection.host || null,
    };
};

const initMockDb = () => {
    console.log("⚡ [SUVIDHA Mock DB] Activating in-memory mock fallback engine!");

    // Disable mongoose connection buffering so queries return immediately without waiting for MongoDB socket
    mongoose.set('bufferCommands', false);

    const getCollection = (model) => {
        const name = model.modelName.toLowerCase() + 's';
        if (!mockDataStore[name]) mockDataStore[name] = [];
        return mockDataStore[name];
    };

    // Override prototype methods for chaining
    mongoose.Query.prototype.sort = function(arg) {
        this._sort = arg;
        return this;
    };
    mongoose.Query.prototype.limit = function(arg) {
        this._limit = arg;
        return this;
    };
    mongoose.Query.prototype.skip = function(arg) {
        this._skip = arg;
        return this;
    };
    mongoose.Query.prototype.select = function(arg) {
        return this;
    };

    // Override Query.prototype.exec to intercept find, findOne, update, count, etc.
    mongoose.Query.prototype.exec = async function() {
        const model = this.model;
        const op = this.op;
        const conditions = this._conditions || {};
        const collection = getCollection(model);

        // Helper to match items
        const match = (item) => {
            for (const key in conditions) {
                const val = conditions[key];
                
                // Logical OR
                if (key === '$or' && Array.isArray(val)) {
                    const matched = val.some(cond => {
                        return Object.entries(cond).every(([k, v]) => {
                            if (typeof v === 'object' && v !== null && v.$regex) {
                                return new RegExp(v.$regex, 'i').test(item[k] || '');
                            }
                            return item[k] === v;
                        });
                    });
                    if (!matched) return false;
                    continue;
                }

                // Complex comparison operators
                if (typeof val === 'object' && val !== null) {
                    if (val.$regex) {
                        if (!new RegExp(val.$regex, 'i').test(item[key] || '')) return false;
                        continue;
                    }
                    if (val.$gt !== undefined) {
                        if (!(new Date(item[key]) > new Date(val.$gt))) return false;
                        continue;
                    }
                    if (val.$lt !== undefined) {
                        if (!(Number(item[key]) < Number(val.$lt))) return false;
                        continue;
                    }
                    if (val.$gte !== undefined) {
                        if (!(new Date(item[key]) >= new Date(val.$gte))) return false;
                        continue;
                    }
                    if (val.$lte !== undefined) {
                        if (!(new Date(item[key]) <= new Date(val.$lte))) return false;
                        continue;
                    }
                }

                if (item[key] !== val) return false;
            }
            return true;
        };

        if (op === 'findOne' || op === 'find') {
            let results = collection.filter(match);

            // Apply sort
            if (this._sort) {
                const sortFields = typeof this._sort === 'string' ? { [this._sort]: 1 } : this._sort;
                results.sort((a, b) => {
                    for (const [key, dir] of Object.entries(sortFields)) {
                        const direction = dir === -1 || dir === 'desc' || dir === 'descending' ? -1 : 1;
                        const valA = a[key];
                        const valB = b[key];
                        if (valA < valB) return -1 * direction;
                        if (valA > valB) return 1 * direction;
                    }
                    return 0;
                });
            }

            // Apply skip
            if (this._skip) {
                results = results.slice(this._skip);
            }

            // Apply limit
            if (this._limit) {
                results = results.slice(0, this._limit);
            }

            // Map results to mongoose documents so they retain methods/virtuals
            const docs = results.map(r => {
                const doc = new model(r);
                doc.isNew = false;
                return doc;
            });

            if (op === 'findOne') return docs[0] || null;
            return docs;
        }

        if (op === 'findOneAndUpdate') {
            const index = collection.findIndex(match);
            const update = this._update || {};
            let item;

            if (index !== -1) {
                item = collection[index];
                Object.assign(item, update.$set || update);
                item.updatedAt = new Date();
            } else if (this.options && this.options.upsert) {
                item = { 
                    _id: new mongoose.Types.ObjectId().toString(),
                    ...conditions, 
                    ...(update.$set || update), 
                    createdAt: new Date(), 
                    updatedAt: new Date() 
                };
                collection.push(item);
            }

            if (item) {
                const doc = new model(item);
                doc.isNew = false;
                return doc;
            }
            return null;
        }

        if (op === 'updateMany') {
            const update = this._update || {};
            let count = 0;
            collection.forEach(item => {
                if (match(item)) {
                    Object.assign(item, update.$set || update);
                    item.updatedAt = new Date();
                    count++;
                }
            });
            return { modifiedCount: count };
        }

        if (op === 'countDocuments') {
            return collection.filter(match).length;
        }

        if (op === 'deleteOne' || op === 'deleteMany') {
            const beforeLen = collection.length;
            const remaining = collection.filter(item => !match(item));
            mockDataStore[model.modelName.toLowerCase() + 's'] = remaining;
            return { deletedCount: beforeLen - remaining.length };
        }

        return [];
    };

    // Override Model.prototype.save
    mongoose.Model.prototype.save = async function() {
        const model = this.constructor;
        const collection = getCollection(model);
        const obj = this.toObject();

        if (!obj._id) {
            obj._id = new mongoose.Types.ObjectId().toString();
        }

        const index = collection.findIndex(item => 
            item._id?.toString() === obj._id?.toString() || 
            (obj.id && item.id === obj.id)
        );

        if (index !== -1) {
            collection[index] = { ...collection[index], ...obj, updatedAt: new Date() };
        } else {
            obj.createdAt = obj.createdAt || new Date();
            obj.updatedAt = obj.updatedAt || new Date();
            collection.push(obj);
        }
        
        this.isNew = false;
        return this;
    };

    // Override Model.create
    mongoose.Model.create = async function(docs) {
        const isArray = Array.isArray(docs);
        const arr = isArray ? docs : [docs];
        const created = [];
        
        for (const doc of arr) {
            const inst = new this(doc);
            await inst.save();
            created.push(inst);
        }
        
        return isArray ? created : created[0];
    };
};

// Connect to MongoDB (with Auto-Mock Fallback if MongoDB is offline)
const connectDB = async () => {
    if (process.env.LOCAL_MOCK_DB === 'true') {
        initMockDb();
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcity_kiosk', {
            connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 10000),
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Create sample data if database is empty
        await createSampleData();
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);

        if (isProduction) {
            process.exit(1);
        } else {
            console.log('⚠️ MongoDB is not running locally. Activating local mock database fallback to prevent app errors during presentation.');
            initMockDb();
        }
    }
};

// Create sample data for testing
const createSampleData = async () => {
    const Citizen = require('../models/Citizen');
    const count = await Citizen.countDocuments();
    
    if (count === 0) {
        const sampleCitizens = [
            {
                id: 'CIT-2026-001',
                fullName: 'Rajesh Kumar',
                aadhaar: '123456789012',
                mobile: '9876543210',
                email: 'rajesh.kumar@email.com',
                accountId: 'ACC-MH-2026-7890',
                isActive: true
            },
            {
                id: 'CIT-2026-002',
                fullName: 'Priya Sharma',
                aadhaar: '234567890123',
                mobile: '8765432109',
                email: 'priya.sharma@email.com',
                accountId: 'ACC-MH-2026-7891',
                isActive: true
            },
            {
                id: 'CIT-2026-003',
                fullName: 'Amit Patel',
                aadhaar: '345678901234',
                mobile: '7654321098',
                email: 'amit.patel@email.com',
                accountId: 'ACC-MH-2026-7892',
                isActive: true
            }
        ];

        await Citizen.insertMany(sampleCitizens);
        console.log('📋 Sample citizen data created');
    }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
    if (process.env.LOCAL_MOCK_DB !== 'true') {
        console.error('MongoDB connection error:', err);
    }
});

mongoose.connection.on('disconnected', () => {
    if (process.env.LOCAL_MOCK_DB !== 'true') {
        console.log('MongoDB disconnected');
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    if (process.env.LOCAL_MOCK_DB !== 'true' && mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
    }
    process.exit(0);
});

module.exports = connectDB;
module.exports.getMongoStatus = getMongoStatus;

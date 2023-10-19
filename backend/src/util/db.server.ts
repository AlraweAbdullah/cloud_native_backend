const { MongoClient } = require('mongodb');
const uri = 'mongodb://root:root@mongo:27017'; // Use the service name "mongo" here
const client = new MongoClient(uri);

// Function to connect to the database
const connectToMongoDB = async () => {
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
};

export { connectToMongoDB, client };

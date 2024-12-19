const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

dotenv.config();

const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, '../../../protos/payment.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
);

const paymentProto = grpc.loadPackageDefinition(packageDefinition).payment;

const { processPayment } = require('../src/controllers/process_controller');

const app = express();
const EXPRESS_PORT = process.env.PORT ||50051;
app.use(express.json());
app.use(cors());

function startGrpcServer() {
    const server = new grpc.Server();
    server.addService(paymentProto.PaymentService.service, {
        ProcessPayment: processPayment,
    });

    const GRPC_PORT = '50051';
    server.bindAsync(
        `0.0.0.0:${GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.error('Failed to bind gRPC server:', err.message);
                process.exit(1);
            }
            console.log(`gRPC server running on port ${port}`);
            server.start();
        }
    );

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('Shutting down servers...');
        server.tryShutdown(() => {
            console.log('gRPC server shut down.');
        });
        process.exit(0);
    });
}

// Connect to DB and start servers
connectDB()
    .then(() => {
        startGrpcServer();
        app.listen(EXPRESS_PORT, () => {
            console.log(`Express server running on port ${EXPRESS_PORT}`);
        });
    })
    .catch((error) => {
        console.log('Failed to connect to the database:', error);
    });

// Global error handlers
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

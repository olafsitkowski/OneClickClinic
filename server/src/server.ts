import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import calendarEventRoutes from './routes/calendarEventRoutes';
import authenticationRoutes from './routes/authenticationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import userRoutes from './routes/userRoutes';
import fileRoutes from './routes/fileRoutes';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            description: 'swagger API',
            version: '1.0.0'
        }
    },
    apis: ['src/routes/*.ts']
};
const specs = swaggerJsdoc(swaggerOptions);
export const MONGO_URL = 'mongodb://localhost:27017';

app.use(cors());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(calendarEventRoutes);
app.use(authenticationRoutes);
app.use(userRoutes);
app.use(analyticsRoutes);
app.use(fileRoutes);

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.warn(error));

server.listen(8080, () => {
    console.log('Server running on port 8080');
});

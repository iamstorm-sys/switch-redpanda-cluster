import express, { Response, Request } from 'express';
import { config } from 'dotenv';
import * as controllers from './controllers/topic.js';


config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 7008;

app.get('/health', (_: Request, res: Response) => {
    res.json({ status: 'ok' });
});

// // add your routes here

// // admin operations
// app.get('/cluster', )
// app.post('/cluster', )
// app.put('/cluster',)
// app.delete('/cluster')

// // user Operations

app.post('/topic', controllers.topic.create)
app.put('/topic', controllers.topic.update)
app.delete('/topic', controllers.topic.delete)









app.listen(port, () => {
    console.log('Server is up and listening on port', port);
});

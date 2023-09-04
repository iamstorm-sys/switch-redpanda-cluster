import express, { Response, Request } from 'express';
import { config } from 'dotenv';
import { controllers } from './controllers/index.ts';
import { middlewares } from './middlewares/index.ts';


config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 7008;

app.get('/health', (_: Request, res: Response) => {
    res.json({ status: 'ok' });
});

// // add your routes here

// admin operations
app.get('/register',
    middlewares.devOrProd,
    // controllers.cluster.registerLocalClusters
)
// app.post('/cluster', )
// app.put('/cluster',)
// app.delete('/cluster')

// // user Operations

app.get('/clusters', controllers.cluster.list)

app.post('/topic', controllers.topic.create)
app.put('/topic', controllers.topic.update)
app.delete('/topic', controllers.topic.delete)






app.listen(port, () => {
    console.log('Server is up and listening on port', port);
});

import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Create Redis client
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

// Create express app
const app = express();
app.use(express.json());

const listProducts = [
    {
        id: 1,
        name: 'Suitcase 250',
        price: 50,
        stock: 4
    },
    {
        id: 2,
        name: 'Suitcase 450',
        price: 100,
        stock: 10
    },
    {
        id: 3,
        name: 'Suitcase 650',
        price: 350,
        stock: 2
    },
    {
        id: 4,
        name: 'Suitcase 1050',
        price: 550,
        stock: 5
    }
];

function getItemById(id) {
    return listProducts.find(item => item.id === id);
}

// Redis functions
async function reserveStockById(itemId, stock) {
    const setAsync = promisify(client.set).bind(client);
    await setAsync(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
    const stock = await getAsync(`item.${itemId}`);
    return stock ? parseInt(stock) : 0;
}

// Routes
app.get('/list_products', (req, res) => {
    res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);

    if (!item) {
        return res.json({ status: 'Product not found' });
    }

    const currentStock = await getCurrentReservedStockById(itemId);
    const response = {
        ...item,
        currentQuantity: item.stock - currentStock
    };
    res.json(response);
});

app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);

    if (!item) {
        return res.json({ status: 'Product not found' });
    }

    const currentStock = await getCurrentReservedStockById(itemId);

    // Check if there's at least one stock available
    if (currentStock >= item.stock) {
        return res.json({
            status: 'Not enough stock available',
            itemId: itemId
        });
    }

    await reserveStockById(itemId, currentStock + 1);
    return res.json({
        status: 'Reservation confirmed',
        itemId: itemId
    });
});

const port = 1245;
app.listen(port, () => {
    console.log(`API available on localhost port ${port}`);
}); 
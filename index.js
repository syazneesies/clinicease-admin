const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const itemRoutes = require("./routes/itemRoutes");
const path = require("path");
const admin = require('firebase-admin');

// Get a reference to the Firestore database
const firestore = admin.firestore();

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use authentication routes
app.use("/auth", authRoutes);

// Define route handler for the root URL to render login view
app.get("/", (req, res) => {
    res.render("login_screen");
});

// Route for home screen
app.get("/home", (req, res) => {
    res.render("home_screen");
});

// Include serviceRoutes
app.use('/', serviceRoutes);

app.get('/services', async (req, res) => {
  try {
    // Fetch services data from Firestore
    const snapshot = await firestore.collection('services').get();
    const services = [];

    snapshot.forEach(doc => {
      const serviceData = doc.data();
      const service = {
        name: serviceData.serviceName,
        quantity: serviceData.serviceQuantity,
        date: serviceData.serviceDate,
        status: serviceData.serviceStatus
      };
      services.push(service);
    });

    // Render the service_screen.ejs page with the services data
    res.render('service_screen', { services: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).send('Error fetching services');
  }
});

app.get('/add_service', (req, res) => {
    // Render the add_service_screen.ejs page
    res.render("add_service");
  });

app.get('/service_detail_screen', (req, res) => {
  // Render the service_detail_screen.ejs view
  res.render('service_detail_screen');
});


// Include rewardRoutes
app.use('/', rewardRoutes);

app.get('/rewards', async (req, res) => {
  try {
    // Fetch rewards data from Firestore
    const snapshot = await firestore.collection('rewards').get();
    const rewards = [];

    snapshot.forEach(doc => {
      const rewardData = doc.data();
      const reward = {
        name: rewardData.rewardName,
        price : rewardData.rewardPrice,
        quantity: rewardData.rewardQuantity,
        date: rewardData.rewardDate,
        status: rewardData.rewardStatus
      };
      rewards.push(reward);
    });

    // Render the service_screen.ejs page with the services data
    res.render('reward_screen', { rewards: rewards });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).send('Error fetching rewards');
  }
});

app.get('/add_reward', (req, res) => {
    // Render the add_reward_screen.ejs page
    res.render("add_reward");
  });

  app.get('/reward_detail_screen', (req, res) => {
    // Render the item_detail_screen.ejs view
    res.render('reward_detail_screen');
  });


  app.use('/', transactionRoutes);

  app.get('/transaction', async (req, res) => {
    try {
      // Fetch transactions data from Firestore
      const snapshot = await firestore.collection('transactions').get();
      const transactions = [];
  
      snapshot.forEach(doc => {
        const transactionData = doc.data();
        const transaction = {
          receiptId: transactionData.receiptId,
          transactionValue : transactionData.transactionValue,
        };
        transactions.push(transaction);
      });
  
      // Render the transaction_screen.ejs page with the services data
      res.render('transaction_screen', { transactions: transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).send('Error fetching transactions');
    }
  });

  app.get('/add_transaction', (req, res) => {
    // Render the add_transaction.ejs page
    res.render("add_transaction");
  });

// Include itemRoutes
app.use('/', itemRoutes);

app.get('/items', async (req, res) => {
  try {
    // Fetch items data from Firestore
    const snapshot = await firestore.collection('items').get();
    const items = [];

    snapshot.forEach(doc => {
      const itemData = doc.data();
      const item = {
        itemName: itemData.itemName,
        itemPrice : itemData.itemPrice,
        itemQuantity: itemData.itemQuantity,
        itemDate: itemData.itemDate,
      };
      items.push(item);
    });

    // Render the service_screen.ejs page with the services data
    res.render('item_screen', { items: items});
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

app.get('/add_item', (req, res) => {
    // Render the add_item_screen.ejs page
    res.render("add_item");
  });

  app.get('/item_detail_screen', (req, res) => {
    // Render the item_detail_screen.ejs view
    res.render('item_detail_screen');
  });

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
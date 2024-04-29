const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK with storageBucket option
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://clinicease-d1dc6.appspot.com' 
  });
}

// Controller to handle adding a new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { receiptID, transactionValue } = req.body;
    console.log("receiptID:", receiptID, "transactionValue:", transactionValue);
    
    if (!receiptID || !transactionValue) {
        throw new Error("Missing receiptID or transactionValue in request body");
    }

    // Generate a unique ID for the transaction
    const transactionId = admin.firestore().collection("transactions").doc().id;

    // Save form data to Firestore
    await admin.firestore().collection("transactions").doc(transactionId).set({
      receiptID: receiptID,
      transactionValue: transactionValue,
    });

    res.status(201).json({
      status: 'success',
      message: 'Transaction saved to Firestore!'
    });
  } catch (err) {
    console.error("Error adding transaction: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save transaction to Firestore'
    });
  }
};

// Function to fetch transaction from Firestore
exports.getTransactions = async (req, res) => {
  try {
    // Get reference to the Firestore collection
    const snapshot = await admin.firestore().collection('transactions').get();
    const transactions = [];

    // Iterate through each document and push transactions details to transactions array
    snapshot.forEach(doc => {
      const transaction = doc.data();
      services.push({
        id: doc.id,
        receiptId: transaction.receiptId,
        transactionValue: transaction.transactionValue, 
      });
    });

    // Check if transactions array is populated
    console.log("Transaction:", transactions);

    // Render the transaction_screen.ejs page with the transactions data
    res.render('transaction_screen', { transactions : transactions });
  } catch (err) {
    console.error("Error fetching transactions: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch transactions'
    });
  }
};

// Controller method to delete a transaction by ID
exports.deleteTransactionById = async (req, res) => {
    try {
      const transactionId = req.params.id;
      
      // Delete the service from Firestore
      await admin.firestore().collection('transactions').doc(transactionId).delete();
  
      res.status(204).end(); 
    } catch (err) {
      console.error('Error deleting transaction:', err);
      res.status(500).json({
        error: 'Failed to delete transaction',
      });
    }
  };
  



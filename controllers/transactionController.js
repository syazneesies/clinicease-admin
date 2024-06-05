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
    const { receiptNumber, transactionValue, transactionStatus } = req.body;
    console.log("Receipt Number:", receiptNumber, "Transaction Value:", transactionValue);
    
    if (!receiptNumber || !transactionValue || !transactionStatus) {
        throw new Error("Missing receipt number, transaction value, or transaction status in request body");
    }

    // Check if the receipt number already exists
    const existingTransaction = await admin.firestore().collection("transactions")
      .where("receiptNumber", "==", receiptNumber)
      .get();

    if (!existingTransaction.empty) {
      return res.status(400).json({
        status: 'error',
        message: 'Receipt number has been added!'
      });
    }

    // Generate a unique ID for the transaction
    const transactionId = admin.firestore().collection("transactions").doc().id;

    // Save form data to Firestore
    await admin.firestore().collection("transactions").doc(transactionId).set({
      receiptNumber: receiptNumber,
      transactionValue: transactionValue,
      transactionStatus: transactionStatus,
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

// Controller method to delete a transaction by ID
// Function to fetch rewards from Firestore
exports.getTransactions = async (req, res) => {
  try {
    // Get reference to the Firestore collection
    const snapshot = await admin.firestore().collection('transactions').get();
    const transactions = [];

    // Iterate through each document and push reward details to services array
    snapshot.forEach(doc => {
      const transaction = doc.data();
      transactions.push({
        id: doc.id,
        receiptNumber: transaction.receiptNumber,
        transactionValue: transaction.transactionValue,
        transactionStatus: transaction.transactionStatus,
      });
    });

    // Check if services array is populated
    console.log("Transactions", transactions);

    // Render the service_screen.ejs page with the reward data
    res.render('transaction_screen', { transactions: transactions});
  } catch (err) {
    console.error("Error fetching transaction: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch transactions'
    });
  }
};


// Controller method to delete a reward by ID
exports.deleteTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.id;
    
    // Delete the service from Firestore
    await admin.firestore().collection('transactions').doc(transactionId).delete();

    res.status(204).end();
  } catch (err) {
    console.error('Error deleting transactions:', err);
    res.status(500).json({
      error: 'Failed to delete transactions',
    });
  }
};


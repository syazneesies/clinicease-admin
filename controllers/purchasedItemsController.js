const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK with storageBucket option
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://clinicease-d1dc6.appspot.com' 
  });
}

exports.getPurchasedItem = async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('purchased_items').get();
        const purchasedItems = [];

        snapshot.forEach(doc => {
            const purchasedItemData = doc.data();
            const items = purchasedItemData.items.map(item => ({
                imageUrl: item.imageUrl,
                itemDescription: item.itemDescription,
                itemName: item.itemName,
                itemPrice: item.itemPrice,
                itemQuantity: item.itemQuantity,
                itemRemark: item.itemRemark,
                quantity: item.quantity,
                itemId: item.itemId
            }));

            const purchasedItem = {
                purchaseditemId: doc.id,
                userId: purchasedItemData.userId,
                purchasedOn: purchasedItemData.timestamp.toDate(),
                items: items,
                totalPrice: purchasedItemData.totalPrice,
                status: purchasedItemData.transactionStatus
            };
            purchasedItems.push(purchasedItem);
        });

        console.log("Purchased Items:", purchasedItems);
        res.render('view_purchased_items', { purchasedItems: purchasedItems });
    } catch (error) {
        console.error('Error fetching purchased items:', error);
        res.status(500).send('Error fetching purchased items');
    }
};

// Function to retrieve purchased items data by ID from Firestore
async function getPurchasedItemsDataById(purchasedItemId) {
    try {
      const doc = await admin.firestore().collection('purchased_items').doc(purchasedItemId).get();
  
      if (!doc.exists) {
        return null; // Return null if document does not exist
      }
  
      // Extract data from the document
      const purchasedItemData = doc.data();
      const items = purchasedItemData.items.map(item => ({
        imageUrl: item.imageUrl,
        itemDescription: item.itemDescription,
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        itemQuantity: item.itemQuantity,
        itemRemark: item.itemRemark,
        quantity: item.quantity,
        itemId: item.itemId
      }));
  
      return {
        purchaseditemId: doc.id,
        userId: purchasedItemData.userId,
        purchasedOn: purchasedItemData.timestamp.toDate(),
        items: items,
        totalPrice: purchasedItemData.totalPrice,
        status: purchasedItemData.transactionStatus
      };
    } catch (error) {
      console.error('Error retrieving purchased items data:', error);
      throw error; // Throw error to be caught by the calling function
    }
  }
  
  // Controller function to handle GET request for fetching purchased items by ID
  exports.getPurchasedItemsById = async (req, res) => {
    try {
      const { purchasedItemId } = req.params;
      const purchasedItemsData = await getPurchasedItemsDataById(purchasedItemId);
      if (purchasedItemsData) {
        console.log('Purchased Items Data:', purchasedItemsData);
        res.status(200).json(purchasedItemsData);
      } else {
        res.status(404).json({ error: 'Purchased items not found' });
      }
    } catch (error) {
      console.error('Error fetching purchased items:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.updateTransactionStatus = async (req, res) => {
    try {
      const { purchasedItemId } = req.params;
      const status = req.body.status;
  
      const docRef = admin.firestore().collection('purchased_items').doc(purchasedItemId);
      await docRef.update({ transactionStatus: status });
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating transaction status:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
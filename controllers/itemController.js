const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK with storageBucket option
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://clinicease-d1dc6.appspot.com' 
  });
}

// Get a reference to the Firebase Storage service
const storage = admin.storage();

// Controller to handle adding a new Item
exports.addItem = async (req, res) => {
  try {
    const { itemName, itemDescription, itemDate, itemQuantity, itemPrice, itemStatus, itemRemark } = req.body;
    const itemImage = req.file; 

    if (!itemImage) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Define the folder path
    const folderPath = 'itemsImages/';
    // Construct the file path within the specified folder
    const filePath = folderPath + itemImage.originalname;

    // Upload image to Firebase Storage
    const imageRef = storage.bucket().file(filePath); 
    await imageRef.save(itemImage.buffer);

    // Get download URL of the uploaded image
    const imageUrl = await imageRef.getSignedUrl({
      action: 'read',
      expires: '03-26-2025'
    });

     // Generate a unique ID for the service
     const itemId = admin.firestore().collection("items").doc().id;
     const parsedItemPrice = parseFloat(itemPrice);

     const parsedItemQuantity = parseInt(itemQuantity);


    // Save form data to Firestore
    await admin.firestore().collection("items").doc(itemId).set({
      itemName: itemName,
      itemDescription: itemDescription,
      itemDate: itemDate,
      itemQuantity: parsedItemQuantity,
      itemPrice : parsedItemPrice ,
      itemStatus : itemStatus,
      itemRemark: itemRemark,
      imageUrl: imageUrl,
    });

    res.status(201).json({
      status: 'success',
      message: 'Item saved to Firebase!'
    });
  } catch (err) {
    console.error("Error adding Item: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save item to Firebase'
    });
  }
};

// Function to fetch items from Firestore
exports.getItems = async (req, res) => {
  try {
    // Get reference to the Firestore collection
    const snapshot = await admin.firestore().collection('items').get();
    const items = [];

    // Iterate through each document and push item details to items array
    snapshot.forEach(doc => {
      const item = doc.data();
      items.push({
        id: doc.id,
        itemName: item.itemName,
        itemPrice: item.itemPrice, 
        itemQuantity: item.itemQuantity, 
        itemDate: item.itemDate, 
      });
    });

    // Check if items array is populated
    console.log("Items:", items);

    // Render the item_screen.ejs page with the items data
    res.render('item_screen', { items: items});
  } catch (err) {
    console.error("Error fetching items: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch items'
    });
  }
};

// Function to get items details by ID
exports.getItemById = async (req, res) => {
  try {
      const { id } = req.params;
      const doc = await admin.firestore().collection('items').doc(id).get();

      if (!doc.exists) {
          return res.status(404).json({ error: 'Item not found' });
      }

      res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ error: 'Failed to fetch item' });
  }
};

// Controller method to delete a item by ID
exports.deleteItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Delete the item from Firestore
    await admin.firestore().collection('items').doc(itemId).delete();

    res.status(204).end();
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({
      error: 'Failed to delete item',
    });
  }
};



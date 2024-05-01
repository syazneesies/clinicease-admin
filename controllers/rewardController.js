const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const upload = require('../middleware/multerMiddleware');

// Initialize Firebase Admin SDK with storageBucket option
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://clinicease-d1dc6.appspot.com' 
  });
}

// Get a reference to the Firebase Storage reward
const storage = admin.storage();

// Controller to handle adding a new reward
exports.addReward = async (req, res) => {
  try {
    const { rewardName, rewardDescription, rewardDate, rewardQuantity, rewardPIC, rewardStatus} = req.body;
    const rewardPoint = parseInt(req.body.rewardPoint);
    const rewardImage = req.file; 

    if (!rewardImage) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate a unique ID for the reward
    const rewardId = admin.firestore().collection("rewards").doc().id;

    // Define the folder path
    const folderPath = 'rewardsImages/';
    // Construct the file path within the specified folder
    const filePath = folderPath + rewardId + '_' + rewardImage.originalname;

    // Upload image to Firebase Storage
    const imageRef = storage.bucket().file(filePath); 
    await imageRef.save(rewardImage.buffer);

    // Get download URL of the uploaded image
    const imageUrl = await imageRef.getSignedUrl({
      action: 'read',
      expires: '03-26-2025'
    });

    // Convert serviceQuantity to number
    const parsedRewardQuantity = parseInt(rewardQuantity);

     let rewardDateTimestamp;
      if (!isNaN(rewardDate)) {
        // If rewardDate is already in milliseconds format
        rewardDateTimestamp = parseInt(rewardDate);
        if (isNaN(new Date(rewardDateTimestamp).getTime())) {
          console.error('Invalid format for rewardDate:', rewardDate);
          return res.status(400).json({ error: 'Invalid format for rewardDate' });
        }
      } else {
        // Try to parse rewardDate into milliseconds
        rewardDateTimestamp = Date.parse(rewardDate);
        if (isNaN(rewardDateTimestamp)) {
          console.error('Invalid format for rewardDate:', rewardDate);
          return res.status(400).json({ error: 'Invalid format for rewardDate' });
        }
      }

    // Save form data to Firestore
    await admin.firestore().collection("rewards").doc(rewardId).set({
      rewardName: rewardName,
      rewardDescription: rewardDescription,
      rewardDate: new Date(rewardDateTimestamp),
      rewardQuantity: parsedRewardQuantity,
      rewardPIC: rewardPIC,
      rewardStatus: rewardStatus,
      rewardPoint: rewardPoint,
      imageUrl: imageUrl
    });

    res.status(201).json({
      status: 'success',
      message: 'Reward saved to Firebase!'
    });
  } catch (err) {
    console.error("Error adding reward: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save reward to Firebase'
    });
  }
};

// Function to fetch rewards from Firestore
exports.getRewards = async (req, res) => {
  try {
    // Get reference to the Firestore collection
    const snapshot = await admin.firestore().collection('rewards').get();
    const rewards = [];

    // Iterate through each document and push reward details to services array
    snapshot.forEach(doc => {
      const reward = doc.data();
      rewards.push({
        id: doc.id,
        name: reward.rewardName,
        point: reward.rewardPoint,
        quantity: reward.rewardQuantity, 
        date: reward.rewardDate, 
        status: reward.rewardStatus 
      });
    });

    // Check if services array is populated
    console.log("Rewards:", rewards);

    // Render the service_screen.ejs page with the reward data
    res.render('reward_screen', { rewards: rewards });
  } catch (err) {
    console.error("Error fetching rewards: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch rewards'
    });
  }
};

// Function to get reward details by ID
exports.getRewardById = async (req, res) => {
  try {
      const { id } = req.params;
      const doc = await admin.firestore().collection('rewards').doc(id).get();

      if (!doc.exists) {
          return res.status(404).json({ error: 'Reward not found' });
      }

      res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
      console.error('Error fetching reward:', error);
      res.status(500).json({ error: 'Failed to fetch reward' });
  }
};

// Controller method to delete a reward by ID
exports.deleteRewardById = async (req, res) => {
  try {
    const rewardId = req.params.id;
    
    // Delete the service from Firestore
    await admin.firestore().collection('rewards').doc(rewardId).delete();

    res.status(204).end();
  } catch (err) {
    console.error('Error deleting reward:', err);
    res.status(500).json({
      error: 'Failed to delete reward',
    });
  }
};

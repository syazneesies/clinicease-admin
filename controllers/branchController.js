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
exports.addBranch = async (req, res) => {
  try {
    const { branchName, branchLocation} = req.body;
    console.log("Branch Name:", branchName, "Branch Location", branchLocation);
    
    if (!branchName || !branchLocation ) {
        throw new Error("Missing branch name and branch location in request body");
    }

    // Generate a unique ID for the transaction
    const branchId = admin.firestore().collection("branch").doc().id;

    // Save form data to Firestore
    await admin.firestore().collection("branch").doc(branchId).set({
      branchName: branchName,
      branchLocation: branchLocation,
    });

    res.status(201).json({
      status: 'success',
      message: 'Branch saved to Firestore!'
    });
  } catch (err) {
    console.error("Error adding branch: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save branch to Firestore'
    });
  }
};

// Function to fetch rewards from Firestore
exports.getBranches = async (req, res) => {
  try {
    // Get reference to the Firestore collection
    const snapshot = await admin.firestore().collection('branch').get();
    const branches = [];

    // Iterate through each document and push reward details to services array
    snapshot.forEach(doc => {
      const branch = doc.data();
      branches.push({
        id: doc.id,
        branchName: branch.branchName,
        branchLocation: branch.branchLocation,
      });
    });

    // Check if services array is populated
    console.log("Branches", branches);

    // Render the service_screen.ejs page with the reward data
    res.render('branch_screen', { branches: branches});
  } catch (err) {
    console.error("Error fetching branches: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch branches'
    });
  }
};


// Controller method to delete a reward by ID
exports.deleteBranchById = async (req, res) => {
  try {
    const branchId = req.params.id;
    
    // Delete the service from Firestore
    await admin.firestore().collection('branch').doc(branchId).delete();

    res.status(204).end();
  } catch (err) {
    console.error('Error deleting branches:', err);
    res.status(500).json({
      error: 'Failed to delete branches',
    });
  }
};


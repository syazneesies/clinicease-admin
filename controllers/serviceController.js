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

// Controller to handle adding a new service
exports.addService = async (req, res) => {
  try {
    const { serviceName, serviceDescription, serviceDate, serviceQuantity, serviceStatus, servicePIC, serviceTimes } = req.body;
    const serviceImage = req.file; 

    if (!serviceImage) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload image to Firebase Storage
    const storage = admin.storage();
    const bucket = storage.bucket();
    const folderPath = 'servicesImages/';
    const fileName = Date.now() + '-' + serviceImage.originalname; // Add timestamp to make filename unique
    const filePath = folderPath + fileName;

    const imageRef = bucket.file(filePath);
    await imageRef.save(serviceImage.buffer, {
      metadata: {
        contentType: serviceImage.mimetype // Set the content type of the file
      }
    });

    // Get download URL of the uploaded image
    const imageUrl = await imageRef.getSignedUrl({
      action: 'read',
      expires: '03-26-2025'
    });

     // Convert serviceTimes back to array of timestamps
     let parsedServiceTimes;
     try {
       parsedServiceTimes = JSON.parse(serviceTimes);
     } catch (error) {
       console.error('Invalid JSON format for serviceTimes:', error);
       return res.status(400).json({ error: 'Invalid JSON format for serviceTimes' });
     }

      // Convert serviceDate to timestamp
      const serviceDateTimestamp = Date.parse(serviceDate);
 
     // Save form data to Firestore
     const serviceId = admin.firestore().collection("services").doc().id;
     await admin.firestore().collection("services").doc(serviceId).set({
       serviceName: serviceName,
       serviceDescription: serviceDescription,
       serviceDate: serviceDateTimestamp, 
       serviceQuantity: serviceQuantity, // Already converted to number on the client-side
       serviceStatus: serviceStatus,
       servicePIC: servicePIC,
       serviceTimes: parsedServiceTimes,
       imageUrl: imageUrl[0] // imageUrl is an array, so access the first element
     });
 
     res.status(201).json({
       status: 'success',
       message: 'Service saved to Firebase!'
     });
   } catch (err) {
     console.error("Error adding service: ", err);
     res.status(500).json({
       status: 'error',
       message: 'Failed to save service to Firebase'
     });
   }
 };

// Function to fetch services from Firestore
exports.getServices = async (req, res) => {
  try {
    // Get reference to the Firestore collection
    const snapshot = await admin.firestore().collection('services').get();
    const services = [];

    // Iterate through each document and push service details to services array
    snapshot.forEach(doc => {
      const service = doc.data();
      services.push({
        id: doc.id,
        name: service.serviceName,
        quantity: service.serviceQuantity, 
        date: service.serviceDate, 
        status: service.serviceStatus 
      });
    });

    // Check if services array is populated
    console.log("Services:", services);

    // Render the service_screen.ejs page with the services data
    res.render('service_screen', { services: services });
  } catch (err) {
    console.error("Error fetching services: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch services'
    });
  }
};

// Function to get service details by ID
exports.getServiceById = async (req, res) => {
  try {
      const { id } = req.params;
      const doc = await admin.firestore().collection('services').doc(id).get();

      if (!doc.exists) {
          return res.status(404).json({ error: 'Service not found' });
      }

      res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({ error: 'Failed to fetch service' });
  }
};

// Controller method to delete a service by ID
exports.deleteServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    // Delete the service from Firestore
    await admin.firestore().collection('services').doc(serviceId).delete();

    res.status(204).end(); // No content response
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({
      error: 'Failed to delete service',
    });
  }
};



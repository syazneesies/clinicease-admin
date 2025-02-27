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
        contentType: serviceImage.mimetype 
      }
    });

    // Get download URL of the uploaded image
    const imageUrl = await imageRef.getSignedUrl({
      action: 'read',
      expires: '03-26-2025'
    });

      // Parse serviceTimes as JSON
    const parsedServiceTimes = JSON.parse(serviceTimes);

    // Ensure parsedServiceTimes is treated as an array
    if (!Array.isArray(parsedServiceTimes)) {
      console.error('serviceTimes is not an array');
      return res.status(400).json({ error: 'serviceTimes is not an array' });
    }

    // Convert serviceTimes array elements to timestamps
    const parsedServiceTimesTimestamps = parsedServiceTimes.map(time => new Date(parseInt(time)));

    // Convert serviceQuantity to number
    const parsedServiceQuantity = parseInt(serviceQuantity);

     let serviceDateTimestamp;
      if (!isNaN(serviceDate)) {
        // If serviceDate is already in milliseconds format
        serviceDateTimestamp = parseInt(serviceDate);
        if (isNaN(new Date(serviceDateTimestamp).getTime())) {
          console.error('Invalid format for serviceDate:', serviceDate);
          return res.status(400).json({ error: 'Invalid format for serviceDate' });
        }
      } else {
        // Try to parse serviceDate into milliseconds
        serviceDateTimestamp = Date.parse(serviceDate);
        if (isNaN(serviceDateTimestamp)) {
          console.error('Invalid format for serviceDate:', serviceDate);
          return res.status(400).json({ error: 'Invalid format for serviceDate' });
        }
      }
 
     // Save form data to Firestore
     const serviceId = admin.firestore().collection("services").doc().id;
     await admin.firestore().collection("services").doc(serviceId).set({
       serviceName: serviceName,
       serviceDescription: serviceDescription,
       serviceDate: new Date(serviceDateTimestamp),
       serviceQuantity: parsedServiceQuantity,
       serviceStatus: serviceStatus,
       servicePIC: servicePIC,
       serviceTimes: parsedServiceTimesTimestamps,
       imageUrl: imageUrl
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

// Function to fetch services from Firestore
exports.getBookedServices = async (req, res) => {
  try {
    // Get reference to the Firestore collection
    const snapshot = await admin.firestore().collection('booked_services').get();
    const bookedServices = [];

    // Iterate through each document and push booked_services details to services array
    snapshot.forEach(doc => {
      const bookedService = doc.data();
      bookedServices.push({
        id: doc.id,
        serviceName: bookedService.serviceName,
        name: bookedService.fullName,
        phoneNumber: bookedService.phoneNumber,
        date: bookedService.serviceDate,
        booked_at: bookedService.createdAt
      });
    });

    // Check if bookedServices array is populated
    console.log("Booked Services:", bookedServices);

    // Render the service_screen.ejs page with the bookedServices data
    res.render('view_booked_appointment', { bookedServices: bookedServices });
  } catch (err) {
    console.error("Error fetching Booked Services: ", err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch BookedServices'
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



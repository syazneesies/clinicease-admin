const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK with storageBucket option
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://clinicease-d1dc6.appspot.com' 
  });
}

exports.getBookedServices = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('booked_services').get();
    const bookedServices = [];

    snapshot.forEach(doc => {
      const bookedServiceData = doc.data();
      const selectedBranch = Array.isArray(bookedServiceData.selectedBranch) ? bookedServiceData.selectedBranch : [bookedServiceData.selectedBranch];
      const bookedService = {
        bookedserviceid: doc.id,
        createdAt: bookedServiceData.createdAt.toDate(),
        fullName: bookedServiceData.fullName,
        phoneNumber: bookedServiceData.phoneNumber,
        serviceDate: bookedServiceData.serviceDate.toDate(),
        serviceId: bookedServiceData.serviceId,
        serviceName: bookedServiceData.serviceName,
        serviceTimes: bookedServiceData.serviceTimes.toDate(),
        userId: bookedServiceData.userId,
        status: bookedServiceData.serviceStatus,
        selectedBranch: selectedBranch.map(branch => ({
          branchName: branch.branchName,
          branchLocation: branch.branchLocation,
        })),
      };
      bookedServices.push(bookedService);
    });
    
    console.log("Booked Services:", bookedServices);
    res.render('view_booked_appointment', { bookedServices : bookedServices });
  } catch (error) {
    console.error('Error fetching booked services:', error);
    res.status(500).send('Error fetching booked services');
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await admin.firestore().collection('booked_services').doc(id).update({ serviceStatus: status });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

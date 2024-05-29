const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK with storageBucket option
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://clinicease-d1dc6.appspot.com' 
  });
}

exports.getPurchasedReward = async (req, res) => {
    try {
      const snapshot = await admin.firestore().collection('purchased_rewards').get();
      const purchasedRewards = [];
  
      snapshot.forEach(doc => {
        const purchasedRewardData = doc.data();
        const purchasedReward = {
          purchasedrewardId: doc.id,
          rewardName: purchasedRewardData.rewardName,
          rewardDate: purchasedRewardData.rewardDate.toDate(),
          rewardStatus: purchasedRewardData.rewardStatus,
          userId: purchasedRewardData.userId,
          createdAt: purchasedRewardData.createdAt.toDate()
        };
        purchasedRewards.push(purchasedReward);
      });
      
      console.log("Purchased Rewards:", purchasedRewards);
      res.render('view_purchased_rewards', { purchasedRewards : purchasedRewards });
    } catch (error) {
      console.error('Error fetching purchased rewards:', error);
      res.status(500).send('Error fetching purchased rewards');
    }
  };

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await admin.firestore().collection('purchased_rewards').doc(id).update({ rewardStatus: status });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};
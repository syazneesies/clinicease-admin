class Reward {
    constructor(rewardId, rewardName, rewardDescription, rewardDate, rewardQuantity, rewardPIC, rewardStatus, rewardPoint) {
      this.rewardId = rewardId;
      this.rewardName = rewardName;
      this.rewardDescription = rewardDescription;
      this.rewardDate = rewardDate;
      this.rewardQuantity = rewardQuantity;
      this.rewardStatus = rewardStatus;
      this.rewardPIC = rewardPIC;
      this.rewardPoint = rewardPoint;
    }
  }
  
  module.exports = Reward;
  
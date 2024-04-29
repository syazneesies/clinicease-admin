class Transaction {
    constructor(receiptNumber, transactionValue, transactionStatus) {
      this.receiptNumber = receiptNumber;
      this.transactionValue = transactionValue;
      this.transactionStatus = transactionStatus;
    }
  }
  
module.exports = Transaction;
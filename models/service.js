class Service {
    constructor(serviceName, serviceDescription, serviceDate, serviceQuantity, serviceStatus, servicePIC) {
      this.serviceName = serviceName;
      this.serviceDescription = serviceDescription;
      this.serviceDate = serviceDate;
      this.serviceQuantity = serviceQuantity;
      this.serviceStatus = serviceStatus;
      this.servicePIC = servicePIC;
    }
  }
  
  module.exports = Service;
  
// Define the formatDate function
function formatDate(timestamp) {
    // Convert timestamp to a Date object
    const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds

    // Get day, month, and year from the date object
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();

    // Format day and month to have leading zeros if needed
    const formattedDay = (day < 10) ? '0' + day : day;
    const formattedMonth = (month < 10) ? '0' + month : month;

    // Return the formatted date string in DD-MM-YYYY format
    return formattedDay + '-' + formattedMonth + '-' + year;
}

module.exports = formatDate;

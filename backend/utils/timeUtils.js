const convertToIST = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
        return new Date(); // Return current time if invalid date
    }
    return new Date(date.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5:30 hours for IST
};

module.exports = { convertToIST };
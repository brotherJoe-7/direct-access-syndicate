// frontend/src/utils/formatDate.js

/**
 * Formats a date string or timestamp into "11th July, 2026" format.
 * @param {string | number | Date} dateInput - The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const day = date.getDate();
    const year = date.getFullYear();
    
    // Get month name
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
    const monthName = monthFormatter.format(date);

    // Get ordinary suffix for the day
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 ? 0 : (day % 100 - day % 10 === 10 ? 0 : day % 10))] || 'th';

    return `${day}${suffix} ${monthName}, ${year}`;
};

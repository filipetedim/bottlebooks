'use strict';

/**
 * Returns true if an object isn't null or undefined, or neither in string format.
 *
 * @param {Object} obj - object to check
 * @return {Boolean} - true if exists, false otherwise
 */
const exists = obj => {
    return (obj !== null && obj !== undefined && obj !== 'null' && obj !== 'undefined'); // eslint-disable-line
};

// Export functions
module.exports = {
    exists
};
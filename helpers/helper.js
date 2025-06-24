// const isPositiveInteger = (value) => {
//     return Number.isInteger(value) && value > 0;
// };

// const isValidString = (value, minLength = 1) => {
//     return typeof value === "string" && value.trim().length >= minLength;
// };

// const isValidNumber = (value) => {
//     return typeof value === "number" && value > 0;
// };

// const isValidEmail = (value) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return typeof value === "string" && emailRegex.test(value);
// };

/**
 * exclude
 * @param {Object} obj
 * @param {String} keys
 */
const exclude = function (obj, keys) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key)),
    )
}

const capitalize = function (str) {
    // if (typeof str !== 'string') return str;
    // return str.charAt(0).toUpperCase() + str.slice(1);
    return str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

export { exclude, capitalize };
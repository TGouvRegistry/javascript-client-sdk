/**
 * @param {Object} payload
 * @param {string} uniqAttributes
 * @returns {Object}
 */

const getUniqAttributePayload = (payload, uniqAttributes) => {
    // check if payload object contains fields and check if attributes is a string

    if (!payload || typeof payload !== "object" || !uniqAttributes || typeof uniqAttributes !== "string") {
        return null;
    }

    const uniqAttributesSplitted = uniqAttributes.split(",").map((uniqAttribute) => uniqAttribute.trim());

    const uniqAttributePayload = {};
    uniqAttributesSplitted.forEach((attribute) => {
        uniqAttributePayload[`data.${attribute}`] = payload[attribute];
    });
    return uniqAttributePayload;
};

/**
 * @param {string} htmlString
 */

const extractQrCodeSrc = (htmlString) => {
    // Regular expression to find
    // <img> tags with alt="qr_code" attribute and extract the src attribute value
    const imgTagRegex = /<img(?=[^>]*(?:\salt=(?:"|')qr_code(?:"|')))(?:[^>]*\ssrc=(?:"|')([^"']+)(?:"|'))?[^>]*>/i;

    // Match the regex against the HTML string
    const match = htmlString.match(imgTagRegex);

    // If there is a match and the src attribute value exists, return it; otherwise, return null
    return match && match[1] ? match[1] : null;
};

module.exports = {
    getUniqAttributePayload,
    extractQrCodeSrc,
};

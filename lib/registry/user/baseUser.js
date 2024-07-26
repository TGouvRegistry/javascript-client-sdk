/* eslint-disable no-underscore-dangle */
const { default: axios } = require("axios");

class BaseUser {
    constructor({ username, password, registryHost }) {
        this.username = username;
        this.password = password;
        this.token = null;
        this.token_exp = null;
        this.registryHost = registryHost;
    }

    /**
     *
     */
    async login() {
        // Use previous token if still valid
        if (this.token && this.token_exp > Date.now()) {
            return this.token;
        }

        const url = `${this.registryHost}/api/v1/auth/login`;

        const body = {
            username: this.username,
            password: this.password,
        };
        try {
            const response = await axios.post(url, body);

            if (!response?.data?.data?.access_token) {
                throw Error("Invalid response from authentication server");
            }

            this.token = response.data.data.access_token;
            this.token_exp = response.data.data.expiresAt;

            return response.data.data.access_token;
        } catch (err) {
            console.log(err);
            if (err.response && err.response.status === 401) {
                throw Error("Invalid username or password");
            } else {
                throw Error("Unable to login at this time. Please try again later.");
            }
        }
    }

    /**
     *@param {Object} payload
     *@param {string} schemaId
     */
    async searchSingleSchemaData(payload, schemaId) {
        const data = {
            query: payload,
        };

        const url = `${this.registryHost}/api/v1/schema/${schemaId}/entities/_search?limit=1`;

        const options = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };

        const response = await axios.post(url, data, options);

        if (response.data?.data.length > 0) {
            return response.data?.data[0]._id;
        }
        return null;
    }

    /**
     * @param {string} schemaId
     * @param {Object} payload
     */
    async inviteDataBySchema(schemaId, payload) {
        const url = `${this.registryHost}/api/v1/schema/${schemaId}/_invite`;

        const options = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };

        const response = await axios.post(url, payload, options);
        const result = response.data?.data;

        return result.id;
    }

    /**
     * @param {string} schemaId
     * @param {string} entryId
     * @param {Object} payload
     */
    async updateSchemaData(schemaId, entryId, payload) {
        const url = `${this.registryHost}/api/v1/schema/${schemaId}/entities/${entryId}`;

        const options = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };

        const response = await axios.put(url, payload, options);
        return response.data.data;
    }
}

module.exports.BaseUser = BaseUser;

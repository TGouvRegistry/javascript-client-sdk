const { default: axios } = require("axios");
const { BaseUser } = require("./baseUser");

class Admin extends BaseUser {
    constructor({
        username, password, userSchemaId, dataSchemaId,
        registryHost,
    }) {
        super({ username, password });
        this.userSchemaId = userSchemaId;
        this.dataSchemaId = dataSchemaId;

        this.registryHost = registryHost;
    }

    /**
     *
     */
    async login() {
        return super.login();
    }

    /**
     *@param {string} schemaId
     */
    async #checkSchemaNameExistence(schemaId) {
        const url = `${this.registryHost}/api/v1/schema/${schemaId}`;

        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            };

            await axios.get(url, options);
            return true;
        } catch (err) {
            // Schema does not exist
            return false;
        }
    }

    /**
     *
     */
    async checkUserSchemaExistence() {
        return this.#checkSchemaNameExistence(this.userSchemaId);
    }

    /**
     *
     */
    async checkDataSchemaExistence() {
        return this.#checkSchemaNameExistence(this.dataSchemaId);
    }

    /**
     *@param {string} email
     */
    async checkUserExistence(email) {
        return this.searchSingleSchemaData(
            { "data.email": email },
            this.userSchemaId,
        );
    }

    /**
     *@param {Object} payload
     */
    async inviteUser(payload) {
        return this.inviteDataBySchema(this.userSchemaId, payload);
    }
}

module.exports.Admin = Admin;

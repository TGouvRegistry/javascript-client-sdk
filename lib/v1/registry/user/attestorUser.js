const { default: axios } = require("axios");
const { BaseUser } = require("./baseUser");

class Attestor extends BaseUser {
    constructor({
        username, password, dataSchemaName, registryHost,
    }) {
        super({ username, password });
        this.dataSchemaName = dataSchemaName;
        this.registryHost = registryHost;
    }

    /**
     *
     */
    async login() {
        return super.login();
    }

    /**
     *
     */
    async attestClaim(claimId) {
        const url = `${this.registryHost}/api/v1/claims/${claimId}/attest`;

        const options = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };

        const body = {
            schemaName: this.dataSchemaName,
        };

        const response = await axios.post(url, body, options);

        return response.data.data.id;
    }
}

module.exports.Attestor = Attestor;

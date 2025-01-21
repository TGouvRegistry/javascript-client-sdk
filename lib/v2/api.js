const { default: axios } = require("axios");

class Api {
    constructor({ host, apiKey }) {
        this.axios = axios.create({
            baseURL: host,
            headers: {
                "x-api-key": apiKey,
            },
        });
    }

    /**
     *
     * @param {string} nameOrId
     */
    async getSchema(nameOrId) {
        const { data } = await this.axios.get(`/schemas/${nameOrId}`);
        return data.data;
    }

    /**
     *
     * @param {string} schemaName
     * @param {object} attrs
     * @returns
     */
    async searchEntity(schemaName, attrs) {
        if (typeof attrs !== "object") {
            throw new Error("Attributes must be an object");
        }

        const body = {
            schema: schemaName,
            query: attrs,
        };

        const { data } = await this.axios.post("/entities/_search", body);
        return data.data;
    }

    /**
     * Create new entity with a given schema
     * @param {string} schemaName
     * @param {obj} payload
     * @returns
     */
    async createEntity(schemaName, payload) {
        if (typeof payload !== "object") {
            throw new Error("Attributes must be an object");
        }

        const body = {
            schema: schemaName,
            data: payload,
        };

        const { data } = await this.axios.post("/entities", body);
        return data.data;
    }

    /**
     * Update an entity with a given schema
     * @param {string} schemaName
     * @param {string} entityId
     * @param {obj} payload
     * @returns
     */
    async updateEntity(schemaName, entityId, payload) {
        if (typeof payload !== "object") {
            throw new Error("Attributes must be an object");
        }

        const body = {
            schema: schemaName,
            data: payload,
        };

        const { data } = await this.axios.patch(`/entities/${entityId}`, body);
        return data.data;
    }

    /**
     * Ask for user data attestation
     * @param {string} schemaName
     * @param {string} entityId
     * @param {string} [attestationPolicyName=null]
     */
    async raiseClaim(schemaName, entityId, attestationPolicyName = null) {
        const body = {
            schema: schemaName,
            entityId,
        };

        if (attestationPolicyName) {
            body.attestationName = attestationPolicyName;
        }

        const { data } = await this.axios.post("/claims", body);
        return data.data;
    }

    /**
     * Attest a request made for a given entity
     * @param {string} schemaName
     * @param {string} claimId
     */
    async attestClaim(schemaName, claimId) {
        const body = {
            schema: schemaName,
            action: "GRANT",
        };

        const { data } = await this.axios.post(`/claims/${claimId}/attest`, body);
        return data.data;
    }

    /**
     * Get the certificate after claim granted on a request
     * @param {string} schemaName
     * @param {string} entityId
     * @param {null} [templateUrl=null] a template to use if provided
     * @param {{}} [qrCodeOptions={}] data to use in order to customize the qrCode
     * @return the qrCode, the full data and the document in a (html) string format
     */
    async getCertificate(schemaName, entityId, templateUrl = null, qrCodeOptions = {}) {
        const body = {
            schema: schemaName,
            entityId,
            options: {
                templateUrl,
                ...qrCodeOptions,
            },
        };

        const { data } = await this.axios.post("/attestations/_certificate", body);
        return data.data;
    }

    /**
     * Get the certificate after claim granted on a request
     * @param {string} schemaName
     * @param {string} attestationId
     * @param {null} [templateUrl=null] a template to use if provided
     * @param {{}} [qrCodeOptions={}] data to use in order to customize the qrCode
     * @return the qrCode, the full data and the document in a (html) string format
     */
    async getCertificateByAttestation(
        schemaName,
        attestationId,
        templateUrl = null,
        qrCodeOptions = {},
    ) {
        const body = {
            schema: schemaName,
            options: {
                templateUrl,
                ...qrCodeOptions,
            },
        };

        const { data } = await this.axios.post(`/attestations/${attestationId}/_certificate`, body);
        return data.data;
    }
}

module.exports.Api = Api;

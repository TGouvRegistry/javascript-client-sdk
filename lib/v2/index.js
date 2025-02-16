const { AxiosError } = require("axios");
const { getUniqAttributePayloadFromArray } = require("../../utils/utils");
const { Api } = require("./api");

class GouvRegistryCertificateExecutor {
    constructor(config) {
        this.dataSchema = config.dataSchema;
        this.attestationPolicyName = config.attestationPolicyName;
        this.uniqueAttributes = config.uniqueAttributes;
        this.payload = (typeof config.payload === "string") ? JSON.parse(config.payload) : config.payload;
        this.templateUrl = config.templateUrl;
        this.qrCodeOnly = config.qrCodeOnly;
        this.qrCodeWidth = config.qrCode?.width;
        this.qrCodeHeight = config.qrCode?.height;
        this.format = config.format;

        this.api = new Api({
            host: config.registryHost,
            apiKey: config.apiKey,
        });
    }

    async execute() {
        try {
            // Check schema existence
            await this.api.getSchema(this.dataSchema);

            // Check data existence; if so, we do an update
            let entitySearchResult = null;

            if (this.uniqueAttributes.length > 0) {
                const uniqAttributePayload = getUniqAttributePayloadFromArray(
                    this.payload,
                    this.uniqueAttributes,
                );
                if (!uniqAttributePayload) {
                    throw new Error("Invalid unique attributes array");
                }

                entitySearchResult = await
                this.api.searchEntity(this.dataSchema, uniqAttributePayload);
            }

            let dataEntityId = null;

            if (!entitySearchResult || (entitySearchResult && entitySearchResult.size === 0)) {
                const entity = await this.api.createEntity(this.dataSchema, this.payload);
                // eslint-disable-next-line no-underscore-dangle
                dataEntityId = entity._id;
            } else {
                // eslint-disable-next-line no-underscore-dangle
                dataEntityId = entitySearchResult.items[0]._id;
                await this.api.updateEntity(this.dataSchema, dataEntityId, this.payload);
            }

            // Raise a claim for the new data and attest
            const claim = await this.api.raiseClaim(
                this.dataSchema,
                dataEntityId,
                this.attestationPolicyName,
            );
            // eslint-disable-next-line no-underscore-dangle
            await this.api.attestClaim(this.dataSchema, claim._id);

            // Get the certificate
            const certificateOptions = { qrCode: {} };
            if (this.qrCodeWidth) {
                certificateOptions.qrCode.width = parseInt(this.qrCodeWidth, 10);
                certificateOptions.qrCode.size = certificateOptions.qrCode.width;
            }
            if (this.qrCodeHeight) {
                certificateOptions.qrCode.height = parseInt(this.qrCodeHeight, 10);
            }

            const certificate = await this.api.getCertificate(
                this.dataSchema,
                dataEntityId,
                this.templateUrl,
                certificateOptions,
            );

            return certificate;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data);
            } else {
                console.error(error);
            }
            return null;
        }
    }
}

module.exports.GouvRegistryCertificateExecutor = GouvRegistryCertificateExecutor;

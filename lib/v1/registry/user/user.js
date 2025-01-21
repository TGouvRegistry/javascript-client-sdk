const { default: axios } = require("axios");
const fs = require("fs");
const path = require("path");
const { BaseUser } = require("./baseUser");
const { extractQrCodeSrc } = require("../../../../utils/utils");

class User extends BaseUser {
    constructor({
        username,
        password,
        dataSchemaId,
        dataSchemaName,
        attestationName,

        registryHost,
    }) {
        super({ username, password });
        this.dataSchemaId = dataSchemaId;
        this.dataSchemaName = dataSchemaName;
        this.attestationName = attestationName;

        this.registryHost = registryHost;
    }

    /**
     *
     */
    async login() {
        return super.login();
    }

    /**
     *@param {*} payload
     */
    async inviteData(payload) {
        return this.inviteDataBySchema(this.dataSchemaId, payload);
    }

    /**
     *@param {string} entryId
    * @param {Object} payload
    */
    async updateData(entryId, payload) {
        return this.updateSchemaData(this.dataSchemaId, entryId, payload);
    }

    /**
     *@param {string} entryId
     */
    async claim(entryId) {
        const url = `${this.registryHost}/api/v1/claims`;

        const options = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };

        const data = {
            schemaName: this.dataSchemaName,
            schemaEntryId: entryId,
            attestationName: this.attestationName,
        };

        const response = await axios.post(url, data, options);

        return response.data?.data?.id;
    }

    /**
     *@param {string} claimId
     *@param {string} template
     *@param {string} isQrCodeOnly
     *@param {Object} [qrCodeOptions={}]
     @param {{}} [options={}]
     */
    async getCertificate(claimId, template, isQrCodeOnly, qrCodeOptions = {}, options = {}) {
        const url = `${this.registryHost}/api/v1/certificates/attestation/${claimId}`;

        const reqOptions = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };

        const data = {
            schemaName: this.dataSchemaName,
            pdf: isQrCodeOnly === false,
            templateUrl: template,
            qrCodeOptions,
        };

        if (!isQrCodeOnly) {
            reqOptions.responseType = "arraybuffer";
        }

        const response = await axios.post(url, data, reqOptions);

        if (isQrCodeOnly) {
            if (typeof response.data.data !== "string") {
                throw Error("RESPONSE OF ONLYQRCODE'S REQUEST IS NOT A STRING");
            }

            const base64String = extractQrCodeSrc(response.data.data)?.replaceAll("data:image/png;base64,", "")?.replace(/&#x3D;/g, "=");

            if ([null, undefined, "", "null", "undefined"].includes(base64String)) {
                throw Error("NO IMG TAG WITH alt=\"qr_code\" FOUND IN RESPONSE OF ONLYQRCODE'S REQUEST");
            }

            return base64String;
        }

        if (options.filePath) {
            // TODO: check file ends with .pdf
            const { filePath } = options;

            // TODO: Review this

            const dirname = path.dirname(filePath);
            let fileAlreadyExists = true;

            try {
                await fs.promises.readFile(filePath);
            } catch (error) {
                fileAlreadyExists = false;
            }

            if (fileAlreadyExists) {
                fs.unlinkSync(filePath);
            }

            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true });
            }

            fs.writeFileSync(filePath, response.data);
        }

        return response.data;
    }
}

module.exports.User = User;

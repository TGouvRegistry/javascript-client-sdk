const { getUniqAttributePayload } = require("../../../utils/utils");
const { User } = require("./user/user");
const { Admin } = require("./user/adminUser");
const { Attestor } = require("./user/attestorUser");

class GouvRegistryCertificateExecutor {
    constructor(config) {
        this.userSchemaId = config.userSchemaId;
        this.attestationPolicyName = config.attestationPolicyName;
        this.singleAttribute = config.singleAttribute;
        this.userSchemaName = config.userSchemaName;
        this.dataSchemaName = config.dataSchemaName;
        this.dataSchemaId = config.dataSchemaId;
        this.userEmail = config.userEmail;
        this.payload = (typeof config.payload === "string") ? JSON.parse(config.payload) : config.payload;
        this.attestatorUsername = config.attestatorUsername;
        this.templateUrl = config.templateUrl;
        this.qrCodeOnly = config.qrCodeOnly;
        this.width = config.width;
        this.height = config.height;
        this.format = config.format;
        this.certificateFileOptions = config.certificateFileOptions;

        this.registryHost = config.registryHost;
        this.credentials = config.credentials;
    }

    async execute() {
        const admin = new Admin({
            username: this.credentials.admin.username,
            password: this.credentials.admin.password,
            dataSchemaId: this.dataSchemaId,
            userSchemaId: this.userSchemaId,

            registryHost: this.registryHost,
        });

        await admin.login();

        // Schema existence check
        if ((await admin.checkUserSchemaExistence()) === false) {
            throw Error("USER SCHEMA DOES NOT EXIST");
        }

        if ((await admin.checkDataSchemaExistence()) === false) {
            throw Error("DATA SCHEMA DOES NOT EXIST");
        }

        // Handler user
        let userId = await admin.checkUserExistence(this.userEmail);

        if (userId == null) {
            // Create user
            userId = await admin.inviteUser({
                email: this.userEmail,
                nom: "n/a",
                prenom: "n/a",
                telephone: "n/a",
                cat: "n/a",
                exp: "n/a",
                rat: "n/a",
            });
        }

        const user = new User({
            username: this.userEmail,
            password: this.credentials.user.password,
            dataSchemaId: this.dataSchemaId,
            dataSchemaName: this.dataSchemaName,
            attestationName: this.attestationPolicyName,

            registryHost: this.registryHost,
        });

        await user.login();

        const uniqAttributePayload = getUniqAttributePayload(
            this.payload,
            this.singleAttribute,
        );

        // Handler user data
        let userDataId = await admin
            .searchSingleSchemaData(uniqAttributePayload ?? this.payload, this.dataSchemaId);

        if (userDataId == null) {
            userDataId = await user.inviteData(this.payload);
        } else {
            await user.updateData(userDataId, this.payload);
        }

        const userDataClaimId = await user.claim(userDataId);

        // Handler attestor
        const attestor = new Attestor({
            username: this.attestatorUsername,
            password: this.credentials.attestator.password,
            dataSchemaName: this.dataSchemaName,

            registryHost: this.registryHost,
        });

        await attestor.login();

        const attestationId = await attestor.attestClaim(userDataClaimId);

        const certf = await user.getCertificate(
            attestationId,
            this.templateUrl,
            this.qrCodeOnly,
            {},
            this.certificateFileOptions,
        );

        return certf;
    }
}

module.exports.GouvRegistryCertificateExecutor = GouvRegistryCertificateExecutor;

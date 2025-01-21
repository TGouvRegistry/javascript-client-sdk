const { v2: GouvREgistryV2 } = require("../../lib/sdk");

const executor = new GouvREgistryV2({
    apiKey: "70bbaa82f909466391c0c35c5b4bc88c572269aa0d06c1f36f0413536d9c537a1b096d0edfdaa47299daf824947139253aef907b85522a622aa46931c63ace1bc99927aac7e393fd90a1cbf6f650e1b2ce4c9bb6dfd991af59a5993bc892548e9e9259710e9e7ab619b7200cdb28039bda73123392ad9042e7cc843c5ef468ac",
    uniqueAttributes: ["lastname"],
    dataSchema: "ATDPersonnelATDSchemaV1",
    payload: {
        lastname: "TEST_POSTMAN_2",
        cat: "null",
        exp: "null",
        rat: "null",
    },
    templateUrl: null,
    qrCodeOnly: false,
    width: 400,
    height: 400,
    format: "pdf",

    registryHost: "http://127.0.0.1:3002/api/v1",
});

executor.execute().then((certificate) => {
    console.log(certificate);
}).catch();

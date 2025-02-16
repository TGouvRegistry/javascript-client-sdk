const { v2: GouvREgistryV2 } = require("../../lib/sdk");

const executor = new GouvREgistryV2(
    {
        payload: {
            nom: "SAMU 2", dateAttestation: "5 février 2023", siege: "Togo Lomé", adresse: "Lomé", numeroAttestation: "987654356", email: "juliokavege@gmail.com", dateSignature: "11 février 2025", ministre: "Johnson manuela", fonctionSignataire: "Ministre", cat: "2025-02-11T12:00:00+00:00", exp: "11 février 2027FORMAT", rat: "na",
        },
        apiKey: "4117bd840f601bb81a6e9244fe2761e9783442d3441453d73a9d74fd238f1434b4ea58b6fab51928b686b23c5d58ef6c440d7bca54635f77e34ba3ac5e60ced1f1ef741ae8cb22abfeae876a0fa382da6c04f23ecc5acda0fd22c9035ba25d5bf8bccb6015a04875624d76fb1ae1d4a72cbef50789a342ec3b97c8b6ba0f6aaf9b19c90b73e85f521addf78caa2e3744597bd21ec14e7ae4ba7c935ace361997",
        uniqueAttributes: ["numeroAttestation"],
        dataSchema: "ATDSANDBOXGOUVTGAccordPrgrammeSchemaV1",
        format: "html",
        templateUrl: "https://raw.githubusercontent.com/Agence-Togo-Digital/VerifiableCredential/refs/heads/main/certificate-templates/qr-code.html",
        registryHost: "https://api.vcs.gouv.tg/api/v1",
        qrCodeOnly: true,
        qrCode: {
            width: "15",
            height: "15",
        }
    },
);

executor.execute().then((certificate) => {
    console.log(certificate);
}).catch();

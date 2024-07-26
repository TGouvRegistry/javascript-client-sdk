const { GouvRegistryCertificateExecutor } = require("../../index");

const executor = new GouvRegistryCertificateExecutor({
    userSchemaId: "66a3ca96863d6e605ab6da01",
    attestationPolicyName: "SchemaV0Attestation",
    singleAttribute: "demandeNumero",
    userSchemaName: "UserSchema",
    dataSchemaName: "SchemaV0",
    dataSchemaId: "66a3c83af1ebf93d5a0ac090",
    userEmail: "test@email.com",
    payload: {
        demandeNumero: "ABF",
        nom: "Xp",
        prenoms: "Gro",
        cat: "null",
        exp: "null",
        rat: "null",
    },
    attestatorUsername: "voyau@attestor.com",
    templateUrl: "https://localhost/template.html",
    qrCodeOnly: false,
    width: 400,
    height: 400,
    format: "pdf",
    certificateFileOptions: {
        filePath: "/home/xampy/Project/TgouvRegistry/gouv-registry/private/pdf/certificate.pdf",
    },

    registryHost: "http://127.0.0.1:8000",
    credentials: {
        admin: {
            username: "dev@admin.com",
            password: "1234",
        },
        user: {
            username: null,
            password: "1234",
        },
        attestator: {
            username: "voyau@attestor.gouv.tg",
            password: "1234",
        },
    },
});

const qrCode = executor.execute();
console.log(qrCode);

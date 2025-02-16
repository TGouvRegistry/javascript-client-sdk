# TGouv Registry Javascript sdk

## How to install

```bash
npm install @digitaltg/tgouv-registry-sdk
```

## How to use

V2 version

```javascript
const { v2: GouvRegistryCertificateExecutorV2 } = require("@digitaltg/tgouv-registry-sdk");

const executor = new GouvRegistryCertificateExecutorV2({
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
    qrCode: {
        width: "15",
        height: "15", 
    }
    format: "pdf",

    registryHost: "http://127.0.0.1:3002/api/v1",
});

executor.execute().then((certificate) => {
    console.log(certificate);
}).catch();

```
The height is not actually used by the system.

Old Version

```javascript
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

```

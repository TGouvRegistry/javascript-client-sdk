const { getUniqAttributePayload, extractQrCodeSrc } = require("../lib/utils/utils");

const payload = {
    name: "name", sexe: "sexe", notUniqueAttribute: "notUniqueAttribute",
};

const htmlString = "<img src=\"htmlStringQrCode\" alt=\"qr_code\" />";

describe("[TGOUV REGISTRY] utils", () => {
    test("Should extract unique attributes", () => {
        const uniqAttributes = "name,  sexe";

        const attrs = getUniqAttributePayload(payload, uniqAttributes);
        expect(typeof attrs).toBe("object");
        expect(Object.keys(attrs).length).toBe(2);
        expect(attrs["data.name"]).toBe("name");
        expect(attrs["data.sexe"]).toBe("sexe");
        expect(attrs["data.notUniqueAttribute"]).toBe(undefined);
    });

    test("Should extract src value from img tag", () => {
        const result = extractQrCodeSrc(htmlString);
        expect(result).toBe("htmlStringQrCode");
    });
});

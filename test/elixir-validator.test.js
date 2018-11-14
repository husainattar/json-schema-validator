const fs = require("fs");
const ElixirValidator = require('../src/elixir-validator');

test("Empty Schema (empty object)", () => {
    const ingestValidator = new ElixirValidator();
    return ingestValidator.validate({}, {}).then( (data) => {
        expect(data).toBeDefined();
        expect(data.validationState).toBe("VALID");
    });
});

test("Attributes Schema", () => {
    let inputSchema = fs.readFileSync("examples/schemas/attributes-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/attributes.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator();

    return elixirValidator.validate(jsonSchema, jsonObj).then((data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(1);
        expect(data.validationErrors[0].userFriendlyMessage).toContain('should match format "uri"');
    });
});


test("BioSamples Schema - FAANG \'organism\' sample", () => {
    let inputSchema = fs.readFileSync("examples/schemas/biosamples-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/faang-organism-sample.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator();

    return elixirValidator.validate(jsonSchema, jsonObj).then((data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(0);
    });
});

test("Study Schema", () => {
    let inputSchema = fs.readFileSync("examples/schemas/submittables/study-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/study.json");
    let jsonObj = JSON.parse(inputObj);
    const elixirValidator = new ElixirValidator();

    return elixirValidator.validate(jsonSchema, jsonObj).then((data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(2);
    });
});
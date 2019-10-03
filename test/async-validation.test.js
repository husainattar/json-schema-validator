const fs = require("fs");
const ElixirValidator = require('../src/elixir-validator');
const IsChildTerm = require('../src/keywords/ischildtermof');

test(" -> isChildTermOf Schema", () => {
    let inputSchema = fs.readFileSync("examples/schemas/isChildTerm-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/isChildTerm.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator([IsChildTerm]);

    return elixirValidator.validate(jsonSchema, jsonObj).then( (data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(1);
        expect(data.validationErrors[0].absoluteDataPath).toBe(".attributes['age'][0].terms[0].url");
    });
});

test("FAANG Schema - FAANG \'organism\' sample", () => {
    let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/faang-organism-sample.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator([IsChildTerm]);

    return elixirValidator.validate(jsonSchema, jsonObj).then( (data) => {

        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(0);
    });
});

test("FAANG Schema - \'specimen\' sample", () => {
    let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/faang-specimen-sample.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator([IsChildTerm]);

    return elixirValidator.validate(jsonSchema, jsonObj).then( (data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(0);
    });
});

test("FAANG Schema - \'pool of specimens\' sample", () => {
    let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/faang-poolOfSpecimens-sample.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator([IsChildTerm]);

    return elixirValidator.validate(jsonSchema, jsonObj).then( (data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(0);
    });
});

test("FAANG Schema - \'cell specimen\' sample", () => {
    let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/faang-cellSpecimen-sample.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator([IsChildTerm]);

    return elixirValidator.validate(jsonSchema, jsonObj).then( (data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(0);
    });
});

test("FAANG Schema - \'cell culture\' sample", () => {
    let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/faang-cellCulture-sample.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator([IsChildTerm]);

    return elixirValidator.validate(jsonSchema, jsonObj).then( (data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(0);
    });
});

test("FAANG Schema - \'cell line\' sample", () => {
    let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/faang-cellLine-sample.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator([IsChildTerm]);

    return elixirValidator.validate(jsonSchema, jsonObj).then( (data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(0);
    });
});

test("Test HCA data", () => {
    let inputSchema = fs.readFileSync("examples/schemas/analysis_process.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/test_pass_new_analysis_process.json");
    let jsonObj = JSON.parse(inputObj);

    const elixirValidator = new ElixirValidator([IsChildTerm], {baseSchemaPath: '/Users/jupp/dev/hca/metadata-schema/json_schema'});

    return elixirValidator.validate(jsonSchema, jsonObj).then( (data) => {
        expect(data).toBeDefined();
        expect(data.validationErrors.length).toBe(4);
    });
});
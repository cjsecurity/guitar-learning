import assert from "node:assert/strict";
import { register } from "node:module";

register("./ts-extension-loader.mjs", import.meta.url);

const {
  NATURAL_NOTES,
  buildNaturalIntervalOptions,
  getNaturalIntervalDefinition,
  getNaturalIntervalQuestionPool,
} = await import("../src/utils/naturalIntervalRecognition.ts");

const expectedPairs = {
  "C-D": "大二度",
  "D-E": "大二度",
  "E-F": "小二度",
  "F-G": "大二度",
  "G-A": "大二度",
  "A-B": "大二度",
  "B-C": "小二度",
  "C-E": "大三度",
  "D-F": "小三度",
  "E-G": "小三度",
  "F-A": "大三度",
  "G-B": "大三度",
  "A-C": "小三度",
  "B-D": "小三度",
  "C-F": "纯四度",
  "D-G": "纯四度",
  "E-A": "纯四度",
  "F-B": "增四度",
  "G-C": "纯四度",
  "A-D": "纯四度",
  "B-E": "纯四度",
  "C-G": "纯五度",
  "D-A": "纯五度",
  "E-B": "纯五度",
  "F-C": "纯五度",
  "G-D": "纯五度",
  "A-E": "纯五度",
  "B-F": "减五度",
  "C-A": "大六度",
  "D-B": "大六度",
  "E-C": "小六度",
  "F-D": "大六度",
  "G-E": "大六度",
  "A-F": "小六度",
  "B-G": "小六度",
  "C-B": "大七度",
  "D-C": "小七度",
  "E-D": "小七度",
  "F-E": "大七度",
  "G-F": "小七度",
  "A-G": "小七度",
  "B-A": "小七度",
};

for (const [id, answer] of Object.entries(expectedPairs)) {
  const definition = getNaturalIntervalDefinition(id);
  assert.equal(definition.answer, answer, `${id} should be ${answer}`);
  assert.match(definition.root, /^[CDEFGAB]$/u, `${id} root must be a natural note`);
  assert.match(definition.target, /^[CDEFGAB]$/u, `${id} target must be a natural note`);
  assert.ok(NATURAL_NOTES.includes(definition.root), `${id} root should be in natural notes`);
  assert.ok(NATURAL_NOTES.includes(definition.target), `${id} target should be in natural notes`);
}

for (const levelId of ["level1", "level2", "level3", "level4", "level5"]) {
  const pool = getNaturalIntervalQuestionPool(levelId);
  assert.ok(pool.length > 0, `${levelId} should have questions`);

  for (const question of pool) {
    const options = buildNaturalIntervalOptions(question);
    assert.equal(options.length, 4, `${question.id} should have four options`);
    assert.ok(options.includes(question.answer), `${question.id} options should include correct answer`);
    assert.equal(new Set(options).size, 4, `${question.id} options should be unique`);
    assert.doesNotMatch(question.id, /[#♯b♭]/u, `${question.id} should not include accidentals`);
  }
}

assert.equal(getNaturalIntervalDefinition("B-F").answer, "减五度");
assert.equal(getNaturalIntervalDefinition("F-B").answer, "增四度");
assert.equal(getNaturalIntervalDefinition("A-C").answer, "小三度");
assert.equal(getNaturalIntervalDefinition("D-B").answer, "大六度");
assert.equal(getNaturalIntervalDefinition("C-E").answer, "大三度");
assert.equal(getNaturalIntervalDefinition("C-A").answer, "大六度");
assert.equal(getNaturalIntervalDefinition("C-B").answer, "大七度");

console.log(`Natural interval recognition checks passed: ${Object.keys(expectedPairs).length} fixed pairs.`);

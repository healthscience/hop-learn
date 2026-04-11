/**
 * BentoBoxDS pattern Registry
 * The library of logical 'Molds' for the InterplayLoom.
 */
const patternRegistry = {
  // 1. Biological Balance / Thresholds
  HomeoRange: {
    name: "HomeoRange",
    description: "Monitors biological stability via Ceiling and Floor thresholds.",
    operators: ["GREATER THAN", "LESS THAN"],
    slots: [
      { label: "Target", archetype: "context", required: true }, // e.g. @glucose
      { label: "Floor", archetype: "quantity", required: true },  // e.g. 70mg/dL
      { label: "Ceiling", archetype: "quantity", required: true } // e.g. 140mg/dL
    ]
  },

  // 2. Pros/Cons Weighted Logic
  DecisionDoughnut: {
    name: "DecisionDoughnut",
    description: "Evaluates interventions by weighing conflicting logic.",
    operators: ["AND", "OR", "NOT"],
    slots: [
      { label: "Observation", archetype: "context", required: true },
      { label: "Impact", archetype: "logic", required: true },      // e.g. NOT effective
      { label: "Variable", archetype: "quantity", required: false }
    ]
  },

  // 3. Cross-Module Emulation
  CueCube: {
    name: "CueCube",
    description: "Maps the flow of data between different peer modules.",
    operators: ["NEXT", "CONNECT"],
    slots: [
      { label: "Source", archetype: "context", required: true }, // From @Device
      { label: "Action", archetype: "ordinal", required: true }, // NEXT
      { label: "Target", archetype: "context", required: true }  // To @resonAgent
    ]
  },

  // 4. Contextual Segmentation
  BioCohort: {
    name: "BioCohort",
    description: "Segments peer data based on environment or state.",
    operators: ["BELONGS TO", "IF"],
    slots: [
      { label: "Entity", archetype: "context", required: true }, // @peer
      { label: "Condition", archetype: "logic", required: true }, // IF @at-pool
      { label: "Category", archetype: "context", required: true } // @training-mode
    ]
  }
};

export default patternRegistry;
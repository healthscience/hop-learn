/**
 * InterplayLoom: The Universal Relational Engine
 * Bridges the gap between a Peer's Story and BentoBoxDS patterns.
 * No LLM. Pure Logic. Lightning Fast.
 */
class InterplayLoom {
  constructor() {
    // Universal Archetypes: Patterns that appear in any peer story
    this.archetypes = {
      quantity: /(\d+(?:\.\d+)?)\s*([a-zA-Z%µg/]+)?/gi, // Updated to make units optional for things like '400IM' or '65'
      chronos: /(\d{1,2}:\d{2})|(\d+\s*(sec|min|hr|ms|seconds|minutes))/gi,
      temporal: /\b(age|aged|years|at|cycle)\s*(\d+)\b/gi, // NEW: Catches "aged 65"
      context: /(@[\w-]+)/gi,
      logic: /\b(if|then|when|not|equals|greater|less)\b/gi,
      intent: /\b(swim|run|longevity|health|stability|balance)\b/gi // NEW: Semantic anchors from Library
    };

    this.activepattern = null;
    this.contextualBuffer = [];
  }

  // Set the active Bentopattern for the current weave
  setpattern(pattern) {
    this.activepattern = pattern;
  }

  // The Reflex: Instant identification of data shapes
  regPass(story) {
    const findings = [];
    let consumedMap = new Array(story.length).fill(false);

    for (const [type, regex] of Object.entries(this.archetypes)) {
      let match;
      while ((match = regex.exec(story)) !== null) {
        findings.push({ type, value: match[0], index: match.index });
        // Mark these characters as "seen"
        for (let i = 0; i < match[0].length; i++) {
          consumedMap[match.index + i] = true;
        }
      }
    }

    // Extract "Unmapped Fragments" (Words not caught by any regex)
    const unmapped = story
      .split(/\s+/)
      .filter(word => !findings.some(f => f.value.includes(word)) && word.length > 3);

    return { findings, unmapped };
  }

  // The Weave: Mapping Story fragments to pattern slots
  weave(story) {
    const { findings, unmapped } = this.regPass(story);
    
    const mappedSlots = this.activepattern.slots.map(slot => {
      let match = null;

      // 1. Try to find by archetype requirement
      if (slot.archetype) {
        match = findings.find(f => f.type === slot.archetype);
      }

      // 2. FALLBACK: If slot is 'Target' and empty, pluck from 'Intent' or 'Unmapped'
      if (!match && slot.label === "Target") {
        const candidate = findings.find(f => f.type === 'intent') || { value: unmapped[0] };
        match = candidate;
      }

      return {
        ...slot,
        value: match ? match.value : null,
        stable: !!match
      };
    });

    return {
      patternName: this.activepattern.name,
      weave: mappedSlots,
      candidates: unmapped, // The "Bubbles" for the Lens
      stabilityScore: mappedSlots.filter(s => s.stable).length / mappedSlots.length
    };
  }

  // The Dissonance Tracker: Identifies what BeeBee needs to ask
  detectFriction(weaveResult) {
    return weaveResult.weave.filter(slot => !slot.stable);
  }

  // BeeBee's Voice: Structural, non-agreeable feedback
  getBeeBeeResponse(weaveResult) {
    const friction = this.detectFriction(weaveResult);
    
    if (friction.length === 0) {
      return `The weave for ${weaveResult.patternName} is stable. Emulation ready.`;
    }

    const missing = friction.map(f => f.label).join(", ");
    return `The story is flowing, but I'm missing the structure for: ${missing}. How do these fit?`;
  }
}

export default InterplayLoom;
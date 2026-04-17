/**
 * InterplayLoom: The Universal Relational Engine
 * Bridges the gap between a Peer's Story and BentoBoxDS patterns.
 * No LLM. Pure Logic. Lightning Fast.
 */
class InterplayLoom {
  constructor() {
    // Universal Archetypes: Patterns that appear in any peer story
  this.archetypes = {
    // H - HELI: Captured as Trigger + Number OR Number + Heli-Unit
    heli: /\b(age|aged|at|orbit|arc|cycle|day)s?\s*(\d+(?:\.\d+)?)\b|\b(\d+(?:\.\d+)?)\s*(orbit|arc|cycle|day)s?\b/gi,

    // C - CAPACITY: Captured as Number + Short Unit (Physics/Biology)
    // Matches "400IM", "80bpm", "10km", "50m"
    capacity: /\b(\d+(?:\.\d+)?)\s*([a-z]{1,5}|IM|bpm)\b/gi,

    // C - HEART: Captured as Intent Trigger + Substantive
    // Matches "for longevity", "target health", "maintain flow"
    heart: /\b(target|goal|intent|for|maintain|aim|of)\s+([a-z]{3,})\b/gi,

    // C - CONTEXT: Captured as Action Trigger + Activity OR @Tag
    // Matches "to swim", "will practice", "@pool"
    context: /\b(to|will|start|practice|do|at|with)\s+([a-z]{3,})\b|(@[\w-]+)/gi,

    // C - COHERENCE: Logical connectors (The "Rules")
    logic: /\b(if|then|when|not|so|because|stable|sync|balance)\b/gi,

    // QUANTITY: The Safety Net (Run this last)
    quantity: /(\d+(?:\.\d+)?)/g
  };

    this.activepattern = null;
    this.contextualBuffer = [];
  }

  // Set the active Bentopattern for the current weave
  setpattern(pattern) {
    this.activepattern = pattern;
  }

  // The Reflex: Instant identification of data shapes
  texturize(story) {
    // 1. TOKENIZE & CLEAN (The Workflow Step)
    const fragments = story.split(/\s+/).map(token => ({
      original: token,
      // Remove trailing punctuation only for the regex test
      matchable: token.replace(/[.,!?;:]+$/, "").toLowerCase(),
      claimed: false,
      pillar: null
    }));

    // 2. ORDERED EXTRACTION
    // We run Heli and Capacity first because they are the most "rigid"
    const findings = [];
    findings.push(...this.extract(fragments, 'heli', this.archetypes.heli));
    findings.push(...this.extract(fragments, 'capacity', this.archetypes.capacity));
    
    // Then Heart and Context (The Trigger-based ones)
    findings.push(...this.extract(fragments, 'heart', this.archetypes.heart));
    findings.push(...this.extract(fragments, 'context', this.archetypes.context));

    // 3. RESIDUE COLLECTION
    const residue = fragments
      .filter(f => !f.claimed)
      .map(f => f.matchable);

    return { 
      findings, 
      unmapped: residue 
    };
  }

  /**
   * Helper to extract patterns from fragments.
   */
  extract(fragments, type, regex) {
    const results = [];
    const fullText = fragments.map(f => f.matchable).join(" ");
    let match;

    // Reset regex lastIndex if global
    if (regex.global) regex.lastIndex = 0;

    while ((match = regex.exec(fullText)) !== null) {
      // Find which fragments this match belongs to
      // Simplified: just find the index in the fragments
      const matchText = match[0];
      const matchIndex = match.index;

      // Mark fragments as claimed
      let currentPos = 0;
      fragments.forEach((f, i) => {
        const start = currentPos;
        const end = start + f.matchable.length;
        
        if (matchIndex >= start && matchIndex < end) {
          f.claimed = true;
          f.pillar = type;
        }
        currentPos = end + 1; // +1 for the space
      });

      results.push({
        type,
        value: matchText,
        index: matchIndex
      });
    }
    return results;
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
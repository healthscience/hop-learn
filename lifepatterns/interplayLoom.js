/**
 * InterplayLoom: The Universal Relational Engine
 * Bridges the gap between a Peer's Story and BentoBoxDS patterns.
 * No LLM. Pure Logic. Lightning Fast.
 */
class InterplayLoom {
  constructor() {
    // Universal Archetypes: Patterns that appear in any peer story
    this.archetypes = {
      quantity: /(\d+(?:\.\d+)?)\s*([a-zA-Z%µg/]+)/gi, // 500mg, 180bpm, 10km
      chronos: /(\d{1,2}:\d{2})|(\d+\s*(sec|min|hr|ms|seconds|minutes))/gi, // 1:15, 60sec
      ordinal: /\b(first|then|after|finally|next|followed by)\b/gi, // Sequence cues
      context: /(@[\w-]+)/gi, // @pool, @home, @bob
      logic: /\b(if|then|when|not|equals|greater|less)\b/gi // Decision cues
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
    for (const [type, regex] of Object.entries(this.archetypes)) {
      let match;
      while ((match = regex.exec(story)) !== null) {
        findings.push({
          type,
          value: match[0],
          raw: match[1] || match[0],
          index: match.index
        });
      }
    }
    return findings;
  }

  // The Weave: Mapping Story fragments to pattern slots
  weave(story) {
    if (!this.activepattern) throw new Error("No Bentopattern selected.");

    const fragments = this.regPass(story);
    const mappedSlots = this.activepattern.slots.map(slot => {
      // Logic: Does a fragment 'belong' in this slot?
      // Matches based on Label similarity or Archetype requirements
      const match = fragments.find(f => 
        story.toLowerCase().includes(slot.label.toLowerCase()) && 
        (slot.archetype ? f.type === slot.archetype : true)
      );

      return {
        ...slot,
        value: match ? match.value : null,
        stable: match !== undefined && match !== null
      };
    });

    return {
      patternName: this.activepattern.name,
      weave: mappedSlots,
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
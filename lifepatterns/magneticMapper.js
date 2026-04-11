/**
 * magneticMapper.js
 * The 'Brain' of the Interplay. 
 * Orchestrates the snap-to-grid logic between Story fragments and pattern slots.
 */
import InterplayLoom from './InterplayLoom.js';
import patternRegistry from './patternRegistry.js';

class MagneticMapper {
  constructor() {
    this.loom = new InterplayLoom();
    this.threshold = 0.7; // Minimum resonance to suggest a 'Snap'
  }

  /**
   * Performs the "Consilience Weave"
   * Maps findings from the Story to the active pattern's slots.
   */
  mapStoryTopattern(story, patternName) {
    const pattern = patternRegistry[patternName];
    if (!pattern) throw new Error(`pattern ${patternName} not found in Registry.`);
    
    this.loom.setpattern(pattern);
    const fragments = this.loom.regPass(story);
    
    const weave = pattern.slots.map(slot => {
      return this._findBestFit(slot, fragments, story);
    });

    return {
      pattern: patternName,
      slots: weave,
      isStable: weave.every(s => s.value !== null),
      unmappedFragments: this._getUnmapped(fragments, weave)
    };
  }

  /**
   * Internal logic to find the 'Magnetic Pull' for a specific slot.
   */
  _findBestFit(slot, fragments, story) {
    // 1. Filter fragments by Archetype (e.g., only Quantity for 'Ceiling')
    const candidates = fragments.filter(f => f.type === slot.archetype);

    // 2. Look for Proximity or Keyword Matching
    // If the slot label (e.g., 'Ceiling') is near a fragment in the story
    let bestMatch = null;
    let highestScore = 0;

    candidates.forEach(fragment => {
      const score = this._calculateResonance(slot.label, fragment, story);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = fragment;
      }
    });

    return {
      label: slot.label,
      value: bestMatch ? bestMatch.value : null,
      resonance: highestScore,
      confirmed: highestScore > this.threshold
    };
  }

  /**
   * Calculates how 'Magnetic' a fragment is to a slot.
   * Based on textual proximity and label matching.
   */
  _calculateResonance(label, fragment, story) {
    const lowerStory = story.toLowerCase();
    const lowerLabel = label.toLowerCase();
    
    // Exact match of label near the fragment index
    const contextWindow = lowerStory.substring(
      Math.max(0, fragment.index - 20), 
      Math.min(lowerStory.length, fragment.index + 20)
    );

    if (contextWindow.includes(lowerLabel)) return 1.0;
    
    // Fuzzy match if the label is mentioned anywhere in the story
    if (lowerStory.includes(lowerLabel)) return 0.5;

    return 0.1;
  }

  _getUnmapped(fragments, weave) {
    const mappedValues = weave.map(w => w.value);
    return fragments.filter(f => !mappedValues.includes(f.value));
  }
}

export default new MagneticMapper();
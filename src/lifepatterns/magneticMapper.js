/**
 * magneticMapper.js
 * The 'Brain' of the Interplay. 
 * Orchestrates the snap-to-grid logic between Story fragments and pattern slots.
 */
import InterplayLoom from './interplayLoom.js';

class MagneticMapper {
  constructor() {
    this.loom = new InterplayLoom();
    this.threshold = 0.7; // Minimum resonance to suggest a 'Snap'
  }

  /**
   * Performs the "Consilience Weave"
   * Maps findings from the Story to the active pattern's slots.
  */
  mapStoryToTexture(story, pattern) {
    // 1. Guard against empty pattern or missing slots
    if (!pattern || !pattern.slots) {
      console.error("[MagneticMapper] Invalid pattern provided:", pattern);
      return { error: "Invalid pattern structure", unmappedFragments: [] };
    }

    // 2. Destructure the Loom results
    const { findings, unmapped } = this.loom.texturize(story);

    // 3. Perform the map
    const alignments = pattern.slots.map(slot => {
      return this._findBestFit(slot, findings, story); 
    });

    return {
      pattern: pattern.name,
      slots: alignments,
      isStable: alignments.every(s => s.value !== null),
      unmappedFragments: unmapped 
    };
  }
  /**
   * Internal logic to find the 'Magnetic Pull' for a specific slot.
  */
  _findBestFit(slot, fragments, story) {
    // Now 'fragments' is the findings array again, so .filter() works!
    const candidates = fragments.filter(f => 
      f.type === slot.archetype || 
      story.toLowerCase().includes(slot.label.toLowerCase())
    );

    // ... rest of your logic to pick the best candidate ...
    return candidates[0] || { label: slot.label, value: null, resonance: 0 };
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
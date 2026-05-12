/**
 * Priority Detection Utility
 * Automatically assigns complaint priority based on category and keywords
 * This is the "AI/Logic Based Priority Detection" feature
 */

// ─── Priority Keyword Maps ────────────────────────────────────────────────────

const HIGH_PRIORITY_CATEGORIES = [
  'murder',
  'kidnapping',
  'assault',
  'terrorism',
  'robbery',
  'domestic_violence',
  'missing_person',
];

const MEDIUM_PRIORITY_CATEGORIES = [
  'harassment',
  'fraud',
  'cybercrime',
  'theft',
  'vandalism',
];

const LOW_PRIORITY_CATEGORIES = [
  'noise_complaint',
  'traffic_issue',
  'minor_dispute',
  'other',
];

// Additional keywords to scan in title/description for priority boost
const HIGH_PRIORITY_KEYWORDS = [
  'murder', 'killed', 'death', 'dead', 'kidnap', 'abduct', 'hostage',
  'bomb', 'explosion', 'terror', 'attack', 'assault', 'rape', 'shoot',
  'gun', 'weapon', 'knife', 'stabbed', 'robbery', 'armed', 'ransom',
  'missing child', 'child abuse', 'human trafficking', 'urgent', 'emergency',
];

const MEDIUM_PRIORITY_KEYWORDS = [
  'harassment', 'stalking', 'fraud', 'scam', 'blackmail', 'extortion',
  'hacking', 'cybercrime', 'online abuse', 'threat', 'intimidation',
  'stolen', 'theft', 'property damage', 'vandalism', 'break-in',
];

const LOW_PRIORITY_KEYWORDS = [
  'noise', 'loud', 'parking', 'traffic', 'dispute', 'argument',
  'neighbor', 'stray', 'litter', 'minor', 'small', 'petty',
];

/**
 * Determines the priority of a complaint based on category and text analysis
 * @param {string} category - The complaint category
 * @param {string} title - The complaint title
 * @param {string} description - The complaint description
 * @returns {'High' | 'Medium' | 'Low'} Priority level
 */
const detectPriority = (category, title = '', description = '') => {
  // Step 1: Category-based priority (primary signal)
  if (HIGH_PRIORITY_CATEGORIES.includes(category)) {
    return 'High';
  }

  if (MEDIUM_PRIORITY_CATEGORIES.includes(category)) {
    // Step 2: Check if text contains HIGH priority keywords for upgrade
    const combinedText = `${title} ${description}`.toLowerCase();
    const hasHighKeyword = HIGH_PRIORITY_KEYWORDS.some(keyword =>
      combinedText.includes(keyword.toLowerCase())
    );
    return hasHighKeyword ? 'High' : 'Medium';
  }

  // Step 3: For low-priority categories, check for keyword-based upgrades
  const combinedText = `${title} ${description}`.toLowerCase();

  const hasHighKeyword = HIGH_PRIORITY_KEYWORDS.some(keyword =>
    combinedText.includes(keyword.toLowerCase())
  );
  if (hasHighKeyword) return 'High';

  const hasMediumKeyword = MEDIUM_PRIORITY_KEYWORDS.some(keyword =>
    combinedText.includes(keyword.toLowerCase())
  );
  if (hasMediumKeyword) return 'Medium';

  return 'Low';
};

/**
 * Get priority badge color info for UI rendering
 * @param {string} priority
 * @returns {{label: string, color: string}}
 */
const getPriorityMeta = (priority) => {
  const meta = {
    High: { label: 'High Priority', color: '#ef4444', badge: 'red' },
    Medium: { label: 'Medium Priority', color: '#f59e0b', badge: 'yellow' },
    Low: { label: 'Low Priority', color: '#22c55e', badge: 'green' },
  };
  return meta[priority] || meta['Low'];
};

module.exports = { detectPriority, getPriorityMeta };

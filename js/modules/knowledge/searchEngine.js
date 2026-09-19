/* ========================================
   searchEngine.js - Full-text search engine
   for knowledge base with inverted index
   ======================================== */

const SearchEngine = (() => {
  // Inverted index: term → Set of item IDs
  const invertedIndex = new Map();
  // Document store: id → {title, content, text, chapter}
  const documents = new Map();
  // Chapter lookup
  const chapterMap = new Map();

  /**
   * Tokenize text into searchable terms
   * Handles both Chinese and English
   */
  function tokenize(text) {
    // Remove HTML tags
    const plain = text.replace(/<[^>]+>/g, ' ')
                      .replace(/&[a-z]+;/g, ' ')
                      .replace(/\s+/g, ' ');
    const tokens = [];
    // Chinese character bigrams + English words
    const words = plain.toLowerCase().match(/[\u4e00-\u9fff]+|[a-zA-Z_]\w*|\d+/g) || [];
    words.forEach(w => {
      tokens.push(w);
      // For Chinese, also add individual characters
      if (/[\u4e00-\u9fff]/.test(w) && w.length > 1) {
        for (let i = 0; i < w.length - 1; i++) {
          tokens.push(w.substring(i, i + 2));
        }
      }
    });
    return [...new Set(tokens)];
  }

  /**
   * Build search index from knowledge data
   */
  function buildIndex() {
    invertedIndex.clear();
    documents.clear();

    // Index all knowledge entries
    Object.entries(KNOWLEDGE).forEach(([id, entry]) => {
      const textContent = (entry.title || '') + ' ' +
                         (entry.content || '').replace(/<[^>]+>/g, ' ') + ' ' +
                         (entry.code || '');

      documents.set(id, {
        id,
        title: entry.title,
        content: entry.content,
        code: entry.code,
        complexity: entry.complexity,
        related: entry.related,
        text: textContent,
        chapter: findChapter(id),
      });

      // Build inverted index
      const tokens = tokenize(textContent);
      tokens.forEach(token => {
        if (!invertedIndex.has(token)) {
          invertedIndex.set(token, new Set());
        }
        invertedIndex.get(token).add(id);
      });
    });

    // Build chapter map
    CHAPTERS.forEach(ch => {
      chapterMap.set(ch.id, ch);
      if (ch.children) {
        ch.children.forEach(child => {
          chapterMap.set(child.id, { ...child, parent: ch });
        });
      }
    });
  }

  /**
   * Find which chapter a knowledge item belongs to
   */
  function findChapter(itemId) {
    for (const ch of CHAPTERS) {
      if (ch.children) {
        for (const child of ch.children) {
          if (child.id === itemId) return ch;
        }
      }
    }
    return null;
  }

  /**
   * Calculate relevance score for a document given query tokens
   */
  function scoreDocument(docId, queryTokens) {
    const doc = documents.get(docId);
    if (!doc) return 0;

    let score = 0;
    const titleLower = (doc.title || '').toLowerCase();
    const textLower = doc.text.toLowerCase();

    queryTokens.forEach(token => {
      // Title match (highest weight)
      if (titleLower.includes(token)) score += 10;
      // Exact title match
      if (titleLower === token) score += 20;
      // Text match
      const matches = (textLower.match(new RegExp(escapeRegex(token), 'g')) || []).length;
      score += Math.min(matches, 10);
    });

    return score;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  return {
    /**
     * Initialize the search engine
     */
    init() {
      buildIndex();
    },

    /**
     * Search knowledge base
     * @param {string} query - Search query
     * @param {number} limit - Max results
     * @returns {Array<{id, title, snippet, score, chapter}>}
     */
    search(query, limit = 20) {
      if (!query || query.trim().length === 0) return [];

      const queryTokens = tokenize(query);
      if (queryTokens.length === 0) return [];

      // Find matching documents
      const candidateIds = new Set();
      queryTokens.forEach(token => {
        // Exact match
        if (invertedIndex.has(token)) {
          invertedIndex.get(token).forEach(id => candidateIds.add(id));
        }
        // Prefix/partial match
        invertedIndex.forEach((ids, term) => {
          if (term.includes(token) || token.includes(term)) {
            ids.forEach(id => candidateIds.add(id));
          }
        });
      });

      // Score and rank
      const results = [];
      candidateIds.forEach(docId => {
        const score = scoreDocument(docId, queryTokens);
        if (score > 0) {
          const doc = documents.get(docId);
          // Generate snippet
          const plainText = doc.text.replace(/\s+/g, ' ');
          let snippet = plainText.substring(0, 150);
          // Try to highlight match area
          queryTokens.forEach(token => {
            const idx = plainText.toLowerCase().indexOf(token);
            if (idx >= 0) {
              const start = Math.max(0, idx - 30);
              const end = Math.min(plainText.length, idx + token.length + 70);
              snippet = (start > 0 ? '...' : '') +
                       plainText.substring(start, end) +
                       (end < plainText.length ? '...' : '');
            }
          });

          results.push({
            id: docId,
            title: doc.title,
            snippet: snippet.trim(),
            score,
            chapter: doc.chapter,
          });
        }
      });

      // Sort by score descending
      results.sort((a, b) => b.score - a.score);
      return results.slice(0, limit);
    },

    /**
     * Get knowledge item by ID
     */
    getById(id) {
      return documents.get(id) || null;
    },

    /**
     * Get all items for a chapter
     */
    getByChapter(chapterId) {
      const results = [];
      documents.forEach((doc, id) => {
        if (id.startsWith(chapterId + '-') || id === chapterId) {
          results.push(doc);
        }
      });
      return results;
    },

    /**
     * Get related items
     */
    getRelated(id) {
      const doc = documents.get(id);
      if (!doc || !doc.related) return [];
      return doc.related.map(rid => documents.get(rid)).filter(Boolean);
    }
  };
})();

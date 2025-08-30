# Fuse.js Documentation

## Overview
Fuse.js is a powerful, lightweight fuzzy-search library for JavaScript that enables flexible and intelligent searching across collections of data.

## Installation Methods

### Package Managers
- **npm**: `npm install fuse.js`
- **Yarn**: `yarn add fuse.js`

### CDN Inclusion
```html
<!-- Production -->
<script src="https://cdn.jsdelivr.net/npm/fuse.js@7.1.0"></script>

<!-- ES Modules -->
<script type="module">
  import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs'
</script>
```

### Module Systems
- **ES6 Modules**: `import Fuse from 'fuse.js'`
- **CommonJS**: `const Fuse = require('fuse.js')`
- **Deno**: 
  ```typescript
  import Fuse from 'https://deno.land/x/fuse@v7.1.0/dist/fuse.min.mjs'
  ```

## Basic Usage

### Initialization
```javascript
const books = [
  { title: "Old Man's War", author: "John Scalzi" },
  { title: "The Martian", author: "Andy Weir" }
];

const fuse = new Fuse(books, {
  keys: ['title', 'author'],
  includeScore: true
});

const results = fuse.search('Martian');
```

## Configuration Options

### Search Behavior
- `isCaseSensitive`: Toggle case-sensitive matching
- `ignoreDiacritics`: Ignore accent marks
- `includeScore`: Include relevance score in results
- `includeMatches`: Include matched character indices
- `minMatchCharLength`: Minimum character length for matches
- `shouldSort`: Sort results by relevance
- `findAllMatches`: Continue searching after first match

### Fuzzy Matching
- `location`: Expected pattern location
- `threshold`: Matching tolerance (0.0-1.0, lower = stricter)
- `distance`: Maximum distance from expected location
- `ignoreLocation`: Ignore location in scoring
- `ignoreFieldNorm`: Ignore field length normalization

### Key Configuration
Keys can be strings, arrays, or objects with weights:
```javascript
// Simple keys
keys: ['title', 'author']

// Weighted keys
keys: [
  { name: 'title', weight: 2 },
  { name: 'author', weight: 1 }
]

// Nested object paths
keys: ['book.title', 'book.author.name']
```

## Search Methods

### Basic Search
```javascript
const results = fuse.search('pattern');
```

### Extended Search
Use special operators for advanced queries:
- `'word`: Exact match
- `!word`: Inverse exact match
- `^word`: Prefix exact match
- `word$`: Suffix exact match
- `word1 word2`: OR operation
- `word1 +word2`: AND operation

### Logical Operators
```javascript
// AND operation
fuse.search("'python +tutorial")

// OR operation  
fuse.search("javascript | typescript")
```

## Result Format

Results are returned as arrays of objects:
```javascript
[
  {
    item: { title: "The Martian", author: "Andy Weir" },
    score: 0.001,
    matches: [
      {
        indices: [[0, 6]],
        value: "The Martian",
        key: "title"
      }
    ]
  }
]
```

## Performance Optimization

### Index Creation
For better performance with large datasets:
```javascript
// Create index once
const myIndex = Fuse.createIndex(['title', 'author'], books);
const fuse = new Fuse(books, options, myIndex);

// Or serialize for storage
const serializedIndex = JSON.stringify(myIndex.toJSON());
```

### Memory Management
- Use `removeAt(index)` to remove items
- Use `add(item)` to add new items
- Consider recreating index for large changes

## Advanced Features

### Custom Scoring
Customize how matches are scored:
```javascript
const options = {
  getFn: (obj, path) => {
    // Custom getter function
    return obj[path];
  },
  sortFn: (a, b) => {
    // Custom sort function
    return a.score - b.score;
  }
};
```

### Field Normalization
Control how field length affects scoring:
```javascript
{
  fieldNormWeight: 1, // Higher values favor shorter fields
  ignoreFieldNorm: false // Disable field normalization
}
```

## Common Use Cases

### Search with Highlighting
```javascript
const fuse = new Fuse(data, {
  keys: ['title'],
  includeMatches: true
});

const results = fuse.search('query');
// Use matches array to highlight matched characters
```

### Multi-field Search
```javascript
const options = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'author', weight: 1 },
    { name: 'tags', weight: 0.5 }
  ]
};
```

### Threshold Tuning
- `threshold: 0.0`: Perfect match required
- `threshold: 0.2`: Good for typo tolerance
- `threshold: 0.4`: More flexible matching
- `threshold: 0.6`: Very loose matching

## Best Practices

1. **Key Selection**: Choose searchable fields that users expect
2. **Threshold Tuning**: Start with 0.3-0.4 and adjust based on results
3. **Performance**: Create index once for static data
4. **User Experience**: Include scores to show relevance
5. **Memory**: Remove items individually rather than recreating entire index

## Integration Examples

### React Hook
```javascript
import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';

function useSearch(items, keys) {
  const [query, setQuery] = useState('');
  
  const fuse = useMemo(() => 
    new Fuse(items, { keys, threshold: 0.3 }), [items, keys]
  );
  
  const results = useMemo(() => 
    query ? fuse.search(query) : items.map(item => ({ item })), 
    [fuse, query]
  );
  
  return [results, setQuery];
}
```

### Vue Composition API
```javascript
import { ref, computed } from 'vue';
import Fuse from 'fuse.js';

export function useSearch(items, options) {
  const query = ref('');
  const fuse = new Fuse(items, options);
  
  const results = computed(() => 
    query.value ? fuse.search(query.value) : []
  );
  
  return { query, results };
}
```

This documentation covers the core functionality of Fuse.js as used in search implementations like the QuickSearch component.
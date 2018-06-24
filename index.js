const fs = require('fs');

const text = fs.readFileSync('text.txt', 'utf8');
const prefixes = fs.readFileSync('prefixes.txt', 'utf8');
const PrefixTreeNode = require('./PrefixTreeNode.js');

console.log(text);
const textArray = text.split(' ');
const prefixesArray = prefixes.split(' ');
console.log(prefixesArray);

class PrefixTree extends PrefixTreeNode {
  constructor() {
    super(null);
  }

  addWord(string) {
    const addWordHelper = (node, str) => {
      if (!node.children[str[0]]) {
        node.children[str[0]] = new PrefixTreeNode(str[0]);
        if (str.length === 1) {
          node.children[str[0]].endWord = 1;
        }
      } else {
        node.children[str[0]].appearances =
          node.children[str[0]].appearances + 1;
      }
      if (str.length > 1) {
        addWordHelper(node.children[str[0]], str.slice(1));
      }
    };

    addWordHelper(this, string);
  }

  predictWord(string, maxSuggestions) {
    var getRemainingTree = function(string, tree) {
      var node = tree;
      if (typeof node === undefined) {
        return false;
      }
      while (string) {
        node = node && node.children[string[0]];
        string = string.substr(1);
      }
      return node;
    };

    var allWords = [];

    var allWordsHelper = function(stringSoFar, tree) {
      for (let k in tree.children) {
        const child = tree.children[k];
        var newString = stringSoFar + child.value;
        if (child.endWord) {
          allWords.push({
            word: newString,
            appearances: child.appearances
          });
        }
        allWordsHelper(newString, child);
      }
    };

    var remainingTree = getRemainingTree(string, this);
    if (remainingTree) {
      allWordsHelper(string, remainingTree);
    }

    return allWords
      .sort((a, b) => {
        var x = a.appearances;
        var y = b.appearances;
        return x > y ? -1 : x < y ? 1 : 0;
      })
      .slice(0, maxSuggestions)
      .map(el => el.word);
  }

  logAllWords(prefixesArray) {
    console.log('------ ALL WORD SUGGESTIONS ------');
    prefixesArray.forEach(el => console.log(this.predictWord(el, 5)));
  }
}

const PrefixTreeClass = new PrefixTree();
textArray.forEach(el => PrefixTreeClass.addWord(el.toLowerCase()));
PrefixTreeClass.logAllWords(prefixesArray);


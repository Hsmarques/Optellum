class PrefixNode {
  constructor(value) {
    this.children = {};
    this.endWord = null;
    this.value = value;
    this.appearances = 0;
  }
}

module.exports = PrefixNode;

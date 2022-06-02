const WordWrappr = require("word-wrappr")
const nodejieba = require("nodejieba")

// CONST
const fontSize = 42
const width = 7

// init
const wrappr = new WordWrappr()
wrappr.loadSync()

let text = "你是想干嘛阿迪斯大叔大婶"
const a = nodejieba.cut(text)
text = a.join(" ")
const lines = wrappr.wrap(text, fontSize, width)
console.log(lines)

const computeWidth = wrappr.computeWidth(text, fontSize)
console.log(computeWidth)

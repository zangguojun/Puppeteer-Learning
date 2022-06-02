const nodejieba = require("nodejieba")

const text =
  "我是拖拉机学院手扶拖拉机专业的。不用多久，我就会升职加薪，当上CEO，走上人生巅峰。"
// const res = nodejieba.cut(text)
// n1
const res = nodejieba.cut(text, true)
// n1
// const res = nodejieba.cutHMM(text)
// const res = nodejieba.cutAll(text)
// const res = nodejieba.cutForSearch(text)
// const res = nodejieba.tag(text)
// const res = nodejieba.extract(text, 5)
// const res = nodejieba.textRankExtract(text, 5)
// const res = nodejieba.cutSmall(text, 5)
console.log(`🚀 ~ res`, res)

const gm = require("gm")
const path = require("path")
const fs = require("fs")

const getFiles = (rootDir) => {
  const list = ["title", "content", "comment_0", "comment_1", "comment_2"]
  return list
    .map((fileName) => path.resolve(rootDir, `${fileName}.png`))
    .filter((filePath) => fs.existsSync(filePath))
}

const collapse = (target, ...args) => {
  return new Promise((resolve) => {
    const [first, ...rest] = args
    gm(first)
      .append(rest)
      .write(target, (err) => {
        resolve()
      })
  })
}

const projectDir = path.resolve(__dirname, "backup", "img")
const dirlist = fs.readdirSync(projectDir)
// dirlist.slice(dirlist.length - 1)
dirlist.forEach(async (dirName) => {
  console.log(`🚀 ~ dirName`, dirName)
  const fileDir = path.resolve(projectDir, dirName)
  const [title, content, ...commentArgs] = getFiles(fileDir)
  await collapse(path.resolve(fileDir, "main.png"), title, content)
  await collapse(path.resolve(fileDir, "comment.png"), ...commentArgs)
})

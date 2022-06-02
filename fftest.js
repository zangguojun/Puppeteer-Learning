const path = require("path")
const fs = require("fs")
const colors = require("colors")

const {
  FFCreatorCenter,
  FFScene,
  FFAlbum,
  FFText,
  FFCreator,
} = require("ffcreator")

const getFiles = (rootDir) => {
  const list = ["title", "content", "commont_0", "commont_1", "commont_2"]
  return list.map((fileName) => path.resolve(rootDir, `${fileName}.png`))
}

const cacheDir = path.resolve(__dirname, "../cache")
const outputDir = path.resolve(__dirname, "../output")
const projectDir = path.resolve(__dirname, "backup", "img")
const width = 720
const height = 1280

const creator = new FFCreator({
  cacheDir,
  outputDir,
  width: 720,
  height: 1280,
  log: true,
})

const dirlist = fs.readdirSync(projectDir)
dirlist.slice(dirlist.length - 1).forEach((dirName) => {
  const fileDir = path.resolve(projectDir, dirName)
  const scene = new FFScene()
  scene.setBgColor("#ff0000")

  const album = new FFAlbum({
    list: getFiles(fileDir),
    x: width / 2,
    y: height / 2,
    width,
    height,
    showCover: false,
  })
  album.setTransition("zoomIn")
  album.setDuration(2)
  scene.addChild(album)

  const fText = new FFText({
    text: dirName,
  })
  fText.setColor("#ffffff")
  fText.setBackgroundColor("#000000")
  fText.addEffect("fadeIn", 1, 1)
  scene.addChild(fText)

  scene.setDuration(2)
})

creator.start()
creator.openLog()

creator.on("start", () => {
  console.log(`FFCreator start`)
})

creator.on("error", (e) => {
  console.log(`FFCreator error: ${e.error}`)
})

creator.on("progress", (e) => {
  console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`))
})

creator.on("complete", (e) => {
  console.log(
    colors.magenta(
      `FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `
    )
  )

  console.log(
    colors.green(
      `\n --- You can press the s key or the w key to restart! --- \n`
    )
  )
})

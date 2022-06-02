const path = require("path")
const fs = require("fs")
const colors = require("colors")

const {
  FFCreatorCenter,
  FFScene,
  FFImage,
  FFText,
  FFCreator,
} = require("ffcreatorlite")

const getFiles = (rootDir) => {
  const list = ["title", "content", "commont_0", "commont_1", "commont_2"]
  return list.map((fileName) => path.resolve(rootDir, `${fileName}.png`))
}

const cacheDir = path.resolve(__dirname, "../cache")
const outputDir = path.resolve(__dirname, "../output")
const projectDir = path.resolve(__dirname, "backup", "img")
const audio = path.resolve(__dirname, "./assets/audio/01.wav")

const creator = new FFCreator({
  cacheDir,
  outputDir,
  width: 720,
  height: 1280,
  log: true,
  audio,
})

const dirlist = fs.readdirSync(projectDir)
dirlist.slice(dirlist.length - 1).forEach((dirName) => {
  const fileDir = path.resolve(projectDir, dirName)
  // const [title, content, commont_0, commont_1, commont_2] =
  getFiles(fileDir).map((imgPath) => {
    const scene = new FFScene()
    scene.setBgColor("#ff0000")
    const fImg = new FFImage({ path: imgPath })
    fImg.setScale(0.8)
    scene.addChild(fImg)
    const fText = new FFText({
      text: dirName,
    })
    fText.setColor("#ffffff")
    fText.setBackgroundColor("#000000")
    fText.addEffect("fadeIn", 1, 1)
    scene.addChild(fText)
    scene.setDuration(2)
    creator.addChild(scene)
  })

  creator.start()
  creator.openLog()

  creator.on("start", () => {
    console.log(`FFCreatorLite start`)
  })

  creator.on("error", (e) => {
    console.log(`FFCreatorLite error:: \n ${JSON.stringify(e)}`)
  })

  creator.on("progress", (e) => {
    console.log(
      colors.yellow(`FFCreatorLite progress: ${(e.percent * 100) >> 0}%`)
    )
  })

  creator.on("complete", (e) => {
    console.log(
      colors.magenta(
        `FFCreatorLite completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `
      )
    )

    console.log(
      colors.green(
        `\n --- You can press the s key or the w key to restart! --- \n`
      )
    )
  })
})

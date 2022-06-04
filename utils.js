const path = require("path")
const fs = require("fs")
const puppeteer = require("puppeteer")

const rootDir = path.resolve(__dirname, "data")
const imgDir = path.resolve(rootDir, "img")
const allHeight = 1600
const maxHeight = allHeight - 200

const nameFormat = (name) =>
  name.replace(/\//g, "-").replace(/\:/g, "：").replace(/ /g, "")

const timeout = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

function mkRootDir() {
  fs.mkdirSync(path.resolve(__dirname, "data"), { recursive: true })
  fs.mkdirSync(path.resolve(__dirname, "data", "img"), { recursive: true })
}

async function getMap(config, info) {
  const browser = await puppeteer.launch(config)
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36"
  )
  await page.goto(info.url)

  const hotListXPath = info.xpath
  await page.waitForXPath(hotListXPath)
  const hotDOM = await page.$x(hotListXPath)
  const hotActicle = await page.evaluate((...domList) => {
    return domList.map((dom) => {
      return {
        href: dom.href,
        name: dom.text,
      }
    })
  }, ...hotDOM)
  return [browser, page, hotActicle]
}

module.exports = {
  mkRootDir,
  rootDir,
  imgDir,
  maxHeight,
  allHeight,
  nameFormat,
  timeout,
  getMap,
}

const PuppeteerVideoRecorder = require("puppeteer-video-recorder")
const puppeteer = require("puppeteer")
const path = require("path")
const fs = require("fs")

const nameFormat = (name) => name.replace(/\//g, "-").replace(/\:/g, "：")

const timeout = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

;(async () => {
  try {
    fs.mkdirSync(path.resolve(__dirname, "data"), { recursive: true })
    fs.mkdirSync(path.resolve(__dirname, "data", "video"), { recursive: true })

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      // slowMo: 500,
      args: ["--no-sandbox"],
    })
    let page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36"
    )
    await page.goto("https://bbs.hupu.com/lol")

    const classifyBtnXPath = "//div[@class='bbs-sl-web-type-wrap']/div"
    await page.waitForXPath(classifyBtnXPath)
    const classifyBtn = await page.$x(classifyBtnXPath)
    /**
     * 0 => 最新回复
     * 1 => 最新发布
     * 2 => 24小时榜
     */
    await classifyBtn[2].click()

    const hotListXPath = "//ul/li//div[@class='post-title']/a"
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

    for (let i = 0; i < hotActicle.length; i++) {
      const href = hotActicle[i].href
      const name = nameFormat(hotActicle[i].name)
      // await page.goto(href, { waitUntil: "networkidle0", timeout: 0 })
      await page.goto(href, { waitUntil: "networkidle0", timeout: 0 })

      fs.mkdirSync(path.resolve(__dirname, "data", "video", name), {
        recursive: true,
      })

      const hiddenXPathList = [
        "//div[contains(@class,'bbs-post-web-body-right-wrapper')]",
        "//div[contains(@class,'backToTop_2mZa6')]",
      ]

      for (let k = 0; k < hiddenXPathList.length; k++) {
        await page.waitForXPath(hiddenXPathList[k])
        const hiddenDom = (await page.$x(hiddenXPathList[k]))[0]
        await page.evaluate((dom) => (dom.style.display = "none"), hiddenDom)
      }

      const contentXPath = "//div[@class='post-wrapper']"
      await page.waitForXPath(contentXPath)
      const contentDOM = (await page.$x(contentXPath))[0]

      const recorder = new PuppeteerVideoRecorder()
      await recorder.init(page, path.resolve(__dirname, "data", "video", name))
      await recorder.start()
      await page.evaluate(async (dom) => {
        return new Promise((resolve) => {
          let curHeight = 0
          const contentHeight = dom.clientHeight
          const timer = setInterval(() => {
            curHeight += 200
            window.scrollTo(0, curHeight)
            if (curHeight >= contentHeight) {
              clearTimeout(timer)
              resolve()
            }
          }, 500)
        })
      }, contentDOM)

      await recorder.stop()
    }

    await browser.close()
  } catch (e) {
    console.log(e)
  }
})()

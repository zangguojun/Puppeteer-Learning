const puppeteer = require("puppeteer")
const path = require("path")
const fs = require("fs")

const nameFormat = (name) =>
  name.replace(/\//g, "-").replace(/\:/g, "：").replace(/ /g, "")

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
    fs.mkdirSync(path.resolve(__dirname, "data", "img"), { recursive: true })

    const browser = await puppeteer.launch({
      // headless: false,
      defaultViewport: null,
      // slowMo: 500,
      args: ["--no-sandbox"],
      // devtools: true,
    })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36"
    )
    await page.goto(
      "https://bbs.hupu.com/search?q=doinb&topicId=&sortby=light&page=1"
    )

    const hotListXPath =
      "//div[@class='content-outline']//a[@class='content-wrap-span'][1]"
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

    // CONST
    const allHeight = 1600
    const maxHeight = allHeight - 200
    const titleXPath = "//div[@class='bbs-post-web-main-title']"
    const contentXPath = "//div[@class='post-wrapper']"
    const hiddenXPathList = [
      "//div[contains(@class,'bbs-post-web-body-right-wrapper')]",
      "//div[contains(@class,'backToTop_2mZa6')]",
    ]
    const commentXPath = "//div[@class='post-reply-list ']"

    for (let i = 0; i < hotActicle.length; i++) {
      const href = hotActicle[i].href
      const name = nameFormat(hotActicle[i].name)
      const curDir = path.resolve(__dirname, "data", "img", name)
      fs.mkdirSync(curDir, {
        recursive: true,
      })

      await page.goto(href, { waitUntil: "networkidle0", timeout: 0 })

      // display: none
      for (let k = 0; k < hiddenXPathList.length; k++) {
        await page.waitForXPath(hiddenXPathList[k])
        const hiddenDom = (await page.$x(hiddenXPathList[k]))[0]
        await hiddenDom.evaluate((dom) => (dom.style.display = "none"))
      }

      // 限制高度
      let sumHeight = 0
      await page.waitForXPath(titleXPath)
      const titleDOM = (await page.$x(titleXPath))[0]
      const titletHeight = await titleDOM.evaluate((dom) => dom.clientHeight)
      sumHeight += titletHeight
      await titleDOM.screenshot({ path: `data/img/${name}/title.png` })
      await titleDOM.evaluate((dom) => (dom.style.display = "none"))

      await page.waitForXPath(contentXPath)
      const contentDOM = (await page.$x(contentXPath))[0]
      await contentDOM.evaluate((dom) => {
        return new Promise((resolve) => {
          const selectors = Array.from(dom.querySelectorAll("img"))
          resolve(selectors)
        }).then((selectors) => {
          return Promise.all(
            selectors.map((img) => {
              console.log("~", img.complete)
              if (img.complete) return Promise.resolve("loaded")
              return new Promise((resolve, reject) => {
                img.addEventListener("load", (...args) => {
                  resolve(...args)
                  console.log("~", "...success")
                })
                img.addEventListener("error", () => {
                  reject(...args)
                  console.log("~", "...error")
                })
              })
            })
          )
        })
      })

      const contentHeight = await contentDOM.evaluate((dom) => dom.clientHeight)
      sumHeight += contentHeight
      if (sumHeight > maxHeight) {
        console.log(`第${i + 1}个 ${name} content 图片过长${sumHeight}`)
        fs.rmSync(curDir, { recursive: true, force: true })
        continue
      }

      await contentDOM.screenshot({ path: `data/img/${name}/content.png` })

      await page.waitForXPath(commentXPath)
      const commentDOM = await page.$x(commentXPath)
      sumHeight = 0
      for (let j = 0; j < 3; j++) {
        const cDom = commentDOM[j]
        const cHeight = await cDom.evaluate((dom) => dom.clientHeight)
        sumHeight += cHeight
        if (sumHeight > maxHeight) break
        await cDom.screenshot({
          path: `data/img/${name}/comment_${j}.png`,
        })
      }
      console.log(`第${i + 1}个 ${name} 截屏成功！`)
    }
    await page.close()
    await browser.close()
  } catch (e) {
    console.log(e)
  }
})()

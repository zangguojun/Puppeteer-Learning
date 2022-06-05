const puppeteer = require("puppeteer")
const path = require("path")
const fs = require("fs")
const { mkRootDir, nameFormat, getMap, maxHeight } = require("./utils")

;(async () => {
  try {
    mkRootDir()

    const [browser, page, hotActicle] = await getMap(
      {
        // headless: false,
        defaultViewport: null,
        // slowMo: 500,
        args: ["--no-sandbox"],
        // devtools: true,
      },
      {
        url: "https://bbs.hupu.com/search?q=RNG&topicId=85&sortby=general&page=1",
        xpath:
          "//div[@class='content-outline']//a[@class='content-wrap-span'][1][./following-sibling::a/text()='英雄联盟']",
      }
    )

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
      const curDir = path.resolve(__dirname, "backup", "img", name)
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
      // await titleDOM.screenshot({ path: `backup/img/${name}/title.png` })
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

      await contentDOM.screenshot({ path: `backup/img/${name}/content.png` })

      await page.waitForXPath(commentXPath)
      const commentDOM = await page.$x(commentXPath)
      sumHeight = 0
      for (let j = 0; j < 3; j++) {
        const cDom = commentDOM[j]
        const cHeight = await cDom.evaluate((dom) => dom.clientHeight)
        sumHeight += cHeight
        if (sumHeight > maxHeight) break
        await cDom.screenshot({
          path: `backup/img/${name}/comment_${j}.png`,
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

const { MsEdgeTTS } = require("msedge-tts")

;(async () => {
  const tts = new MsEdgeTTS()
  await tts.setMetadata(
    "en-US-AriaNeural",
    MsEdgeTTS.OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS
  )
  const filePath = await tts.toFile(
    "./example_audio.webm",
    "Love to us human is what water to fish.Love shines the most beautiful light of humanity,we born in it,we live by it.Too often we take it as granted,but we should know love is a priceless gift we should cherish.But how to cherish the love?I have heard a saying :the quickest way to receive love is to give it; the fastest way to lose love is to hold it too tightly the best way to keep love is to give it wings."
  )
  console.log(`🚀 ~ filePath`, filePath)
})()

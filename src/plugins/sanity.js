import PicoSanity from "picosanity"

const client = new PicoSanity({
  projectId: "nipfx4rq",
  dataset: "production",
  useCdn: true,
})

export default {
  install: (app) => {
    app.config.globalProperties.$sanity = client
  },
}

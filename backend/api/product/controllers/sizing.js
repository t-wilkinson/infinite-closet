module.exports = {
  async sizeChart(ctx) {
    let sizeChart = await strapi.query('size-chart').find()
    sizeChart = sizeChart.map((chart) =>
      Object.entries(chart).reduce((acc, [k, v]) => {
        acc[strapi.services.size.normalize(k)] = v
        return acc
      }, {})
    )

    const sizeEnum = strapi.services.size.enum.map(
      strapi.services.size.normalize
    )

    ctx.send({
      chart: sizeChart,
      sizeEnum,
      measurements: ['hips', 'waist', 'bust'],
    })
  },
}

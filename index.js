let lineChartRsp
let lineChartBitrate
function refresh({ cdnId, partnerId, startTime, endTime, videoType }) {
  fetch(
    `https://api-dev.spilot.io/reports/v1/multi-cdn/test?cdnId=${cdnId}&partnerId=${partnerId}&startTime=${startTime}&endTime=${endTime}&videoType[]=${videoType}`
  )
    .then(data => data.json())
    .then(rsp => {
      if (lineChartRsp) {
        lineChartRsp.destroy()
      }
      if (lineChartBitrate) {
        lineChartBitrate.destroy()
      }
      const rspTime = rsp.data.filter(r => r.response_time !== null).map(r => r.response_time)
      const bitrate = rsp.data.map(r => r.bitrate !== null).map(r => r.bitrate)
      const bitrateData = bitrate.sort((a, b) => b - a)
      const data = rspTime.sort((a, b) => a - b)
      const ctx = document.getElementById('lineChartRsp').getContext('2d')
      const ctx1 = document.getElementById('lineChartBitrate').getContext('2d')
      const Lr = rspTime.length
      const Lp = bitrate.length
      const p95IndexRsp = Math.floor(Lr * 0.95)
      const p95ValueRsp = data[p95IndexRsp]
      const p50IndexRsp = Math.floor(Lr * 0.50)
      const p50ValueRsp = data[p50IndexRsp]
      const p90IndexRsp = Math.floor(Lr * 0.90)
      const p90ValueRsp = data[p90IndexRsp]

      const p95IndexBit = Math.floor(Lp * 0.95)
      const p95ValueBit = bitrateData[p95IndexBit]
      const p50IndexBit = Math.floor(Lp * 0.50)
      const p50ValueBit = bitrateData[p50IndexBit]
      const p90IndexBit = Math.floor(Lp * 0.90)
      const p90ValueBit = bitrateData[p90IndexBit]
      lineChartRsp = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map((_, index) => index + 1), // X-axis labels
          datasets: [
            {
              label: 'Response Time',
              data: data, // Y-axis data points
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false, // No fill under the line
              pointRadius: 0 // No points on the line
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Điểm dữ liệu'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Response time'
              }
            }
          }
        },
        plugins: [
          {
            id: 'p95Line',
            beforeDraw: chart => {
              const ctx = chart.ctx
              const xScale = chart.scales.x
              const yScale = chart.scales.y
              const xPos = xScale.getPixelForValue(p95IndexRsp + 1)
  
              ctx.save()
              ctx.strokeStyle = 'red'
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.moveTo(xPos, yScale.top)
              ctx.lineTo(xPos, yScale.bottom)
              ctx.stroke()
              ctx.restore()
  
              ctx.font = '12px Arial'
              ctx.fillStyle = 'red'
              ctx.fillText(`p95: ${p95ValueRsp}`, xPos + 5, yScale.top + 20)
            }
          },
          {
            id: 'p50Line',
            beforeDraw: chart => {
              const ctx = chart.ctx
              const xScale = chart.scales.x
              const yScale = chart.scales.y
              const xPos = xScale.getPixelForValue(p50IndexRsp + 1)
  
              ctx.save()
              ctx.strokeStyle = 'red'
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.moveTo(xPos, yScale.top)
              ctx.lineTo(xPos, yScale.bottom)
              ctx.stroke()
              ctx.restore()
  
              ctx.font = '12px Arial'
              ctx.fillStyle = 'red'
              ctx.fillText(`p50: ${p50ValueRsp}`, xPos + 5, yScale.top + 20)
            }
          },
          {
            id: 'p90Line',
            beforeDraw: chart => {
              const ctx = chart.ctx
              const xScale = chart.scales.x
              const yScale = chart.scales.y
              const xPos = xScale.getPixelForValue(p90IndexRsp + 1)
  
              ctx.save()
              ctx.strokeStyle = 'red'
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.moveTo(xPos, yScale.top)
              ctx.lineTo(xPos, yScale.bottom)
              ctx.stroke()
              ctx.restore()
  
              ctx.font = '12px Arial'
              ctx.fillStyle = 'red'
              ctx.fillText(`p90: ${p90ValueRsp}`, xPos + 5, yScale.top + 20)
            }
          }
        ]
      })
      lineChartBitrate = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: data.map((_, index) => index + 1), // X-axis labels
          datasets: [
            {
              label: 'Bitrate',
              data: bitrateData, // Y-axis data points
              borderColor: 'grey',
              borderWidth: 2,
              fill: false, // No fill under the line
              pointRadius: 0 // No points on the line
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Điểm dữ liệu'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Bitrate'
              }
            }
          }
        },
        plugins: [{
          id: 'p95Line1',
          beforeDraw: chart => {
            const ctx = chart.ctx
            const xScale = chart.scales.x
            const yScale = chart.scales.y
            const xPos = xScale.getPixelForValue(p95IndexBit + 1)

            ctx.save()
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(xPos, yScale.top)
            ctx.lineTo(xPos, yScale.bottom)
            ctx.stroke()
            ctx.restore()

            ctx.font = '12px Arial'
            ctx.fillStyle = 'red'
            ctx.fillText(`p95: ${p95ValueBit}`, xPos + 5, yScale.top + 20)
          }
        },
        {
          id: 'p50Line1',
          beforeDraw: chart => {
            const ctx = chart.ctx
            const xScale = chart.scales.x
            const yScale = chart.scales.y
            const xPos = xScale.getPixelForValue(p50IndexBit + 1)

            ctx.save()
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(xPos, yScale.top)
            ctx.lineTo(xPos, yScale.bottom)
            ctx.stroke()
            ctx.restore()

            ctx.font = '12px Arial'
            ctx.fillStyle = 'red'
            ctx.fillText(`p50: ${p50ValueBit}`, xPos + 5, yScale.top + 20)
          }
        },
        {
          id: 'p90Line1',
          beforeDraw: chart => {
            const ctx = chart.ctx
            const xScale = chart.scales.x
            const yScale = chart.scales.y
            const xPos = xScale.getPixelForValue(p90IndexBit + 1)

            ctx.save()
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(xPos, yScale.top)
            ctx.lineTo(xPos, yScale.bottom)
            ctx.stroke()
            ctx.restore()

            ctx.font = '12px Arial'
            ctx.fillStyle = 'red'
            ctx.fillText(`p90: ${p90ValueBit}`, xPos + 5, yScale.top + 20)
          }
        }]
      })
    })
    .catch(err => console.log(err))
  
}
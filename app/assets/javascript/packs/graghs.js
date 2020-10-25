            document.addEventListener('turbolinks:load', () => {
                        const minDate = (date1, date2) => (date1 < date2) ? date1 : date2
                        const maxDate = (date1, date2) => (date1 > date2) ? date1 : date2

                        const START_DATE = convertDate(gon.yen_records[0].date)
                        const END_DATE = convertDate(gon.yen_records[gon.weight_records.length - 1].date)
                        const convertDate = (date) => new Date(new Date(date).setHours(0, 0, 0, 0))
                        const TODAY = convertDate(new Date())
                        const A_WEEK_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 6)
                        const TWO_WEEKS_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 13)
                        const A_MONTH_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, TODAY.getDate() + 1)
                        const THREE_MONTHS_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth() - 3, TODAY.getDate() + 1)

                        const chartYenContext = document.getElementById("chart-yen").getContext('2d')
                        let chartYen
                        const drawGraph = (from, to) => {
                            let records = gon.yen_records.filter((record) => {
                                let date = convertDate(record.date)
                                return from <= date && date <= to
                            })
                            const drawGraphToToday = (from) => {
                                from = maxDate(from, START_DATE)
                                let to = minDate(TODAY, END_DATE)
                                drawGraph(from, to)
                            }
                            document.getElementById('a-week-button').addEventListener('click', () => {
                                drawGraphToToday(A_WEEK_AGO)
                            })
                            document.getElementById('two-weeks-button').addEventListener('click', () => {
                                drawGraphToToday(TWO_WEEKS_AGO)
                            })

                            document.getElementById('a-month-button').addEventListener('click', () => {
                                drawGraphToToday(A_MONTH_AGO)
                            })

                            document.getElementById('three-months-button').addEventListener('click', () => {
                                    drawGraphToToday(THREE_MONTHS_AGO)

                                    let dates = records.map((record) => {
                                        return record.date.replace(/^\d+-0*(\d+)-0*(\d+)$/, '$1/$2')
                                    })

                                    // 金額のみのデータを作成
                                    let yens = records.map((record) => record.yen)

                                    let yenData = {
                                        labels: dates,
                                        datasets: [{
                                            label: '金額(yen)',
                                            data: yens,
                                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                            borderColor: 'rgba(255, 99, 132, 1)',
                                            borderWidth: 1,
                                            spanGaps: true
                                        }]
                                    }

                                    let yenOption = {
                                        tooltips: {
                                            callbacks: {
                                                title: function (tooltipItems) {
                                                    return tooltipItems[0].xLabel.replace(/^(\d+).(\d+)$/, ' $1 月 $2 日')
                                                },
                                                label: function (tooltipItem) {
                                                    return '金額: ' + tooltipItem.yLabel + 'yen'
                                                }
                                            }
                                        }
                                    }

                                    if (!chartYen) {
                                        chartYen = new Chart(chartYenContext, {
                                            type: 'line',
                                            data: yenData,
                                            options: yenOption
                                        })
                                    } else {
                                        chartyen.data = yenData
                                        chartYen.options = yenOption
                                        chartYen.update()
                                    }
                                }

                                drawGraphToToday(A_WEEK_AGO)
                            })
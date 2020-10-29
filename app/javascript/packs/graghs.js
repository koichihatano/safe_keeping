import flatpickr from "flatpickr";

document.addEventListener("turbolinks:load", () => {
  if (document.getElementById("start-calendar")) {
    const convertDate = (date) => new Date(new Date(date).setHours(0, 0, 0, 0));

    const minDate = (date1, date2) => (date1 < date2 ? date1 : date2);
    const maxDate = (date1, date2) => (date1 > date2 ? date1 : date2);

    const START_DATE = convertDate(gon.graph_records[0].date);
    const END_DATE = convertDate(
      gon.graph_records[gon.graph_records.length - 1].date
    );

    flatpickr.localize(flatpickr.l10ns.ja);

    const drawGraphForPeriod = () => {
      let from = convertDate(document.getElementById("start-calendar").value);
      let to = convertDate(document.getElementById("end-calendar").value);
      if (from > to) {
        alert("終了日は開始日以降の日付にしてください");
      } else {
        drawGraph(from, to)
      }
    };
    const periodCalendarOption = {
      disableMobile: true,
      minDate: START_DATE,
      maxDate: END_DATE,
      onCharge: drawGraphForPeriod,
    }

    const startCalendarFlatpickr = flatpickr(
      "#start-calendar",
      periodCalendarOption
    )
    const endCalendarFlatpickr = flatpickr(
      "#end-calendar",
      periodCalendarOption
    )
    // 新規登録用のカレンダー
    flatpickr("#new-calendar", {
      disableMobile: true,
      // 記録のある日付を選択できないようにする
      disable: gon.recorded_dates,
      defaultDate: "today",
    })

    // 編集モーダルで日付を選択したときに，記録された体重を表示する関数
    const editCalendar = document.getElementById("edit-calendar");
    const editYen = document.getElementById("edit-yen");
    const inputYen = () => {
      let record = gon.yen_records.find(
        (record) => record.date === editCalendar.value
      );
      editYen.value = record.yen
      editRemain.value = record.remain
    }

    // 記録編集用のカレンダー
    flatpickr("#edit-calendar", {
      disableMobile: true,
      // 記録のある日付のみ選択できるようにする
      enable: gon.recorded_dates,
      // 記録が無い場合は日付を選択できないようにする
      noCalendar: gon.recorded_dates.length === 0,
      onChange: inputYen
    })
    const TODAY = convertDate(new Date());
    const A_WEEK_AGO = new Date(
      TODAY.getFullYear(),
      TODAY.getMonth(),
      TODAY.getDate() - 6
    )
    const TWO_WEEKS_AGO = new Date(
      TODAY.getFullYear(),
      TODAY.getMonth(),
      TODAY.getDate() - 13
    )
    const A_MONTH_AGO = new Date(
      TODAY.getFullYear(),
      TODAY.getMonth() - 1,
      TODAY.getDate() + 1
    )
    const THREE_MONTHS_AGO = new Date(
      TODAY.getFullYear(),
      TODAY.getMonth() - 3,
      TODAY.getDate() + 1
    )

    const chartYenContext = document
      .getElementById("chart-yen")
      .getContext("2d")
    let chartYen

    const drawGraph = (from, to) => {
      let records = gon.graph_records.filter((record) => {
        let date = convertDate(record.date)
        return from <= date && date <= to
      })
      let dates = records.map((record) => {
        return record.date.replace(/^\d+-0*(\d+)-0*(\d+)$/, "$1/$2")
      })
      // 金額のみのデータを作成
      let yens = records.map((record) => record.yen)

      let yenDatasets = {
        type: 'line',
        label: '金額(yen)',
        data: yens,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        spanGaps: true,
        fill: false,
        yAxisID: 'y-axis-yen'
      }

      let remains = records.map((record) => record.remain)
      debugger
      let remainDatasets = {
        type: 'bar',
        label: '予算(remain)',
        data: remains,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        spanGaps: true,
        yAxisID: 'y-axis-remain',
      }
      let graphData = {
        labels: dates,
        datasets: [yenDatasets, remainDatasets]
      }
      let options = {
        tooltips: {
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].xLabel.replace(
                /^(\d+).(\d+)$/,
                " $1 月 $2 日")
            }
          }
        },
        scales: {
          yAxes: [{
              id: 'y-axis-yen', // Y軸のID
              position: 'left', // どちら側に表示される軸か？
            },
            {
              id: 'y-axis-remain',
              position: 'right',
              gridLines: {
                display: false,
              },
              ticks: {
                // y軸のメモリを 0 からスタートに強制
                beginAtZero: true
              },
            }
          ]
        }
      }
      if (!chartYen) {
        chartYen = new Chart(chartYenContext, {
          type: 'bar',
          data: graphData,
          options: options,
        })
      } else {
        chartYen.data = graphData
        chartYen.options = options
        chartYen.update()
      }
    }

    const drawGraphToToday = (from) => {
      from = maxDate(from, START_DATE)
      let to = minDate(TODAY, END_DATE)
      drawGraph(from, to)
      startCalendarFlatpickr.setDate(from)
      endCalendarFlatpickr.setDate(to)
    }
    document.getElementById("a-week-button").addEventListener("click", () => {
      drawGraphToToday(A_WEEK_AGO)
    })
    document
      .getElementById("two-weeks-button")
      .addEventListener("click", () => {
        drawGraphToToday(TWO_WEEKS_AGO)
      })

    document.getElementById("a-month-button").addEventListener("click", () => {
      drawGraphToToday(A_MONTH_AGO)
    })

    document
      .getElementById("three-months-button")
      .addEventListener("click", () => {
        drawGraphToToday(THREE_MONTHS_AGO)
      })

    drawGraphToToday(A_WEEK_AGO)
  }
})
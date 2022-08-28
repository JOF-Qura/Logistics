$(function () {
  // set current year to text
  $("#get_year").html(
    `${new Date().getFullYear()} ${localStorage.getItem(
      "DEPARTMENTNAME"
    )} Budgets`
  );

  // load  budget chart of specific department
  $.ajax({
    url:
      apiURL +
      "budget-plan/charts/" +
      localStorage.getItem("DEPARTMENTID") +
      "/" +
      new Date().getFullYear(),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    success: function (data) {
      if (data) {
        let percent = 100 - (data.total_spent / data.given_budget) * 100;

        $("#budget_percent").val(Math.round(percent));
        $("#given_budget").html("\u20B1" + numberWithCommas(data.given_budget));
        $("#total_spent").html("\u20B1" + numberWithCommas(data.total_spent));
        $("#remaining").html(
          "\u20B1" + numberWithCommas(data.given_budget - data.total_spent)
        );
      } else {
        // notification("error", "Error!","");
        $("#budget_percent").val(0);
        $("#given_budget").html("No budget Set");
        $("#total_spent").html("No budget Set");
        $("#remaining").html("No budget Set");
        console.log("error" + data);
      }
    },
    complete: function (data) {
      knobFunction();
    },
    error: function ({ responseJSON }) {},
  });

  // load monthly spent of specific department
  $.ajax({
    url:
      apiURL +
      "budget-plan/dept-spent/" +
      localStorage.getItem("DEPARTMENTID") +
      "/" +
      new Date().getFullYear(),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        console.log(Object.keys(responseData));
        // console.log(Object.values(responseData))

        var areaChartData = {
          labels: Object.keys(responseData).reverse(),
          datasets: [
            {
              // category
              label: "Monthly Spent",
              // backgroundColor: "rgba(60,141,188,0.9)",
              borderColor: "rgba(60,141,188,0.8)",
              pointRadius: false,
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              fill: false,

              // value
              data: Object.values(responseData).reverse(),
            },
          ],
        };

        var lineChartCanvas = $("#request_per_month_line")
          .get(0)
          .getContext("2d");
        var lineChartData = $.extend(true, {}, areaChartData);
        var temp0 = areaChartData.datasets[0];
        lineChartData.datasets[0] = temp0;

        var lineChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          datasetFill: false,
        };

        new Chart(lineChartCanvas, {
          type: "line",
          data: lineChartData,
          options: lineChartOptions,
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
});
knobFunction = () => {
  $(".knob").knob({
    readOnly: true,
    format: function (value) {
      return value + "%";
    },
  });
};

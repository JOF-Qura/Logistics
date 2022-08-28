$(function () {
  // set current year to text
  $("#curr_year").text(`Year ${new Date().getFullYear()} department budgets`);

  // load charts of budgets of departments for this year
  $.ajax({
    url: apiURL + "budget-plan/charts/" + new Date().getFullYear(),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    success: function (data) {
      if (data) {
        $("#budget_charts_body").empty();
        let budget_charts_body =
          '<div class="row d-flex justify-content-between">';
        for (let i in data) {
          let percent =
            100 - (data[i].total_spent / data[i].given_budget) * 100;
          // console.log(data[i].department.department_name +" : "+percent)
          budget_charts_body +=
            '<div class="col-md-4">' +
            '<div class="card border-0">' +
            '<div class="card-header">' +
            '<h3 class="card-title"><strong>' +
            data[i].department.department_name +
            "</strong></h3>" +
            "</div>" +
            '<div class="card-body">' +
            '<input type="text" class="knob" value="' +
            Math.floor(percent) +
            '" data-width="150" data-height="150" data-fgColor="#f56954">' +
            '<div class="d-flex justify-content-between my-3">' +
            '<div><label>Given Budget:</label><div class="knob-label h5"><strong>' +
            "\u20B1" +
            numberWithCommas(data[i].given_budget) +
            "</strong></div></div>" +
            '<div><label>Total Spent:</label><div class="knob-label h5"><strong>' +
            "\u20B1" +
            numberWithCommas(data[i].total_spent) +
            "</strong></div> </div>" +
            "</div>" +
            '<label>Remaining:</label><div class="knob-label h5"><strong>' +
            "\u20B1" +
            numberWithCommas(data[i].given_budget - data[i].total_spent) +
            "</strong></div>" +
            "</div>" +
            "</div>" +
            "</div>";
        }
        budget_charts_body += "</div>";
        $("#budget_charts_body").append(budget_charts_body);
      } else {
        notification("error", "Error!", data.detail);

        console.log("error" + data);
        loadTable();
      }
    },
    complete: function (data) {
      knobFunction();
    },
    error: function ({ responseJSON }) {},
  });

  knobFunction = () => {
    $(".knob").knob({
      readOnly: true,
      format: function (value) {
        return value + "%";
      },
    });
    /* END JQUERY KNOB */
  };
});

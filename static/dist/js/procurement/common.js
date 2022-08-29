const baseURL = "http://localhost:8000/";
const apiURL = "http://localhost:8000/api/v1/";

const notification = (type, title, message) => {
  return toastr[type](message, title);
};



const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

let button = document.querySelector(".submit");

$(document).ajaxStart(function () {
  button != undefined ? (button.disabled = true) : null;
});
// when ajax has sent the request
$(document).ajaxSend(function (e, xhr, opt) {
	button != undefined ? (button.disabled = true) : null;
});

// ajax received a response
$(document).ajaxComplete(function () {
	button != undefined ? (button.disabled = false) : null;
});

// ajax has error
$(document).ajaxError(function (xhr, error, thrown) {
	button != undefined ? (button.disabled = false) : null;

});



const formatPurchaseRequestNo = (pr_no) => {
  let number = String(pr_no);

  pr_no = "PR-";
  for (let i = 0; i < 8 - number.length; i++) {
    pr_no += "0";
  }

  pr_no += number;
  return pr_no;
};

const formatRfqNo = (rfq_no) => {
  let rfq_number = String(rfq_no);

  rfq_no = "RFQ-";
  for (let i = 0; i < 8 - rfq_number.length; i++) {
    rfq_no += "0";
  }

  rfq_no += rfq_number;
  return rfq_no;
};


const formatPoNo = (po_no) => {
  let number = String(po_no);

  po_no = "PO-";
  for (let i = 0; i < 8 - number.length; i++) {
    po_no += "0";
  }

  po_no += number;
  return po_no;
};



// remove index from arrray
function removeA(array, product) {
  for (var i in array) {
    if (array[i] == product) {
      array.splice(i, 1);
      break;
    }
  }
}

// remove duplicate in product array - XXXX
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


// Date Today
var d = new Date();

var month = d.getMonth() + 1;
var day = d.getDate();

var today =
  d.getFullYear() +
  "-" +
  (("" + month).length < 2 ? "0" : "") +
  month +
  "-" +
  (("" + day).length < 2 ? "0" : "") +
  day;

var localStorageArr = [];


// trim the input fields except file, select, textarea
trimInputFields = () => {
	var allInputs = $("input:not(:file())");
	allInputs.each(function () {
		$(this).val($.trim($(this).val()));
	});
};

$.ajaxSetup({
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("ID"),
  },
});

$(function () {

// localStorageArr.push(localStorage.getItem("TOKEN"));
// // localStorageArr.push($.cookie("TOKEN"));
// localStorageArr.push(localStorage.getItem("ID"));
// if (localStorage.getItem("TOKEN") == null  ||localStorage.getItem("DEPARTMENTNAME") == null ) {
//     window.location.replace(baseURL+"login");
// }

// $("#userFullName").text(localStorage.getItem("FIRSTNAME") + " "+ localStorage.getItem("LASTNAME"))
$("#userFullName").html(sessionStorage.getItem("USER_TYPE"))
// $("#userDepartment").text(localStorage.getItem("DEPARTMENTNAME"))


})
// });

// convert string to '...' if length is greater that the given limit
trimString =(string, length) => {
  return string.length > length ? 
         string.substring(0, length) + '...' :
         string;
};

logout = () => {
  localStorage.clear();
  window.location.replace(baseURL+"login");

}


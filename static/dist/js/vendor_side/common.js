const webURL = "http://localhost:8000/vendor/";
const baseURL = "http://localhost:8000/";

const apiURL = "http://localhost:8000/api/v1/";
const notification = (type, title, message) => {
  return toastr[type](message, title);
};

const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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


const formatPurchaseRequestNo = (pr_no) => {
  let number = String(pr_no);

  pr_no = "PR-";
  for (let i = 0; i < 8 - number.length; i++) {
    pr_no += "0";
  }

  pr_no += number;
  return pr_no;
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

const formatRfqNo = (rfq_no) => {
  let number = String(rfq_no);

  rfq_no = "RFQ-";
  for (let i = 0; i < 8 - number.length; i++) {
    rfq_no += "0";
  }

  rfq_no += number;
  return rfq_no;
};


var localStorageArr = [];


$(function () {
  // load vendor logo
  fetchVendorLogo();

localStorageArr.push(localStorage.getItem("TOKEN"));
localStorageArr.push(localStorage.getItem("USERID"));
if (localStorageArr[0] == null) {
  setTimeout(() =>{

    window.location.replace(baseURL+"vendor-login");
  }, 1000)

}

$("#vendorName").text(localStorage.getItem("VENDORNAME"))
// $("#vendorIndustry").text(localStorage.getItem("INDUSTRY"))
$("#vendorStatus").text(localStorage.getItem("VENDORSTATUS"))



});

logout = () => {
  // create time log logout
  $.ajax({
    url: apiURL + "vendor-time-log",
    // contentType: "application/x-www-form-urlencoded",
    type: "POST", // post, put, delete, get
    data: JSON.stringify({
        logged_type: "Logged Out",
        client_ip:localStorage.getItem("CLIENT_IP"),
        vendor_id:localStorage.getItem("ID"),
      }),
    contentType: "application/json",
    processData: false,
    cache: false,
    dataType: "json",
    success: function (data) {
        if(data){

          window.location.replace(baseURL+"vendor-login");

    }

    },
    error: function ({ responseJSON }) {
    // notification("warning","Incorrect Email or Password");


    },
});
  localStorage.clear();
  window.location.replace(baseURL+"vendor-login");

}

$.ajaxSetup({
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("TOKEN"),
  },
});

// get vendor logo
const fetchVendorLogo = () =>{
$.ajax({
  url: apiURL + "vendor/" + localStorage.getItem("ID"),
  type: "GET",
  headers: { Authorization: `Bearer ${localStorage.getItem("TOKEN")}` },
  success: (data) => {
    $("#vendor_logo").attr(
      "src",
      apiURL + "vendor/vendor-pic/" + data["vendor_logo"]
    );

  },
});
}

// load notification
const loadNotif = () => {
  $.ajax({
    url: apiURL + "notification/vendor/" + localStorage.getItem("ID") +"/"+"vendor",
    type: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("TOKEN")}` },
    success: (data) => {
      
      $("#notif_body").empty();
      let new_notif = 0;
      let notif_body ='<span class="dropdown-item dropdown-header">'+data.length+' Notification(s)</span>';
      $.each(data, function (i, responseData) {
      if(responseData.status == "unread"){
        new_notif +=1
      }
      // console.log(responseData.created_at)
  
      if(i <= 5){
        if((responseData.title).toLowerCase().includes("order")){
          notif_body += 
        '<div class="dropdown-divider"></div>'+
        '<a href="/vendor/list-of-orders/" class="dropdown-item">'+
        '<i class="fas fa-envelope mr-2"></i>'+responseData.title+
        '<div>' +trimString(responseData.title, 10) +
        '<span class="float-right text-muted text-sm">'+moment(responseData.created_at).fromNow()+'</span>'+'</div>'+
        '</a>';
      }

      if((responseData.title).toLowerCase().includes("quotation")){
        notif_body += 
      '<div class="dropdown-divider"></div>'+
      '<a href="/vendor/proposals/" class="dropdown-item">'+
      '<i class="fas fa-envelope mr-2"></i>'+responseData.title+
      '<div>' +trimString(responseData.title, 10) +
      '<span class="float-right text-muted text-sm">'+moment(responseData.created_at).fromNow()+'</span>'+'</div>'+
      '</a>';
    }
    }

    });
    notif_body += 
    '<div class="dropdown-divider"></div>' +
    '<a href="#" onclick="return showAllNotif()"  class="dropdown-item dropdown-footer">See All Notifications</a>'
    
    
  
    if(new_notif != 0) $('#new_notif').html(new_notif)
    else $('#new_notif').html("")
    $("#notif_body").append(notif_body)
  
    },
    error: function (data) {},
    
  });
}

loadNotif()

// convert string to '...' if length is greater that the given limit

trimString =(string, length) => {
  return string.length > length ? 
         string.substring(0, length) + '...' :
         string;
};


// mark notification as read
$(document).ready(function() {
console.log(localStorage.getItem("CLIENT_IP"))

$('#notif_dropdown').click(function(){
  $.ajax({
    url: apiURL + "notification/" + localStorage.getItem("ID"),
    type: "PUT",
    contentType: "application/json",
    dataType: "json",
    // contentType: false,
    processData: false,
    cache: false,
    data: JSON.stringify({
      status: "read"
    }),
    headers: { Authorization: `Bearer ${localStorage.getItem("TOKEN")}` },
    success: (data) => {
      // console.log("success")
      loadNotif()
    
    },
    error: function (data) {},
    
  });
})
});
showAllNotif = () => {
  $("#modal-notif").modal("show");

}



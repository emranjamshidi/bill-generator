$(window).on("load", () => {
  $(".loader").hide();
});

$(document).ready(() => {
  $(".decrease").hide();
});

//////////////////////////////////////////////////////////////////
/////////////////////////// Used methods//////////////////////////
//////////////////////////////////////////////////////////////////

// Conver Persian numbers to English
String.prototype.toEnglishDigits = function () {
  return this.replace(/[۰-۹]/g, function (chr) {
    var persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return persian.indexOf(chr);
  });
};

// Conver English numbers to Persian
String.prototype.toPersianDigits = function () {
  return this.replace(/[0-9]/g, function (chr) {
    var persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    var English = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return persian[English.indexOf(chr)];
  });
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

// Increase buttons
$(".increase").click(function () {
  let number = +$(this).parent().siblings(".number").text().toEnglishDigits();
  number++;
  $(this).parent().siblings(".number").text(number.toString().toPersianDigits());

  // Show again the decrease number
  if (number > 0) $(this).siblings(".decrease").show();

  // Calculate new sum
  let price = $(this).parent().parent().parent().children().children()[0].innerText;
  price = price.replace("/", "").toEnglishDigits();
  let sum = price * number;
  sum = sum.toString().toPersianDigits();
  sum = sum.split("");
  sum.reverse().splice(3, 0, "/").reverse();
  sum.reverse();
  sum = sum.join("");

  // Inset new sum
  let sumE = $(this).parent().parent().parent().siblings(".sum-div").children().children()[0];
  $(sumE).text(sum);

  // Update bill
  collectSum();
  finalCal();
});

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
// Decrease button
$(".decrease").click(function () {
  let number = +$(this).parent().siblings(".number").text().toEnglishDigits();
  number--;
  $(this).parent().siblings(".number").text(number.toString().toPersianDigits());

  // Hide it if numbers get zero
  if (number == 0) $(this).hide();

  // Calculate new sum
  let price = $(this).parent().parent().parent().children().children()[0].innerText;
  price = price.replace("/", "").toEnglishDigits();
  let sum = price * number;
  if (sum == 0) {
    sum = sum.toString().toPersianDigits();
  } else {
    sum = sum.toString().toPersianDigits();
    sum = sum.split("");
    sum.reverse().splice(3, 0, "/").reverse();
    sum.reverse();
    sum = sum.join("");
  }

  // Inset new sum
  let sumE = $(this).parent().parent().parent().siblings(".sum-div").children().children()[0];
  $(sumE).text(sum);

  // Update bill
  collectSum();
  finalCal();
});

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
// Collect sum and wage calculation
function collectSum() {
  // Calculate sum
  let result = 0;
  let wage;
  $(".foods__item").each(function () {
    let cost = $(this).children()[2];
    cost = $(cost).children()[0];
    cost = $(cost).children()[0];
    cost = +$(cost).text().replace("/", "").toEnglishDigits();
    result += cost;
  });

  // Calculate wage
  wage = (result * 2.5) / 100;

  // Insert wage and sum
  if (result == 0) {
    result = result.toString().toPersianDigits();
    wage = wage.toString().toPersianDigits();
  } else {
    result = result.toString().toPersianDigits();
    result = result.split("");
    if (result.length > 3) result.reverse().splice(3, 0, "/").reverse();
    result.reverse();
    result = result.join("");
    wage = wage.toString().toPersianDigits();
    wage = wage.split("");
    if (wage.length > 3) {
      wage.reverse().splice(3, 0, "/");
      wage.reverse();
    }
    wage = wage.join("");
  }
  $("#wage").text(wage);
  $("#collectOrders").text(result);
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
// Discount stuff
let used = 0;
let isPercentage;
let value = 0;
const Discounts = {
  aboli: 20000,
  hossein79: 10000,
  Mamad123: 15000,
  "20darsad": "20%",
  "10darsad": "10%",
};
// 0 empty
// 1 wrong
// 2 used
$("#discount").click(function () {
  let buttonI = $(this).children()[0];
  // --Empty state
  if (used == 0) {
    // Get the code
    let code = $("#discountInput").val();
    // Check for existance and if it was do the works
    for (let key in Discounts) {
      if (code == key) {
        used = 2;
        value = Discounts[code];
        $(buttonI).removeClass("fa-plus");
        $(buttonI).addClass("fa-trash");
        $(this).css("background-color", "#E74C3C");
        $("#discountInput").css("background-color", "#D9F6E6");
        $("#discountInput").prop("disabled", true);
      }
    }
    // Cheched and it was wrong
    if (used != 2 && used == 0) {
      used = 1;
      value = 0;
      $(buttonI).removeClass("fa-plus");
      $(buttonI).addClass("fa-times");
      $(this).css("background-color", "#E74C3C");
      $("#discountInput").css("background-color", "#FBDFDC");
      $("#discountInput").val("Wrong Code");
      $("#discountInput").prop("disabled", true);
    }
  } else if (used == 1) {
    // --Wrong state
    used = 0;
    value = 0;
    $(buttonI).removeClass("fa-times");
    $(buttonI).addClass("fa-plus");
    $(this).css("background-color", "#F39C12");
    $("#discountInput").css("background-color", "#FFFFFF");
    $("#discountInput").prop("disabled", false);
    $("#discountInput").val("");
  } else if (used == 2) {
    // --Used state
    used = 0;
    value = 0;
    $(buttonI).removeClass("fa-trash");
    $(buttonI).addClass("fa-plus");
    $(this).css("background-color", "#F39C12");
    $("#discountInput").css("background-color", "#FFFFFF");
    $("#discountInput").prop("disabled", false);
    $("#discountInput").val("");
  }

  // Final calculations
  finalCal();
});

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

// Final price
function finalCal() {
  // Discount Cal.
  if (typeof value == "string") {
    let collect = +$("#collectOrders").text().toEnglishDigits().replace("/", "");
    let offVal = value.split("");
    offVal.pop();
    offVal = +offVal.join("");
    offVal = (collect * offVal) / 100;
    offVal = offVal.toString().toPersianDigits();
    offVal = offVal.split("");
    if (offVal.length > 3) offVal.reverse().splice(3, 0, "/").reverse();
    offVal.reverse();
    offVal = offVal.join("");
    $("#off").text(offVal);
  } else {
    let injectVal = value.toString().toPersianDigits();
    injectVal = injectVal.split("");
    if (injectVal.length > 3) injectVal.reverse().splice(3, 0, "/").reverse();
    injectVal.reverse();
    injectVal = injectVal.join("");
    $("#off").text(injectVal);
  }

  // Final Cal
  let final = 0;
  final += +$("#collectOrders").text().toEnglishDigits().replace("/", "");
  final += +$("#wage").text().toEnglishDigits().replace("/", "");
  final -= +$("#off").text().toEnglishDigits().replace("/", "");
  final = final.toString().toPersianDigits();
  final = final.split("");
  if (final.length > 3) final.reverse().splice(3, 0, "/").reverse();
  final.reverse();
  final = final.join("");
  $("#final").text(final);
}

$(function () {
  $("#hiddenOutput").hide();
  errorHide();

  $("input[type=number]").each(function () {
    $(this).attr("disabled", true);
  });

  $("input:radio[name=kbn]").on("change", function () {
    $("input[type=number]").each(function () {
      $(this).attr("disabled", false);
    });

    errorHide();
    if ($(this).val() == 3) {
      $("#charge").attr("disabled", true);
      $("#count").attr("disabled", false);
      $("#charge").val(0);
    } else {
      $("#charge").attr("disabled", false);
      $("#count").attr("disabled", false);

      if ($(this).val() == 2) {
        $("#count").attr("disabled", true);
        $("#count").val(1);
      }

      if ($("#money").val() != "") {
        getCharge();
      } else {
        $("#charge").val("");
      }
    }
  });

  $("#money").on("blur", function () {
    getCharge();
  });

  $("#plus").on("click", function () {
    if ($("#count").attr("disabled") == undefined) {
      let value = Number.parseInt($("#count").val());
      $("#count").val(value + 1);
    }
  });

  $("#minus").on("click", function () {
    if ($("#count").attr("disabled") == undefined) {
      let value = Number.parseInt($("#count").val());
      $("#count").val(value - 1);
    }
  });

  $("#calBtn").on("click", function () {
    const hasErrors = clickCommonEvent();
    if (hasErrors) {
      errors.forEach(function (id) {
        $(`#error-${id}`).show();
        $(`#${id}`).addClass("error-input");
      });
    } else {
      $("#hiddenOutput").show();
      $("#hiddenOutput").text('입금 계좌는 3333281063073 카카오뱅크 ㅂㅅㅎ 입니다!');
      $("#hiddenOutput").select();
      document.execCommand("copy");
      $("#hiddenOutput").hide();
    }
    
  });

  $("#copyBtn").on("click", function () {
    const hasErrors = clickCommonEvent();

    if (hasErrors) {
      errors.forEach(function (id) {
        $(`#error-${id}`).show();
        $(`#${id}`).addClass("error-input");
      });
    } else {
      $("#output").show();
      createText(
        $("input[name=kbn]:checked").val(),
        $("#money").val(),
        $("#charge").val(),
        $("#currency").val(),
        $("#count").val(),
        $("#fees").val()
      );
    }
    
    if ($("#output").text() != "") {
      $("#hiddenOutput").show();
      $("#hiddenOutput").text($("#output").text());
      $("#hiddenOutput").select();
      document.execCommand("copy");
      $("#hiddenOutput").hide();
    }
  });
});

function errorHide() {
  $("[id ^= error-]").each(function () {
    $(this).hide();
    $("#output").hide();

    let id = $(this).attr("id").replace("error-", "");
    $(`#${id}`).removeClass("error-input");
  });
}

function createText(chargeLabel, money, charge, currency, count, fees) {
  let moneyNum = Number.parseInt(money);
  let chargeNum = Number.parseInt(charge);
  let currencyFloat = Number.parseFloat(currency);
  let countNum = Number.parseInt(count);
  let feesNum = Number.parseInt(fees);
  let result =
    Math.ceil(((moneyNum + chargeNum) * (currencyFloat + 15)) / 100) +
    3000 * countNum + feesNum;

  $("#output").html(
    `총 입금해주실 금액은 ${result.toLocaleString()}원입니다.\n\n</br></br>` +
      `대행 진행을 원하신다면 계좌번호를 안내해드리겠습니다!\n<\n/br></br>` +
      `💡견적\n</br>` +
      `(의뢰금액 ${moneyNum.toLocaleString()}엔${
        chargeLabel == 1
          ? ` + 편의점수수료 ${chargeNum.toLocaleString()}엔`
          : chargeLabel == 2
          ? ` + 송금수수료 ${chargeNum.toLocaleString()}엔`
          : ""
      }) * 환율 + 대행수수료 ${(3000 * countNum).toLocaleString()}원${
        feesNum == 0
          ? ""
          : ` + 추가수수료 ${feesNum.toLocaleString()}원`
      } \n\n</br></br>` +
      `💡환율\n</br>` +
      `${currencyFloat.toLocaleString()} + 15원 = ${(
        currencyFloat + 15
      ).toLocaleString()}원`
  );
}

function getCharge() {
  let value = Number.parseInt($("#money").val());

  if ($("input[name=kbn]:checked").val() == 1) {
    $("#charge").val(Math.ceil(value / 10000) * 110);
  } else if ($("input[name=kbn]:checked").val() == 2) {
    $("#charge").val(value < 30000 ? 220 : 440);
  }
}

function clickCommonEvent() {
  errorHide();
  let errors = [];

  $("input").each(function () {
    if ($(this).attr("type") !== "radio") {
      if ($(this).val() == "") {
        errors.push($(this).attr("id"));
      }
    }
  });

  if ($("input[name=kbn]:checked").val() == undefined) {
    errors.push("kbn");
  }
  
  return errors.length > 0 ? true : false;
}

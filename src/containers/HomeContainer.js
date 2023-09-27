import $ from "jquery";
import { useState } from "react";
import styled from "styled-components";
import { RadioItem, Error, errorHide } from "../components/common";
import { getCurrency } from "../api/common";
import { apiKey } from "../api/key";

const HomeContainer = () => {
  const [activate, setActivate] = useState(false);
  const radios = ["편의점", "송금", "기타"];

  $(function () {
    //エラー、コピーテキストエリア隠す
    $("#hiddenOutput").hide();
    errorHide();

    //input非活性
    $("input[type=number]").each(function () {
      $(this).attr("disabled", true);
    });
  });

  const getCharge = () => {
    let value = Number.parseInt($("#money").val());

    if ($("input[name=kbn]:checked").val() === "0") {
      $("#charge").val(Math.ceil(value / 10000) * 110);
    } else if ($("input[name=kbn]:checked").val() === "1") {
      $("#charge").val(value < 30000 ? 220 : 440);
    }
  };

  const onChangeKbn = (e) => {
    $("input[type=number]").each(function () {
      $(this).attr("disabled", false);
    });

    errorHide();

    if (e.target.value === "2") {
      $("#charge").attr("disabled", true);
      $("#charge").val(0);
    } else {
      $("#charge").attr("disabled", false);
      if ($("#money").val() !== "") {
        getCharge();
      } else {
        $("#charge").val("");
      }
    }
  };

  const onClick = (e) => {
    errorHide();
    let errors = [];

    $("input").each(function () {
      if ($(this).attr("type") !== "radio") {
        if ($(this).val() === "") {
          errors.push($(this).attr("id"));
        }
      }
    });

    if ($("input[name=kbn]:checked").val() === undefined) {
      errors.push("kbn");
    }

    if (errors.length !== 0) {
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
        $("#currency").val()
      );

      if (e.target.id === "copyBtn") {
        $("#hiddenOutput").show();
        $("#hiddenOutput").text($("#output").text());
        $("#hiddenOutput").select();
        document.execCommand("copy");
        $("#hiddenOutput").hide();
      }
    }
  };

  const clickGetCurrency = () => {
    getCurrency(apiKey).then((result) => {
      console.log(result.json());
    });
  };

  const createText = (chargeLabel, money, charge, currency) => {
    let moneyNum = Number.parseInt(money);
    let chargeNum = Number.parseInt(charge);
    let currencyFloat = Number.parseFloat(currency);
    let result =
      Math.ceil(((moneyNum + chargeNum) * (currencyFloat + 15)) / 100) + 3000;

    $("#output").html(
      `총 입금 금액은 ${result.toLocaleString()} 원 입니다.\n</br>` +
        `토스 사용하시면 토스입금계좌 안내 도와드리겠습니다!\n\n</br></br>` +
        `💡견적\n</br>` +
        `(의뢰금액 ${moneyNum.toLocaleString()}엔${
          chargeLabel === "0"
            ? ` + 편의점수수료 ${chargeNum.toLocaleString()}엔`
            : chargeLabel === "1"
            ? ` + 송금수수료 ${chargeNum.toLocaleString()}엔`
            : ""
        }) * 환율 + 대행수수료 3,000원\n\n</br></br>` +
        `💡환율\n</br>` +
        `${currencyFloat.toLocaleString()} + 15원 = ${(
          currencyFloat + 15
        ).toLocaleString()}원`
    );
  };

  return (
    <AreaParent className="flexBox _col">
      <Head>
        <label>대행 견적 계산기</label>
      </Head>
      <Body>
        <div className="flexBox _col parent">
          <label>의뢰구분</label>
          <div className="gridBox _col3" style={{ gridGap: "12px" }}>
            {radios.map((text, index) => {
              return (
                <RadioItem
                  key={index}
                  text={text}
                  index={index}
                  name="kbn"
                  onChange={onChangeKbn}
                ></RadioItem>
              );
            })}
          </div>
          <Error id="kbn"></Error>
        </div>
        <div className="flexBox _col parent">
          <label>의뢰 금액</label>
          <Input
            type="number"
            inputMode="numeric"
            id="money"
            placeholder="예: 15100"
          />
          <Error id="money"></Error>
        </div>
        <div className="flexBox _col parent">
          <label>추가 수수료</label>
          <Input
            type="number"
            inputMode="numeric"
            id="charge"
            placeholder="예: 220"
          />
          <Error id="charge"></Error>
        </div>
        <div className="flexBox _col parent">
          <label>현재 환율</label>
          <div className="flexBox">
            <Input
              type="number"
              inputMode="numeric"
              id="currency"
              placeholder="예: 900.01"
              style={{ flexGrow: 1 }}
            />
            <CurrencyButton
              style={{ marginLeft: "10px" }}
              onClick={clickGetCurrency}
            >
              가져오기
            </CurrencyButton>
          </div>
          <Error id="currency"></Error>
        </div>
      </Body>
      <Area className="flexBox _col" style={{ marginTop: "48px" }}>
        <Button id="calBtn" onClick={onClick}>
          견적 계산
        </Button>
        <Button id="copyBtn" onClick={onClick}>
          문장 복사
        </Button>
      </Area>
      <Text>
        <textarea id="hiddenOutput"></textarea>
        <label id="output"></label>
      </Text>
    </AreaParent>
  );
};

const AreaParent = styled.div`
  align-items: center;
  @media (max-width: 390px) {
    padding-top: 40px;
    padding-left: 16px;
    padding-right: 16px;
  }
`;
const Area = styled.div`
  width: 358px;

  @media (max-width: 390px) {
    width: 100%;
  }
`;

const Head = styled(Area)`
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
`;

const Body = styled(Area)`
  .parent {
    margin: 24px 0px;

    label:first-child {
      margin-bottom: 8px;
      font-size: 15px;
      font-weight: medium;
    }
  }
`;

const Text = styled(Area)`
  margin-top: 24px;
  margin-bottom: 40px;

  #output {
    line-height: 148%;
  }
`;
const Input = styled.input`
  font-size: 17px;
  padding: 14px 20px 15px 20px;
  border: solid 1px #dddddd;

  ::placeholder {
    color: #dddddd;
  }
`;

const BaseButton = styled.button`
  cursor: pointer;
  border-radius: 4px;
`;

const Button = styled(BaseButton)`
  font-size: 17px;
  padding: 14px 20px 15px 20px;

  &#calBtn {
    margin-bottom: 12px;
    background: #4583ee;
    color: white;
    border: solid 1px #4583ee;
  }

  &#copyBtn {
    background: white;
    color: #4583ee;
    border: solid 1px #4583ee;
  }
`;

const CurrencyButton = styled(BaseButton)`
  padding: 8px, 10px, 8px, 10px;
  border: solid 1px #777777;
  background: #ffffff;
  font-size: 13px;
`;
export default HomeContainer;

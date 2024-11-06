import $ from 'jquery';
import { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { RadioItem, Table2Row, Error, errorHide } from '../components/common';
import Toast from '../components/toast';

const HomeContainer = () => {
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [showResult, setShowResult] = useState(false);

  const [category, setCategory] = useState('store');
  const [fees, setFees] = useState('0');
  const [count, setCount] = useState('1');
  const [kingaku, setKingaku] = useState('');
  const [tesuryo, setTesuryo] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('0');

  const [writeAccount, setWriteAccount] = useState(false);

  const radios = { store: '편의점', card: '카드・페이' };
  const account = process.env.REACT_APP_ACCOUNT;

  useEffect(() => {
    errorHide();
    $('#hiddenOutput').hide();
  }, []);

  useEffect(() => {
    errorHide();
    $('#hiddenOutput').hide();

    if (showResult) {
      $('tr').each((index, _tr) => {
        const child = $(_tr).find('td');

        const row1text = $(child[0]).text();
        const row2text = $(child[1]).text();

        $('#hiddenOutput').append(row1text + row2text + '\n');
      });
      try {
        navigator.clipboard.writeText($('#hiddenOutput').text());
      } catch (err) {
        settingTimer('알 수 없는 에러 발생 /n 새로고침ㄱㄱ');
      }
    }
  }, [showResult]);

  const getCharge = () => {
    if ($('#store').is(':checked')) {
      setTesuryo(Math.ceil(kingaku / 10000) * 110);
    } else {
      setTesuryo(0);
    }
  };

  const onChangeKbn = (e) => {
    errorHide();

    $('#count').attr('disabled', false);
    setCategory(e.target.value);
    getCharge(e.target.value);

    if (e.target.value === 'store') {
      $('#tesuryo').attr('disabled', false);
    } else {
      $('#tesuryo').attr('disabled', true);
    }
  };

  const onClick = (e) => {
    errorHide();
    let errors = [];

    $('input').each(function () {
      if ($(this).attr('type') !== 'radio') {
        if ($(this).val() === '') {
          errors.push($(this).attr('id'));
        }
      }
    });

    if (errors.length !== 0) {
      errors.forEach(function (id) {
        $(`#error-${id}`).show();
        $(`#${id}`).addClass('error-input');
      });
    } else {
      $('#output').show();

      calculate();

      setShowResult(true);
      settingTimer('복사 완료');
    }
  };

  const settingTimer = (text) => {
    setIsToastVisible(true);
    setToastMessage(text);

    setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  const onCopyAccount = useCallback(() => {
    navigator.clipboard.writeText(`입금 계좌는 ${account} 카카오뱅크 ㅂㅅㅎ입니다.`);
    settingTimer('복사 완료');
  }, []);

  const onChangeCnt = useCallback((event) => {
    setCount(event.target.value);
  }, []);

  const clickPlus = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  const clickMinus = useCallback(() => {
    setCount(count - 1 < 0 ? 0 : count - 1);
  }, [count]);

  const calculate = () => {
    setIsToastVisible(false);
    let result = Math.ceil(((Number.parseInt(kingaku) + Number.parseInt(tesuryo)) * (Number.parseFloat(currency) + 15)) / 100) + 3000 * Number.parseInt(count);
    setAmount(result);
  };

  const fillBlank = (text) => {
    return text.toLocaleString();
  };

  return (
    <AreaParent className="flexBox _col" onClick={() => (isToastVisible === true ? setIsToastVisible(false) : '')}>
      <Head>
        <label>대행 견적 계산기</label>
      </Head>
      {isToastVisible && <Toast text={toastMessage} setToast={setIsToastVisible}></Toast>}
      {!showResult && (
        <>
          <Body>
            <div className="flexBox _col parent">
              <label>의뢰구분</label>
              <fieldset style={{ border: 'solid 1px #dddddd', padding: '14px 20px 15px 20px' }} className="gridBox _col2">
                {Object.keys(radios).map((key) => {
                  return <RadioItem key={key} id={key} text={radios[key]} name="kbn" onChange={onChangeKbn} isCheck={key === category}></RadioItem>;
                })}
              </fieldset>
              <Error id="kbn"></Error>
            </div>
            <div className="flexBox _col parent">
              <label>마감 수수료</label>
              <Input type="number" inputMode="numeric" id="fees" onChange={(e) => setFees(e.target.value)} value={fees} />
              <Error id="count"></Error>
            </div>
            <div className="flexBox _col parent">
              <label>의뢰 건수</label>
              <div className="flexBox">
                <Input type="number" inputMode="numeric" id="count" style={{ flexGrow: 1, width: 0 }} onChange={onChangeCnt} value={count} />
                <CurrencyButton style={{ marginLeft: '10px' }} onClick={clickPlus}>
                  +
                </CurrencyButton>
                <CurrencyButton style={{ marginLeft: '10px' }} onClick={clickMinus}>
                  -
                </CurrencyButton>
              </div>
              <Error id="count"></Error>
            </div>
            <div className="flexBox _col parent">
              <label>의뢰 금액</label>
              <Input type="number" inputMode="numeric" id="kingaku" value={kingaku} onChange={(e) => setKingaku(e.target.value)} onBlur={getCharge} placeholder="예: 15100" />
              <Error id="kingaku"></Error>
            </div>
            <div className="flexBox _col parent">
              <label>추가 수수료</label>
              <Input type="number" inputMode="numeric" id="tesuryo" value={tesuryo} onChange={(e) => setTesuryo(e.target.value)} placeholder="예: 220" />
              <Error id="tesuryo"></Error>
            </div>
            <div className="flexBox _col parent">
              <label>현재 환율</label>
              <Input type="number" inputMode="decimal" id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="예: 900.01" />
              <Error id="currency"></Error>
            </div>
            <div className="_col parent">
              <input id="showAccount" type="checkbox" style={{ marginRight: '5px' }} checked={writeAccount} onChange={() => setWriteAccount(!writeAccount)} />
              <label htmlFor="showAccount">계좌번호 안내하기</label>
            </div>
          </Body>
          <Area className="flexBox _col" style={{ marginTop: '48px', marginBottom: '48px' }}>
            <Button id="calBtn" onClick={onClick}>
              견적 계산
            </Button>
            <Button id="accountBtn" onClick={onCopyAccount}>
              계좌 복사
            </Button>
          </Area>
        </>
      )}
      {showResult && (
        <>
          <Area className="flexBox _col" style={{ marginTop: '24px', marginBottom: '48px' }}>
            <Button id="calBtn" onClick={() => setShowResult(false)}>
              수정하기
            </Button>
            <Button id="calBtn" onClick={onClick}>
              견적 다시 복사
            </Button>
            <Button id="accountBtn" onClick={onCopyAccount}>
              계좌 복사
            </Button>
          </Area>
          <Body>
            <table id="copyArea" style={{ width: '100%' }}>
              <tbody>
                <Table2Row row1={'✔ 견적'}></Table2Row>
                <Table2Row row1={'　💡 적용환율 : '} row2={`${fillBlank(Number.parseFloat(currency) + 15)}원`}></Table2Row>
                <Table2Row row1={'　💡 결제금액 : '} row2={`${fillBlank(Number.parseInt(kingaku))}엔`}></Table2Row>
                <Table2Row row1={'　　　+ 수수료 : '} row2={`${fillBlank(Number.parseInt(tesuryo))}엔`}></Table2Row>
                <Table2Row row1={'　⭕ 계산결과 : '} row2={`${fillBlank(Number.parseInt(amount))}원`}></Table2Row>
                {fees != 0 && <Table2Row row1={'　　　+ 마감수수료 : '} row2={`${fillBlank(Number.parseInt(fees))}원`}></Table2Row>}
                <Table2Row row2={'----------------------------'}></Table2Row>
                <Table2Row row1={'💰 입금금액 : '} row2={`${fillBlank(Number.parseInt(amount) + Number.parseInt(fees))}원`}></Table2Row>
                <Table2Row row2={'----------------------------'}></Table2Row>
                {writeAccount && <Table2Row row1={`입금 계좌는 ${account} 카카오뱅크 ㅂㅅㅎ입니다.`}></Table2Row>}
                {!writeAccount && <Table2Row row1={'대행 진행을 원하신다면 입금 계좌를 안내해드리겠습니다!'}></Table2Row>}
              </tbody>
            </table>
          </Body>
          <textarea id="hiddenOutput"></textarea>
        </>
      )}
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
  width: 50px;
`;
export default HomeContainer;

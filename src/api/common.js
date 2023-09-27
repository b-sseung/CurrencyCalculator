export const getCurrency = async (key) => {
  return await fetch(
    "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON",
    {
      method: "POST",
      body: {
        authkey: key,
        data: "AP01",
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    }
  )
    .then((res) => res)
    .catch((e) => console.log(e));
};

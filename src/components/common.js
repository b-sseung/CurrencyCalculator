import $ from 'jquery';

export const RadioItem = ({ name, id, text, onChange, isCheck }) => {
  return (
    <div className="flexBox">
      <input type="radio" name={name} id={id} value={id} onChange={onChange} checked={isCheck}></input>
      <label htmlFor={id} style={{ marginLeft: '5px' }}>
        {text}
      </label>
    </div>
  );
};

export const Table2Row = ({ row1, row1align = 'left', row2, row2align = 'right' }) => {
  return (
    <tr style={{ whiteSpace: 'pre-wrap', display: 'flex', margin: '10px 0' }}>
      <td style={{ textAlign: row1align }}>{row1}</td>
      <td style={{ textAlign: row2align, flexGrow: '1' }}>{row2}</td>
    </tr>
  );
};

export const Error = ({ id }) => {
  return (
    <label className="error" id={`error-${id}`}>
      필수 선택 값입니다.
    </label>
  );
};

export const errorHide = () => {
  $('[id ^= error-]').each(function () {
    $(this).hide();
    $('#output').hide();

    let id = $(this).attr('id').replace('error-', '');
    $(`#${id}`).removeClass('error-input');
  });
};

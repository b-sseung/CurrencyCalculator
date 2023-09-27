import $ from 'jquery'

export const RadioItem = ({ name, index, text, onChange }) => {
    return (
        <div className="flexBox">
            <input type='radio' name={name} id={`radio${index}`} value={index} onChange={onChange}></input>
            <label htmlFor={`radio${index}`}>{text}</label>
        </div>
    );
}

export const Error = ({id}) => {
    return (
        <label className="error" id={`error-${id}`}>필수 선택 값입니다.</label>
    )
}

export const errorHide = () => {
    $("[id ^= error-]").each(function () {
        $(this).hide();
        $("#output").hide();

        let id = $(this).attr("id").replace("error-", "");
        $(`#${id}`).removeClass("error-input");
    });
}
import ReactDOM from 'react-dom';
import { keyframes } from 'styled-components';
import styled from 'styled-components';
const animation = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -30%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

const Aside = styled.aside`
  position: absolute;
  top: 50%;
  left: 50%;
  animation: ${animation} 2s ease-in-out infinite;
  padding: 10px 50px;
  background: gray;
  border-radius: 50px;
  transform: ;
`;

const Toast = ({ text }) => {
  return ReactDOM.createPortal(
    <Aside id="toast">
      <p style={{ color: 'white', fontWeight: 'bold' }}>{text}</p>
    </Aside>,
    document.querySelector('body')
  );
};

export default Toast;

import ReactDOM from 'react-dom';
import { keyframes } from 'styled-components';
import styled from 'styled-components';
const animation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(1rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
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

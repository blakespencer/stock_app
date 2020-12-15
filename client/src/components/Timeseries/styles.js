import styled from 'styled-components';

export const ChartArea = styled.div`
  height: 700px;
`;

export const Tooltip = styled.div`
  box-sizing: border-box;
  opacity: 0;
  position: absolute;
  padding: 0.6em 1em;
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.4em;
  font-size: 0.9em;
  border: 1px solid #ddd;
  z-index: 10;
  transition: all 0.1s ease-out;
  pointer-events: none;
  border-radius: 5px;
`;

export const TooltipDate = styled.div`
  margin-bottom: 0.2em;
  font-weight: 600;
  font-size: 1.1em;
  line-height: 1.4em;
`;

export const TooltipPrice = styled.div``;

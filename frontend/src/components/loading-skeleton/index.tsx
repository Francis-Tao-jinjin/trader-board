import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const SkeletonItem = styled.div`
  background: #f6f7f8;
  background-image: linear-gradient(90deg, #f6f7f8 25%, #e0e0e0 50%, #f6f7f8 75%);
  background-size: 100% 100%;
  animation: ${shimmer} 1.5s infinite cubic-bezier(0.46, 0.03, 0.52, 0.96);
  border-radius: 4px;
  height: 200px;
`;

interface Props {
  count?: number;
  style?: React.CSSProperties;
}

const LoadingSkeleton: React.FC<Props> = ({count = 4, style}) => {
  const items = Array.from({ length: count });
  return (
    <>
      {
        items.map((_, index) => (
          <SkeletonItem key={index} style={style}/>
        ))
      }
    </>
  );
};

export default LoadingSkeleton;
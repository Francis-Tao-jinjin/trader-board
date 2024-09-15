import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 400px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f0f0f0;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),  /* 第一层阴影 */
    0 4px 8px rgba(0, 0, 0, 0.1),  /* 第二层阴影 */
    0 8px 16px rgba(0, 0, 0, 0.1); /* 第三层阴影 */
`;

const CarouselContent = styled.div<{ translateX: number }>`
  display: flex;
  transform: ${({ translateX }) => `translateX(-${translateX}%)`};
  transition: transform 0.5s ease-in-out;
`;

const CarouselItem = styled.div`
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 1;
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const PrevButton = styled(NavButton)`
  left: 10px;
`;

const NextButton = styled(NavButton)`
  right: 10px;
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: ${({ active }) => (active ? '#007bff' : '#ccc')};
  border-radius: 50%;
  cursor: pointer;
`;

interface Props {
  items: ReactNode[];
}

const Carousel: React.FC<Props> = ({items}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer>
      <CarouselContent translateX={currentIndex * 100}>
        {items.map((item, index) => (
          <CarouselItem key={index}>{item}</CarouselItem>
        ))}
      </CarouselContent>
      <PrevButton onClick={handlePrev}>‹</PrevButton>
      <NextButton onClick={handleNext}>›</NextButton>
      <DotsContainer>
        {items.map((_, index) => (
          <Dot key={index} active={index === currentIndex} onClick={() => handleDotClick(index)} />
        ))}
      </DotsContainer>
    </CarouselContainer>
  );
};

export default Carousel;
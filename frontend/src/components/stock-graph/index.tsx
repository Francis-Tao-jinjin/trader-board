import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { darken, transparentize } from 'polished';
import { getStockDailyRecord, getStockSMA, getStockEMA, getStockMACD } from '../../service/api';

const GraphContainer = styled.div`
  height: 440px;
  position: relative;
  border: 1px solid grey;
`;

const ChartWrapper = styled.div`
  height: 400px;
  width: 100%;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 5px;
  width: 100%;
`;

const Button = styled.button<{ active: boolean, bgColor: string }>`
  background-color: ${({ active, bgColor }) => (active ? bgColor : '#EEE')};
  color: ${({ active }) => (active ? '#FFF' : '#616161')};
  border: 2px solid ${({ active, bgColor }) => (active ? darken(0.2, bgColor) : '#CCC')};
  padding: 0.25rem 1rem;
  border-radius: 9px;
  cursor: pointer;
  margin: 0 0.5rem;
  transition: background-color 0.1s ease-in-out;
  &:hover {
    background-color: ${({ active, bgColor }) => (active ? bgColor : '#DDD')};
  }
`;

const INDICATOR_COLORS = {
  sma: '#8BC34A',
  ema: '#FF9800',
  macd: '#9C27B0',
}

interface StockGraphProps {
  symbol: string;
}

export const StockGraph: React.FC<StockGraphProps> = ({ symbol }) => {
  
  const [isSmaActive, setIsSmaActive] = useState(false);
  const [isEmaActive, setIsEmaActive] = useState(false);
  const [isMacdActive, setIsMacdActive] = useState(false);

  const { data: smaData, } = useQuery({
    queryKey: ['sma', symbol],
    queryFn: () => getStockSMA({symbol}),
    enabled: isSmaActive,
    staleTime: 1000 * 60 * 60,
  });

  const { data: emaData, } = useQuery({
    queryKey: ['ema', symbol],
    queryFn: () => getStockEMA({symbol}),
    enabled: isEmaActive,
    staleTime: 1000 * 60 * 60,
  });

  const { data: macdData, } = useQuery({
    queryKey: ['macd', symbol],
    queryFn: () => getStockMACD({symbol}),
    enabled: isMacdActive,
    staleTime: 1000 * 60 * 60,
  });

  console.log('MACD Data:', macdData);

  const handleSmaClick = () => {
    setIsSmaActive((v) => !v);
  };

  const handleEmaClick = () => {
    setIsEmaActive((v) => !v);
  };

  const handleMacdClick = () => {
    setIsMacdActive((v) => !v);
  };

  const { data: stockData, isPending, error } = useQuery({
    queryKey: ['stockDailyRecord', symbol],
    queryFn: () => getStockDailyRecord({symbol}),
    staleTime: 1000 * 60 * 60,
  });

  const labels = stockData?.data?.daily_record?.map((record) => record.date);
  const closePrices = stockData?.data?.daily_record?.map((record) => record.close);

  const chartData = useMemo(() => {
    const finalData = {
      labels,
      datasets: [
        {
          label: `${symbol} Closing Prices`,
          data: closePrices,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          borderWidth: 1,
        },
      ],
    };
    if (isSmaActive && smaData?.data) {
      finalData.datasets.push({
        label: `${symbol} 20-day SMA`,
        data: smaData.data.map((item) => isNaN(item.SMA) ? 0 : item.SMA),
        borderColor: INDICATOR_COLORS.sma,
        backgroundColor: transparentize(0.8, INDICATOR_COLORS.sma),
        fill: false,
        tension: 0.1,
        borderWidth: 1,
      });
    }
    if (isEmaActive && emaData?.data) {
      finalData.datasets.push({
        label: `${symbol} 20-day EMA`,
        data: emaData.data.map((item) => isNaN(item.EMA) ? 0 : item.EMA),
        borderColor: INDICATOR_COLORS.ema,
        backgroundColor: transparentize(0.8, INDICATOR_COLORS.ema),
        fill: false,
        tension: 0.1,
        borderWidth: 1,
      });
    }
    return finalData;
  }, [closePrices, labels, symbol, isSmaActive, smaData, isEmaActive, emaData]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Closing Price'
        }
      }
    }
  };

  return (
    <GraphContainer className='pb-8'>
      <ChartWrapper>
        <Line data={chartData} options={chartOptions}/>
      </ChartWrapper>
      <ButtonContainer>
        <Button active={isSmaActive} onClick={handleSmaClick} bgColor={INDICATOR_COLORS.sma}>
          SMA
        </Button>
        <Button active={isEmaActive} onClick={handleEmaClick} bgColor={INDICATOR_COLORS.ema}>
          EMA
        </Button>
        {/* <Button active={isMacdActive} onClick={handleMacdClick} bgColor={INDICATOR_COLORS.macd}>
          MACD
        </Button> */}
      </ButtonContainer>
    </GraphContainer>
  );
};

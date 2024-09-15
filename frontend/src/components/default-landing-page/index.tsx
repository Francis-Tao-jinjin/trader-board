import MockStocksDailyData from './mock-data/stocks_daily.json';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styled from 'styled-components';
import Carousel from '../carousels';
import img_1 from './assets/img-1.png';
import img_2 from './assets/img-2.png';
import { useMemo } from 'react';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  height: calc(100vh - 116px);
  
  background: linear-gradient(#efefef, #b0b0b0);
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const DescriptionSection = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

const FullWidthFullHeightDiv = styled.div<{imgSrc: string}>`
  width: 100%;
  height: 400px;
  background-image: url(${({imgSrc}) => imgSrc});
  background-size: cover;
  background-repeat: no-repeat;
`;

export const DefaultLandingPage = () => {
  
  const chartDemo = useMemo(() => {
    const stockSymbol = Object.keys(MockStocksDailyData)[0];
    let dailyRecord = (MockStocksDailyData as any)[stockSymbol];
    if (Array.isArray(dailyRecord)) {
      dailyRecord.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    const labels = dailyRecord.map((record: any) => record.date);
    const closePrices = dailyRecord.map((record: any) => record.close);
    return <Line data={{
      labels,
      datasets: [
        {
          label: `${stockSymbol} Closing Prices`,
          data: closePrices,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          borderWidth: 1,
        },
      ],
    }}
    options={{
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
    }}
    />
  }, []);

  const items = [
    <div className='w-full' style={{height: 400}}>{chartDemo}</div>,
    <FullWidthFullHeightDiv imgSrc={img_1}/>,
    <FullWidthFullHeightDiv imgSrc={img_2}/>,
  ];

  return (
    <PageContainer>
      <Title>Welcome to the Trader Board</Title>
      <Carousel items={items}/>
      <DescriptionSection>
        <p>
        Upon creating an account, you will have the ability to add stocks to your dashboard and analyze daily data from the past five months.
        </p>
        <p>
        You will also have the capability to monitor additional stock-related indicators, aiding in the analysis and tracking of the latest market conditions.
        </p>
      </DescriptionSection>
    </PageContainer>
  );
}
import React from 'react';
import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addStock, getUserStockList } from '../../service/api';
import { AddStockInput } from '../add-stock-input';
import LoadingSkeleton from '../loading-skeleton';
import { StockGraph } from '../stock-graph';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const Graph = styled.div`
  background-color: #007bff;
  height: 300px;
  border-radius: 4px;
`;

export const UserDashboard: React.FC = () => {
  
  const queryClient = useQueryClient();

  const { data: stockList, isPending, error } = useQuery({
    queryKey: ['userStockList'],
    queryFn: getUserStockList,
  });

  const mutation = useMutation({
    mutationFn: addStock,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userStockList'],
        exact: true,
        refetchType: 'active',
      });
    },
    onError: (err: any) => {
      if (typeof err.response !== 'undefined' && (typeof err.response?.error === 'string')) {
        toast.error(err.response.error, { autoClose: 5000 })
      }
    }
  });

  const handleAddStock = (stockSymbol: string) => {
    if (stockSymbol) {
      mutation.mutate({ symbol: stockSymbol });
    }
  };

  const stockListData = stockList?.data;
  
  return (
    <PageContainer>
      <SearchContainer>
        <AddStockInput handleAddStock={handleAddStock} isLoading={mutation.isPending} />
      </SearchContainer>
      <GridContainer>
        {isPending ? (
          <LoadingSkeleton style={{
            height: '300px',
          }} />
        ) : (
          <>
            {stockListData?.map((stock) => (<StockGraph key={stock.symbol} symbol={stock.symbol} />))}
          </>
        )}
      </GridContainer>
    </PageContainer>
  );
};

import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Provider as PaperProvider} from 'react-native-paper';
import {App} from './App';
import {theme} from './themes/default';
import Toast from 'react-native-toast-message';

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
});

const Root = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <App />
        <Toast />
      </PaperProvider>
    </QueryClientProvider>
  );
};

export {Root};

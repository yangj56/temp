import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import './index.css';
import { Router } from './router';
import { store } from './store/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
ReactDOM.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Router />
    </QueryClientProvider>
  </Provider>,
  document.getElementById('root')
);

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isAuthenticated } from './AuthCheck/auth';
import { ApolloClient, InMemoryCache, ApolloProvider, } from '@apollo/client';

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() && !router.pathname.includes('/login')) {
      router.push('/login');
    }
  }, []);

  const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache(),
    fetchOptions: {
      mode: 'no-cors',
    },
  });

  return (
    <ApolloProvider client={client}>
      <div style={{ overflowX: 'hidden' }}>
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  )
}

export default App;

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from './auth';

const ProtectedRoute = (WrappedComponent) => {
    const Wrapper = (props) => {
        const router = useRouter();

        useEffect(() => {
            if (!isAuthenticated()) {
                router.push('/login');
            }
        }, []);

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default ProtectedRoute;



import withAuth from 'next-auth/middleware';

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            if (!token && req.nextUrl.pathname !== '/') {
                return false;
            }
            return true;
        },
    },
});

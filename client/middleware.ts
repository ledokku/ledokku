import withAuth from 'next-auth/middleware';

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            if (req.nextUrl.pathname !== '/' && !token) {
                return false;
            }
            return true;
        },
    },
});

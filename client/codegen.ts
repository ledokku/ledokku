import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: `https://ledokku.on.ocstudios.mx/graphql`,
    documents: './graphql/**/*.graphql',
    generates: {
        'generated/graphql.tsx': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
                // 'graphql-codegen-apollo-next-ssr',
            ],
        },
        './graphql.schema.json': {
            plugins: ['introspection'],
        },
    },
};

export default config;

import { DbTypes } from '../generated/graphql';

export const dbTypeToDokkuPlugin = (dbType: DbTypes) => {
    switch (dbType) {
        case DbTypes.Mongodb:
            return 'mongo';
        case DbTypes.Postgresql:
            return 'postgres';
        case DbTypes.Redis:
            return 'redis';
        case DbTypes.Mysql:
            return 'mysql';
        case DbTypes.Mariadb:
            return 'mariadb';
    }

    return '';
};

export const dbTypeToReadableName = (dbType: DbTypes) => {
    switch (dbType) {
        case DbTypes.Mongodb:
            return 'MongoDB';
        case DbTypes.Postgresql:
            return 'PostgreSQL';
        case DbTypes.Redis:
            return 'Redis';
        case DbTypes.Mysql:
            return 'MySQL';
        case DbTypes.Mariadb:
            return 'MariaDB';
    }
};

export const isServer = () => typeof window === 'undefined';

export function throwError<T>(message: string): T {
    throw new Error(message);
}

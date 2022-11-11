import { DbTypes } from '../../generated/graphql';
import { MongoIcon } from '../icons/MongoIcon';
import { MySQLIcon } from '../icons/MySQLIcon';
import { PostgreSQLIcon } from '../icons/PostgreSQLIcon';
import { RedisIcon } from '../icons/RedisIcon';

interface DbIconProps {
    database: DbTypes;
    size?: number;
}

export const DbIcon = ({ database, size }: DbIconProps) => {
    switch (database) {
        case 'MONGODB':
            return <MongoIcon size={size} />;
        case 'POSTGRESQL':
            return <PostgreSQLIcon size={size} />;
        case 'REDIS':
            return <RedisIcon size={size} />;
        case 'MYSQL':
            return <MySQLIcon size={size} />;
    }

    return <div />;
};

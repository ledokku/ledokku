import { DbTypes } from '../../generated/graphql';
import { MariaDBIcon } from '../icons/MariaDBIcon';
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
        case DbTypes.Postgresql:
            return <PostgreSQLIcon size={size} />
        case DbTypes.Mongodb:
            return <MongoIcon size={size} />
        case DbTypes.Mysql:
            return <MySQLIcon size={size} />
        case DbTypes.Redis:
            return <RedisIcon size={size} />
        case DbTypes.Mariadb:
            return <MariaDBIcon size={size} />;
    }

    return <></>
};

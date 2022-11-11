import { DbTypes } from '../../generated/graphql';
import { MongoIcon } from '../icons/MongoIcon';
import { MySQLIcon } from '../icons/MySQLIcon';
import { PostgreSQLIcon } from '../icons/PostgreSQLIcon';
import { RedisIcon } from '../icons/RedisIcon';

interface LabelProps {
    name: string;
    type: DbTypes;
}

export const labelIcon = (type: DbTypes) => {
    if (type === 'MONGODB') {
        return <MongoIcon className="mt-1 mr-2" size={20} />;
    } else if (type === 'REDIS') {
        return <RedisIcon className="mt-1 mr-2" size={20} />;
    } else if (type === 'MYSQL') {
        return <MySQLIcon className="mt-1 mr-2" size={20} />;
    } else if (type === 'POSTGRESQL') {
        return <PostgreSQLIcon className="mt-1 mr-2" size={20} />;
    }
};

export const DatabaseLabel = ({ name, type }: LabelProps) => (
    <div className="flex flex-row h-6 mt-1 mb-1">
        {labelIcon(type)}
        <p>
            {name}
            {''}
        </p>
    </div>
);

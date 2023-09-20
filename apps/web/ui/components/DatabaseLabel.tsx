import { DbTypes } from "../../generated/graphql";
import { MariaDBIcon } from "../icons/MariaDBIcon";
import { MongoIcon } from "../icons/MongoIcon";
import { MySQLIcon } from "../icons/MySQLIcon";
import { PostgreSQLIcon } from "../icons/PostgreSQLIcon";
import { RedisIcon } from "../icons/RedisIcon";

interface LabelProps {
  name: string;
  type: DbTypes;
}

export const labelIcon = (type: DbTypes, size: number = 20) => {
  switch (type) {
    case DbTypes.Postgresql:
      return <PostgreSQLIcon className="mt-1 mr-2" size={size} />;
    case DbTypes.Mongodb:
      return <MongoIcon className="mt-1 mr-2" size={size} />;
    case DbTypes.Mysql:
      return <MySQLIcon className="mt-1 mr-2" size={size} />;
    case DbTypes.Redis:
      return <RedisIcon className="mt-1 mr-2" size={size} />;
    case DbTypes.Mariadb:
      return <MariaDBIcon className="mt-1 mr-2" size={size} />;
  }

  return <></>;
};

export const DatabaseLabel = ({ name, type }: LabelProps) => (
  <div className="flex flex-row h-6 mt-1 mb-1">
    <span>{labelIcon(type)}</span>
    <p className="text-ellipsis overflow-hidden">
      {name}
      {""}
    </p>
  </div>
);

import { DbTypes } from "../../generated/graphql";
import { MariaDBIcon } from "./MariaDBIcon";
import { MongoIcon } from "./MongoIcon";
import { MySQLIcon } from "./MySQLIcon";
import { PostgreSQLIcon } from "./PostgreSQLIcon";
import { RedisIcon } from "./RedisIcon";

interface DbIconProps {
  database: DbTypes;
  size?: number;
}

export const DbIcon = ({ database, size }: DbIconProps) => {
  switch (database) {
    case DbTypes.Postgresql:
      return <PostgreSQLIcon size={size} />;
    case DbTypes.Mongodb:
      return <MongoIcon size={size} />;
    case DbTypes.Mysql:
      return <MySQLIcon size={size} />;
    case DbTypes.Redis:
      return <RedisIcon size={size} />;
    case DbTypes.Mariadb:
      return <MariaDBIcon size={size} />;
  }

  return <></>;
};

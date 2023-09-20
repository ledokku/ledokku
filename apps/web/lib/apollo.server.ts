import { GraphQLClient } from "graphql-request";
import { SERVER_URL } from "../constants";
import { getSdk } from "../generated/graphql.server";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const client = new GraphQLClient(`${SERVER_URL}/graphql`);

export const serverClient = getSdk(client);
export const serverClientWithAuth = async () => {
  const session = await getServerSession(authOptions);
  return getSdk(client, (action) =>
    action({
      Authorization: `Bearer ${session?.accessToken}`,
    })
  );
};

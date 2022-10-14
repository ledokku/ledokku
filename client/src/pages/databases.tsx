import { Button, Table, Text } from "@nextui-org/react"
import { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { useDatabaseQuery } from "../generated/graphql"
import { DatabaseVersionBadge } from "../ui/components/DatabaseVersionBadge"

export const Databases = () => {
    const history = useHistory();
    const [page, setPage] = useState(0);
    const { data, loading } = useDatabaseQuery({
        variables: {
            page
        }
    })

    return <>
        <div className="w-full flex flex-row justify-between">
            <Text h2 className="mb-8">Bases de datos</Text>
            <Link to="/create-database">
                <Button>
                    Crear base de datos
                </Button>
            </Link>
        </div>
        <Table selectionMode="single" onSelectionChange={(key: any) => {
            const index = key.currentKey

            history.push(`database/${data?.databases.items[index].id}`)
        }}>
            <Table.Header>
                <Table.Column>Nombre</Table.Column>
                <Table.Column>Tipo</Table.Column>
                <Table.Column>Version</Table.Column>
            </Table.Header>
            <Table.Body loadingState={loading ? "loading" : "idle"}>
                {data?.databases.items.map((it, index) =>
                    <Table.Row key={index}>
                        <Table.Cell><Text b h4>{it.name}</Text></Table.Cell>
                        <Table.Cell>{it.type}</Table.Cell>
                        <Table.Cell css={{ w: "3rem" }}><DatabaseVersionBadge database={it} /></Table.Cell>
                    </Table.Row>
                ) ?? []}
            </Table.Body>
            <Table.Pagination total={data?.databases.totalPages} page={page + 1} onPageChange={setPage} rowsPerPage={10} />
        </Table>
    </>
}
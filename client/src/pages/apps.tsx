import { Button, Table, Text } from "@nextui-org/react"
import { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { useAppsQuery } from "../generated/graphql"

export const Apps = () => {
    const history = useHistory();
    const [page, setPage] = useState(0);
    const { data, loading } = useAppsQuery({
        variables: {
            page
        }
    })

    return <>
        <div className="w-full flex flex-row justify-between">
            <Text h2 className="mb-8">Aplicaciones</Text>
            <Link to="/create-app">
                <Button>
                    Crear aplicación
                </Button>
            </Link>
        </div>
        <Table selectionMode="single" onSelectionChange={(key: any) => {
            const index = key.currentKey

            history.push(`app/${data?.apps.items[index].id}`)
        }}>
            <Table.Header>
                <Table.Column>Nombre</Table.Column>
                <Table.Column>Repositorio</Table.Column>
                <Table.Column>Puertos</Table.Column>
            </Table.Header>
            <Table.Body loadingState={loading ? "loading" : "idle"}>
                {data?.apps.items.map((it, index) =>
                    <Table.Row key={index}>
                        <Table.Cell><Text b h4>{it.name}</Text></Table.Cell>
                        <Table.Cell>{it.appMetaGithub ? `${it.appMetaGithub.repoOwner}/${it.appMetaGithub.repoName}` : " "}</Table.Cell>
                        <Table.Cell>{it.ports}</Table.Cell>
                    </Table.Row>
                ) ?? []}
            </Table.Body>
            <Table.Pagination total={data?.apps.totalPages} page={page + 1} onPageChange={setPage} rowsPerPage={10} />
        </Table>
    </>
}
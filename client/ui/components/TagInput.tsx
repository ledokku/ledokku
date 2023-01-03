import { Badge, Button, Input, Loading, Text } from "@nextui-org/react";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface TagInputProps {
    tags?: string[];
    disabled?: boolean;
    loading?: boolean;
    onAdd?: (tag: string) => void;
    onRemove?: (tag: string) => void;
}

export const TagInput = ({ tags = [], onAdd, onRemove, disabled = false, loading = false }: TagInputProps) => {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | undefined>(undefined)

    return <>
        <Input
            label="Etiqueta"
            width="300px"
            value={name}
            contentLeft={loading ? <Loading size="xs" /> : undefined}
            disabled={disabled || loading}
            onChange={(e) => setName(e.currentTarget.value)}
            labelRight={
                <Button
                    size="xs"
                    disabled={disabled || loading}
                    onClick={disabled || loading ? undefined : () => {
                        const pattern = /^[a-z0-9-]+$/;
                        setError(undefined)
                        if (!pattern.test(name)) return setError(`No cumple con el patrón ${pattern}`)
                        if (tags?.includes(name) === true) return setError(`La etiqueta ${name} ya existe`)

                        onAdd?.call(undefined, name);
                        setName("")
                    }}
                    light>Agregar</Button>
            } />
        <Text color="$error">{error}</Text>
        <div className="flex gap-2 mt-4">
            {tags.map((it, index) => <Badge
                key={index}
                enableShadow
                disableOutline
                color="primary"
            >{it}<AiOutlineCloseCircle
                    className="ml-1 cursor-pointer"
                    onClick={() => {
                        onRemove?.call(undefined, it)
                    }} /></Badge>)}
        </div>
    </>
}
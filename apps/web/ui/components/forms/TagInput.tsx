import { Badge, Button, Chip, Input, Spinner } from "@nextui-org/react";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface TagInputProps {
  tags?: string[];
  disabled?: boolean;
  loading?: boolean;
  onAdd?: (tag: string) => void;
  onRemove?: (tag: string) => void;
}

export const TagInput = ({
  tags = [],
  onAdd,
  onRemove,
  disabled = false,
  loading = false,
}: TagInputProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  return (
    <div>
      <Input
        label="Etiqueta"
        width="300px"
        value={name}
        placeholder="Nombre de la etiqueta"
        startContent={loading ? <Spinner size="sm" /> : undefined}
        disabled={disabled || loading}
        onChange={(e) => setName(e.currentTarget.value)}
        errorMessage={error}
        endContent={
          <Button
            size="sm"
            color="primary"
            disabled={disabled || loading}
            onClick={
              disabled || loading
                ? undefined
                : () => {
                    const pattern = /^[a-z0-9-]+$/;
                    setError(undefined);
                    if (!pattern.test(name))
                      return setError(`No cumple con el patrón ${pattern}`);
                    if (tags?.includes(name) === true)
                      return setError(`La etiqueta ${name} ya existe`);

                    onAdd?.call(undefined, name);
                    setName("");
                  }
            }
            variant="solid"
          >
            Agregar
          </Button>
        }
      />
      <div className="flex flex-wrap gap-2 mt-2 w-[300px]">
        {tags.map((it, index) => (
          <Chip
            key={index}
            color="primary"
            isCloseable
            onClose={() => {
              onRemove?.call(undefined, it);
            }}
          >
            {it}
          </Chip>
        ))}
      </div>
    </div>
  );
};

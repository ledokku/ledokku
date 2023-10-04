import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useState } from "react";
import {
  App,
  AppByIdDocument,
  useChangeAppBranchMutation,
} from "@/generated/graphql";
import toast from "react-hot-toast";

interface BranchChangeInputProp {
  app: App;
}

export const BranchChangeInput = ({ app }: BranchChangeInputProp) => {
  const ghInfo = app.appMetaGithub;

  const [changeBranch, { loading }] = useChangeAppBranchMutation();
  const [name, setName] = useState(ghInfo?.branch ?? "");
  const [showChangeModal, setShowChangeModal] = useState(false);

  if (!ghInfo) return <></>;

  return (
    <div>
      <Modal isOpen={showChangeModal} onClose={() => setShowChangeModal(false)}>
        <ModalHeader>
          <h4>Cambiar rama</h4>
        </ModalHeader>
        <ModalBody>
          <div>
            ¿Deseas cambiar el nombre de la rama de <b>{ghInfo.branch}</b> a{" "}
            <b>{name}</b>?
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            size="sm"
            onClick={() => setShowChangeModal(false)}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={
              loading
                ? undefined
                : () => {
                    changeBranch({
                      variables: {
                        input: {
                          appId: app.id,
                          branchName: name,
                        },
                      },
                      refetchQueries: [AppByIdDocument],
                    })
                      .then((res) => {
                        setShowChangeModal(false);
                        toast.success("Rama actualizada");
                      })
                      .catch((e) => {
                        toast.error("Rama no actualizada");
                      });
                  }
            }
            isLoading={loading}
          >
            Cambiar
          </Button>
        </ModalFooter>
      </Modal>
      <Input
        placeholder="Ej. master, dev, feat"
        label="Nombre de la rama"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        width="300px"
        endContent={
          <Button
            size="sm"
            disabled={ghInfo.branch === name || !name}
            onClick={() => setShowChangeModal(true)}
            variant="solid"
            color="primary"
          >
            Cambiar
          </Button>
        }
      />
    </div>
  );
};

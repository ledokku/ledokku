"use client";

import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  Branch,
  BuildEnvVar,
  Repository,
  useBranchesLazyQuery,
  useCreateAppGithubMutation,
} from "@/generated/graphql";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import _ from "lodash";
import { useOpenEnvFile } from "@/hooks/useOpenEnvFile";
import { OpenGithubConfigurationModal } from "@/ui/components/modals/OpenGithubConfigurationModal";
import { useGithubContext } from "@/contexts/GithubContext";
import {
  Button,
  Checkbox,
  Input,
  Link,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { TagInput } from "@/ui/components/forms/TagInput";
import { FiUpload } from "react-icons/fi";
import { EnvForm } from "@/ui/components/forms/EnvForm";
import { Alert } from "@/ui/components/alerts/Alert";

interface BranchOption {
  value: Branch;
  label: string;
}

interface CreateAppGithubForm {
  name: string;
  gitRepoFullName: string;
  branchName: string;
  gitRepoId: string;
  githubInstallationId: string;
  dockerfilePath?: string;
  envVars: BuildEnvVar[];
  tags: string[];
  isDockerfileEnabled?: boolean;
}

export default function CreateAppGithub() {
  const envFile = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isOpenConfigOpen, setIsOpenConfigOpen] = useState(false);
  const { installationId, repositories, apps } = useGithubContext();

  const [createAppGithubMutation, { loading }] = useCreateAppGithubMutation();

  const {
    values,
    errors,
    setFieldValue,
    handleChange,
    resetForm,
    handleSubmit,
    isSubmitting,
  } = useFormik<CreateAppGithubForm>({
    initialValues: {
      name: "",
      gitRepoFullName: "",
      branchName: "",
      gitRepoId: "",
      githubInstallationId: "",
      dockerfilePath: "Dockerfile",
      envVars: [],
      tags: [],
      isDockerfileEnabled: false,
    },
    onSubmit: async ({ isDockerfileEnabled, ...values }) => {
      try {
        const app = await createAppGithubMutation({
          variables: {
            input: {
              ...values,
              dockerfilePath: isDockerfileEnabled
                ? values.dockerfilePath
                : undefined,
            },
          },
        });
        router.push(`/dashboard/apps/${app.data?.createAppGithub.id}/build`);
      } catch (error: any) {
        error.message === "Not Found"
          ? toast.error(`Repositorio: ${values.gitRepoFullName} no encontrado`)
          : toast.error(error.message);
      }
    },
  });

  const [getBranches, { data: branchesData, loading: branchesLoading }] =
    useBranchesLazyQuery();

  const { openEnvFile } = useOpenEnvFile({
    onRead(envVars) {
      setFieldValue("envVars", envVars);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const handleChangeRepo = (active: Repository) => {
    const name = active.name
      .split("")
      .map((it) => (/^[a-z0-9-]+$/.test(it) ? it : "-"))
      .join("");

    resetForm();
    setFieldValue("gitRepoFullName", active.fullName);
    setFieldValue("branchName", "");
    setFieldValue("gitRepoId", active.id);
    setFieldValue("name", name);
    setFieldValue("dockerfilePath", "Dockerfile");
  };

  let branchOptions: BranchOption[] = [];

  if (branchesData && !branchesLoading) {
    branchesData.branches.map((b) =>
      branchOptions.push({ value: b, label: b.name })
    );
  }

  useEffect(() => {
    if (values.gitRepoFullName.length > 0) {
      getBranches({
        variables: {
          installationId,
          repositoryName: values.gitRepoFullName,
        },
      });
    }
  }, [values.gitRepoFullName, getBranches, installationId]);

  if (repositories.length === 0)
    return (
      <>
        <OpenGithubConfigurationModal
          isOpen={isOpenConfigOpen}
          onClose={() => setIsOpenConfigOpen(false)}
        />
        <Alert
          className="mb-8"
          title="Configura los permisos de repositorios"
          type="warning"
          message="Primero necesitas configurar los permisos de los repositorios
      que te gustaria usar. Una vez completado,
      es hora de escoger el repositorio y la rama que te gustaria para crear la aplicación."
        />
        <Button onClick={() => setIsOpenConfigOpen(true)} color="primary">
          Configurar permisos
        </Button>
      </>
    );

  return (
    <>
      <OpenGithubConfigurationModal
        isOpen={isOpenConfigOpen}
        onClose={() => setIsOpenConfigOpen(false)}
      />
      <input
        type="file"
        id="file"
        ref={envFile}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) {
            openEnvFile(e.target.files);
          }
        }}
      />
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/2">
          <h2>Crear nueva aplicación de Github</h2>
          <p>
            Cuando hagas push a Git, tu aplicación va a lanzarse de nuevo
            automaticamente.
          </p>

          <div className="mt-8 flex flex-col gap-8">
            <div>
              <Select
                label="Repositorio"
                placeholder="Selecciona un repositorio"
                value={values.gitRepoId}
                onSelectionChange={(e) => {
                  const repo = repositories.find(
                    (item) => item.id === e.toString()
                  );

                  if (repo) {
                    handleChangeRepo(repo);
                  }
                }}
                errorMessage={errors.gitRepoId}
              >
                {repositories.map((repo) => (
                  <SelectItem
                    key={repo.id}
                    value={repo.id}
                    onClick={() => handleChangeRepo(repo)}
                  >
                    {repo.name}
                  </SelectItem>
                ))}
              </Select>
              <p>
                ¿No puedes ver los repositorios privados?{" "}
                <Link
                  onClick={() => setIsOpenConfigOpen(true)}
                  isExternal
                  className="cursor-pointer"
                >
                  Configura la app de Github
                </Link>
              </p>
            </div>
            <Input
              id="name"
              name="name"
              label="Nombre de la app"
              value={values.name}
              onChange={handleChange}
              fullWidth
              errorMessage={errors.name}
              isDisabled={values.gitRepoId.length === 0}
            />
            <Select
              label="Rama a lanzar"
              placeholder="Selecciona una rama"
              value={values.branchName}
              onChange={(e) => {
                setFieldValue("branchName", e.currentTarget.value);
              }}
              isLoading={branchesLoading}
              errorMessage={errors.branchName}
              isDisabled={values.gitRepoId.length === 0}
            >
              {branchOptions.map((option) => (
                <SelectItem key={option.value.name} value={option.value.name}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            <div>
              <Checkbox
                id="isDockerfileEnabled"
                name="isDockerfileEnabled"
                isDisabled={values.gitRepoId.length === 0}
                isSelected={values.isDockerfileEnabled}
                onChange={handleChange}
              >
                Usar Docker
              </Checkbox>
              {values.isDockerfileEnabled && (
                <div className="mt-2">
                  <Input
                    id="dockerfilePath"
                    name="dockerfilePath"
                    label="Directorio del archivo Dockerfile"
                    value={values.dockerfilePath}
                    onChange={handleChange}
                    isDisabled={values.gitRepoId.length === 0}
                    startContent="./"
                    fullWidth
                    errorMessage={errors.dockerfilePath}
                  />
                </div>
              )}
            </div>
            <TagInput
              tags={values.tags ?? []}
              disabled={values.gitRepoId.length === 0}
              onAdd={(tag) => {
                setFieldValue("tags", [...values.tags, tag]);
              }}
              onRemove={(tag) => {
                setFieldValue(
                  "tags",
                  values.tags.filter((it) => it !== tag)
                );
              }}
            />
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="flex justify-between">
            <h5>Variables de entorno</h5>
            <Button
              size="sm"
              color="primary"
              onClick={() => envFile.current?.click()}
              startContent={<FiUpload className="mr-2" />}
            >
              Desde archivo
            </Button>
          </div>
          <div className="mt-8 flex flex-col divide-y divide-divider">
            <EnvForm
              asBuildArg={false}
              className="mb-2"
              name=""
              value=""
              isNewVar={true}
              onSubmit={(data) => {
                const exists = values.envVars.find(
                  (it) => it.key === data.name
                );

                if (!exists) {
                  setFieldValue("envVars", [
                    ...values.envVars,
                    {
                      key: data.name.trim(),
                      value: data.value,
                      asBuildArg: data.asBuildArg,
                    },
                  ]);
                } else {
                  setFieldValue(
                    "envVars",
                    values.envVars.map((it) => {
                      if (it.key === data.name) {
                        return data;
                      } else {
                        return it;
                      }
                    })
                  );
                }
              }}
            />
            {values.envVars
              .map((envVar) => {
                return (
                  <EnvForm
                    className="py-2"
                    key={envVar.key}
                    name={envVar.key}
                    value={envVar.value}
                    asBuildArg={envVar.asBuildArg ?? false}
                    onSubmit={(data) => {
                      setFieldValue(
                        "envVars",
                        values.envVars.map((it) => {
                          if (it.key === data.name) {
                            return {
                              key: data.name,
                              value: data.value,
                              asBuildArg: data.asBuildArg,
                            };
                          } else {
                            return it;
                          }
                        })
                      );
                    }}
                    onDelete={(key) => {
                      setFieldValue(
                        "envVars",
                        values.envVars.filter((it) => it.key !== key)
                      );
                    }}
                  />
                );
              })
              .reverse()}
          </div>
        </div>
      </div>
    </>
  );
}

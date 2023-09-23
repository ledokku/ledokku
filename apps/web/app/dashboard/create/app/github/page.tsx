"use client";

import { serverClient } from "@/lib/apollo.server";
import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";

interface RepoOption {
  value: Repository;
  label: string;
}

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
  tags?: string[];
  isDockerfileEnabled?: boolean;
}

export default function CreateAppGithub() {
  const envFile = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isOpenConfigOpen, setIsOpenConfigOpen] = useState(false);
  const { installationId, repositories, apps } = useGithubContext();

  const [getBranches, { data: branchesData, loading: branchesLoading }] =
    useBranchesLazyQuery({
      fetchPolicy: "network-only",
    });
  const [createAppGithubMutation, { loading }] = useCreateAppGithubMutation();

  const formik = useFormik<CreateAppGithubForm>({
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

  const { openEnvFile } = useOpenEnvFile({
    onRead(envVars) {
      formik.setFieldValue("envVars", envVars);
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

    formik.setFieldValue("gitRepoFullName", active.fullName);
    formik.setFieldValue("branchName", "");
    formik.setFieldValue("gitRepoId", active.id);
    formik.setFieldValue("name", name);
    formik.setFieldValue("dockerfilePath", "Dockerfile");
  };

  let branchOptions: BranchOption[] = [];

  if (branchesData && !branchesLoading) {
    branchesData.branches.map((b) =>
      branchOptions.push({ value: b, label: b.name })
    );
  }

  useEffect(() => {
    if (formik.values.gitRepoFullName.length > 0) {
      getBranches({
        variables: {
          installationId,
          repositoryName: formik.values.gitRepoFullName,
        },
      });
    }
  }, [formik.values.gitRepoFullName, getBranches, installationId]);

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
      <div>
        <h2>Crear nueva aplicación de Github</h2>
        {repositories && (
          <>
            <p>
              Cuando hagas push a Git, tu aplicación va a lanzarse de nuevo
              automaticamente.
            </p>

            <div>
              <Select
                label="Repositorio"
                placeholder="Selecciona un repositorio"
                value={formik.values.gitRepoId}
                onChange={(e) => {
                  const repo = repositories.find(
                    (item) => item.id === e.currentTarget.value
                  );

                  if (repo) {
                    handleChangeRepo(repo);
                  }
                }}
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
            </div>
          </>
        )}
      </div>
    </>
  );

  //       {repos ? (
  //         <>
  //           <p>
  //             Cuando hagas push a Git, tu aplicación va a lanzarse de nuevo
  //             automaticamente.
  //           </p>

  //           <div>
  //             <div>
  //               <form onSubmit={formik.handleSubmit} className="mt-8">
  //                 <Text h5>Repositorio</Text>
  //                 <Dropdown>
  //                   <Dropdown.Button flat>
  //                     {selectedRepo?.fullName ?? "Selecciona un repositorio"}
  //                   </Dropdown.Button>
  //                   <Dropdown.Menu
  //                     color="primary"
  //                     css={{ $$dropdownMenuWidth: "auto" }}
  //                     selectionMode="single"
  //                     selectedKeys={
  //                       new Set(selectedRepo?.id ? [selectedRepo?.id] : [])
  //                     }
  //                     onAction={(key) => {
  //                       const repo = repos.find((item) => item.id === key);

  //                       if (repo) {
  //                         handleChangeRepo(repo);
  //                       }
  //                     }}
  //                   >
  //                     {repos.map((option) => (
  //                       <Dropdown.Item key={option.id}>
  //                         {option.name}
  //                       </Dropdown.Item>
  //                     ))}
  //                   </Dropdown.Menu>
  //                 </Dropdown>

  //                 <Text className="mt-1" h6>
  //                   ¿No puedes ver los repositorios privados?{" "}
  //                   <Link
  //                     onClick={() => setIsOpenConfigOpen(true)}
  //                     css={{ display: "inline" }}
  //                   >
  //                     Configura la app de Github
  //                   </Link>
  //                 </Text>
  //                 <div className="mt-8 mb-4">
  //                   <Input
  //                     label="Nombre de la app"
  //                     value={formik.values.name}
  //                     onChange={(e) => {
  //                       formik.setFieldValue(
  //                         "name",
  //                         e.currentTarget.value,
  //                         true
  //                       );
  //                     }}
  //                     disabled={formik.values.repo.id.length === 0}
  //                     fullWidth
  //                   />
  //                   <Text className="text-red-500">{formik.errors.name}</Text>
  //                 </div>
  //                 <Text h5 className="mt-8">
  //                   Rama a lanzar
  //                 </Text>
  //                 <Dropdown>
  //                   <Dropdown.Button flat disabled={!branchesData}>
  //                     {branchesLoading ? (
  //                       <Loading color="currentColor" size="sm" />
  //                     ) : selectedBranch !== "" ? (
  //                       selectedBranch
  //                     ) : (
  //                       "Selecciona una rama"
  //                     )}
  //                   </Dropdown.Button>
  //                   <Dropdown.Menu
  //                     color="primary"
  //                     css={{ $$dropdownMenuWidth: "auto" }}
  //                     selectionMode="single"
  //                     selectedKeys={
  //                       new Set(selectedBranch ? [selectedBranch] : [])
  //                     }
  //                     onAction={(key) => {
  //                       const repo = branchOptions.find(
  //                         (item) => item.value.name === key
  //                       );

  //                       if (repo) {
  //                         handleChangeBranch(repo);
  //                       }
  //                     }}
  //                   >
  //                     {branchOptions.map((option) => (
  //                       <Dropdown.Item key={option.value.name}>
  //                         {option.label}
  //                       </Dropdown.Item>
  //                     ))}
  //                   </Dropdown.Menu>
  //                 </Dropdown>
  //                 <div className="mt-8 mb-4">
  //                   <Checkbox
  //                     label="Usar Docker"
  //                     isDisabled={formik.values.repo.id.length === 0}
  //                     isSelected={isDockerfileEnabled}
  //                     onChange={(val) => setIsDockerfileEnabled(val)}
  //                   />

  //                   {isDockerfileEnabled && (
  //                     <div className="mt-2">
  //                       <Input
  //                         label="Directorio del Dockerfile"
  //                         value={formik.values.dockerfilePath}
  //                         onChange={(e) => {
  //                           formik.setFieldValue(
  //                             "dockerfilePath",
  //                             e.currentTarget.value,
  //                             true
  //                           );
  //                         }}
  //                         disabled={formik.values.repo.id.length === 0}
  //                         labelLeft="./"
  //                         fullWidth
  //                       />
  //                       <Text className="text-red-500">
  //                         {formik.errors.dockerfilePath}
  //                       </Text>
  //                     </div>
  //                   )}
  //                 </div>
  //                 <TagInput
  //                   tags={tags}
  //                   disabled={formik.values.repo.id.length === 0}
  //                   onAdd={(tag) => setTags([...tags, tag])}
  //                   onRemove={(tag) => setTags(tags.filter((it) => it !== tag))}
  //                 />
  //                 <Button
  //                   className="mt-8"
  //                   type="submit"
  //                   disabled={!selectedBranch || !selectedRepo}
  //                 >
  //                   {!loading ? (
  //                     "Crear"
  //                   ) : (
  //                     <Loading color="currentColor" type="points-opacity" />
  //                   )}
  //                 </Button>
  //               </form>
  //             </div>
  //             <Grid md xs={12}>
  //               <div className="w-full mt-8">
  //                 <div className="flex flex-row justify-between mb-4">
  //                   <Text h5>Variables de entorno</Text>
  //                   <Button
  //                     size="sm"
  //                     ghost
  //                     onClick={() => envFile.current?.click()}
  //                   >
  //                     <FaUpload className="mr-2" /> Desde archivo
  //                   </Button>
  //                 </div>
  //                 {
  //                   <div className="w-full">
  //                     <EnvForm
  //                       key="newVar"
  //                       name=""
  //                       value=""
  //                       asBuildArg={false}
  //                       isNewVar={true}
  //                       onSubmit={(data) => {
  //                         const exists = envVars.find(
  //                           (it) => it.key === data.name
  //                         );

  //                         if (!exists) {
  //                           setEnvVars([
  //                             ...envVars,
  //                             {
  //                               key: data.name,
  //                               value: data.value,
  //                               asBuildArg: data.asBuildArg,
  //                             },
  //                           ]);
  //                         } else {
  //                           setEnvVars(
  //                             envVars.map((it) => {
  //                               if (it.key === data.name) {
  //                                 return {
  //                                   key: data.name,
  //                                   value: data.value,
  //                                   asBuildArg: data.asBuildArg,
  //                                 };
  //                               } else {
  //                                 return it;
  //                               }
  //                             })
  //                           );
  //                         }
  //                       }}
  //                     />
  //                     {envVars
  //                       .map((envVar, index) => {
  //                         return (
  //                           <>
  //                             <Divider className="my-4" />
  //                             <EnvForm
  //                               key={envVar.key}
  //                               name={envVar.key}
  //                               value={envVar.value}
  //                               asBuildArg={envVar.asBuildArg ?? false}
  //                               onSubmit={(data) => {
  //                                 setEnvVars(
  //                                   envVars.map((it) => {
  //                                     if (it.key === data.name) {
  //                                       return {
  //                                         key: data.name,
  //                                         value: data.value,
  //                                         asBuildArg: data.asBuildArg,
  //                                       };
  //                                     } else {
  //                                       return it;
  //                                     }
  //                                   })
  //                                 );
  //                               }}
  //                               onDelete={(key) => {
  //                                 setEnvVars(
  //                                   envVars.filter((it) => it.key !== key)
  //                                 );
  //                               }}
  //                             />
  //                           </>
  //                         );
  //                       })
  //                       .reverse()}
  //                   </div>
  //                 }
  //               </div>
  //             </Grid>
  //           </div>
  //         </>
  //       ) : (
  //         <>
  //           <Alert
  //             className="my-8"
  //             title="Configura los permisos de repositorios"
  //             type="warning"
  //             message="Primero necesitas configurar los permisos de los repositorios
  //               que te gustaria usar. Una vez completado,
  //               es hora de escoger el repositorio y la rama que te gustaria para crear la aplicación."
  //           />
  //           <Button onClick={() => setIsOpenConfigOpen(true)}>
  //             Configurar permisos
  //           </Button>
  //         </>
  //       )}
  //     </>

  //   </AdminLayout>
  // );
}

import React from 'react';
import { useAppProxyPortsQuery } from '../../generated/graphql';

interface AppProxyPortsProps {
  appId: string;
}

export const AppProxyPorts = ({ appId }: AppProxyPortsProps) => {
  const {
    data: appProxyPortsData,
    loading: appProxyPortsLoading,
    error,
  } = useAppProxyPortsQuery({
    variables: { appId },
  });

  console.log(appProxyPortsData, error);

  return (
    <React.Fragment>
      <div className="py-5">
        <h1 className="text-md font-bold">Port Management</h1>
        <p className="text-gray-400 text-sm">
          The following ports are assigned to your app.
        </p>
      </div>

      {appProxyPortsLoading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : null}

      {appProxyPortsData && appProxyPortsData.appProxyPorts.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase">
                Scheme
              </th>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase">
                Host port
              </th>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase">
                Container port
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appProxyPortsData.appProxyPorts.map((proxyPort, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-no-wrap">
                  {proxyPort.scheme}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  {proxyPort.host}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  {proxyPort.container}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                  <button className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </React.Fragment>
  );
};

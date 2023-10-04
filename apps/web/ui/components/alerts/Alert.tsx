import { Card, CardBody, CardFooter } from "@nextui-org/react";

interface AlertProps {
  title?: string;
  message: string;
  type: "success" | "danger" | "warning" | "primary" | "secondary";
  className?: string;
  children?: React.ReactNode;
}

const staticClasses = `
    bg-success-50 text-success-800 text-success-600
    bg-danger-50 text-danger-800 text-danger-600
    bg-warning-50 text-warning-800 text-warning-600
    bg-primary-50 text-primary-800 text-primary-600
    bg-secondary-50 text-secondary-800 text-secondary-600
`;

export const Alert = ({
  message,
  title,
  type,
  className,
  children,
}: AlertProps) => {
  return (
    <>
      <div className={staticClasses} />
      <div className={`w-156 ${className}`}>
        <Card className={`bg-${type}-50`}>
          <CardBody>
            {title ? (
              <h4 className={`text-${type}-800`}>{title}</h4>
            ) : undefined}
            <p className={`text-${type}-600`}>{message}</p>
          </CardBody>
          {children && <CardFooter>{children}</CardFooter>}
        </Card>
      </div>
    </>
  );
};

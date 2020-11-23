interface IconProps {
  opacity?: number;
  size?: number;
  className?: string;
}

export const TrashBinIcon: React.FC<IconProps> = ({
  opacity,
  size = 24,
  ...props
}) => (
  <svg
    fill="none"
    viewBox={`0 0 24 24`}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    width={size}
    height={size}
    {...props}
  >
    <path
      opacity={opacity}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

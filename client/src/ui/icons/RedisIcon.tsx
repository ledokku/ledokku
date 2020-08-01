import React from 'react';

interface IconProps {
  opacity?: number;
  size?: number;
  className?: string;
}

export const RedisIcon: React.FC<IconProps> = ({
  opacity,
  size = 24,
  ...props
}) => (
  <svg width={size} height={size} viewBox={`0 0 24 24`} fill="none" {...props}>
    <path
      d="M10.5 2.66101L11.04 3.65801L9.243 4.30201L11.652 4.52001L12.4 5.76601L12.867 4.64501L14.944 4.43701L13.334 3.82401L13.76 2.80701L12.182 3.32601L10.5 2.66101ZM17.405 4.73801L13.76 6.18201L17.052 7.48001L17.405 7.33401L20.698 6.03601L17.405 4.73801ZM6.895 5.05001C6.10775 5.05001 5.35271 5.17135 4.7958 5.38736C4.23889 5.60338 3.92568 5.89639 3.925 6.20201C3.925 6.50781 4.23791 6.80107 4.79489 7.0173C5.35188 7.23353 6.10731 7.35501 6.895 7.35501C7.68269 7.35501 8.43812 7.23353 8.99511 7.0173C9.55209 6.80107 9.865 6.50781 9.865 6.20201C9.86432 5.89639 9.55111 5.60338 8.9942 5.38736C8.43729 5.17135 7.68225 5.05001 6.895 5.05001ZM24 6.80501C24 6.80501 15.017 11.083 13.605 11.758C12.379 12.319 11.704 12.319 10.344 11.852C8.318 11.022 0 7.24101 0 7.24101V8.27901C0 8.51901 0.332 8.77801 0.966 9.07901C2.243 9.69201 9.306 12.756 10.416 13.285C11.528 13.815 12.316 13.825 13.729 13.088C15.141 12.35 21.778 9.18301 23.055 8.51801C23.709 8.17601 24 7.91601 24 7.67801V6.80501ZM13.958 7.40701L8.39 8.26001L12.274 9.87001L13.958 7.40701ZM24 10.637C24 10.637 15.017 14.916 13.605 15.591C12.379 16.151 11.704 16.151 10.344 15.684C8.318 14.854 0 11.074 0 11.074V12.112C0 12.35 0.332 12.61 0.966 12.912C2.243 13.524 9.306 16.588 10.416 17.117C11.528 17.647 12.316 17.657 13.729 16.92C15.141 16.183 21.778 13.015 23.055 12.35C23.709 12.018 24 11.748 24 11.51V10.637ZM24 14.479L13.605 19.433C12.379 19.993 11.704 19.993 10.344 19.527C8.318 18.696 0 14.916 0 14.916V15.954C0 16.193 0.332 16.453 0.966 16.754C2.243 17.367 9.306 20.43 10.416 20.96C11.528 21.49 12.316 21.5 13.729 20.762C15.141 20.025 21.778 16.858 23.055 16.193C23.709 15.85 24 15.58 24 15.352V14.479Z"
      fill="currentColor"
      opacity={opacity}
    />
  </svg>
);

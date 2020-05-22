import React from 'react';

interface IconProps {
  opacity?: number;
  className?: string;
  size?: 24 | 40;
}

export const NodeIcon: React.FC<IconProps> = ({
  opacity,
  size = 24,
  ...props
}) => (
  <svg width={size} height={size} viewBox={`0 0 24 24`} fill="none" {...props}>
    <path
      d="M11.998 24C11.677 24 11.357 23.916 11.076 23.753L8.14 22.016C7.702 21.771 7.916 21.684 8.06 21.633C8.645 21.43 8.763 21.383 9.388 21.029C9.453 20.992 9.539 21.006 9.606 21.046L11.862 22.385C11.944 22.43 12.059 22.43 12.134 22.385L20.929 17.309C21.011 17.262 21.063 17.168 21.063 17.071V6.92101C21.063 6.82201 21.01 6.72901 20.926 6.67901L12.135 1.60701C12.054 1.56001 11.946 1.56001 11.864 1.60701L3.075 6.68001C2.99 6.72901 2.936 6.82501 2.936 6.92101V17.071C2.936 17.168 2.99 17.26 3.075 17.306L5.484 18.698C6.791 19.352 7.592 18.582 7.592 17.808V7.78701C7.592 7.64501 7.706 7.53401 7.848 7.53401H8.963C9.102 7.53401 9.218 7.64601 9.218 7.78701V17.808C9.218 19.553 8.268 20.553 6.614 20.553C6.106 20.553 5.705 20.553 4.588 20.002L2.28 18.675C1.71 18.346 1.358 17.73 1.358 17.071V6.92101C1.358 6.26201 1.711 5.64601 2.28 5.31801L11.075 0.236006C11.632 -0.0789941 12.371 -0.0789941 12.923 0.236006L21.717 5.31801C22.287 5.64701 22.641 6.26201 22.641 6.92101V17.071C22.641 17.73 22.287 18.344 21.717 18.675L12.923 23.753C12.643 23.916 12.324 24 11.998 24ZM19.099 13.993C19.099 12.093 17.815 11.587 15.112 11.23C12.381 10.869 12.103 10.682 12.103 10.043C12.103 9.51501 12.338 8.81001 14.361 8.81001C16.168 8.81001 16.834 9.19901 17.108 10.417C17.132 10.532 17.237 10.616 17.355 10.616H18.496C18.567 10.616 18.634 10.585 18.682 10.535C18.73 10.481 18.756 10.412 18.749 10.339C18.572 8.241 17.178 7.26301 14.361 7.26301C11.853 7.26301 10.357 8.321 10.357 10.096C10.357 12.021 11.845 12.553 14.252 12.791C17.132 13.073 17.355 13.494 17.355 14.06C17.355 15.043 16.566 15.462 14.713 15.462C12.386 15.462 11.874 14.878 11.702 13.72C11.682 13.596 11.576 13.505 11.449 13.505H10.312C10.171 13.505 10.058 13.617 10.058 13.758C10.058 15.24 10.864 17.006 14.713 17.006C17.501 17.007 19.099 15.91 19.099 13.993Z"
      fill="currentColor"
      opacity={opacity}
    />
  </svg>
);

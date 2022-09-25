import { Card, Divider, Text } from '@nextui-org/react';

export const Terminal = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
  <Card css={{ bgColor: "$black", color: "$white", maxH: 500 }}>
    <div></div>
    <Card.Header><Text h6 color='$white' className='mb-1'>Terminal</Text></Card.Header>
    <Card.Divider css={{ bgColor: "$gray800" }} />
    <Card.Body css={{ lineHeight: 1.5, fontSmooth: 'auto' }}>
      {props.children}
    </Card.Body>
  </Card>
  // <Box
  //   mt="3"
  //   p="4"
  //   boxShadow="lg"
  //   borderRadius="lg"
  //   color="gray.100"
  //   backgroundColor="gray.900"
  //   fontSize="sm"
  //   fontFamily="mono"
  //   lineHeight="1.5"
  //   style={{ WebkitFontSmoothing: 'auto' }}

  // />
);

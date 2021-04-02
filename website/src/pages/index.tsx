import React from 'react';

import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  SimpleGrid,
  ChakraProvider,
  Image,
  Grid,
  GridItem,
  Divider,
} from '@chakra-ui/react';

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <ChakraProvider>
      <Layout>
        <Container py={20} mb={20} alignContent={'center'} maxW={'4xl'}>
          <SimpleGrid
            minChildWidth={300}
            columns={[4, 2, 2, 2]}
            gap={{ md: 6, xs: 2, sm: 2 }}
            pt={4}
            as="main"
          >
            <Box>
              <Heading
                color="gray.700"
                fontWeight={'extrabold'}
                fontFamily={'sans-serif'}
                fontSize={'6xl'}
                lineHeight={'110%'}
              >
                Ledokku
              </Heading>
              <Heading
                color="grey.600"
                fontWeight={'bold'}
                fontFamily={'sans-serif'}
                fontSize={{ base: 'xl', md: 'xl', sm: 'xl', xs: 'l' }}
                lineHeight={'110%'}
                mb={6}
                px={1}
              >
                Take control of your app deployments
              </Heading>
              <Divider orientation="horizontal" />
              <SimpleGrid mb={10} gap={{ xl: 4, l: 4, sm: 4, xs: 1 }}>
                <Heading color="gray.600">Deploy from git</Heading>
                <Heading color="gray.500">Link with databases</Heading>
                <Heading color="gray.400">Open source</Heading>
                <Heading color="gray.300">Save money</Heading>
                <Heading color="gray.200">Based on Dokku</Heading>

                <SimpleGrid mt={6} columns={16}>
                  <Image h={6} w={6} src="img/js.png" />
                  <Image h={6} w={6} src="img/ruby.png" />
                  <Image h={6} w={6} src="img/golang.png" />
                  <Image h={6} w={6} src="img/python.png" />
                  <Image h={6} w={6} src="img/php.png" />
                  <Image h={6} w={6} src="img/java.png" />
                  <Image
                    h={6}
                    w={6}
                    src="https://cdn.svgporn.com/logos/scala.svg"
                  />
                  <Image
                    h={6}
                    w={6}
                    src="https://cdn.svgporn.com/logos/clojure.svg"
                  />
                </SimpleGrid>
              </SimpleGrid>
              <SimpleGrid mt={12}>
                <Link href="/docs/getting-started">
                  <Button
                    colorScheme={'white'}
                    w={'50%'}
                    bg={'gray.900'}
                    _hover={{
                      bg: 'gray.500',
                    }}
                  >
                    Get started
                  </Button>
                </Link>
              </SimpleGrid>
            </Box>
            <Box mt={6}>
              <Box w={{ md: 450, sm: 300, xs: 300 }} boxShadow="lg">
                <Image src="img/dashboardLanding.png" />
              </Box>
              <Box
                mt={-16}
                ml={6}
                mr={6}
                w={{ md: 400, sm: 250, xs: 250 }}
                boxShadow="lg"
              >
                <Image src="img/terminal.png" />
              </Box>
            </Box>
          </SimpleGrid>
        </Container>
      </Layout>
    </ChakraProvider>
  );
}

export default Home;

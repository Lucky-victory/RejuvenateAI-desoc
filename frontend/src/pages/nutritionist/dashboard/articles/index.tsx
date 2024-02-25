import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Image,
  Tr,
  ResponsiveValue,
} from '@chakra-ui/react';
import NutritionistDashBoardLayout from '../layout';
import Head from 'next/head';
import { Link } from '@chakra-ui/next-js';
import { useGetArticlesQuery } from '@/state/services';
import { removeKeyFromObject, selectObjectKeys } from '@/utils';
import { Article } from '@/types/shared';
import TableItems from '@/components/TableItems';
import isEmpty from 'just-is-empty';

export default function ArticlesDashBoard() {
  const { data, isLoading, isFetching } = useGetArticlesQuery({ s: 'all' });
  const articles = removeKeyFromObject(data?.data || ([] as Article[]), [
    'author',
  ]);
  console.log({ _data: articles });

  const tableHeadStyles = {
    // pb: 4,
    fontSize: '15px',
    fontWeight: 'medium',
    textTransform: 'uppercase' as ResponsiveValue<'capitalize'>,
    // color: '#9CA4AB',
  };
  return (
    <>
      <Head>
        <title>Dashboard | Articles</title>
      </Head>
      <NutritionistDashBoardLayout>
        <Box className='min-h-full h-full px-4 mt-6'>
          {' '}
          <Flex align={'center'} justify={'space-between'}>
            <Flex align={'center'} gap={6}>
              <Heading size={'lg'} className='text-primaryGreen'>
                Articles
              </Heading>{' '}
            </Flex>
            <Button
              as={Link}
              href={'articles/new'}
              className='bg-primaryGreen text-primaryBeige hover:bg-primaryYellowTrans hover:text-primaryGreen'
            >
              Create Post
            </Button>
          </Flex>
          {(!isLoading || !isFetching) && !articles?.length && (
            <Flex
              bg={'gray.100'}
              minH={'250px'}
              my={5}
              justify={'center'}
              align={'center'}
            >
              <Text color={'gray.500'} fontWeight={'medium'} fontSize={'xl'}>
                You don&apos;t have any articles yet.
              </Text>
            </Flex>
          )}
          {!isEmpty(articles) && (
            <Box
              my={8}
              maxW={'full'}
              minW={{ xl: '350px', base: '100%' }}
              px={5}
              py={4}
              w={{ base: 'full' }}
              flex={1}
              alignSelf={'flex-start'}
              // h={"442px"}
              border={'1px'}
              borderColor={'gray.300'}
              // rounded={'14px'}
              bg={'white'}
              //   pos={"relative/"}
            >
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr
                      h={'auto'}
                      borderBottom={'2px'}
                      borderBottomColor={'gray.100'}
                    >
                      {!isEmpty(articles) &&
                        selectObjectKeys(articles[0]).map((key, i) => {
                          return (
                            <Th key={'article-th' + key} {...tableHeadStyles}>
                              {key}
                            </Th>
                          );
                        })}

                      <Th {...tableHeadStyles} key={'article-th-actions'}>
                        Actions
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody className='files-table-body'>
                    {!isEmpty(articles) &&
                      articles.map((d, i) => (
                        <Tr key={'article-item' + d.id + i}>
                          <TableItems keyPrefix={'article'} dataItem={d} />
                          <Td>
                            <HStack>
                              <Button
                                href={'/blog/article/' + d.slug}
                                variant={'outline'}
                                as={Link}
                                size={'sm'}
                                textDecor={'none'}
                                rounded={'full'}
                              >
                                View
                              </Button>
                              <Button
                                size={'sm'}
                                href={'./articles/edit?pid=' + d.id}
                                variant={'outline'}
                                as={Link}
                                textDecor={'none'}
                                rounded={'full'}
                              >
                                Edit
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
        ;
      </NutritionistDashBoardLayout>
    </>
  );
}

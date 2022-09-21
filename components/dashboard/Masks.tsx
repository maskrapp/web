import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export const Masks = () => {
  return (
    <TableContainer>
      <Table variant="unstyled">
        <Thead>
          <Tr>
            <Th>Mask</Th>
            <Th>Email</Th>
            <Th>Messages</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>test@test.com</Td>
            <Td>lol@lol.com</Td>
            <Td>100</Td>
            <Td>
              <Button>Edit</Button>
            </Td>
          </Tr>
        </Tbody>
        <Tfoot></Tfoot>
      </Table>
    </TableContainer>
  );
};

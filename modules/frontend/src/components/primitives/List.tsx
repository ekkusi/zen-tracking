import {
  ListItem as ChakraListItem,
  UnorderedList as ChakraUnOrderedList,
  OrderedList as ChakraOrderedList,
  ListProps,
  ListItemProps,
} from "@chakra-ui/react";
import styled from "styled-components";

const ListItem = styled(ChakraListItem)``;

const ListItemDefaultProps: ListItemProps = {};

ListItem.defaultProps = ListItemDefaultProps;

export { ListItem };

const ListDefaultProps: ListProps = {};

const UnOrderedList = styled(ChakraUnOrderedList)``;

UnOrderedList.defaultProps = ListDefaultProps;

export { UnOrderedList };

const OrderedList = styled(ChakraOrderedList)``;

OrderedList.defaultProps = ListDefaultProps;

export { OrderedList };

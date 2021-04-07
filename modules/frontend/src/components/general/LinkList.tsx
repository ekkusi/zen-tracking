import { ListItemProps, ListItem, UnorderedList } from "@chakra-ui/react";
import React from "react";
import { Link, LinkProps } from "react-router-dom";
import styled from "styled-components";

type LinkListItemProps = ListItemProps & LinkProps;

const LinkListItem = (props: LinkListItemProps): JSX.Element => {
  return (
    <ListItem
      as={Link}
      display="block"
      borderRadius="10px"
      px="4"
      py="2"
      ml="0"
      mb="1"
      lineHeight="1.2"
      bg="primary.500"
      color="text.dark"
      {...props}
    />
  );
};

export { LinkListItem };

export const LinkList = styled(UnorderedList)``;

LinkList.defaultProps = {
  ml: 0,
};

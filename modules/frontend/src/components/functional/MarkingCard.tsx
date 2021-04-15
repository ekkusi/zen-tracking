import { Box, BoxProps, Flex, Tag, Text, useColorMode } from "@chakra-ui/react";
import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { motion } from "framer-motion";
import React, { useState } from "react";

import DateUtil from "../../util/DateUtil";
import LeafRating from "../general/LeafRating";
import Image from "../primitives/Image";

type MarkingCardProps = BoxProps & {
  marking: Marking;
};

const MarkingCard = ({ marking, ...rest }: MarkingCardProps): JSX.Element => {
  const { colorMode } = useColorMode();
  const [heightAnimation, setHeightAnimation] = useState<"fixed" | "showAll">(
    "fixed"
  );

  const getCommentContent = () => {
    if (marking.comment) {
      return marking.comment.length > 80 && heightAnimation === "fixed" ? (
        <>
          {marking.comment.slice(0, 80)}...{" "}
          <Text as="a" onClick={() => setHeightAnimation("showAll")}>
            Lue lisää
          </Text>
        </>
      ) : (
        marking.comment
      );
    }
    return "Ei kommenttia";
  };

  const variations = {
    fixed: {
      height: "300px",
    },
    showAll: {
      height: "auto",
    },
  };

  return (
    <Box
      as={motion.div}
      position="relative"
      borderRadius="md"
      bg="bg.light"
      boxShadow={colorMode === "light" ? "dark" : "dark-lg"}
      color="text.light"
      width={{ base: "100%", sm: "300px" }}
      overflow="hidden"
      initial="fixed"
      animate={heightAnimation}
      variants={variations}
      {...rest}
    >
      <Tag
        position="absolute"
        top="0"
        right="15px"
        borderTopRadius="0"
        py="4"
        boxShadow="dark"
        bg="primary.500"
        color="text.dark"
        fontSize="md"
      >
        {DateUtil.format(marking.date)}
      </Tag>
      <Image
        src={
          marking.photoUrl
            ? marking.photoUrl
            : "/photos/no-photo-placeholder.png"
        }
        width="100%"
        height="150px"
        borderTopLeftRadius="md"
        borderTopRightRadius="md"
        isBgImg
        borderBottom="1px solid"
        borderColor="gray.300"
      />
      <Box p="2" width="100%">
        <Flex justify="center" mb="2">
          <LeafRating
            baseId={marking.id}
            value={marking.rating}
            iconSize="2em"
            isAnimated={false}
          />
        </Flex>
        <Text color="text.light">{getCommentContent()}</Text>
      </Box>
    </Box>
  );
};

export default MarkingCard;

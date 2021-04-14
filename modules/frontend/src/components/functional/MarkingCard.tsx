import { Box, BoxProps, Text, useColorMode } from "@chakra-ui/react";
import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import React from "react";
import LeafRating from "../general/LeafRating";
import Image from "../primitives/Image";

type MarkingCardProps = BoxProps & {
  marking: Marking;
};

const MarkingCard = ({ marking, ...rest }: MarkingCardProps): JSX.Element => {
  const { colorMode } = useColorMode();
  return (
    <Box
      borderRadius="md"
      p="3"
      bg="bg.light"
      boxShadow={colorMode === "light" ? "dark" : "dark-lg"}
      color="text.light"
      width="300px"
      {...rest}
    >
      {marking.photoUrl && <Image src={marking.photoUrl} boxSize="200px" />}
      <LeafRating
        baseId={marking.id}
        value={marking.rating}
        iconSize="2em"
        isAnimated={false}
      />
      <Text color="text.light">
        {marking.comment ? marking.comment : "Ei kommenttia"}
      </Text>
    </Box>
  );
};

export default MarkingCard;

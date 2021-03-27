import {
  Flex,
  FlexProps,
  LightMode,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ButtonWithRef } from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import React from "react";
import useGlobal from "store";
import DateUtil from "util/DateUtil";
import { Link } from "react-router-dom";
import { GetChallenges_getChallenges } from "./__generated__/GetChallenges";

type ChallengeCardProps = FlexProps & {
  challenge: GetChallenges_getChallenges;
  onEdit: () => Promise<void>;
  onDelete: () => Promise<void>;
  updateChallenges: () => Promise<void>;
};

const ChallengeCard = ({
  challenge,
  onEdit,
  onDelete,
  updateChallenges,
  ...rest
}: ChallengeCardProps): JSX.Element => {
  const { colorMode } = useColorMode();

  const [activeParticipation] = useGlobal((state) => state.activeParticipation);

  return (
    <Flex
      direction="column"
      borderRadius="10px"
      boxShadow={colorMode === "light" ? "dark" : "dark-lg"}
      width={{ base: "100%", sm: "300px" }}
      height="300px"
      py="5"
      px="7"
      bg={colorMode === "light" ? "white" : "gray.50"}
      color="text.light"
      {...rest}
    >
      <LightMode>
        <Heading.H3 mb="0">{challenge.name}</Heading.H3>
        {activeParticipation?.challenge.id === challenge.id && (
          <Text as="span" color="primary.regular">
            Aktiivinen haaste
          </Text>
        )}
        <Text as="span" fontStyle="italic" mb="0">
          {challenge.startDate && challenge.endDate
            ? `${DateUtil.format(challenge.startDate)} -
            ${DateUtil.format(challenge.endDate)}`
            : "Ei päätettyä ajankohtaa"}
        </Text>
        <Text as="span" mb="3">
          Ilmoittautuneita: {challenge.participations.length}
        </Text>

        <Text fontSize="md" overflow="hidden">
          {challenge.description}
        </Text>
      </LightMode>

      <ButtonWithRef as={Link} to={`/challenges/${challenge.id}`} mt="auto">
        Lue lisää
      </ButtonWithRef>
    </Flex>
  );
};

export default ChallengeCard;

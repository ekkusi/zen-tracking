import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Fade, Flex, Text } from "@chakra-ui/react";
import { PrimaryButton } from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import React from "react";
import { Link } from "react-router-dom";
import useGlobal from "store";

const WelcomePage = (): JSX.Element => {
  const [user] = useGlobal((store) => store.currentUser);

  return (
    <Fade in>
      <Flex
        width="100%"
        direction="column"
        alignItems="center"
        pt="400px"
        transition="opacity 2s"
      >
        <Heading.H1 fontSize="6xl">Tervetuloa {user && user.name}!</Heading.H1>
        <Text fontSize="xl" mb="5">
          Käyttäjäsi on nyt luotu!
        </Text>

        <Link to="/">
          <PrimaryButton
            size="lg"
            fontSize="lg"
            fontWeight="normal"
            borderRadius="8px"
            p={[10, 7]}
            rightIcon={<ArrowForwardIcon w={8} h={8} />}
          >
            Aloita zenin kasvattaminen!
          </PrimaryButton>
        </Link>
      </Flex>
    </Fade>
  );
};

export default WelcomePage;

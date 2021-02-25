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
        height="100vh"
        justify="center"
        alignItems="center"
        transition="opacity 2s"
      >
        <Flex direction="column" alignItems="center" mb="50px">
          <Heading.H1 fontSize={{ base: "4xl", sm: "6xl" }}>
            Tervetuloa {user && user.name}!
          </Heading.H1>
          <Text fontSize={{ base: "lg", sm: "xl" }} mb={{ base: "3", sm: "5" }}>
            Käyttäjäsi on nyt luotu!
          </Text>

          <Link to="/">
            <PrimaryButton
              fontSize={{ base: "md", sm: "lg" }}
              fontWeight="normal"
              borderRadius="8px"
              p={{ base: [8, 5], sm: [10, 7] }}
              rightIcon={<ArrowForwardIcon w={8} h={8} />}
            >
              Aloita zenin kasvattaminen!
            </PrimaryButton>
          </Link>
        </Flex>
      </Flex>
    </Fade>
  );
};

export default WelcomePage;

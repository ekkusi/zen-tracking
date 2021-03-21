import { Box, Container, Text } from "@chakra-ui/react";
import { ButtonWithRef } from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const WelcomePage = (): JSX.Element => {
  // If user has visited logged in before already, show form straight away
  const [opacityValues, setOpacityValues] = useState([0, 0, 0]);
  const [animationIndex, setAnimationIndex] = useState(0);

  // Change opacity of current indexz and move to next index in opacity animations
  const changeOpacity = () => {
    const newValues = [...opacityValues];
    newValues[animationIndex] = 100;
    setOpacityValues(newValues);
    setAnimationIndex(animationIndex + 1);
  };

  useEffect(() => {
    // Animate boxes to appear in two second intervals, useEffect is automatically called again if state is changed
    // Start first animation immediately (still setTimeout to not change before first render)
    // If user has already visited login page, no need to animate
    if (animationIndex === 0) {
      setTimeout(changeOpacity, 50);
    }
    if (animationIndex < opacityValues.length) {
      setTimeout(changeOpacity, 1000);
    }
  });

  return (
    <Container maxWidth="1000px" pb="7">
      <Heading.H1
        fontSize={{ base: "4xl", md: "6xl" }}
        mt={{ base: "8", md: "10" }}
        mb={{ base: "2", md: "3" }}
        opacity={opacityValues[0]}
        transition="opacity 2s"
        textAlign={{ base: "left", sm: "center" }}
      >
        Tervehdys!
      </Heading.H1>
      <Text
        fontWeight="normal"
        opacity={opacityValues[1]}
        transition="opacity 2s"
        textAlign="justify"
        fontSize={{ base: "lg", sm: "xl" }}
        mb="6"
      >
        2020 on karisteltu ja on myös <strong>SINUN</strong> aikasi aloittaa
        elämä ilman mielen jatkuvaa sabotointia. Liity siis{" "}
        <Text as="span" fontWeight="bold" fontStyle="italic">
          Unleash your inner ZEN
        </Text>{" "}
        yhteisöön (<strong>HUOM!</strong> ei siis kultti) ja ota ensiaskeleet
        kohti kehon, mielen sekä sydämen hyvinvointia.
      </Text>
      <Box
        opacity={opacityValues[2]}
        transition="opacity 2s"
        textAlign="center"
      >
        <ButtonWithRef as={Link} to="/login" size="lg">
          Aloita tästä
        </ButtonWithRef>
      </Box>
    </Container>
  );
};

export default WelcomePage;

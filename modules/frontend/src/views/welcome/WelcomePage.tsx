import { Box, Text } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
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

  const reedSvgs = useMemo((): JSX.Element[] => {
    console.log("creating svgs");
    const svgs = [];
    const pathAmount = 100;
    const reedLength = 1000;

    for (let i = 0; i < pathAmount; i += 1) {
      const points = [];
      for (let x = 0; x < reedLength; x += 1) {
        const y = 5 + 3 * Math.sin((x + 3 * 50) / 70);
        points.push([x, y]);
      }

      const path = `M${points
        .map((p) => {
          return `${p[0]},${p[1]}`;
        })
        .join(" L")}`;

      const pathVariants = {
        hidden: {
          x: 0,
        },
        visible: {
          x: -reedLength / 2,
        },
      };

      const { clientWidth } = document.documentElement;

      svgs.push(
        <Box
          as="svg"
          key={i}
          position="absolute"
          transform="rotate(90deg)"
          width={{ base: "300px", md: "500px" }}
          height="10px"
          left={{
            base: -150 + (clientWidth / pathAmount) * i,
            sm: -250 + (clientWidth / pathAmount) * i,
          }}
          bottom={{
            base: -150 + Math.random() * 100,
            md: -100 + Math.random() * 150,
          }}
        >
          <motion.path
            stroke="black"
            strokeWidth="2px"
            strokeLinecap="round"
            fill="none"
            d={path}
            initial="hidden"
            animate="visible"
            variants={pathVariants}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
            }}
          />
        </Box>
      );
    }
    return svgs;
  }, []);

  return (
    <Box
      m="0"
      position="relative"
      width="100%"
      height="100vh"
      overflow="hidden"
      background="linear-gradient(180deg, #a40606 0%, #d98324 74%)"
    >
      <Box
        as={motion.svg}
        width="calc(100% + 5px)"
        position="absolute"
        bottom="0"
        left="-5px"
        preserveAspectRatio="none"
        viewBox="0 0 890 100"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
      >
        <motion.path
          d="m1,127c0,-1 0,-3 0,-7c0,-4 -0.48055,-6.03873 0,-9c0.50654,-3.12144 1,-5 1,-7c0,-1 0,-2 0,-4c0,-1 0,-2 0,-3c0,-1 0,-2 0,-3c0,-2 1,-2 1,-3c0,-1 0,-2 0,-3c0,-1 0,-2 0,-3c0,-1 0,-2 0,-3c0,-1 0,-2 0,-3c0,-1 0,-2 0,-3c0,-1 0,-2 0,-3c0,-1 0,-2 0,-3c0,-2 0,-3 0,-4c0,-1 0.29289,-1.29289 1,-2c0.70711,-0.70711 0.4588,-1.69344 1,-3c0.38268,-0.92388 -0.38268,-2.07612 0,-3c0.5412,-1.30656 1.07612,-1.61732 2,-2c2.61313,-1.08239 1.29289,-3.29289 2,-4c0.70711,-0.70711 1.29289,-0.29289 2,-1c0.70711,-0.70711 0.61732,-1.07612 1,-2c0.5412,-1.30656 1.29289,-2.29289 2,-3c0.70711,-0.70711 1.29289,-0.29289 2,-1c1.41421,-1.41422 1.29289,-1.29289 2,-2c0.70711,-0.70711 1,-1 1,-2c0,-1 0,-2 1,-2c1,0 2,0 3,0c1,0 1.29289,-0.29289 2,-1c0.70711,-0.70711 1,-1 3,-1c1,0 0.29289,-1.29289 1,-2c0.70711,-0.70711 1.29289,-0.29289 2,-1c0.70711,-0.70711 2.07612,0.38268 3,0c1.30656,-0.54119 1.29289,-1.29289 2,-2c0.70711,-0.70711 3,0 4,0c1,0 2,0 4,0c1,0 2.29289,-0.70711 3,0c0.70711,0.70711 3,1 5,1c2,0 5,0 6,0c4,0 9,0 13,0c6,0 8.29289,-0.70711 9,0c0.70711,0.70711 1.07612,1.61732 2,2c1.30656,0.54119 2.4588,0.69344 3,2c0.38268,0.92388 0.85273,1.1731 2,2c1.814,1.30745 3.61732,1.07612 4,2c0.5412,1.30656 2.03873,1.51945 5,2c6.24289,1.01308 10.38062,4.44352 16,6c3.85486,1.06773 8.58578,0.58578 10,2c0.70711,0.70711 1,1 2,1c1,0 2.0535,0.54049 4,1c2.17625,0.51374 7.9258,2.49755 13,3c10.94647,1.08391 24,0 31,0c2,0 3,0 4,0c1,0 2,0 3,0c2,0 3.95107,-1.28711 9,-2c11.92332,-1.68352 26,-1 29,-1c3,0 3.29289,-0.29289 4,-1c0.70711,-0.70711 0.58578,-0.58578 2,-2c0.70711,-0.70711 1.88496,-0.27431 4,-1c4.82303,-1.65482 9.12476,-1.42472 15,-3c8.25252,-2.21267 12.15224,-3.23463 14,-4c1.30655,-0.54119 2,-1 3,-1c1,0 2,0 3,0c2,0 9.99689,-0.03822 22,-1c12.99673,-1.0414 24,-1 25,-1c1,0 2,0 3,0c2,0 2.97897,1.06541 6,2c6.9549,2.1516 13.10699,1.08099 17,2c4.35251,1.02748 6,3 7,3c1,0 2,0 2,1c0,1 -0.47214,2.76393 4,5c1.78885,0.89443 9,3 14,5c5,2 7.82376,2.48626 10,3c0.97324,0.22975 1.186,0.69255 3,2c1.14728,0.8269 2.38074,0.52221 5,3c3.63226,3.43607 8.92224,4.38926 18,6c14.89999,2.64383 23,4 28,4c1,0 2.29291,-0.70711 3,0c0.70709,0.70711 2.01022,1.75256 5,2c6.06204,0.50171 12.00885,1.53948 24,2c13.02881,0.50037 20.90778,1.49622 25,2c0.99249,0.12218 1.29291,0.29289 2,1c0.70709,0.70711 2,0 3,0c1,0 4,0 11,0c11,0 29,0 41,0c7,0 8,0 9,0c1,0 2.0058,0.18641 5,0c8.04669,-0.50097 18.01843,-1.81483 29,-3c8.01569,-0.86508 14,-1 15,-1c1,0 1.07611,-0.61732 2,-1c1.30658,-0.5412 1.88495,-2.27431 4,-3c4.823,-1.65482 10.02417,-2.83738 24,-5c6.01123,-0.93018 12.21167,-0.71412 15,-3c1.09369,-0.8966 2.69342,-2.45881 4,-3c1.84778,-0.76537 7.82428,-2.44878 15,-5c6.8595,-2.43877 19.31854,-2.2213 25,-5c3.23889,-1.5841 3.29291,-2.29289 4,-3c0.70709,-0.70711 1.69342,-0.45881 3,-1c3.6955,-1.53074 11.13794,-1.35135 22,-4c13.21429,-3.22222 16.87854,-5.49346 20,-6c0.98706,-0.16018 3,0 5,0c6,0 13.9585,-1.49923 23,-2c3.9939,-0.2212 5,-1 6,-1c1,0 2,0 3,0c1,0 7,0 9,0c5,0 8.29291,-0.70711 9,0c0.70709,0.70711 0.69342,1.45881 2,2c0.92389,0.38268 1.07611,0.61732 2,1c1.30658,0.54119 2.07611,0.61732 3,1c1.30658,0.54119 2.07611,0.61732 3,1c1.30658,0.54119 1.82373,1.48626 4,2c1.94647,0.45951 3,1 4,1c1,0 1,1 2,1c1,0 2.14935,0.47427 3,1c1.9021,1.17557 2.07611,1.61732 3,2c2.6131,1.08239 8.04486,3.5911 19,5c12.06616,1.55178 17.07611,2.61732 18,3c1.30658,0.54119 1.29291,1.29289 2,2c0.70709,0.70711 2,0 4,0c2,0 3,0 5,0c3,0 4,0 6,0c1,0 3,0 5,0c2,0 4,0 5,0c1,0 2,0 3,0c1,0 2,0 3,0c2,0 3,0 5,0c2,0 3,0 5,0c1,0 3,-1 5,-1c1,0 2,0 3,0c1,0 2.29291,-0.70711 3,0c0.70709,0.70711 1.29291,0.29289 2,1c0.70709,0.70711 1,1 1,2c0,1 2.29291,0.29289 3,1c0.70709,0.70711 0,2 0,3c0,1 0,2 0,3c0,1 0,2 0,3c0,1 -0.38269,2.07612 0,3c0.5412,1.30656 1,2 1,3c0,1 1,1 1,2c0,1 0.4588,1.69344 1,3c0.38269,0.92388 0,2 0,3c0,1 -0.38269,2.07612 0,3c0.5412,1.30656 1,2 1,3c0,1 0,2 0,3c0,1 0,2 0,3c0,1 0,2 0,4c0,1 0,2 0,3c0,1 0.29291,1.29289 1,2c0.70709,0.70711 1,2 1,3c0,1 -0.70709,3.29289 0,4c0.70709,0.70711 1,1 1,2c0,1 0,2 0,3c0,2 1,3 1,5l0,1l0,1l0,1"
          id="svg_1"
          width="100%"
          height="100%"
          opacity="undefined"
          stroke="#000"
          fill="black"
        />
      </Box>
      <Heading.H1
        position="absolute"
        top={{ base: "50px", md: "300px" }}
        left="0"
        right="0"
        textAlign="center"
        verticalAlign="middle"
        fontFamily="Amatic SC"
        fontSize={{ base: "40px", md: "60px" }}
        color="#0f0f0f"
      >
        Tervetuloa zenin kasvattamisen pariin, senkin nilviäinen!
      </Heading.H1>
      <Text
        as={Link}
        to="/login"
        size="lg"
        color="white"
        fontFamily="Amatic SC"
        fontSize={{ base: "50px", md: "65px" }}
        position="absolute"
        top={{ base: "250px", md: "375px" }}
        left="50%"
        transform="translateX(-50%)"
      >
        Aloita
      </Text>
      {reedSvgs.map((it) => it)}
    </Box>
  );
};

export default WelcomePage;

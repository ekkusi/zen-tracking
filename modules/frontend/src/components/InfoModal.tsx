import { ListItem, OrderedList, Text } from "@chakra-ui/react";
import React from "react";
import ModalTemplate, { ModalTemplateProps } from "./general/ModalTemplate";
import Heading from "./primitives/Heading";

type InfoModalProps = Omit<
  ModalTemplateProps,
  "isOpen" | "onClose" | "children"
> & {
  isOpen: boolean;
  onClose: () => void;
};

const InfoModal = (props: InfoModalProps): JSX.Element => {
  return (
    <ModalTemplate hasHeader={false} {...props}>
      <>
        <Heading.H1 mb="2">Tervehdys!</Heading.H1>
        <Text>
          Tervetuloa seurailemmaan haasteesi kulkua, mikä ikinä se onkaan!
        </Text>
        <Text>
          Zen-tracking on vielä hyvin pitkälti kehitysvaiheessa. Tämän takia
          sovellus saattaa olla eri näköinen tänään kuin mitä se on huomenna ja
          sovelluksen ominaisuudet saattavat vaihtua hyvinkin ripeään tahtiin.
          Lisäilen silti tuottamiani koodinpätkiä pitkälti suoraan tähän
          live-versioon, jotta sinä pääset testailemaan uusia kivoja jutskia:)
        </Text>
        <Text>Tämä tuo pöydälle kaksi asiaa:</Text>
        <OrderedList mb="3">
          <ListItem>Sovelluksessa voi esiintyä bugeja:(</ListItem>
          <ListItem>
            Mikään ei ole kovin kiveen hakattua ja toiminnallisuudet hakevat
            vielä paikkojaan.
          </ListItem>
        </OrderedList>
        <Text>
          Mikäli siis huomaat Zen-trackingia käyttäessäsi joitakin bugeja tai
          mieleesi tulee mitä tahansa kehitysideoita, otan nämä erittäin
          mielelläni vastaan! Zen-trackingin piirit ovat <i>vielä</i> melko
          pienet, joten sinun äänesi on sen tulevaisuuden kannalta hyvinkin
          arvokas:)
        </Text>
        <Text mb="4">
          Näitä ehdotuksia/bugi-ilmotuksia otan vastaan alta löytyvään
          sähköpostiosoitteeseen!
        </Text>
        <Text mb="0">Puss och kram,</Text>
        <Text mb="0">Ekeukko, Founder and Master of Code of Zen-tracking.</Text>
        <Text fontStyle="italic">ekku.eki@gmail.com</Text>
      </>
    </ModalTemplate>
  );
};

export default InfoModal;

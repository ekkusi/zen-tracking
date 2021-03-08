import { Text } from "@chakra-ui/react";
import React from "react";
import ModalTemplate, { ModalTemplateProps } from "./general/ModalTemplate";
import Heading from "./primitives/Heading";

type InstructionsModalProps = Omit<ModalTemplateProps, "children">;

const InstructionsModal = (props: InstructionsModalProps): JSX.Element => {
  return (
    <ModalTemplate
      openButtonLabel="Ohjeita"
      openButtonProps={{ mb: { base: "2", sm: "0" } }}
      headerLabel="Ohjeita"
      closeButtonLabel="Sulje ohjeet"
      {...props}
    >
      <>
        <Text>
          Kun olet mielestäsi onnistunut suorittamaan haasteen kyseisen päivän
          osalta, merkkaa alta päivä suoritetuksi ja saat suorituksen
          kasvattamaan putkeasi!
        </Text>
        <Text>
          Voit lisätä halutessasi kommentin päivän suorituksesta, päivän
          fiiliksistä tai mistä vaan! Näiden kommenttien pohjalta voit
          esimerkiksi reflektoida haastetta jälkeenpäin, kun muisti on alkanut
          yksittäisten päivien osalta hämärtyä.
        </Text>
        <Text>
          Mikäli et ole piilottanut tietojasi muilta käyttäjiltä kirjautuessasi
          sisään ensimmäistä kertaa, näkyvät nämä kommentit muille samaista
          haastetta suorittaville käyttäjille. Tällä tavoin voi kaikki haluavat
          suorittaa haastetta yhdessä ja katsoa, kuinka muilla sujuu samaisen
          haasteen eteneminen!
        </Text>
        <Heading.H3 fontWeight="bold">
          Merkkausten muokkaus jälkikäteen
        </Heading.H3>
        <Text>
          Merkattuasi ensimmäisen suorituksen voit muokata jo tekemiäsi
          merkkauksia painamalla kalenterista jotakin päivää, jolloin
          muokkausikkuna aukeaa. Jos päivällä on jo merkkaus, voit tästä
          ikkunasta joko muokata merkkauksen tietoja tai poistaa merkkauksen.
          Jos avatulla päivällä ei ole vielä merkkausta, voit tästä lisätä
          merkkauksen jälkikäteen, mikäli et edellisinä päivinä sitä ehtinyt
          tekemään. Etukäteen et kuitenkaan tulevia päiviä voi merkata, koska
          tarkoituksena on merkkailla suorituksia vasta niiden toteuduttua:)
        </Text>
      </>
    </ModalTemplate>
  );
};

export default InstructionsModal;

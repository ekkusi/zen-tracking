import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React from "react";
import ModalTemplate, { ModalTemplateProps } from "../general/ModalTemplate";
import Heading from "../primitives/Heading";

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
      <Tabs>
        <TabList>
          <Tab>Haasteet</Tab>
          <Tab>Suorituksen merkkaus</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Text>
              Merkkauksia lisätäksesi tulee sinun ensin olla liittynyt johonkin
              haasteeseen ja valinnut tämä haaste aktiiviseksi. Jos tämä on
              ensimmäinen kertasi sovelluksessa, voit aloittaa joko liittymällä
              jo olemassa olevaan haasteeseen tai luomalla omasi. Alle ohjeet
              molempiin.
            </Text>
            <Heading.H2>Haasteet liittyminen</Heading.H2>
            <Text>
              Navigoinnista löytyvästä Haasteet-linkistä pääset selaamaan
              haasteita. Täältä löydät kaikki muiden tekemät julkiset haasteet.
              Avaamalla haasteen koko sivun <i>Lue lisää</i> -painikkeesta näet
              sen tarkemman kuvauksen ja muut tiedot, kuten siihen jo liittyneet
              henkilöt.
            </Text>
            <Text>
              Jos jokin haaste näyttää kiinnostavalta, voit samaiselta sivulta
              liittyä haasteeseen ja aloittaa heti merkailemaan! Kun
              ilmoittaudut ensimmäistä kertaa haasteeseen, pitäisi tästä
              automaattisesti tulla <i>aktiivinen haasteesi</i>.
            </Text>
            <Heading.H2>Aktiivinen haaste</Heading.H2>
            <Text fontStyle="italic">Mikä aktiivinen haaste?</Text>
            <Text>
              Aina merkkaillessasi suoritusta etusivulta, siirtyy merkkaukset
              aktiiviseen haasteeseesi. Mikäli haluat vaihtaa merkkauksen
              menemään eri haasteeseen, valitse vain joko etusivulta tai{" "}
              <i>Omat jutskat</i> osiosta eri aktiivinen haaste.
            </Text>
            <Text>
              Huom! Aktiivinen haaste voi olla vain käynnissä oleva haaste.
              Mikäli haluamasi haaste ei näy aktiivisen haasteen valinnassa, on
              haaste joko vanhentunut tai et vielä ole ilmoittautunut kyseiseen
              haasteeseen.
            </Text>
            <Heading.H2>Haasteen luominen</Heading.H2>
            <Text>
              Ainahan ei tietysti voi löytyä valmiita haasteita, jotka
              miellyttäisivät kaikkia. Voit tällöin tehdä omaan haasteen, joka
              voi olla aivan mitä vain, vaikka raamatun lukemisesta 30 päivässä
              Ultra Maratonin suorittamiseen.
            </Text>
            <Text>
              Uuden haasteen pääset luomaan Haasteet-sivulta löytyvästä +
              painikkeesta.
            </Text>
            <Heading.H2>Haasteen kentät</Heading.H2>
            <Text>* - pakolliset kentät</Text>
            <Heading.H3>* Nimi</Heading.H3>
            <Text>Lyhyt ja ytimekäs nimi haasteelle</Text>
            <Heading.H3>* Kuvaus</Heading.H3>
            <Text>
              Tarkoituksena kuvata, mikä on haasteen tarkoitus. Tähän voit
              sanaseppäillä niin paljon tai niin vähän kuin haluat. Kuvaavampi
              haaste on tietysti suuremmalla todennäköisyydellä houkuttelevampi
              muille liittyä:)
            </Text>
            <Heading.H3>Päivämäärä</Heading.H3>
            <Text>
              Milloin haaste tulee toteutumaan. Aikaväli. Voi kestää päivän tai
              3 vuotta.
            </Text>
            <Text>
              Mikäli et vielä ole varma, milloin haluat haasteen toteuttaa, ei
              päivämäärää ole pakko asettaa. Tällöin haasteesta tulee{" "}
              <i>ehdotus</i>, jonka päivämäärän voit tarkentaa vasta myöhemmin.
            </Text>
            <Heading.H3>Yksityisyys</Heading.H3>
            <Text>
              Haluatko, että haaste on julkinen vai vain omassa tiedossasi? Jos
              haluat pitää haasteen henkilökohtaisena, ruksi tämä
              valintalaatikko lopusta.
            </Text>
          </TabPanel>
          <TabPanel>
            <Text>
              Kun olet mielestäsi onnistunut suorittamaan haasteen kyseisen
              päivän osalta, merkkaa kyseiselle päivälle suoritus. Voit tehdä
              tämän joko etusivulta tai koko suorituksen seurannasta. Jos olet
              liittynyt haasteeseen ja valinnut sen aktiiviseksi (
              <i>ks. Haasteet-osio</i>), voit merkata päivän osalta etusivulta
              tai koko suorituksen sivulta.
            </Text>
            <Heading.H2>Merkkauksen kentät</Heading.H2>
            <Text>* = pakolliset kentät</Text>
            <Heading.H3>* Fiilikset</Heading.H3>
            <Text>
              Päivän fiilikset, asteikolla 1-5. Voipi olla joko haasteen
              suorituksen osalta tai koko päivästä yleisesti.
            </Text>
            <Heading.H3>Kommentti</Heading.H3>
            <Text>
              Vapaavalintainen kommentti suorituksesta. Jos suoritat pidempää
              haastetta, voi nämä toimia mahtavana haasteen jälkipuinnin tukena,
              kun muisti on jo alkanut tehdä temppujaan alkupään suoritusten
              osalta!
            </Text>
            <Heading.H3>Päivän kuva</Heading.H3>
            <Text>
              Kuten Michelangelolla oli tapana sanoa: kuva kertoo enemmän kuin
              tuhat sanaa. Ota siis päivän suorituksesta kuva muistuttulemaan
              haasteen onnen tai tuskan hetkistä!
            </Text>
            <Heading.H3>Yksityisyys</Heading.H3>
            <Text>
              Haluatko pitää kyseisen merkkauksen vain omana tietonasi? Ruksi
              tämän mukaan viimeinen valintalaatikko.
            </Text>
            <Text>
              Jos haasteesi on yksityinen, ovat merkkauksesi yksityisiä
              automaattisesti
            </Text>
            <Heading.H2>
              Merkkauksien muokkaus ja jälkeenpäin lisääminen
            </Heading.H2>
            <Text>
              Ainahan ei reippaimmallakaan kalenterinpitäjälläkään pysy
              päiväkirja yllä joka päivä, eikä tarvitse tässäkään pysyä. Pääset
              lisäilemään vanhoja merkkauksia siirtymällä koko haasteen
              suorituksen seurantaan/muokkaukseen.
            </Text>
            <Text>
              Tähän pääset helpoiten seuraamalla etusivulta koko suorituksen
              seurantaan vievää linkkiä. Jos linkki ei täältä löydy, pääset
              tarkastelemaan suorituksia tarkemmin navigoinnista löytyvästä{" "}
              <i>Omat justskat</i> -linkistä. Täältä löydät ilmoittautumisesi ja
              pääset siirtymään niiden tarkempaan tarkasteluun sekä
              muokkailemaan merkkailujasi.
            </Text>
            <Text>
              Uusia merkkauksia vanhoille päiville voit lisätä klikkaamalla
              kyseiseltä sivulta löytyvän kalenterin jotakin päivää. Tästä
              aukeaa uuden merkkauksen lisäämisen ikkuna kyseiselle päivälle.
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ModalTemplate>
  );
};

export default InstructionsModal;

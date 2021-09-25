--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2 (Ubuntu 13.2-1.pgdg20.04+1)

-- Started on 2021-08-25 00:00:02 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Marking" DROP CONSTRAINT IF EXISTS "Marking_participation_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Challenge" DROP CONSTRAINT IF EXISTS "Challenge_creator_name_fkey";
ALTER TABLE IF EXISTS ONLY public."ChallengeParticipation" DROP CONSTRAINT IF EXISTS "ChallengeParticipation_user_name_fkey";
ALTER TABLE IF EXISTS ONLY public."ChallengeParticipation" DROP CONSTRAINT IF EXISTS "ChallengeParticipation_challenge_id_fkey";
ALTER TABLE IF EXISTS ONLY public."ChallengeParticipation" DROP CONSTRAINT IF EXISTS user_challenge_uniq;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_email_key";
ALTER TABLE IF EXISTS ONLY public."Marking" DROP CONSTRAINT IF EXISTS "Marking_pkey";
ALTER TABLE IF EXISTS ONLY public."Challenge" DROP CONSTRAINT IF EXISTS "Challenge_pkey";
ALTER TABLE IF EXISTS ONLY public."Challenge" DROP CONSTRAINT IF EXISTS "Challenge_name_key";
ALTER TABLE IF EXISTS ONLY public."ChallengeParticipation" DROP CONSTRAINT IF EXISTS "ChallengeParticipation_pkey";
ALTER TABLE IF EXISTS ONLY public."ChallengeParticipation" DROP CONSTRAINT IF EXISTS "ChallengeParticipation_challenge_id_user_name_key";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Quote";
DROP TABLE IF EXISTS public."Marking";
DROP TABLE IF EXISTS public."ChallengeParticipation";
DROP TABLE IF EXISTS public."Challenge";
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS citext;
--
-- TOC entry 2 (class 3079 OID 16811)
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- TOC entry 3096 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- TOC entry 3 (class 3079 OID 16916)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3097 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 16927)
-- Name: Challenge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Challenge" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(254) NOT NULL,
    description text NOT NULL,
    creator_name character varying(254) NOT NULL,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    is_private boolean DEFAULT true NOT NULL,
    CONSTRAINT "Challenge_check" CHECK ((start_date <= end_date))
);


--
-- TOC entry 203 (class 1259 OID 16936)
-- Name: ChallengeParticipation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChallengeParticipation" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    challenge_id uuid NOT NULL,
    user_name character varying(254) NOT NULL,
    is_private boolean DEFAULT true NOT NULL
);


--
-- TOC entry 204 (class 1259 OID 16941)
-- Name: Marking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Marking" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_name character varying(254),
    comment character varying(2000),
    participation_id uuid NOT NULL,
    photo_url character varying(254),
    rating integer NOT NULL,
    is_private boolean DEFAULT true NOT NULL,
    CONSTRAINT check_rating_constraint CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- TOC entry 205 (class 1259 OID 16951)
-- Name: Quote; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Quote" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quote character varying(254) NOT NULL
);


--
-- TOC entry 206 (class 1259 OID 16955)
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    name character varying(254) NOT NULL,
    password character varying(254) NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    email public.citext,
    is_email_verified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    finished_and_checked_challenges uuid[] DEFAULT ARRAY[]::uuid[] NOT NULL
);


--
-- TOC entry 3086 (class 0 OID 16927)
-- Dependencies: 202
-- Data for Name: Challenge; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Challenge" (id, name, description, creator_name, start_date, end_date, is_private) FROM stdin;
ad0e17b2-e4d6-4dc8-aa07-6ceace2fbebf	NO_PARTICIPATION_MARKINGS_HOLDER	Haaste, jonka tarkoituksena on sisällyttää tyhjät merkkaukset, eli merkkaukset joilla ei ole haastetta. Käytetään vain virheen estona, ei oikeana haasteena.	ekeukko	\N	\N	f
8dc5b9fb-8118-4fc2-b5a2-2d6bbf81deb2	Käpöttelyä ja myöhästelemättömyyttä!	Joka päivä käyvään käpöttelemässä ulkona. Voipi olla juosten tai kävellen, aamulla tai illalla, ihan fiiliksen mukkaan! Tämän lisäks \npitäis vielä olla koko kuu myöhästelemättä.	ekeukko	2021-03-01 00:00:00+00	2021-03-31 00:00:00+00	f
df9f2845-791c-4c38-818c-e3cafb9bf172	Laulu ja kitaransoitto	Laulun ja kitaransoiton harjoittelu 15 min/päivä. 	Sippi	2021-03-01 00:00:00+00	2021-03-31 00:00:00+00	f
d08b9f99-859d-4407-9557-a11b37519bf5	Keskittyminen 10min	Paikoillaan olo ja aivojen tyhjennys, niin että keskittyy esim hengittämiseen 10min.	Päivänsäde63	2021-03-01 00:00:00+00	2021-03-31 00:00:00+00	f
01b13575-3590-4000-b2f2-9e66ce56f7cb	Kakkapissipyllypieru	Pisua ja kakkaa	Lohkaremies	2021-02-25 00:00:00+00	2021-03-16 00:00:00+00	f
bb086405-088f-42ab-82d8-9df061b78d2e	Katso uutiset joka päivä	Huomaatko kysyväsi muilta, "niin siis mitä nyt on tapahtunut?", "Mikä arktinen politiikka?", "siis onko täällä joku pandemia käynnissä?" On aika sivistyä! https://areena.yle.fi/tv/ohjelmat/uutiset-ja-ajankohtaiset	Tipi	2021-03-20 00:00:00+00	2021-04-18 00:00:00+00	f
d6d5e254-585d-4a62-9c09-c8904ad79035	Sometusta joka päivä	Voi perkele:|	ekeukko	2021-04-01 00:00:00+00	2021-04-30 00:00:00+00	f
83c068bd-ff93-4d56-81da-8790e7f447fc	Someloma	Somet pois ja katse kohti kaikkea muuta ku ruutua. Koko kk aikana korkeintaan 8h Youtubea, Facebook sallittu koneella vaan jos siellä on jotain tarpeellista, Instagramissa saapi käydä tasan kerran. Lisäks vielä vois pyrkiä soittamaan mahollisimman paljon viestien sijaan. 	aquamies	2021-04-01 00:00:00+00	2021-04-30 00:00:00+00	f
205b626c-1651-46b8-9778-792d97f4ffcf	Urheilua 5x viikossa	Kevyempää tai raskaampaa liikuntaa vähintään 5 päivänä viikossa. Vappuviikolla saa palata sohvan tai pallotuolin pohjalle laiskistumaan!	Tipi	2021-04-05 00:00:00+00	2021-04-25 00:00:00+00	f
7aac371f-aaac-4767-8c07-7b33c1d20c8e	Lue runo päivässä	Vapaavalintainen runo, jonka voi lukea hiljaa mielessään tai lausua ääneen. Lukemisen jälkeen pieni pohdinta koskettiko runo itseä jotenkin.	Päivänsäde63	2021-04-06 00:00:00+00	2021-04-30 00:00:00+00	f
802c9ff3-141b-426f-b806-bc0d495e724d	Miks kukaan vois ikinä ajatella näin?	Ota joka päivä selvää jostain aiheesta, jonka kanssa oot eri mieltä, josta et oo kiinnostunu tai johon et omassa arjessa todennäkösesti tulis muuten törmäämään. Hyvällä tsägällä (ja todennäkösesti) opit paljon uutta oman kuplan ulkopuolelta :-)	rajuerkki	2021-06-20 00:00:00+00	2021-07-20 00:00:00+00	f
bb9a69f0-343d-4790-a903-afb845a58318	(syötä joku self-love termi tähän...)	Ole ylpeä itestäs joka päivä:) Kato peiliin ja hymyile ja sano jottain kivvaa itestäs.\n\nTietysti voit tänne tulla ja myös kirjottaa sen alas.	ekeukko	\N	\N	f
31f5641a-5bba-4dc4-b4e5-3c306eb9facb	Testaile uutta	Hyppää kiikkubäkkäri, kirjota päiväkirjaa, käy kuviokelluntatunnilla tai vaikka kuuntele uus jännä piisi. Tesuttele jotakin uutta joka päivä.	ekeukko	\N	\N	f
df6a33ed-bf8b-4b74-a1f2-366cec050c6d	Kehu kaveria	Nimi kertoo ytimen. Jaa rakkautta<3\n\nOnko tämä luonnotonta ja kömpelöä tehdä haasteen muodossa? On. Mutta voi se silti olla ihan kivvaa. Kaverin ei tarvii tietää haasteesta:)	ekeukko	\N	\N	f
d4bb42ae-5825-44b7-8f36-ed2feef762b8	Raakavegaaniutta	Kuihdu ja kärsi tai puhdistu ja kukoista. Syö pelkästään kypsyttämättömiä vekkaanisia asioita. Inspiraatiota ruokavaihtoehdoista tarjoaa esimerkiksi vauva.fi: https://www.vauva.fi/keskustelu/3501308/raakavegaaneja-antaisitteko-muutaman-paivan-esimerkkiruokia.	ekeukko	\N	\N	f
906d837e-91ee-423c-8bf8-a3727f0d7168	Budjettipihistely	Ole oman elämäsi Roope-setä ja elä senteillä. Se, tarkoittaako tämä pelkästään mäkkärin roskisruoilla (ei roskaruoilla) elämistä vai nettishoppailun pientä rajoittamista, on sinun itsesi päätettävissä, mutta tarkoituksena elää sopivissa mittakaavassa säästeliäästi.	ekeukko	\N	\N	f
b6ba36d7-ebbe-4fc2-bc13-c0cfdd32c236	Toukokuun tuulahdus sivistystä	Lueleskelutuokio päivittäin. Itse valitun x ajan tai y sivun verran. Villasukat jalkaan, kynttilä tulille, teekuppi ja kirja käteen ja menoks!	ekeukko	2021-05-03 00:00:00+00	2021-05-31 00:00:00+00	f
00bb7b69-4936-4d48-866c-2abe3624b1d0	bootcamp 🥴🥵	35:n päivän ajan urheilua joka päivä joko kevyemmin tai raskaammin.	annukka	2021-04-24 00:00:00+00	2021-05-28 00:00:00+00	f
64512bfd-5e5a-454f-beaf-95549cd930c8	Karkiton kaksviikkonen	On aika vapautua sokerin pauloista hetkeksi ja kokea maailma aivan uudella tavalla.	Tipi	2021-05-17 00:00:00+00	2021-05-30 00:00:00+00	f
5b4843e8-e812-41ff-b018-14aa2a7fe18e	Älä osta mitään uutta	Tuliko törsättyä mekkoihin ja muuhun kesäiseen, kun helle yllätti? Shoppailu seis! Seuraavan kuukauden ajan ostaa saa vain käytettyä tavaraa ja välttämättömiä tarvikkeita. Ja tottakai ruokaa. 	Tipi	2021-05-17 00:00:00+00	2021-06-17 00:00:00+00	f
f04c55a3-41c4-472b-bbe7-9127932455c2	Serenaadien soittelua	Yks uus biisi päivässä!	ekeukko	2021-06-02 00:00:00+00	2021-06-30 00:00:00+00	f
\.


--
-- TOC entry 3087 (class 0 OID 16936)
-- Dependencies: 203
-- Data for Name: ChallengeParticipation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ChallengeParticipation" (id, challenge_id, user_name, is_private) FROM stdin;
3ebe0a89-3fe9-4196-8697-3f253d3da53a	ad0e17b2-e4d6-4dc8-aa07-6ceace2fbebf	joku	f
56614b8f-a1ac-4cf7-9353-1bd885f5fad7	ad0e17b2-e4d6-4dc8-aa07-6ceace2fbebf	awodijadio	f
bab6b5af-a607-4293-9d0a-3ece3a3a7b72	ad0e17b2-e4d6-4dc8-aa07-6ceace2fbebf	juhevalt	f
1a8efd7f-e1b5-4bdb-94ab-a296ae8fe5e1	ad0e17b2-e4d6-4dc8-aa07-6ceace2fbebf	eke	f
c50d3745-3b2e-4173-a8f8-e0de1c7ba672	ad0e17b2-e4d6-4dc8-aa07-6ceace2fbebf	asdasdawdawd	f
e4c6d1a8-8526-4e7a-95b4-753d9e8ddeb2	ad0e17b2-e4d6-4dc8-aa07-6ceace2fbebf	Lassi	f
bc0ab1e8-3f1c-4908-9008-40c225062866	ad0e17b2-e4d6-4dc8-aa07-6ceace2fbebf	testi3	f
3a440ba1-d9dc-4913-82ad-84e40f7ee1dd	ad0e17b2-e4d6-4dc8-aa07-6ceace2fbebf	testi4	f
24c48705-13e7-436f-8f33-cecfcdf7982f	8dc5b9fb-8118-4fc2-b5a2-2d6bbf81deb2	ekeukko	f
88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	d08b9f99-859d-4407-9557-a11b37519bf5	Päivänsäde63	f
0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	df9f2845-791c-4c38-818c-e3cafb9bf172	Sippi	f
868b86e2-434b-4b7c-8c11-8e81ef5de99f	01b13575-3590-4000-b2f2-9e66ce56f7cb	Lohkaremies	f
7638b206-d8a9-4896-bdcc-27eb3b0d1b55	8dc5b9fb-8118-4fc2-b5a2-2d6bbf81deb2	aquamies	f
c14a8559-2bce-41ba-99ee-63f54cbdd252	bb086405-088f-42ab-82d8-9df061b78d2e	Tipi	f
f589274e-756d-4429-a1b5-f8d1b1c662e3	bb086405-088f-42ab-82d8-9df061b78d2e	Päivänsäde63	f
75f8fa9b-75e3-4da0-8008-1bb19aed8440	83c068bd-ff93-4d56-81da-8790e7f447fc	aquamies	f
2fe35c10-0c40-42a8-96cd-5178fb09f2b5	d6d5e254-585d-4a62-9c09-c8904ad79035	ekeukko	f
e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	205b626c-1651-46b8-9778-792d97f4ffcf	Tipi	f
a27ca96b-1eb6-4746-9189-626a5d2d4024	205b626c-1651-46b8-9778-792d97f4ffcf	Lohkaremies	f
54b954fd-f804-443c-971a-bc4ddbe34887	205b626c-1651-46b8-9778-792d97f4ffcf	aquamies	f
6e5e01c1-dd39-4493-ae92-b7e794392c4d	7aac371f-aaac-4767-8c07-7b33c1d20c8e	Päivänsäde63	f
bc811337-8f99-42f5-9661-15b7d5963aa1	00bb7b69-4936-4d48-866c-2abe3624b1d0	annukka	f
b24cae35-fe28-4356-bd99-693d7f5c07f1	d08b9f99-859d-4407-9557-a11b37519bf5	sinppa	f
b6925dde-6de7-46fa-b32b-542da1ca8c2d	bb9a69f0-343d-4790-a903-afb845a58318	Päivänsäde63	f
d9ce7ea1-c808-4fcd-a306-8f756f2785b1	b6ba36d7-ebbe-4fc2-bc13-c0cfdd32c236	ekeukko	f
c88aab17-9f41-4e13-9a62-2209567946e1	b6ba36d7-ebbe-4fc2-bc13-c0cfdd32c236	aquamies	f
effd4904-d0cd-46b0-a338-862844632111	64512bfd-5e5a-454f-beaf-95549cd930c8	Tipi	f
8cb3be66-7255-493b-96d1-7fd3c5f3b206	5b4843e8-e812-41ff-b018-14aa2a7fe18e	Tipi	f
19757979-66a4-4b3a-a8d3-0bff4b08b0bc	f04c55a3-41c4-472b-bbe7-9127932455c2	ekeukko	f
ca19c8b2-8c7b-4063-a2fa-187a374b5dae	802c9ff3-141b-426f-b806-bc0d495e724d	rajuerkki	f
\.


--
-- TOC entry 3088 (class 0 OID 16941)
-- Dependencies: 204
-- Data for Name: Marking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Marking" (id, date, user_name, comment, participation_id, photo_url, rating, is_private) FROM stdin;
be5baa22-4934-4765-a4ed-1010d4985869	2021-03-27 10:00:00+00	\N	Aamulenkkiä! Meinasin aamulla gonahtaa näihin aamurutiineihin. Ongelmana on se, että vituttaa nousta sängystä ylös. kun ajattelee, että pitäisi tehdä sitä rutiinia. Vähän huonolla jalalla nousee, jos ei tee mieli nousta ollenkaan, koska on liian ärsyttävä haaste sille aamulle.\n\nSe on sitten vähän ristiriitanen, kun kuitenkin niiden aamurutiinien jälkeen voi olla vaan parempi olo. Kyllähän se nytkin oli kiva, kun oli jo lenkillä käynyt. Mutta ei oo kiva herätä silleen, että ei tee mieli nousta. Pitää siis ainakin muitakin haasteita testata, kun vaan aamurutiinihaasteita!	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	2	t
215d099c-4c3e-4668-b613-c126cf73be8b	2021-03-28 20:09:53+00	\N		24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/fb1c58d9-7582-4cf9-ba62-65b78abfb8a8-image.jpg	3	t
d1eca674-1f09-4601-b4e0-a2f6ebb8ec7d	2021-03-30 05:48:55+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	f
25d0ad09-74a1-4bc3-a405-35f750322fbf	2021-03-28 10:00:00+00	\N	Lehtisaareen pannukahvireffeille ja käppäilyä mielettömässä kelissä ympäriinsä metissä, oli hyvä päivä:3	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	5	f
ff0be933-3e8d-469e-9807-cbf7d74ab312	2021-03-29 09:00:00+00	\N	Käväsin fyssarilla aamusta ja sitte Kortepohjassa ja siinäpä tuli jo muutama kilsa käppäiltyä!	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
05e08181-d17a-4c9e-92c4-3ddde97c174e	2021-03-27 10:00:00+00	\N	Saikkosen kanssa Viitaniemessä ja muualla, oli mukavaa taas reippailla seurassa:)	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
17a11b7d-89b5-4ba5-a249-af781dbf513a	2021-03-30 09:00:00+00	\N	Käpystelin mä aamusta maalailemaan ja sitte taas ihanassa paisteessa pikkusen Harjun lenkin kautta kotio:)	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	2	f
897e35dc-81be-4648-b248-ea61b9f8e102	2021-03-31 09:00:00+00	\N	Miksun synttäreiden kunniaks kaninkololle ja Ekemestariukon kanssa kottii, oli kivoja tähtiä✨	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
77f39750-5f0c-4709-b4fa-996240086894	2021-04-02 09:00:00+00	\N	Kyllä sitä pyyhkäsee instaa ettimään useempaanki otteeseen... mutta muutoin ihan mukava päivä, opiskelun jälkeen lähinnä kuuntelin podcastia tubesta ja jossain vaiheessa myös hukkasin puhelimen neljäks tunniks kokonaan	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
8fe4d5e6-b1a6-410e-aa89-f18e278a7080	2021-04-03 09:00:00+00	\N	Pääsiäisretki kämppisten kanssa, päiväunet, lasagnea, pashaa ja korttipelejä. Tässä kommuunissa on hyvä:3 Eikä somettomuus haitannu laisinkaan	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	5	f
e92efa1d-d8db-4ca6-9ef0-8a5a49ccbfc1	2021-04-04 09:00:00+00	\N	Pikku kiipeilysessari mökkikivellä + kuntopiirichallenge, hyvä setti! 	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/3f10ddd6-b192-46c8-b3c0-b8c598ef77b3-IMG_20210404_150353.jpg	4	f
131f4ace-6139-4e16-b4f5-5509b446a418	2021-04-14 09:00:00+00	\N	Ulukokiipiäminen keljonkankaalla	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/a861980a-cd1d-45a3-82f0-bbab36e2a12a-IMG_20210413_204410.jpg	3	f
0909537e-46f8-404b-9157-e7c194ecf618	2021-04-05 09:00:00+00	\N	Kova kiipeilysessari eken, rassen ja julian kaa! 	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/4cdea7a0-7885-433e-9b0d-abd9ecfc9792-IMG_20210405_160739.jpg	4	f
3c355b6e-7098-40c0-a782-6f86d66d910b	2021-04-06 09:00:00+00	\N	30min pikareeni alakerran salilla. Aivan virkistävä setti! 	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/daa55617-f55c-4cfd-b877-65e3b2f76101-16177366950503069253772139031516.jpg	3	f
4c8b8d0d-418c-4adc-8332-9fdee8714a0c	2021-04-07 20:55:29+00	\N	Porrastreeni jonkun luolastaan poistuneen koodarinörtin kanssa! 	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	4	f
79d4c089-1b44-41f0-a7cc-a915bced174d	2021-04-08 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	f
bc874a4e-3112-4e49-9c0a-d729aa0928f9	2021-04-08 09:00:00+00	\N	Vitsi kun tekis mieli uppoutua. Eikä edes sen takia että haluisin nähä jotain tiettyä, mutta se on vaan jotenki kivaa välillä olla passiivinen ja kuluttaa aikaa niin. Mikä taas on aika kaameeta kun enemmän miettii, miks mä haluaisin olla omassa elämässäni passiivinen? Eihän se edes oikeesti rentouta tai palauta. Selasin sitte jotain blogeja hetken, en tiiä onko se huijaamista mutta ei kai, koska instagram se pahin on, minkä takia en enää edes lue blogeja kun niihin ei jää aikaa😅 Mutta tänään on ollu tosi hyvä mieli, jotenki selkeempi entisestään. Lie sitten valo vai somettomuus vai seura vai eteenpäin meneminen elämässä. Kivaa kuitenkin. Lounasta Miksun Hennin ja Annukan kanssa, sitte pitkä kävelylenkki Ellan kanssa pitkästä aikaa kaksin ja vitsin hyviä oivalluksia! Kivaa	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	2	f
0e2d59b2-6727-44e2-819f-a7c44e33d6dd	2021-04-09 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
0dca227d-46c9-41ce-ae27-9f2076ef5c94	2021-04-10 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
819da399-980e-4f35-8100-be633e42634e	2021-04-11 09:00:00+00	\N	Thaikkutreenit 	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	5	f
bded09a1-c78e-4ab3-9938-ee037b4dda4f	2021-04-11 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	f
32edfb3d-bd66-4e08-b3c1-bd25de239bfe	2021-04-12 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	f
a7c0b967-859b-4bca-9141-3684807aca88	2021-04-12 09:00:00+00	\N	Iltakiipiäminen, hapotti vähä liikaa	a27ca96b-1eb6-4746-9189-626a5d2d4024	\N	2	f
382ac73d-9f05-4dca-b554-915c780fb4e2	2021-04-14 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	f
ff6c6b64-6f49-4db0-80c1-45102490ce34	2021-04-14 09:00:00+00	\N	Löytyi hyvä tsemppiruno	6e5e01c1-dd39-4493-ae92-b7e794392c4d	\N	4	f
3aa46322-e8dd-42bd-bf89-70c749c7a84a	2021-04-12 09:00:00+00	\N	Portaita bestttt	54b954fd-f804-443c-971a-bc4ddbe34887	\N	5	f
906928d3-cf54-4d73-8fca-bb8296aa62c9	2021-04-14 09:00:00+00	\N	Jumppaa kellarissa	54b954fd-f804-443c-971a-bc4ddbe34887	\N	3	f
538935fc-75be-40c0-8634-caa0c18349fd	2021-04-14 09:00:00+00	\N	Luentopäivinä tekis mieli harhautella. Illalla stimpan vappustartti ja kivoja tyyppejä	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
a5933383-7e67-499c-8848-861289aa855c	2021-04-15 09:00:00+00	\N	Pienen lehmän aarre runo. Lempeä.	6e5e01c1-dd39-4493-ae92-b7e794392c4d	\N	4	f
2abee03c-7d9e-40d4-b92f-a0d06d38d644	2021-04-16 09:00:00+00	\N	Aamupäivän kellarijumppa	54b954fd-f804-443c-971a-bc4ddbe34887	\N	4	f
368b6006-84bb-4c26-a335-3f271427cde3	2021-04-16 09:00:00+00	\N	Juoksu	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	2	f
c149c8ab-8f1f-4bb9-91b8-5c4da6c10803	2021-03-20 08:36:11+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	f
44d8e548-b96f-44f0-b49d-eabc17261427	2021-04-17 09:00:00+00	\N	Porrastreeni	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	5	f
06a95c7c-e45d-438a-9266-3e42bc015c33	2021-04-16 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	f
601e1ead-229b-4011-9f4c-6687a21de5ce	2021-04-17 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
96bc8d92-570b-41a5-964f-7e4e3a1ff4a5	2021-03-09 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
87890430-f2f6-48b2-be13-8a8ef55dd59b	2021-03-10 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
aa3f61bd-b704-414a-bb8f-a8465cf6ef90	2021-03-11 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
42cc31b4-d2fc-4e2e-bf16-171bb28cc593	2021-04-10 18:25:02+00	\N	Hyvin neutraali. Vähän pakkopulla turhan tuntune video laneilta. Ei kummempata!	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/cc1e93b7-75f2-49d6-800b-d1c4789d3316-7D2F7007-E4DD-4BBC-8AC4-47F245599CED.png	3	f
7be55f7f-b844-42f6-a072-b11f0651556c	2021-04-16 09:00:00+00	\N	Taidekuvatesti seminaarimäen hengailuista:) Ei taas mitenkään erityinen, mutta tuli ainaki ign filttereitäkin testattua!	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/d35ccb3e-1a02-42ad-b57e-cd2187be5add-AD9A55FD-76A7-4492-A3A2-DFE4AF71F562.jpeg	3	f
dc173e8c-45ba-421d-8989-41922ac34458	2021-03-21 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
74964469-3416-45c4-8169-1fed58c807e9	2021-03-22 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
cb895478-e902-46f4-bb82-354f32008e66	2021-03-23 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
63f7b73d-38ef-40af-81f0-e766f3030136	2021-03-24 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
b144772e-8520-4368-82e5-8ceb9d7a9205	2021-03-25 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
f66b7292-a8f0-495f-a0aa-dbb7684b45a1	2021-03-26 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
006a1b9f-9af1-4ae5-a2eb-23bff3f7d763	2021-03-27 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
aed7aaef-59cd-42c8-afaa-880b03b5d310	2021-03-27 10:00:00+00	\N		88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	2	t
8360ba25-1b21-404d-98f7-709ee3dbcd8c	2021-03-26 10:00:00+00	\N		88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	t
a95f61ef-a9c2-415c-9e20-0ec9e6eaec9d	2021-03-28 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
e7609a12-7ed1-4367-9d4a-4702510cce29	2021-03-29 09:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
24a76499-79f2-40d4-95be-bc06ef5dcf0e	2021-03-12 10:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	t
6feaba23-d61a-4a8b-b91e-16327fdfe30d	2021-03-30 09:00:00+00	\N		24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
29047e49-c9e3-47cd-9e3a-b569dab67941	2021-04-01 12:50:44+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
ea894572-4e9f-45cf-bd69-307d894beee0	2021-04-04 18:10:00+00	\N	Päivittelin heti aamulla, mutta ei saaaakeli ku mennee energiaa tähän touhuun. Oikeesti on ehkä 70% ajasta jollain tavalla ajatuksissa joko A. mitä postaa huomenna tai myöhemmin tai kehtaisko postata sitä tätä tuota tai B. mitähän nyt kaikki oli mieltä tämän päivän postauksesta. Vielä vaikeempaa tästä tekee se, etten hyväksy noita ajatuksia niin mennee vielä enemmän energiaa kun taistelen vastaan. Sitten kuitenkin toisaalta kun on hyvä mieli, niin tää voi olla ihan kivvaa ja jopa oottaa, että pääsee postailemmaan jottain ja kaikki tuntuu hyvin kivoilta ajatuksilta. Mutta sitten taas vuoristoradan toisessa päässä himoahistukset. En tiiä onko parempi seiffata ja postata tuommosta läppäjuttua vai tehä jottai oikeeta.	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/10a1f1b5-5a7f-408e-b503-3777ecf54bf9-18081663-F45C-4146-9034-626FAF7FCEE0.jpeg	2	f
a55895d2-13b6-4b7f-b8be-5f5f9e9052c3	2021-04-04 09:00:00+00	\N	Täytin sometyhjiöni opiskelulla ja melkein 8h palapeliprokkiksella itse määästerin Ekeukon kotikolossa	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
7bc6a307-b21b-4024-8912-814aa7ea5293	2021-04-05 09:00:00+00	\N	Kivaa ku opiskelu jopa sujuu, ja iltapäivän voi kahvitella ja pelailla ja kattoa dokkaria kämppisten kanssa:3 Vaikka vähän olikin somea ikävä tännää	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
783ba0f4-cdc2-46ea-bc11-bf1462f5c8bd	2021-04-06 09:56:52+00	\N	Ensimmäinen runo kertoi luomisesta. Tämän haaste vaatii keskittymistä, ettei suorita tai että ajatukset lähtee muualle. Randomilla Runoja Sinulle kirjasta	6e5e01c1-dd39-4493-ae92-b7e794392c4d	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/a08619cb-88fe-462c-9604-1a84cc226c7e-16177029872858547703727951572755.jpg	3	f
c6b7a6d9-8347-4ec9-8a76-2886671a8de1	2021-04-06 09:00:00+00	\N	Opiskelutauot on hankalia ku on tottunu käyttämään ne puhelimen pläräämiseen. Mutta ei niissä ongelmaa oo sit kun vaan laskee puhelimen takas pöydälle ja toteaa että jotain muuta	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
da362f41-0949-473e-8ea8-c6e4563b7f54	2021-04-06 09:00:00+00	\N	Aamujooga	54b954fd-f804-443c-971a-bc4ddbe34887	\N	3	f
5a859889-92db-4932-a9d4-a8e3bfacaaae	2021-04-07 09:00:00+00	\N	Aamulla ois kyllä some uponnu, mutta sen sijaan kuuntelin sentään edes äänikirjaa ja podcastia (ja saatoin pelata Mario kartia, seki pitäis ehkä bänniä...). Muutoin oliki sit helppoa kun gradu rullas ja illalla tuijotin tohkeissani neljä tuntia Justice Leaguea kolon väen kanssa	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	2	f
6a840628-d983-4e3b-8078-e428ee28d401	2021-04-07 05:36:24+00	\N	Jumppailin abouttiarallaa tunnin, missä on kaikki voima reisistäni?	54b954fd-f804-443c-971a-bc4ddbe34887	\N	3	f
e3d09346-dfa7-4ef8-ac3b-1995217eb4f5	2021-04-07 09:00:00+00	\N	Iltakiipiäminen as usually	a27ca96b-1eb6-4746-9189-626a5d2d4024	\N	4	f
3c3f64f3-8580-4459-9019-48a9c0f264fe	2021-04-09 09:00:00+00	\N	Rojektointi päivä	a27ca96b-1eb6-4746-9189-626a5d2d4024	\N	5	f
d42700ff-7717-4068-9b2f-59698873bb20	2021-04-10 09:00:00+00	\N	E-urheilua, kai se lasketaan? 	a27ca96b-1eb6-4746-9189-626a5d2d4024	\N	5	f
8059499a-b53e-4f7c-9c5c-94fdd13c79ba	2021-04-10 09:00:00+00	\N	Thainyrkkeily privatunti	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/d0a5abc0-9895-46a2-b867-894f6467900d-184693.jpg	5	f
c7139932-f92f-4005-9971-577d1b7da501	2021-04-12 09:00:00+00	\N	Etsimällä löytyi hieno runo	6e5e01c1-dd39-4493-ae92-b7e794392c4d	\N	5	f
3eedb3ad-adb1-4b1d-9fe6-854a9e36a4b5	2021-04-13 09:00:00+00	\N	Sinä runo	6e5e01c1-dd39-4493-ae92-b7e794392c4d	\N	3	f
27ac973e-4c6f-4b94-ba47-d2c2f1e01ef2	2021-03-17 10:00:00+00	\N	Rentouttava sessio	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
9d5cdecf-fb85-4b05-aa78-20deea87b180	2021-03-27 19:35:40+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	t
00667d74-f8b1-4f09-9eab-6f65a7784759	2021-02-25 10:00:00+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
b5548b6f-d43a-4594-903e-fa90d78526d5	2021-03-01 21:00:16.325947+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
797b5923-10c9-4f4b-ad97-396d09d863c6	2021-04-07 09:00:00+00	\N	En ajatellu paljoo yhtää ja olin tyytyväine päivän kuvvaa:) tähä asti nyt on kolme päivää tosi paljo helpottanu! Ei jotenki vaa jaksa ennää miettiä, että mitähä muut miettii. Varmaa vaihtuu vielä, mutta iha mukavaa!	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/c2652106-292a-42f7-8811-2aed540ee15c-EE7912F9-BDF6-49F0-A420-834EBA5C642D.jpeg	5	f
61944608-b283-4c77-9d71-3748c7fa737c	2021-03-29 20:12:11+00	\N	Lenkki! Juoksin melkee tuokkarille ja takas. Aamurutiinit on rankkoja. Vaikee, ku pitäs lähtee kävelemmää, mutta ei anna ihtesä vaan kävellä vaan pitäs juosta. Sitten ei tee mieli juosta, koska se on hapokasta. Sitten ei oikeen jaksas nousta ylös, kun pittää lähtee juoksemmaa. Mikähän aamurutiini toimis semmosena, että sitä vois tehä mielellään? Kinkkisiä nää aamurutiinit,  kun on hyvästä, että niitä on, mutta perkaleen vaikee väkisin mittään suorittaa heti aamulla.\n\nEi oo hyvä ruveta suorittammaan heti aamulla! Nytki lenkin jälkeen ku asettu vaan sohvalle juomaan kahvia ja kahteli espanjan luentoo nii oli perkaleen mukavaa vaan olla ja tehä! Sitä ennen meinas hapottaa ja tuntu, että kaikkee vaan pittää tehä. Pitäskö se olla aamurutiinina oikeesti vaan, että ottaa kahvia ja kahtoo Youtubee? Ei lenkkiä, ei venyttelyä, ei lukemista, ei meditointia. Kun vaan makkoilua. Kahtelee sitten tunnin päästä uudestaan. Vois olla potentiaalia!	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	2	t
54d84a03-daee-4290-9229-1e4451770275	2021-03-31 05:44:45+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	f
30086898-c3e6-4ecd-bb8f-e2c69e714d3b	2021-04-01 09:00:00+00	\N	Oli niin paljon tekemistä, ettei oikeastaan vaikeuksia. Oli myös jotenki helpottunu olo, ettei voi selailla puhelinta ja voi keskittyä omaan elämäänsä oikiasti. 	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	4	f
914a4152-c708-4203-9fed-79f426cbd64a	2021-03-30 09:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
92c39e10-809c-4d2c-8d8d-5003097a255b	2021-03-31 09:00:00+00	\N		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
60140ce6-ddf6-4303-ab82-7e2a5ed3bd6e	2021-04-05 15:40:32+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
0573c764-113a-4fef-b109-c30f6b9d31bf	2021-04-04 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	f
297ada2b-4579-4f57-b0e8-24aa509f9785	2021-04-05 15:41:54+00	\N	Kotitreeni lihaskunto 20min	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	3	f
93b61bd2-bf62-4354-8845-da20a3bdebeb	2021-04-06 07:32:19+00	\N	Aamuinen porrastreeni	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/de1c4a7a-ba5e-43e9-82c8-8cc78bb3b9bd-IMG_20210406_094322.jpg	5	f
e4a531b1-0d32-4a85-8af9-06999f11b7c2	2021-04-06 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	f
35f0e618-d123-4ad6-b379-230964e244ef	2021-04-07 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	f
3719309a-b75a-4dfc-9784-9c393289f2e9	2021-04-08 07:42:18+00	\N	Aamuinen juoksulenkki 5km	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/bccb147f-a09e-4e9f-a246-0553dd611fd0-IMG_20210408_101918.jpg	4	f
1bd1d908-c630-439b-94a8-c65e75396695	2021-04-08 09:00:00+00	\N	Runo ei nyt oikein avautunut, ehkä on ollut sopivassa mielentilassa ( väsynyt ekan uuden työn aloituksen jälkeen)	6e5e01c1-dd39-4493-ae92-b7e794392c4d	\N	3	f
eb296e17-be25-4d4c-9ead-f50cc68fd594	2021-04-08 09:00:00+00	\N	Piiitkä kävelylenkki Ellan kanssa:—)	54b954fd-f804-443c-971a-bc4ddbe34887	\N	3	f
4022c8e5-d383-4944-b636-0601c890a718	2021-04-10 09:00:00+00	\N	Eino Leinoa, mutta tarviis ehkä jotain uudempaa...	6e5e01c1-dd39-4493-ae92-b7e794392c4d	\N	2	f
86dc80ee-fcea-49b7-81c2-717ea6513663	2021-04-11 09:00:00+00	\N	10 000 kg salichallenge, 10 000 kiloo pitää nostaa yhteensä, kaikki liikkeet kelpaa! 	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/94b83f6f-73d1-4602-a847-b1f295d38675-16181679495926339678558130882975.jpg	5	f
7035e961-3002-4398-a256-9bae14dc5767	2021-04-13 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	1	f
d862874d-732b-494f-a734-f41e311124e0	2021-04-13 09:00:00+00	\N	Juoksulenkki 4,8km	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	3	f
3fcfaea4-7821-4c0d-b1da-a9856cbc891b	2021-04-14 09:00:00+00	\N	Thaikkureenit	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	5	f
a3308cea-b748-4d2a-a74a-7f1670fbdf70	2021-04-15 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
1a6cba68-2454-4947-a86d-1e1757a9dd12	2021-04-15 09:00:00+00	\N	Himajooga	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	3	f
97dd0b7e-a835-4726-b04a-201370f57b46	2021-04-13 09:00:00+00	\N	Jooga + pikku salireeni	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/3ac91664-4f29-408c-bce0-ece1e0c6e62d-IMG_20210413_213644.jpg	3	f
6f5e4eae-9903-4d8d-ad5e-fb1d07633434	2021-04-16 09:00:00+00	\N	Kiipeilyäkiipeilyä	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/857af295-8e0f-4e13-8c62-a043f6e22a08-IMG_20210416_164546.jpg	4	f
5eb2b064-0646-4caf-bb4c-6fbc9b6aa6a6	2021-04-16 09:00:00+00	\N	Jouduin käymään instagramissa tarkistamassa aikataulua ja se tuntu tavallaan houkuttelevalta lähteä klikkailemaan kaikkea, ja tavallaan oli helpottavaa ettei niin tarvinnu tehä koska sitä kontenttia ois ollut varmasti p a l j o n	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	4	f
3db36757-0a0b-4b84-95a2-a8be6a243869	2021-04-15 09:00:00+00	\N	Ku on seuraa (tänään koriskentällä) ni ei oo lainkaan vaikeeta olla puhelimesta kaukana, mutta luentojen tauot, ne nyt taas yllätti tänäänkin. Tai ei se lopulta oo vaikeeta mut yllättää että ne ois niitä vaikeimpia vaikkei hirveen vaikeita oiskaan XD ja kyllä se Mario Kart myös nyt jäi päivittäiseen tekemiseen, pirun lanit kun koukutti entisestään. Mietin myös että pitäiskö katkasta vikaks pariks viikoks melkeinpä kaikki paitsi whatsapp🧐 vois olla jännittävää	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	4	f
aaab5c18-75e8-459a-a05a-d557e7f6ebba	2021-03-19 10:00:00+00	\N	Kesken kuului whatsappin ääni, niin vähän häiriintyi	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	https://zen-tracking.s3.amazonaws.com/marking-images/73a52d0c-cbe5-4491-8089-4eccd5d5bf7a-20210319_153945.jpg	2	f
13166c60-e60d-4a7e-998f-c2d5027cd133	2021-03-15 10:00:00+00	\N	Hyvä sessio	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
6a2e97de-5f84-4cc3-9509-c4e4985bb3f7	2021-03-14 10:00:00+00	\N		88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
6420b94f-e020-4c10-8a99-a52fa7134aa6	2021-03-16 10:00:00+00	\N	Tänään laskin hengityksiä, se toimi hyvin	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
4357d370-e6b2-40e5-b27c-820339b2a917	2021-03-16 21:58:11+00	\N	Nörttäys lähtee käsistä:D pittää tasapainotella vähän, että mitenkä paljon muut ajattellee, että oon kakkaa seuraa, kun nörttään ja mitenkä paljon vaan tekkee mieli nörtätä:| mutta nyt aivot sumussa 4 tunnin herokudebuggauksien jälkeen kuvan voi lisätä ja tässä kuva yhdestä jokailtasista AlmaMikaEke-Rukalla lenkeistä!\n\nÄlytön tähtitaivas kello 23:55 lenkillä!! Ei tosin revontulia:( opin että tähenlento on meteoroidi, eli meteoriitti, joka ei oo tullu maahan	24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/63f4c8d0-a888-4663-8b74-4b7a5964901d-image.jpg	3	f
82ac7804-a880-48d8-b7b5-5afaa45a5cf2	2021-03-05 10:00:00+00	ekeukko	Housekahviaaa!	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
b180c876-ad1d-4763-9277-2f2bb7e127f4	2021-03-01 16:18:23.94795+00	Päivänsäde63	Ensimmäinen 10min paikallaan olo ja yritys olla ajattelematta ("meditaatio?"). Mukava kokemus, mutta ei oo helppoa pistää aivoja zero tilaan.	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
50466a86-8154-46d4-a4cb-4eecebfd8c55	2021-04-12 09:00:00+00	\N	Vähän turha. Tyhmältä vähän tuntuu väkisin jotai laittaa, mutta tulipahan huastettua ja laitettua. Eipähän juuri ahistakkaa! Ihan hauska miten ei kiinnosta yhtään paljoa, mitä postailee:)	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/564a7e7e-0036-403d-971b-dc9ddd17099c-9BEC3338-9934-4780-9D32-B9ECBB5974AD.jpeg	3	f
bbef7483-728e-41a1-bf57-852da31554a6	2021-04-13 09:00:00+00	\N	Hmm, vähän turha taas. Ei kovin sydämenläheinen päivitys. Mutta kai näitä tämmösiäkin on pakko olla, kun joka päivä päivittää väkisin. Juuuuu.	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/5112fc95-6938-4c2c-9e70-fd2610a11260-54CA3600-94E4-4B84-B353-E9700A33D769.jpeg	2	f
0163bdef-a296-44dc-86ef-ca602bef5377	2021-03-12 10:00:00+00	ekeukko	Tulipahan lenkiteltyä juoksenneltua, mutta oli kyllä hapokasta. Eilen oli biitsiä niin voipi vaikuttaa. Sen kyllä huomasin, että kiva on käydä ihan vaan näkemässä maailmaa heti aamusta! Pääsee ainakin pään sisästä pois, kun menee kävelemään/juoksemaan ja kahtoo, että tässähän näitä muita ihmisiä on ja tässä ne elelee:)	24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.amazonaws.com/marking-images/ebd7218d-a725-4b8b-88b0-12283c671df4-quote-13.jpg	3	f
87e5739d-b5df-4dc8-b20d-23d1f3b59e2e	2021-03-14 10:00:00+00	\N	Kävelin extramutkan kautta Aliinalle maalausiltamaan ja takaisin	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
3cdc00e1-27c6-424c-b43b-c37701e9911a	2021-03-13 10:00:00+00	\N	Hennin kanssa Harjua ympäriämpäri:—)	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
670e8ded-d215-44e7-87fc-1a688eab5ad8	2021-03-16 10:00:00+00	\N	Joku lapsi lens perhepuiston läheisessä jäämäessä korkeuksiin, nauratti. Kävellen kirjastolle maalauskurssille ja sieltä kotio	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
cf8f1cf7-7a85-4453-93cc-669da8d9195b	2021-03-12 10:00:00+00	\N	Kauppareissua ja käpystelyä MeHeen	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
e8958ef7-af7d-40ff-9d99-94616ccfc3e2	2021-03-15 10:00:00+00	\N	Räntää ja filmit kehitykseen, Aliinalta porkkanoita ja Miriamsin mariannekakkujen pelastus	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
401d7409-6084-4fc3-8789-0c0865aa3736	2021-03-22 10:00:00+00	\N	Kahenkertaista kävelyä! Aamulla kävin köpöttelemässä Supermarkettiin hakemaan kahvia ja myslileipää (ai että on saakelin hyvvää leipää, mutta on kyllä kallistaki) ja myöhemmin sitte vielä Rassen kanssa pajalle. Kyllähän tuo herättää aamulla heti käppäillä, mutta kyllähän se vähän hapottaaki! Vähän myös vaikeelta tuntuu jotenki ilman agendaa lähtee vaan kävelemään heti aamulla tai muutenkin. Juokseminen vähän eri asia. Varmaan ois siis hyvä just tehä tuota, niin ei ois niin perkaleen suoritusmentaliteettia:|	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	4	f
b0681731-d3ff-4ca4-83da-5b79a4789a90	2021-02-20 10:00:00+00	eke	TEEERVE! Onpahan hauskaa koodailla menemään poikien kanssa. 10-sormijärjestelmä tykittää menemään merkkiä siihen tahtiin, että HUHHUH. Tässä vähän pidempi kommenti. Juu. Moro:)	1a8efd7f-e1b5-4bdb-94ab-a296ae8fe5e1	\N	3	f
c144cb45-39f3-4ffa-bce6-efa6be0eee2d	2021-02-21 10:00:00+00	Lassi	Sama homma	e4c6d1a8-8526-4e7a-95b4-753d9e8ddeb2	\N	3	f
1c268053-e0d9-4c07-b570-31a4a2915713	2021-02-20 10:00:00+00	Lassi	Moikka moi	e4c6d1a8-8526-4e7a-95b4-753d9e8ddeb2	\N	3	f
9ced7d41-a0b7-4739-bd3c-adf6a9f6bb14	2021-03-01 10:00:00+00	ekeukko		24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
8c0e4efd-cac2-4f3f-ab8d-cbf6c302a20b	2021-02-22 13:46:24.171509+00	Lassi	Hello hello	e4c6d1a8-8526-4e7a-95b4-753d9e8ddeb2	\N	3	f
faac2441-53c7-46ae-94d0-9b59be90c3a9	2021-03-01 16:41:47.45941+00	Sippi	Laulu ja kitara 15+15 minuuttia. 	0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
198e1cf7-532c-4901-ab38-e80450d4ef6d	2021-03-01 20:59:09.702475+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
cdc5a074-2665-450b-814f-e8db50d288c0	2021-03-21 11:21:44+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	f
f0ace49f-ed8a-4421-a17a-cf9235864ca8	2021-03-21 10:00:00+00	\N	Harjun portaat Mr Rasmuksen kaa:) kyllähän tuo mukavata on portaitaki vejellä, vaikka kovasti niitä on kauhistellu enne! Oikeesti on vaa rennompaa ku lenkin juoksemine, ku voi vetää kunnon himospurtin ja sitte ottaa rennommin. Melkeen vois olla enemmän mun juttu, kun juoksulenkittely! Myös kiva kuulla Rasselta vähä kuulmisia:)	24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.amazonaws.com/marking-images/ed8a5e68-c5f0-4e92-bc1c-90a0e41847c9-CB4E1732-047A-4D55-963F-3B7060DA1863.jpeg	5	f
fb2da447-e4c5-41e7-87f7-f62ac05e9492	2021-03-22 06:35:08+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
47e20cac-ffef-447d-a095-efbb1c419bd1	2021-03-22 10:00:00+00	\N	Tinderöinti kävelyllä taas, tällä kertaa mukavasti! Ja vitsi mikä keli, joutsenki laskeutu tuomiojärvelle ja oli niin nättttiä.	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	4	f
a0c38ea8-bb6c-4d83-848b-ac2f2b170fad	2021-03-21 10:00:00+00	\N	Kirjanpalautus-iltakävely, joka venyki pidemmäks mutta ai kun se teki hyvää! Paitsi polvelle, joka jostain syystä hajoaa😢	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
b09e6125-9885-4857-b672-139b8965a3d6	2021-03-16 10:00:00+00	\N	Hyvin tuli pisu	868b86e2-434b-4b7c-8c11-8e81ef5de99f	https://zen-tracking.s3.amazonaws.com/marking-images/c09fbebc-2b9c-4ac0-8ea9-c4fad31519ef-16164466822155277309900843790637.jpg	3	f
f1699d34-5c6d-4845-870f-77747b5ed86a	2021-03-20 10:00:00+00	\N	Niin mukava päivä, kävelyä joka suuntaan aka maalauskurssille, leffailtaan, kaninkolon peli-iltaan ja luikastellen takaisin kotiin kello kolmelta yöllä! Myöhästymisten suhteen meni tosin plörinäks, mutta kukaan ei kuollu joten kaikki hyvin	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
22f5221c-427e-43aa-a072-4ad653e1924e	2021-03-19 10:00:00+00	\N	Heti aamusta nälissään kävelin iloisesti labraan ja siinäpä se lenkki sitte tulikin	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
909eb765-2a65-4f5b-9e1b-242e45579a3f	2021-03-17 10:00:00+00	\N	Dear dairy...\nNo eka kävelin luikastellen yths:lle. Sitten kiertelin kirpparit ja kävelin kotiin. Illemmalla lähdin tinderkävelyreffeille ja menin ensin taulumäelle ja sitten se tyyppi kuljetti mua ties missä metiköissä Holstissa ja Lohikoskella, enkä tienny yhtään missä mennään. Sitten umpijäässä menin Ekelle kastelemaan kukkia. Varmaan ainaki 7km kävelyä, nyt sattuu polviin ja reffitki oli miälenkiintoset. Mut en myöhästyny mistään! Vaikka oli vaikka mitä aikatauluja:)	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
beed9eef-bd92-4c9b-b36d-26acc3c4a029	2021-03-18 10:00:00+00	\N	Ilokiven kautta käppäilyä kaninkololle Rasmuksen syndesekoiluille ja sieltä takas kotio mitä kauneimman auringonlaskun ja vaaleenpunasten pilvien saattelemana. 	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
bf95c3c9-f321-48fd-9fc0-513e7cc8bc7a	2021-03-23 12:32:10+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	f
8a32bc51-547d-4614-8c42-46c05ae92379	2021-03-23 10:00:00+00	\N	Kombuchaa ja filosofiaaa reunion! Ja käppäilyä ympäri jyväskylän terapiasta kiven kautta kuset housussa kottiin ja sieltä laajikseen	24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.amazonaws.com/marking-images/74436688-7fa1-4b62-be4a-cfece3959465-image.jpg	4	f
20265867-e090-4e77-847e-7b31b2b9fed4	2021-03-18 20:59:48+00	\N		24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/3d4a3012-805c-41a9-a656-8a1a69b07d0b-7A9E13EE-4B12-474A-B982-AD87BD391346.jpeg	4	f
bb2d9c15-0f18-4f3d-973c-2bd31b517d2b	2021-03-19 10:00:00+00	\N		24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.amazonaws.com/marking-images/7cf2e382-0380-4db5-a2a9-62fff1b7c10d-E7DC2E08-2E02-4FF2-83DE-EDB8B3F3661A.jpeg	4	f
1d5d1c4e-9a1d-4a16-b65b-a45b2a3505b9	2021-03-23 10:00:00+00	\N	Venuttelyasento ja hengitys	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	5	f
6e344ebf-0eec-42b8-97e8-984e009287bd	2021-03-21 10:00:00+00	\N		88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
d0104ae0-e1e0-473f-a6fb-3625ff993316	2021-03-15 10:00:00+00	\N	Munat	868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
9822c61a-ea27-4c1b-8bc4-a72caf56060a	2021-03-14 10:00:00+00	\N		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
2c540936-c328-4883-a706-f359ac1d39f1	2021-03-15 10:00:00+00	\N	Juoksuttelulenkki aamuselta Vuosselii ja takasi! Hapotti kyllä  ja tuntu vähän idiootilta lähtee juoksemaa täällä Rukalla kaiken muun tohinan keskellä, mutta tulipahan juostua	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
42f473d8-0d5e-4de8-ba1c-0ae9bebe969a	2021-02-15 12:42:31.674461+00	eke	\N	1a8efd7f-e1b5-4bdb-94ab-a296ae8fe5e1	\N	3	f
d0c29bf1-2907-4538-912b-506b563abad2	2021-02-15 13:23:27.83314+00	joku	\N	3ebe0a89-3fe9-4196-8697-3f253d3da53a	\N	3	f
3c0b19dd-31fa-49ea-815b-9278478f6aab	2021-02-15 13:50:35.529969+00	asdasdawdawd	\N	c50d3745-3b2e-4173-a8f8-e0de1c7ba672	\N	3	f
9fdfc2c3-78ba-42be-9c5a-75bb28d0415c	2021-02-13 09:38:55.702871+00	eke	\N	1a8efd7f-e1b5-4bdb-94ab-a296ae8fe5e1	\N	3	f
3eb03177-f3b4-4527-bd13-1481038a501c	2021-02-15 13:56:33.23574+00	awodijadio	\N	56614b8f-a1ac-4cf7-9353-1bd885f5fad7	\N	3	f
e36cc98e-5876-4349-8c69-27284cef9f3e	2021-02-15 20:30:00.979055+00	juhevalt	\N	bab6b5af-a607-4293-9d0a-3ece3a3a7b72	\N	3	f
0aeef8c2-0462-43c1-a191-c3ad1de1a712	2021-02-18 08:03:34.186895+00	eke	\N	1a8efd7f-e1b5-4bdb-94ab-a296ae8fe5e1	\N	3	f
e40b528f-6f7c-45be-86c2-42b315cc2dd9	2021-02-19 10:00:00+00	eke		1a8efd7f-e1b5-4bdb-94ab-a296ae8fe5e1	\N	3	f
9af60de6-539f-485c-8e15-7398a91c10fe	2021-02-20 10:00:00+00	eke		1a8efd7f-e1b5-4bdb-94ab-a296ae8fe5e1	\N	3	f
5bd1953b-fbc7-43ab-a8b8-ede6bd21be6c	2021-03-20 10:00:00+00	\N		88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
fdf84768-bf28-4ad8-9a9d-9c59eeefbe5e	2021-03-22 10:00:00+00	\N	Kävelymeditointi	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
02a88b4b-7f37-48a8-ab7b-e1188efac5cb	2021-02-28 10:00:00+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
0469986a-a597-4f52-9b59-0c19ffd8c35a	2021-02-28 10:00:00+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
df37693f-e350-412f-ab54-d5ed7c228d3e	2021-02-26 10:00:00+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
cc88fd5d-1cfb-4272-a57a-5296a14d0ce0	2021-03-01 21:01:32.082945+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
41b89bfc-36e7-4aca-983b-aa1a31901775	2021-03-01 21:38:49.70278+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
a8e386d5-e69f-448c-b798-7414f3c2edd9	2021-02-27 10:00:00+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
c529faa2-838f-4715-a00a-2449c08713e9	2021-03-01 21:42:40.204161+00	eke		1a8efd7f-e1b5-4bdb-94ab-a296ae8fe5e1	\N	3	f
659f0593-b80a-425c-8c23-e91d20672e50	2021-03-02 07:52:35.440103+00	ekeukko	Eka aamulenkki! Jokunen 20min tuli juoksenneltua. Oon kyllä aivan perkuleen innoissaan näistä haasteista:) Vähän pelottaa, miten penikat ja polvet kestää tuota juoksemista, mutta onneks voi aina ottaa mummomoden ja kävellä vaan, jos pettää!	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
96bfa921-2f3e-441e-8b5f-c54cc06483fa	2021-03-02 13:55:47.829597+00	Sippi		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
6edb4f5e-1e4d-4954-a996-84722f648000	2021-03-02 17:08:35.943868+00	Päivänsäde63	Hiljaisuus ja hengittely oli rentouttavaa. Ajatuksetkin pysyivät aika pitkään poissa ja keskityin vaan hengitykseen. Kurkkukipu vähän häiritsi, vaikka toisaalta tuntui, että kurkku rentoutui	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
e0f4c018-54c0-4bc8-ac21-4a1cd827a4e4	2021-03-03 10:00:00+00	Päivänsäde63	Melko hyvä sessio ilman hirveesti ajatusten pomppimista. Istuiltaan hyvä.	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
b337d7c1-4913-4246-b065-450f4d0cee32	2021-03-03 18:25:58.727205+00	Sippi		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
4a6522fa-caaa-4798-9c0c-e17bb48ec0b6	2021-03-03 21:06:04.350288+00	ekeukko	Aamulenkkiä Tourujoen varrella. Seurailin hetken siinä ohi lipuvia jäämurikoita ja keppejä ja ihmettelin jännää luontoo:) Lenkkihaaste jää nyt muutaman päivän vähän ketoosin varjoon, mutta ei se mittään!	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
4fba56d5-7ef2-469f-a75d-2ddf4fdb64f1	2021-03-04 10:00:00+00	eke		1a8efd7f-e1b5-4bdb-94ab-a296ae8fe5e1	\N	3	f
70fc9158-c4ed-4222-8629-52dcd788accc	2021-03-04 20:51:13.616562+00	ekeukko		24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
7c9f25cc-397b-43b7-ac5e-873c5502095c	2021-03-04 20:54:42.080524+00	aquamies	Hiihdettiin 10km maman kanssa Ukko-Hallan maisemissa, nyt jalat painaa mutta oli mukavata:)	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
e316490e-4e56-4193-9246-20432a8c6d18	2021-03-03 10:00:00+00	aquamies	Käppäilin muutaman kilsan Ukko-Hallan keskuksesta sillan yli kehä 1:stä pitkin 2. Avenjuulle ja rötkähdin saman tien päikkäreille kun ei huvittanu mikään muu olleskaan	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
15042e9f-b619-4ab1-a5e6-5bdd772b78ab	2021-03-08 10:00:00+00	Päivänsäde63	Aika pitkään onnistuin olemaan ajattelematta. Mutta on tää vaan vaikeeta. Varmaan onnituis paremmin jos vois tuijottaa vaikka järven selkää.	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
523a3372-3b2f-473d-b57d-4f02f98ba261	2021-03-08 18:22:47.885637+00	Sippi		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
b893b5e7-933d-49b6-975e-fff4fa18f243	2021-03-05 10:00:00+00	Sippi		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
a597eb6c-666a-4507-91f0-546a79850546	2021-03-06 10:00:00+00	Sippi		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
d4302e11-8425-4309-99b6-9e2429ff9e88	2021-03-02 10:00:00+00	aquamies	Ukko-Hallan huipulle menin revontulijahtiin käppäilemään yksin pilkkopimeään ja piileskelin lumikissaa. Ei näkyny revontulia mutta ihan tooosi nätti tähtitaivas ympäröi joka puolella ja pirun kirkas kuu nousi jälleen taivaalle heitellen varjoja lumeen. En malttanu jäädä sisään mökille palatessakaan vaan menin vielä vähän ulos käppäilemään ja kärkkymään revontulia keskiyöllä. Ei näkyny mutta oli niin hiljasta ja nättiä :3	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
dd31dfd7-113a-42b9-8278-caa711c6caeb	2021-03-26 06:33:19+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	f
dc3bfd5b-bab9-4f89-a36f-abe2a6ec0ebc	2021-03-25 10:00:00+00	\N	Lenkittelyä ensin Norssille ja sitten Kaninkololta kottiin:) Olipahan kevyt askel! Ihan ku ois vähän kasvanu kunto! Ei pitkiä pätkiä, mutta tuli juostua ihan kovvaa!\n\nMyöskin, off topic, mutta lauleskeltiin miksun kanssa:)	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
f0a8e9a3-5d89-45b7-811b-6ddb2febe136	2021-03-25 10:00:00+00	\N	Justiinsa, tännää käveltiin Jyväsjärven ympäri med Justiina	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	4	f
cc659077-ea71-42c1-bbe6-a75395d10d44	2021-03-28 11:04:09+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	t
781bb9f1-50af-431b-aa87-52bdbc4b036b	2021-03-29 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	t
b7d371ad-0153-4a30-bfc3-c9b95d61c395	2021-03-01 10:00:00+00	aquamies	Mietin tuossa pitkään illalla äidin kanssa melkein ysiin asti venyneen illalliskeskustelun jälkeen, että jaksanko lähteä ulos kävelylle vai alotanko tomerasti ja taitavasti maksamalla euron heti ekana päivänä. Päätin että eihän tästä tuu mitään jos luistan jo heti alkuunsa, että vähän parempaa asennetta nyt kehiin ja happihyppely tekee vaan hyvää. Lähdin, ja totesin että okei täällä on tooosi pimeää ja niin hiljasta että vähän pelottaa, mutta ku vilkasin taivasta ja näin tähdet ni totesin että okei vau, kyllähän täällä kelpaa. Käppäilin ja huomasin puiden lomasta jättimäisen valopallon loisteen ja tajusin että melkein täysikuuhan se siellä möllöttää ihan tajuttoman kirkkaana ja upeana, että vau. Olin entistä iloisempi. Sitten jatkoin kävelyä ja näin lisää kajastusta puiden takana ja mietin että mikäs asutuskeskittymä tässä muka niin lähellä, että pilviin heijastuis valosaastetta tuolla tavoin. Kattelin sitä aikani, kunnes ne pilvet alko lepattaa ja ymmärsin, että katselen kaukana siintäviä revontulia. Totesin, että tää oli selvääkin selvempi merkki sille, että yhtäkään kävelyä en kyllä voi missata koska jokainen on mahdollisuus johonki uskomattomaan!! Ja että vaikkei revontulia näkisikään ni happi tekee hyvää ja sen siistin kepin voikin vaikka löytää Mäki-Masan kaduilta. Tuolla oli niin jumalattoman kaunista että lopulta kykin siellä tunnin, ja lopuks ne revontulet kiiti suoraan mun ylitse ja lepatteli siinä tovin ennen ku katosivat kokonaan puiden taa.	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
04fc484a-b27c-4e48-b9f5-782f5807a0a9	2021-03-04 10:00:00+00	Sippi		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
3fae499e-a72d-4a98-9a08-f32443c8c12e	2021-03-05 10:00:00+00	aquamies	Kympin hiihtolenkki päivällä kauniissa auringonpaisteessa ja pienet happihyppelyt vielä illasta tunturin huipulla tuhansien tähtösten alla:’)	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
337bc304-07f1-4f66-be7a-e5bcd12238f7	2021-03-06 10:00:00+00	Päivänsäde63	Kohtuullisesti, ajatuksia on vaan vaikea saada pysymään hilj	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
0dc3ca68-2c8f-470a-94a8-de77125b29ea	2021-03-07 10:00:00+00	Päivänsäde63	Ei oo helppoo, tuntuu liika yritykseltä. Ja korva/kurkunpää arkuus haittas kans keskittymistä. Pitäis kai osata laskeutua tähän tilaan paremmin	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
ce1ae595-a397-474d-81a4-350329995b7d	2021-03-07 20:46:59.351991+00	ekeukko	Muutameexcu Tiian kera:) tipsuteltiin lenkkiä Muuratsalon perukoilla ja takasi 6kilsaa. Robin hoodi oli jo kuiva!!	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
3add49f4-4298-49d9-af26-861d442842f5	2021-03-06 10:00:00+00	ekeukko	Ketoosipäiviä jälkikäteen merkkailua. Lenkki = kahvi housesta:D oli kyllä ihan ison kylän meininkiä heti herätessä käyvä hakemassa takeaway kahvi kuppilasta!	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
bc48cd1e-25fa-45f9-9b38-89b7a13c1707	2021-03-08 10:00:00+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
8a756f0b-5a71-41fa-a681-58a6230fa06d	2021-03-07 10:00:00+00	Lohkaremies		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
b228c17c-e405-448e-9b59-14638909d8d4	2021-03-08 10:00:00+00	ekeukko	Suoraan kasilta ulos. Talvi on perkule hienoo! Kimmelteli oksissa jäänpalaset ihanasti:) Aattelin, että käyn vaan pikaseen kävelemässä puiston ympäri, mutta lähinki juoksemaa ja kulki aika kivasti! Silti kyllä aamu lähtee käyntii vasta kahvin jälkee, ei tuo sitä korvaa.	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
2c1bb81d-cf0f-4e74-8b44-49cc6184a1f7	2021-03-07 10:00:00+00	Sippi		0a70aaab-e0e2-4556-acb1-3bb94d13e5fc	\N	3	f
482b1a2e-c58e-470b-9418-84fafcef7cbb	2021-03-09 10:00:00+00	Päivänsäde63	Nyt oli ok sessio, ihan rentoutui. Pitkällään ja silmät auki	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
b9524e24-80ac-40ef-b2ec-ec16293beb37	2021-03-10 10:00:00+00	Päivänsäde63	6min pötköttely, ok	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
809c78c9-0111-4506-b413-7f266d36c5d7	2021-03-06 10:00:00+00	aquamies	Käytiin maman kanssa vähän käppäilemässä jollain könkäällä/myllyllä	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
0e613e1e-b435-416f-a2ad-d9ca658d1ce1	2021-03-07 10:00:00+00	aquamies	Kauppareissulle, teki hyvää käppäillä monen tunnin ajomatkan jäljiltä😌	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
e08fb968-c4bd-41a6-94ef-421e92b5935e	2021-03-10 10:00:00+00	aquamies	Kävelin kaninkololle ja takasin, nättiä aurinkoista pakkassäätä ja tähtitaivasta:)	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
0ec9a5c8-8017-4891-960a-01bb8438e68f	2021-03-09 10:00:00+00	aquamies	Yhteiset mukavat aamukäppäilyt itse zenimestariukon kanssa:—)	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
dc2c4414-5d93-41e9-97a3-472470758d14	2021-03-11 10:00:00+00	Päivänsäde63	Mukava rentoutuminen vaikka välillä kävi ajatuksia, mut annoin vaan mennä ohi	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
5e5b5441-6351-4199-a563-b67c9950a77f	2021-03-11 10:00:00+00	aquamies	Melkein tajuton hiihtolenkki:’(	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
1f42e174-89a0-46d7-9673-177a938e8e82	2021-03-10 10:00:00+00	ekeukko		24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
61d9d129-db34-460f-8e20-394f38c86f82	2021-03-09 10:00:00+00	ekeukko		24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
18eb899c-21ca-44b2-9905-10f6cfdf8a06	2021-03-12 10:00:00+00	Päivänsäde63	Reissuun pakkaamisen lista vähän pyöri mielessä, mutta keksin vanhan rentoutumisharjoituksen miten jäsenet alkaa painaa alustaa vasten	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
08f95a69-5d48-4d2b-881c-09943ac96b78	2021-03-13 10:00:00+00	Päivänsäde63	Rukalla. Ilman kelloa pötköttely.	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
7352f776-6969-4a9c-add7-8b884bbbe448	2021-03-14 10:00:00+00	ekeukko	Pikanen kävely Mikaboin ja Alman kanssa. Mukavata höpöttelyä yksinäisyydestä ja muusta:)	24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
b5620fec-e767-44f9-ad39-8f7d8894e33f	2021-01-13 10:00:00+00	testi3		bc0ab1e8-3f1c-4908-9008-40c225062866	\N	3	f
3afcaa13-36c2-4a48-80cd-a8167e2671e1	2021-01-22 10:00:00+00	testi3		bc0ab1e8-3f1c-4908-9008-40c225062866	\N	3	f
5e6b4d2b-9984-48eb-9ba3-3f20f3a1f9d3	2021-01-24 10:00:00+00	testi3		bc0ab1e8-3f1c-4908-9008-40c225062866	\N	3	f
778dedad-6525-460a-9777-3ae90c7c9471	2021-02-10 10:00:00+00	testi4		3a440ba1-d9dc-4913-82ad-84e40f7ee1dd	\N	3	f
54717131-613b-4373-8aa3-43fac4ea4f0e	2021-02-19 10:00:00+00	testi4		3a440ba1-d9dc-4913-82ad-84e40f7ee1dd	\N	3	f
6b17c826-5a29-49ff-adb0-01d1b31ddf20	2021-03-13 10:00:00+00	\N		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
5651e993-2775-4ea8-9c22-92ef387d826d	2021-03-12 10:00:00+00	\N		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
60de7b19-e98d-41f9-b8fe-fde6e2de8adc	2021-03-11 10:00:00+00	\N		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
fcfd8bcc-83ab-4b16-a8bd-c6f6c375d689	2021-03-10 10:00:00+00	\N		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
efd10a55-333a-40c8-b487-b248de804263	2021-03-09 10:00:00+00	\N		868b86e2-434b-4b7c-8c11-8e81ef5de99f	\N	3	f
5ec0df1b-41f8-48ba-9ff0-c038ba4f611b	2021-03-17 10:00:00+00	\N	Lenkki ny ei kummonen ollu. Iltakäpöttely mikaboin ja almadogen kanssa. Tähtitaivas taas kyllä melkonen! Mika kusetti että huomenna paistais rehontulet:( mutta mahtista oli saada kyllä kuvanlähettäminen ja teemavalinta tähän! Mukavata myös saaha Nooralta palautetta:)	24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/74afe6a0-f3e1-49a6-859e-bdb2443b30f6-81C0753E-FAAB-4A33-85B5-1AA3D74048A5.jpeg	3	f
7fd45715-ca92-43c8-a534-9e037de3efa2	2021-03-11 10:00:00+00	ekeukko		24c48705-13e7-436f-8f33-cecfcdf7982f	\N	3	f
96f159d5-7629-459e-bc63-aa2e71cfd45c	2021-03-23 10:00:00+00	\N	Keskustassa ja Kivellä pyörimistä jälleen	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	2	f
3bb39d07-41a6-4971-8533-24d52e4ef94b	2021-03-24 16:55:20+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
6ab4003e-2225-47cc-b80d-c2f7183e2aeb	2021-03-24 10:00:00+00	\N	Venytysasento ja hengittely on hyvä yhdistelmä	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	5	f
365b24d0-f885-439c-8ba6-f7d28159e6f6	2021-03-24 10:00:00+00	\N	Käppäilin vaan ilokivelle ja takasin Nooran kera:) kevät tuli ja lumi suli! Tuntuu säässä, viboissa ja kaikessa! Ihanaa olla ulkona:) vähän ristiriitasta sen kanssa, että ihanaa myös nörtätä sisällä.	24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/d87538fa-746c-4d47-95f6-7c5ab3804311-959B6F81-AC93-46DD-940F-E108243D6441.jpeg	3	f
da047327-ea2a-4198-a5cf-2422db0b40ea	2021-03-25 10:00:00+00	\N	Nyt oli vähn heikko keskittymiskyky. Porrastreenin jälkeen ja liikaa asioita pyöri mielessä	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	2	f
0bce54ed-5500-4a12-a5ad-69dac43b53ba	2021-03-24 10:00:00+00	\N	Kauppaan ja kotio ja lätäköitä, ja Ekeukon kanssa Kiveen ja takaisin	7638b206-d8a9-4896-bdcc-27eb3b0d1b55	\N	3	f
b1387428-22cc-4bf4-bf8d-9a652019b27b	2021-03-25 10:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	5	f
1a68ed49-7064-4744-b502-98af6dffc343	2021-03-31 09:00:00+00	\N	Viimeinen päivä. Melko hyv	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
637911fd-9a33-424c-814c-5402c5c3f46c	2021-03-30 09:00:00+00	\N	Nukkumaan mennessä,ei kelloaikaa. Hyvä rentoutus	88cb3c5b-d656-41ff-9858-1edb8dfa8fd3	\N	3	f
aa763f61-c437-44d8-bb89-2be744fa0f1c	2021-04-03 20:47:42+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	2	f
de84c127-dec3-4c4e-be50-98a517d633e0	2021-04-01 09:00:00+00	\N	Kädet täris ekaa päivitystä pistäessä ei saakeli!! Tuntu sumu ku kovimpana ahistuksen päivänä. Ei oikeesti. Mutta syke oli kyllä korkeella ja meni joku 10min keräillä. Onneks olin Mikan ja Tiian kaa nii oli helppo laittaa menemää!\n\nMutta. Tuli kyllä saatanan hyvä vastaanotto. Aivan ihana:) oli uskomaton päivä. Eihän tuossa ajatukset pyöriny muualla ku siinä enää sen jälkee, mutta ei haitannu! Ei ku oli meillä lanit eli oli siinäki ajatukset! Mutta joo, tuli niin ihania viestejä, että ei voinu mitenkää vikoperin kääntää sitä minkäänäkösillä nurinkurisuuksilla huonoon. Ihania ihmisiä on elämässä ja olemassa:)\n\nEnnakkofiilikset haasteeseen: pelottaa, että ei osaa miettiä päivisin muuta ku että mitä sitä tänää postaa, enne ku on postannu. Pelottaa myös, että ei saa laitettua sitä mitä haluais tai mikä ois ”omaa ihtee”, koska miettii noin. Pelottaa, että ei sitten edes tiiä mikä se oma ihtensä on, koska vetää nii kieroks aivot. MUTTA samalla on kyllä ihan siistiä haastaa, etenki ku on nii hyvät vastaanotot. Tekis mieli laittaa tästä sovelluksesta jotai, ois sairasta laittaa joku soittovideo, ja vähän kaikkee. Hirveesti pyörii ajatuksia päässä jostain postausjutuista. Mutta yhtäpaljon myös inhibitioajatuksia samasista hommista.\n\nKahtellaan!	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/cb0eed4b-5c8f-4123-9fb1-f9b9e1a3a4fa-810F02C0-438A-40B0-A882-F1D56ECF54E2.jpeg	5	f
0e527598-4497-4db5-8fe4-328b24d0ea22	2021-04-02 15:23:48+00	\N	En saanu unta koska ressas nii paljon mitä postaa:D no postasin sitte kahvin ryystön heti aamusta! Ja vastaanotto uskomaton taas. Oli 17 viestijuttuilmotusta Igssä! Sairasta. Nyt taas ahistaa, että mitä huomenna, mutta eipähä se mittää:) katotaa huomenna!	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/1f089ce7-0a5e-4b7e-84e4-9f5df86e86b5-58851914-DA3B-45C8-AD6D-A06BB1FE0114.jpeg	5	f
cefce8c3-b22d-4499-90de-27bec1fadcf6	2021-04-02 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
6eed89de-9057-481f-b2a8-ea79ee73f4ee	2021-03-31 09:00:00+00	\N		24c48705-13e7-436f-8f33-cecfcdf7982f	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/006f5571-3b45-4b3b-9743-eca7948372b9-5F202C9C-6817-4E26-A7EA-13F0F0C2FB48.jpeg	5	f
503e187f-5593-42ef-a3f9-b8d8ea5ecc46	2021-04-07 09:00:00+00	\N	Lyhyt, mutta koskettava runo vanhemmuudesta. Sitä vaan toivoo kaikkea hyvää lapsilleen.	6e5e01c1-dd39-4493-ae92-b7e794392c4d	\N	5	f
a7daef2f-4b0e-4c12-bab7-86751b062654	2021-04-17 09:00:00+00	\N	Otelautareeni, vähä kämänen reeni oli kyllä	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images-dev/4ed74b4f-9396-474c-bb43-0d1a9d423179-IMG_20210411_185139.jpg	2	f
896c6daf-aec1-4db9-92fa-dd26b7973628	2021-04-28 09:00:00+00	\N	5/35! Jeii tänään oli hyvä kiipeilypäivä, pääsin taas uusia 6B reittejä 🌞	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
5ec58d77-b569-4b3b-b3e4-f0a9de815c31	2021-05-10 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
100c8445-f21f-4e63-a71b-2e4fd89caafa	2021-05-11 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	3	f
04cdee0a-d13a-4497-9bd3-7ce7358f0ea2	2021-05-12 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
95a8936f-0844-4224-b0e9-25bdfdb3b71e	2021-05-13 09:00:00+00	\N	Pitäis nukkua vähän enemmän, eihän tästä tuu mitään. Lukeminen hieman vaikeeta, kun kaks päivää nukkunu 6h:D Mutta oikeestaan silti yllättävän helppoo toisaalta!	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	2	f
faed1407-b09e-4490-be1f-7a52a589d3f5	2021-05-13 09:00:00+00	\N	Kesä!	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	5	f
6e5f061f-98f1-48eb-8670-d352d0888744	2021-04-18 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	2	f
7b43b747-ef12-44c7-9808-589c22d4e218	2021-04-19 09:00:00+00	\N	Juoksu + kävely yhdistelmä, hyvän mielen treeni:) 	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	https://zen-tracking.s3.eu-west-2.amazonaws.com/undefined/ca355ab0-c006-48bb-ae41-ab4bb30e3501-IMG_20210419_120756.jpg	3	f
65dd72c5-d66e-4772-ba0f-9e7abb2a2339	2021-04-19 09:00:00+00	\N	Traverse 7B+ tuli kiivettyä marvinilta:) 	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/60a17acf-3849-459e-9d17-a3c9802e6784-IMG-20210419-WA0008.jpeg	5	f
1a8f6fb6-5004-4d14-a052-2734aa55a767	2021-04-19 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	f
30cb867c-d3a7-4fb8-a9f2-2973a1d98692	2021-04-20 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	4	f
ec9b9bca-0348-42c6-9df8-43e704b04ef7	2021-04-21 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	f
feff86fb-401f-44a5-ac87-7f83b70fe393	2021-04-21 09:00:00+00	\N	4km maastojuoksu	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	5	f
bc195b56-f493-4fb7-8300-66ab95da4d1e	2021-04-17 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
618d8428-d20e-4253-8c6e-d1662a5ce445	2021-04-18 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
e2f82766-548e-4a05-8c81-cc284f72f4ab	2021-04-19 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
3a11a5f8-cf55-4950-ab2d-c27d2ebb563d	2021-04-20 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
22134441-095d-444e-a886-5fb75b69a140	2021-04-21 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
f8bc8788-824c-4a94-8946-532baec3c05b	2021-04-09 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
63f7a865-5e3c-43e6-a9a2-5a6e02031594	2021-04-10 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
d04d2e1d-6c3f-4b3c-bebf-4af22df7ae69	2021-04-11 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
b5fe337f-aa09-4e42-9dea-7790fd536647	2021-04-12 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
217d47fe-31b1-46d6-8936-95765c81eea8	2021-04-13 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
604a7326-40d7-4738-8f00-e8b762bb497f	2021-04-20 09:00:00+00	\N	Tylsyyttäni otelautailin ja tein vatsoja	a27ca96b-1eb6-4746-9189-626a5d2d4024	\N	3	f
434eefa3-740b-42c6-9148-379d195c7086	2021-04-21 09:00:00+00	\N	Booty kukistettu, ouuujeee! 	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/e44ee25e-78a3-461e-8118-d65cfafb3538-Screenshot_20210422_012212_com.huawei.himovie.overseas.jpg	5	f
13993209-ec05-499d-a295-cd3fd27e0f22	2021-04-22 09:00:00+00	\N		c14a8559-2bce-41ba-99ee-63f54cbdd252	\N	3	f
2ef1aafb-3f76-4898-8206-4471be4cec48	2021-04-23 09:00:00+00	\N	Lihaskunto	e63bb2b5-2cf8-4f42-ba3a-a07fa014f75f	\N	2	f
d8521c8b-ea7a-407d-abd7-5e2b8c7b1393	2021-04-23 09:00:00+00	\N	Pajapaja	a27ca96b-1eb6-4746-9189-626a5d2d4024	\N	4	f
6eda53d6-ca87-4051-8504-89aa50d80642	2021-04-25 09:00:00+00	\N	2/35. Päätin tehdä tästä julkisen haasteen. En oo vielä ihan vakuuttunut siitä, että tuunko selviämään tästä :D mutta sosiaalinen paine kannatelkoon minua tulevan kuukauden. \nTänään oli vuorossa kotitreenailua ja kiipeilyä!	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
abede5da-b73c-4cb9-b6ac-695537cd285b	2021-04-25 09:00:00+00	\N		2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/feac574c-aded-4cde-9ce4-5c6a1b9cf588-0F67F1AB-F77D-4906-B18B-CED122095B03.png	4	f
ae0c41a7-8926-467e-85d8-334826dda107	2021-04-26 19:13:07+00	\N	3/35. Hyvä fiilis vielä! Lenkkeilin tänään valmennettavien kaa alkulämpäks muutaman kilsan, ja tuli kyl hölkkäilyt tarpeeseen ku oon ihan jumissa viikonlopun treeneistä. Vois kai sitä joskus omatoimisestikin lenkkeillä, ehkä. 	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	3	f
7a6ff811-2c9c-4ab5-85f2-94b0eccc18db	2021-04-24 09:00:00+00	\N	1/35. Eka päivä, good vibes!! Kotitreenailua ja makoilua olohuoneen lattialla hikisenä.	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
65b66b80-b7be-4bfd-93c4-24ea2a336737	2021-04-22 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
cead0197-1e24-429e-b8ee-692b4d7ff10c	2021-04-23 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
73ce9695-81b6-4570-a27b-e6595e7e92a8	2021-04-24 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
b0d2f820-f0e3-4b72-a237-6c05804ea87f	2021-04-25 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
449e33c7-2e6e-4d2b-9016-39ab4b1aed21	2021-04-26 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
83627b3a-8d1e-44a0-9d10-e6e6a1187273	2021-04-27 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	3	f
5c79bc6d-9a4a-456d-98d8-c0dbea96baef	2021-05-01 09:00:00+00	\N	8/35. Päivän ainoa urheilusuoritus tais olla harjulle kapuaminen. It still counts!	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	1	f
2a2f7038-77f3-4018-af97-e36eb9743c5d	2021-05-29 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	5	f
350b19aa-0855-4439-95e4-ccadcccc315f	2021-04-27 09:00:00+00	\N	4/35. Hyvin kulkee vielä! Oli kivat kiipeilysessarit illalla, meni taas uus 6B! Tänään tais mennä itse asiassa kymmenen 6B reitin raja rikki, jee! Vähän jännittää miten kroppa pysyy kasassa tän jäljellä olevan kuukauden ajan, mut pitää vaan yrittää ohjelmoida treenit ja viikot järkevästi, ettei tulis mitään vammoja 🤞🏽	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
d4db483b-4763-49d7-be12-240721957718	2021-04-28 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	4	f
b9f14631-cced-450d-92da-d180cdfc88de	2021-04-19 09:00:00+00	\N	Huomaa, että kuormittaa vähän taas tämä. Oli pieni pahan mielen kutkutus koko päivän takaraivossa, mikä lähti saman tien, kun laitto vaan päivän kuvan. Ei ollu paha itessää kuvvaa laittaa, mutta ihmeellistä, miten konkreettisesti voi huomata tuon tuovan resiä.	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/5ae18ada-b729-48e0-b39e-4ff3d2e1f147-1684C719-9E1D-4273-9B69-F1FB72889C87.png	3	f
53636e64-0c2d-4bb5-9f31-a9bca62bacd8	2021-04-21 09:00:00+00	\N	En minä eilen mittään laittanut:( Tyhmältä tuntuu laittaa mittään, mikä ei tunnu järkevältä, jos tuntuu vaan pakotetulta. Mutta no eipä tuo niin paljon häirihe nyt, vaikka yks päivä jäis välistä. Vaikeempaa on vaan aina sitten seuraavana päivän poistailla.\n\nMutta nyt taas aamulla vähän heti mietti, että voiii pylly, kun ei varmaan mitään keksi koko päivänä. Mutta heti kun laitto vaan aamulla jotain, niin heti hävis pieni pala päästä. Huomaa taas, mitenkä tämä kuitenni vähän stressiä aiheuttaa, vaikka ei sinänsä kiinnostakkaa hirveesti ennää, mitä laittelee. Mutta puoltoista viikkoo ennää jälellä!	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/f0ba6d7a-c466-4fd9-9d82-7ea9284c9592-9A9D78D4-402A-4E26-8C2C-F9CCFE13D275.png	4	f
6eb16790-896b-4e2d-b05c-67767745b14f	2021-04-22 09:00:00+00	\N		2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/e400aa1d-db91-4b2e-bbb3-b84d7adbd063-058CFEB5-1BB5-4D21-97E1-5E3051B4465F.png	4	f
86a9be63-e448-4289-96f9-b543ed00e9d3	2021-04-23 09:00:00+00	\N	Mukavata videota kroketeista, hauskaa touhutus videota. On se mukavata, kun tullee IGssä viestejäkin, että joku video, mitä on ottanut, on saanut hymyilyttämmään:) Kyllä se tuo arvoo tälle haasteelle.	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/e8c3a9fc-5d82-488d-a381-b8aa358b26b2-6E1992BA-71DE-47F8-A740-3C1A8F0C2DE7.png	5	f
8d1fa8d4-2baa-4b95-9e99-f8794e990e7f	2021-04-24 09:00:00+00	\N	Nopia video taas kroketti day 2. Ei kummempia miettimisiä tai muutenkaan muuta kummempata. Mietin kroketista kollaasin tekemistä meidän uskomattamasta radasta, mutta ei sitte ollu fiilistä kuitenkaa...	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/a42126bc-e14b-4b23-8bc1-35d4c15cf5cf-5542173B-294A-4AD2-9C82-C26D5D11F3B5.png	3	f
75864ba0-f948-4294-9057-a10c35bb9f6b	2021-04-26 09:00:00+00	\N		2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/848a80cc-020e-46ce-8c99-78d51e90b133-B8874EF6-D99C-432B-A43A-9CF63CA3BAD0.png	4	f
b2fc8823-54e9-46e4-a504-1cfb35e2e5dc	2021-04-24 09:00:00+00	\N	Viiden tähen retki! 	a27ca96b-1eb6-4746-9189-626a5d2d4024	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/c2eb0d62-5b5b-4241-8ad4-8f8c87f65282-IMG_20210424_164502.jpg	5	f
59241ee9-b2aa-479e-b361-92a24c533c5f	2021-04-29 09:00:00+00	\N	6/35. Kevyt kotitreeni liikkuvuuspainotteisesti aamulla ennen vappujuttuja oli toimiva! 	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
aa41d01c-d902-4752-9df9-fb585784033a	2021-04-30 09:00:00+00	\N	7/35. Jee super hyvä fiilis! Toka 6C kiivetty, pikkudarrassa vieläpä!	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
cc61ed5e-12a3-42a2-b533-b5096dd2a417	2021-04-29 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	4	f
c9f55152-6e95-42a3-86d2-84209353c383	2021-04-30 09:00:00+00	\N		75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	4	f
cf95ad78-a12f-46e9-81f3-22df53e8ad52	2021-04-03 09:00:00+00	\N	Aivan todella helppo suoritus! Illalla tuli (tietysti just nukkumaanmennessä lol) ajatus, että jos vaan kuvvaan videon heti aamulla, ku harjailen hampaita ulkona:) Ja sitte kuvasin aamulla. Ja ei ressannu oikee mitää tai mittää kummempia miettiny siitä. Helppo! Melkee olo, että vois vaikka laittaa jottai muutaki tännää ku menne mökille. Katotaa. Ihan kivvaa kyllä kuvata heti aamulla jottai, vaikka kyllä en haluukkaa, että se ois ainut, mitä nyt teen.\n\nLisähuomio 10min tauon jälkeen. Nään perkule potentiaalia jopa tässä jollain tavalla. Ihan sama rupeeko ite jakamaan mitä, mutta nyt rupes Meeri seuraamaan mua ja nyt kun katon sen päivityksiä, niin näen senkin ihan uudessa valossa ja se on pelkästään mahdollista sen takia, että se jakaa asioita Instagramissa! Ja sekään ei ois varmaan ruvennut seuraamaan, jos en ois nyt jotain päivitellyt ja ei ois algoritmit sitä kautta sille mun profiilia tuputtanut. Eli kyllä tämä ainakin siistejä asioita on tuonut saakelisti jo kolmen päivän aikana, mitä nyt on vaikeeta tähän kaikkee kirjotella. Eli joka tapauksessa aivan pirun siisti haaste, mitä ikinä tämä tuokaan vielä ja mihinkä tämä nyt meneekään:)\n\nLisähuomio numero 2. On nyt ollu ajatuksissa jo kiksit siitä, että jakaisin vikana päivänä loppuun ihan tästä haasteesta fiilikset Instagramiin. Että ihan antasin jotain jopa siellä. On hyvä olo nyt tuosta ajatuksesta. Mutta katotaan miltä tuntuu kolmen viikon päästä.	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/9a54f007-47b4-4061-a77d-6842c88f3a52-782A81B4-CEE0-4394-84C6-B208658C9E0E.png	5	f
d5d1d67a-6870-4d0c-928e-7cb3a9ff0e68	2021-04-05 09:00:00+00	\N	Yllättävän helppo! Laitoin postauksen vasta joskus 18, nii sai vähän liia pitkää miettiä, että mitähä helvettiä laittaa. Mutta ihan kivalta tuntu vaa laittaa:) ja ei ahistanu ku vaa vasta iha illalla vähäse!	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/f1fc49f0-cbf9-46db-9c39-62563350573f-E6B6F867-54AC-46BF-8A0E-9B50B2D4F0BF.jpeg	4	f
845a9c9c-f773-4286-9460-af002a82677b	2021-04-06 09:00:00+00	\N	Helppo! Intuition mukana vaan kun Alma tuli kylään. Mutta saakeli heti ku kuuli, että Miksun äiti ihmetellyt että ”mitä se nyt tuommosta” niin unohtu kaikki hyvä palaute ja jäi vaan tuo mieleen:D on se ahistus semmosta	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/a2410b5a-e94b-4bce-ad71-50cc3a53f5cd-0413CD00-3322-4BF8-94AD-D955F3C79101.png	4	f
f6467768-475c-4364-9f3e-b5b04fc868fc	2021-04-08 18:55:33+00	\N	Mainio, hyvä ellei erinomainen! Laitoin perkule kakski storya!! Menin fiilistelemmää Tuokkarin rantaa ja ai että, olipas ihana vaan olla. Tuli ajatus, että auringonlaskua kun mennee kahtommaa, nii pitäs mennä oikeesti ajan kanssa. Nii, että ei oikeestaa mee kahtommaa auringonlaskua vaa mennee vaa istummaa. Ja vaikka juomaa oluen. Nii minä nytte tein:) siinä sitte ku vaa istuu ja ihmettellee, nii jossai vaiheessa huomaa vaa kahtelemansa sitä taivaan kääntyvää liukuväriä ja miettivänsä, mikä kohta tuosta gradientista on kaunein. Ja kahtelevansa kaisloja ihmetellen niitten kaunista tuulessa heiluvaa varjoa tuon valosäihkeen eessä. Aivan täysiä perus skenetysajatuksia, mutta kun niitä ei mene katsomaan, niin niitä huomaa vaan jossain vaiheessa katsovansa. Ei yhtään yrittämällä nähdä jotain jollain tietyllä tavalla vaan ihan vaan kahtelemalla. Ja sitte se ihana rauhallinen vibettelykokemus tulee luonnostaan:)\n\nTuli mieleen siinä joku quote ku kahtelin että: ”Älä yritä nähdä jotain, vaan katso vain, niin alat nähdä”. Senseijuttuja:D mutta niin minä tunsin itse siinä tuokkarilla istuskellessa:)	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/5e937f40-34b0-47a7-9615-7f7ab602c16d-BD2F2542-35AB-41AA-929C-A7CC95B29D72.jpeg	5	f
d7e6ce2c-17bc-4610-ae80-bc70176b3edf	2021-05-02 09:00:00+00	\N	9/35. Hyvät sunnuntaikiipeilysessarit uusien reittien kera!	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	4	f
2a5f9ced-ac78-4b2b-91c3-2f27261e53a4	2021-04-11 20:20:46+00	\N	Ihan todella luonnollinen ja kiva päivä:) kuva ystävistä! Tuntu vaan mukavalta erittäin kovin kivan ulkoilun jälkee Lozzin edustalla. Oli kyllä taas kiva olla ihtensä kanssa koko päivän, vaikka oliki väsy ja pikkune lanidarrapäivä! Kyllä tämä somehaaste jottain tekee siihen suuntaa, että on helpompi ownata kaikki itessä:) ja kyllä nuo postaukset alkaa koko ajan tuntua enemmä siltä, että tämmösiä sitä haluaaki postailla, jos postailee! Sillä mentaliteetilla on helppo postailla	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/26f9b4a0-5516-4c4d-a0a4-b0fe4089c612-1E11FD66-C615-45CE-AC3D-006988C68045.jpeg	5	f
f1a74529-b4f9-4458-bfa9-920c132e821e	2021-04-14 09:00:00+00	\N	Helppo ja kiva! Ei kummempata, tännää oli kiva laittaa vähän turhake kuva vaan leteistä:)	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/261bd406-0fbd-4303-9a3d-f2e44551cdfb-7D239832-4546-4D2C-A1FF-D5BE10D71D1B.jpeg	4	f
623575ea-971a-42e2-a8cf-06286514c31a	2021-04-28 09:00:00+00	\N	Aattelin, että en edes pistä mitään, kun olin tyytyväinen eiliseen postaukseen, mutta pistinpähän nyt kuitenkin "hassunhauskan" metronomiunivitsin, kun tuli intuitiolla. Ihan hauskaa, että on mahdollista vähän sattumalta hetken mielijohteesta jotain laittaa. Siinä pisteessä ollaan. 2 päivää jälellä! Jännittävvää.	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/1d6ca360-2b11-4a67-8850-94fee117e4ef-91335FAE-9684-4316-9E3A-33002630F8C3.png	4	f
4c80d731-3e4c-4808-b4e9-91104eae7d7b	2021-04-29 09:00:00+00	\N		2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/7f8609b9-98ec-4334-aaa6-9cd72d62d526-52E12378-122B-4528-A29E-F724BC322FDA.png	4	f
fe582269-00bf-4bd6-a332-f378e3070378	2021-05-09 09:00:00+00	\N	16/35. Kävin lenkillä ja jaksoin jopa juosta lähes 7 km! 	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
e05e7685-9d00-40d5-aa6b-62f9baafb74e	2021-05-08 09:00:00+00	\N	15/35. Hyviä kiipeilyjä! Violetti 6B projekti on niiin lähellä jo. 	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
3033b37f-0c62-42c3-913c-3b15a4c072f9	2021-05-07 09:00:00+00	\N	14/35. En tehnyt mitään 🦦	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	1	f
65c23494-e310-4e21-a3e1-3d141484a32c	2021-05-06 09:00:00+00	\N	13/35. Liikkuvuustreeni illalla.	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	3	f
2dacee0b-6a9f-491e-befc-e12150eb89ad	2021-05-11 09:00:00+00	\N	Muutama sivu, eihän tästä meinaa tulla mitään	c88aab17-9f41-4e13-9a62-2209567946e1	\N	2	f
70981be9-5d20-4074-8ec5-d9358fcbfef9	2021-05-13 09:00:00+00	\N	Ihana aamun lukuhetki auringossa ennen töitä 	c88aab17-9f41-4e13-9a62-2209567946e1	\N	5	f
6104f513-764c-4081-99df-2e5a37b4bd03	2021-05-12 09:00:00+00	\N	Lueskelua takapihalla ennen grillihengailuja	c88aab17-9f41-4e13-9a62-2209567946e1	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/0370f033-a8d1-4fc0-94bc-00c66edd5463-24D8FE6D-9BE2-431A-B603-558B9A295102.jpeg	4	f
c223e008-f829-427e-8a7b-c1632c9c58b6	2021-05-14 09:00:00+00	\N	Mahtavat omat pojat, joiden luona käytiin	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	4	f
da49e5cf-7b2a-4596-84e2-da83b0dd780e	2021-04-15 09:00:00+00	\N	Taas päivän lopuksi vaan vähän väkinäinen postaus. Mutta sisältöä elämästä! Sisältöä mahdollisista tulevista elämistä uusilla pikku viherkavereilla:) On kyllä joka päivä vaan helpompaa laittaa mitä tahansa sisältöä! Merkillistä, miten nopeesti voi aivot tottua siihen, että ei tämä nyt niin kummosta ole. Kuhan vaan jottain laittaa. Mutta toki se on tämän haasteen takia. Koska on pakko laittaa, niin laittaa jotain. Mutta en usko, että oikeesti on pelkästään sitä! Kyllä tässä ajatusmallit vähän vaan väkisin muuttuu. Ihan siistiä on se huomata:)	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/6d4936f7-0a6e-487d-9a68-0fb4ea082d83-6DD34532-8D17-4E3A-987D-A89EBAB73940.jpeg	5	f
6281a834-f796-4b4e-84a5-8be236ddd3d8	2021-04-18 09:00:00+00	\N	Laittelinpahan ihan kollaasipäivitystä viime kesältä. Eilen en laitellu mitään.\n\nTuntu eilen, että on turha laittaa jotenki rapula/väsypäivältä mitään, koska ei oikeen oo mitään annettavaa. Laittasin, että väsyttää. Oisko siinä järkee? Vois kai siinäkin olla, mutta perkule. Tuntuu vaan tyhmältä.\n\nMutta nyt taas ahistaa pitkästä aikaa! Myös tuntuu kaikki perus ighommat. Että perkule, miks ei tuu kommentteja tai jotaki. Perusahistukset. Myös alkaa tuntua, että sais jo loppua tämä kuu. Ainakin tämä joka päivä jonkin laittaminen vähän ehkä pilaa tätä, on vähän liikaa. Mutta samaan aikaan en minä ois laittanu koskaan mitään, jos se ois ollu kerran kolmessa päivässä tai jotain. Ei oo kultasta tietä.\n\nMutta nyt taas pitkästä aikaa on se olo, että kyllä tämä some nyt enemmän tuo joka tapauksessa pahaa kuin hyvää. Mistähän se nyt tullee? On kyllä jännää. Niin ristiriitasta. Ehkä koska some on enemmän yhistänyt minua joidenkin ihmisten kanssa, ketkä ei oo niin läheisiä, mutta sitten ei tunnu kuitenkaan niin mukavalta ees kovin läheisten ihmisten kanssa jakaa asioita ja laitella someen ja niiden kanssa tuntuu eniten ahistukset, että mitähän on mieltä. Onko se tyhmää? Tarkottaako se, että ne ihmiset vaan on minulle tärkeitä, koska niiden ihmisten mielipiteillä on väliä ja sen takia ahdistaa? Tämmöstä spekutusta tähän iltaan.\n\nJoka tapauksessa, onpahan ollut pitkä kuu saaakeli! Kyllä näissä haasteiden aikana ainakin sen huomaa, että yksi kuukausi on ihan perkaleen pitkä aika, jos ei muuta. Ihan siistiä siltä kannalta, että on paljon tuntunut viime aikoina, että on vähän sumunen koko viime vuosi, että aika on vaan hurahtanut! Tässä huomaa, että kyllä sitä vaan perkaleesti myös tapahtuu.	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/31d729ce-2c89-4326-ae0f-3318031230e7-C961BDF9-BE68-4E01-8810-B43A7E5F6AF8.png	2	f
fff634c2-7dd1-49bf-b35c-f42562b79c77	2021-04-27 09:00:00+00	\N	Laitoinpahan tästä sovelluksesta postauksen. Mainostin! Olenpahan ylpeä itestäni, teinpähän asioita, mitä toivoinkin tekeväni tällä haasteella:) Kyllähän tämä tosiaan toimii vielä enemmän semmosena, että nyt oikeesti näyttää maailmalle, että tämmöstä minä teen tämmönen minä oon. Vielä aika eri asia kuin kertoa kavereille. Tässä oikeesti pistää itsensä likoon. On se ihan siistiä. Ja mitä tänään mietinkin, niin tässä minä voin uskotella itselleni, että tämä riittää. Tämän ei tarvii olla yhtään valmiimpi, yhtään hienompi, yhtään monimutkaisempi, että voin esitellä sitä ylpeänä. Ja on kyllä nyt jälkeenpäin, päivä myöhemminki tätä kirjotellessa on hyvä mieli tuosta! Ihan sama tuleeko yhtään käyttäjää tai mitään, niin voi olla tyytyväinen, että näyttää tätä ylpeänä. Kyllä se tuntuu kivalta! Ja kyllä se vaan on niin, että vaikka asioita tekisi vain itsensä takia, niin ei niitä pidä silti pitää vaan omana tietona. Kun asioista kertoo ihmisille, niistä tulee vaan enemmän omia asioita. Ja missäpä sitä voi suuremmalle yleisölle kertoa jotain omaa asiaa kuin vaikka siellä igssä. Ei ainakaan tällä hetkellä minun elämässä kovin suurempaa kanavaa ole. Hyvä Ekku!	2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/53600d08-f9e9-4950-8b9f-f7f7b5a4e400-C8BE04BA-493B-494A-8C9C-1D899EF69ECC.png	5	f
e1f040ee-41db-4fe8-aae9-50b2dd822c36	2021-04-30 09:00:00+00	\N		2fe35c10-0c40-42a8-96cd-5178fb09f2b5	https://zen-tracking.s3.eu-west-2.amazonaws.com/marking-images/a5153ba8-76e8-4863-8360-5e0b281b2c68-1BA284A5-55D7-4145-9931-BD3964BE2721.jpeg	3	f
df721a9d-8f64-4f2e-98e1-f0aa96aca41c	2021-05-02 18:28:44+00	\N	Ahkera	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	4	f
11862d55-6716-4695-9999-ed87f9863d59	2021-05-01 09:00:00+00	\N	Hyväksyvä	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	2	f
f3d011f5-a274-4082-bb41-bbde56e6c5e8	2021-05-03 09:00:00+00	\N	Kelpo lukuhetki aamulla. Kyllä tuo Sinuhe vielä päihitetään. Oli kyllä karuja settejä heti parin sivun aikana. Taitaa olla Sinuhella rankat ajat tulossa lopun aikaa:/	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
2de20cd0-6790-4823-8909-085a126339c6	2021-05-28 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
1f60188e-35c9-445f-bff2-ccb2c139ef67	2021-05-03 09:00:00+00	\N	10/35. Vähän meni tiukille, mut sainpas itseni lopulta taivuteltua jalkatreenin pariin vielä illalla.	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	4	f
a6d2b80c-cc7b-4023-b588-b713de3eb724	2021-05-04 09:00:00+00	\N	11/35. Jälleen kotitreenailua illalla ✌🏽	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	4	f
a01546e2-c0c3-4eeb-a7ba-45cea1cccc7f	2021-05-04 09:00:00+00	\N	Toivoa kesästä	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	4	f
c0252a7f-ffdd-4d04-8927-ca79801e1d54	2021-05-03 09:00:00+00	\N	Hyvä porrastreeni, huippuolo	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	5	f
ea0c9ab8-e6ce-4fda-b37e-c83e5a777084	2021-05-04 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
3aa5c7ec-9fd8-4410-aab4-df11974d5465	2021-05-05 09:00:00+00	\N	Perkeleen Sinuhe, kun pistää surullisilla tarinoilla ison kasan ravisteltavaa heti aamuu	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	3	f
a0c3a75f-8ab5-4fe9-ac65-39c96a78f406	2021-05-05 09:00:00+00	\N	12/35. Hyvät kiipeilysetit! Violettiin 6B projektiin muuvit tehty, ens kerralla sit koko reitti putkeen!	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
82055e27-f43a-4c02-aa51-1ff55e3c9ee6	2021-05-04 09:00:00+00	\N	Säälittävät muutaman sivun pakkolukemiset, kun en saanu vielä mieluista kirjaa kirjastosta	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	1	f
716b2ee5-8d73-4479-b388-80a904f66062	2021-05-05 09:00:00+00	\N	Säälittävä nopea kirjan avasu myös tänään illalla 	75f8fa9b-75e3-4da0-8008-1bb19aed8440	\N	1	f
bfef21f3-e195-4a61-b018-d6627289bbfc	2021-05-04 09:00:00+00	\N	Säälittävä muutaman sivun pakkolukeminen, kun ei oo vielä mieluista kirjaa kirjastosta	c88aab17-9f41-4e13-9a62-2209567946e1	\N	1	f
73934bb5-e46c-4bf4-9565-ae24f55d7d7a	2021-05-05 09:00:00+00	\N	Tänään samanlainen iltaräpistely, ja missasin vieläpä kirjan hakuajan vaikka seisoin jo kirjastonovillakin, mutta sit tuliki pitkä puheluXD	c88aab17-9f41-4e13-9a62-2209567946e1	\N	1	f
05e97a40-e599-4b2f-a0fe-50300a23680d	2021-05-05 09:00:00+00	\N	Töissä hyvä flow	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	4	f
265070cf-95be-4bef-b46b-f889b9038ff5	2021-05-06 07:33:09+00	\N	Luin 10 sivua varmaan 15 minuutissa, sairasta	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
e328a0dd-cd63-401b-af0e-8bc19322c4bc	2021-05-06 09:00:00+00	\N	Täydellinen rentoutuminen hierojalla	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	4	f
58fa2861-c582-415a-9fcc-b835a952f788	2021-05-07 09:00:00+00	\N	Koko perhe koolla mökillä ja Ekun synttärit ja yritysjuhlat 😁	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	5	f
80e6c06a-35fa-45cb-9a1e-3c0c6b6a0ff6	2021-05-07 09:00:00+00	\N	Illalla lukemista. Ainakaan Sinuhea ei pysty niin hyvin lukemaan, keskittyminen menee heti, kun väsyttää.	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	2	f
d809c224-587f-45c7-83a8-c7a96d3c0d38	2021-05-08 09:00:00+00	\N	Jos ei aamurutiinina lue, nii on se vaa vaikeeta ottaa aikaa päivällä ja asettua lukemaa, vaikka ei mitää ois	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	2	f
4660ec92-ddd7-4d55-a114-5e58f8d554a9	2021-05-09 09:00:00+00	\N	Paras kirje ikinä teki niin hyvän mielen ja äitienpäivä ylipäätään	b6925dde-6de7-46fa-b32b-542da1ca8c2d	\N	5	f
52f32fb6-23ac-4243-a454-57ae6b17e39f	2021-05-09 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	2	f
2e6479d2-c040-4a1c-99f1-d19a180de4bb	2021-05-16 09:00:00+00	\N	Kyllä se vaan putken pitäminen näissä suoritushaasteissa on hyvästä. Kaks päivää taukoo nii tuntuu taas kunnon kynnykseltä alottaa, mutta mukavahan se oli vaan lueskella.\n\nHuomasin, että aika pinttyny myös aivoihin joku tekemisen pakko, kun aamusin aina pittää taistella sitä vastaan, että pitäs tehä kaikkee. Toki tuo vika kurssi nyt varmaan tekee helpotuksen, kun vaa loppuu	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
154934bf-e0d2-49ed-a384-792ab0f6a3d4	2021-05-17 09:00:00+00	\N		c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
1c62f12c-ff43-4069-b976-28e473acb102	2021-05-17 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
ec9b8984-e8f1-43a6-8d79-e4d111794c76	2021-05-17 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	5	f
696e8e9a-c114-4a7b-b59c-b57cdc00f31c	2021-05-17 09:00:00+00	\N	Iltainen lukuhetki. Ihan mukavata olti iltamyöhäänki ku ei vaa sängyssä lukenu!	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
b333d592-5399-4389-9dfa-335d4f43199e	2021-05-18 09:00:00+00	\N		c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
16e39e3e-ddb1-4e85-b503-d4f0004498bb	2021-05-18 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
716c227d-8c04-45f8-a598-af95a4d711fd	2021-05-19 09:00:00+00	\N		c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
d985d206-65ff-4520-a005-1ba1d3963592	2021-05-19 09:00:00+00	\N	26/35. Jee violetti 6B projekti done!	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	5	f
e7b4ab54-c254-4a8b-b62d-b71cfd977955	2021-05-10 09:00:00+00	\N	17/35. Kevyt parin kilsan kävelylenkki.	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	2	f
4a752858-ddef-4461-ad63-da995ccbf616	2021-05-11 09:00:00+00	\N	18/35. Heh, en tiiä lasketaanks, mut auton siivoominen ja pesu meni kyl iha urheilusta	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	2	f
ca3033c6-ce81-4058-be2f-532abf275bf4	2021-05-12 09:00:00+00	\N	19/35. Jaksoin lopulta vääntäytyä pikakiipeilyille illalla! Violetin 6B projektin yrkkäilyä. Muuvit menee, mut kokonaisuus ei vielä ihan.	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	4	f
7b4f8e55-8cd7-44ec-b606-6711f390d42b	2021-05-15 09:00:00+00	\N	22/35. Tarun kaa kiipeilyä! Oli mukavaa!	bc811337-8f99-42f5-9661-15b7d5963aa1	\N	4	f
23d1fb5e-473e-439b-861a-d9a5cc3d4d18	2021-05-20 09:00:00+00	\N	Iltalukemisia, ei meinaa malttaa lopettaa ni osaispa joskus alottaa aiemmin	c88aab17-9f41-4e13-9a62-2209567946e1	\N	4	f
11e4a049-55bf-4d7d-b08f-dfdcfd809766	2021-05-18 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	3	f
d6f4b96f-dadf-41b3-a477-8e986015c69b	2021-05-19 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	2	f
9566ace1-50e3-4d80-ac5c-28d4ff74ead6	2021-05-19 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
f6691c79-e780-420e-b5fa-a07976cef773	2021-05-20 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	3	f
e05b3f5c-11dd-48e0-bbe3-ef03df5b7fc6	2021-05-21 09:00:00+00	\N	Houkutuksia	effd4904-d0cd-46b0-a338-862844632111	\N	2	f
eed88837-9a3a-4e1d-aa84-6a672555ae52	2021-05-21 09:00:00+00	\N		c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
01cbd213-9364-4b09-8451-9ff20066fce8	2021-05-20 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
8f1b3c82-7409-450c-bf1d-171f63f9279f	2021-05-21 09:00:00+00	\N	Perkele 30 sivua jälellä	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
8495db4e-b775-4fe7-9376-8d16423791f2	2021-05-22 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	4	f
fddde913-ad13-4cfe-9b6a-b594a83246c5	2021-05-23 09:00:00+00	\N	Ohi on perkele!	d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	5	f
d0cc3499-4f46-43a6-ace4-f0e1e01f2151	2021-05-23 09:00:00+00	\N		c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
2d3b97f6-9bf8-462b-94e3-0cff468ecb08	2021-05-22 09:00:00+00	\N		c88aab17-9f41-4e13-9a62-2209567946e1	\N	4	f
9a9b868a-eb09-45cb-9ee9-78efa08bd8b8	2021-05-22 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
f862f1cf-625c-4818-8dae-99bb3ac82aa1	2021-05-23 09:00:00+00	\N	Melkeen ostin karkkia, hui.	effd4904-d0cd-46b0-a338-862844632111	\N	2	f
256543d3-bc3e-4401-b154-3d358b98fc6b	2021-05-24 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
04a40ea5-e33e-441f-9a16-9a031dbbef74	2021-05-22 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	5	f
480b4c55-bf21-4f00-8072-b2171a00d837	2021-05-23 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	5	f
b3c5ecb7-c331-4845-b54f-c2f6b2628967	2021-05-20 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	5	f
ffbbe978-683d-4e97-956d-4285c76a393a	2021-05-19 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
7650e920-ee74-4d2e-9da0-07deed452a13	2021-06-03 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
2c8fb0a0-7572-4a00-99d1-fa51ba6df898	2021-05-21 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	4	f
4616b494-5aeb-4d91-9015-f8c07dee61de	2021-05-18 09:00:00+00	\N	Houkutuksia. 	8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	2	f
f8b6edaa-09b2-4977-a94b-cdcc1d8b7e1b	2021-05-24 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	5	f
970660e5-966b-470d-9674-19251be13580	2021-05-24 09:00:00+00	\N	Myöhäseks se taas meni mutta tulipahan 	c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
dadc8bbc-5294-44ef-ad64-c66096ae949f	2021-05-25 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	5	f
384e90a1-40c1-4a0c-afde-3f57fd0df098	2021-05-25 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
37667a44-95c9-4998-bc89-693cc004392c	2021-05-25 09:00:00+00	\N	Lounaslukemiset best	c88aab17-9f41-4e13-9a62-2209567946e1	\N	4	f
4c5c94ba-fbcf-49a3-b617-75bb40048427	2021-05-26 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
47ce7963-c7e1-424f-af6c-bf5dbf4f49bf	2021-05-27 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
3b321302-e954-48ad-a2b7-2d830b928c34	2021-05-26 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	5	f
af897729-16b4-41fd-889d-1489602c9de4	2021-05-27 09:00:00+00	\N	Houkutuksia. 	8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
90422e68-7971-4928-9065-aab3db7f2652	2021-05-27 09:00:00+00	\N		c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
7651e056-5fe2-4a80-8314-c639a24f4095	2021-05-26 09:00:00+00	\N		c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
dcadeb77-e1c2-43c0-991c-daec4ba8a136	2021-05-28 09:00:00+00	\N	Aamupalalla lukemista ennen töitä	c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
3fbceb27-4e68-4671-94e5-99b41b4f7fa9	2021-05-24 09:00:00+00	\N		d9ce7ea1-c808-4fcd-a306-8f756f2785b1	\N	3	f
26363e96-08d7-4a2c-a4cb-a69f66858a33	2021-05-29 09:00:00+00	\N		c88aab17-9f41-4e13-9a62-2209567946e1	\N	3	f
84f4a636-b7f5-4a1f-bc47-06697489deb6	2021-05-30 09:00:00+00	\N	Keskellä yötä taas, ei mee ihan nappiin	c88aab17-9f41-4e13-9a62-2209567946e1	\N	2	f
31f555fc-1c0f-4f80-9b63-5865e65dff14	2021-05-30 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	5	f
cb14aeed-18d4-4ab2-86e6-94bb95f4a293	2021-05-31 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
8a31fb97-617f-41fb-a2ec-3f2c6badbdc7	2021-05-28 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
b9feb1f1-937e-4eec-a52e-5a402be34381	2021-05-29 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
bb3f2a2b-b802-4f98-ba24-c7dcd9f010fc	2021-05-30 09:00:00+00	\N		effd4904-d0cd-46b0-a338-862844632111	\N	5	f
6e854278-9bb3-452d-a67e-f385a4923157	2021-05-31 09:00:00+00	\N	Yöllä taas enkä mää malttanu lopettaa ku meni jännäks	c88aab17-9f41-4e13-9a62-2209567946e1	\N	4	f
4769efeb-e261-4927-bae6-fdb935f8ee5f	2021-06-02 09:00:00+00	\N	Päivälauluttelut Tipi kanssa<3 La vien rose uutena kipaleena	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	2	f
37dc1fa0-b802-4982-8072-5d3247a21fd4	2021-06-03 09:00:00+00	\N	First day of my life - PERKALE ON HYVÄ HAASTE!!!	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	5	f
54fbea30-3fe7-4fae-8793-6140beee849e	2021-06-04 09:00:00+00	\N	Kiss from a rose - perkuleen vaikeeta	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	3	f
0a5ae6bc-9fd4-479f-acbe-c9cf3d2373d0	2021-06-06 09:00:00+00	\N	Dear god	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	4	f
a249eb63-0fab-4cac-adfa-e0dc71200712	2021-06-07 09:00:00+00	\N	Youve got a friend in me	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	2	f
a4ea7935-0a91-4957-9d31-97546da7fc79	2021-06-02 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
d6f28cbd-ae0e-4aac-b103-e1f2a4bd0e57	2021-06-04 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
ff3b6620-2de6-4071-b61c-02ef8583be1d	2021-06-05 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
07b4e694-6713-47b6-a3d9-4c5df2e2656f	2021-06-06 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
60d7a227-e24d-465b-8777-d57e037426c2	2021-06-07 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
f79f2e5f-558b-48f2-9bda-f0bb267282d6	2021-06-08 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
b450f84f-9378-4799-ad42-7e042da51b53	2021-06-09 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
91769ff9-dcba-403a-8a54-853f4bb5fca9	2021-06-10 09:00:00+00	\N		8cb3be66-7255-493b-96d1-7fd3c5f3b206	\N	3	f
6d56a4e4-92f7-4b95-9d20-4a93c83923d7	2021-06-11 09:00:00+00	\N	Maailma on sun	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	2	f
f4e2058a-4f9b-4f18-a9cd-28474311546a	2021-06-10 09:00:00+00	\N	I wont be found	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	3	f
22575699-82cb-4186-9573-a14c4db7b6d1	2021-06-12 09:00:00+00	\N	Kurjuuden kuningas! Nuoteista vielä perkule, isoja tekoja:)	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	5	f
dcc1fd50-88ba-4ead-a0da-4cbb1eab6580	2021-06-14 09:00:00+00	\N	Fly me to the moon coveri sooloineen!	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	4	f
c4512e37-9c7e-480e-a144-b0a1946a2941	2021-06-15 09:00:00+00	\N	Deep river blues - aivan perkuleen mainiota jamitella ja vaikka taas alussa tuntu epätoivoselta, nii ku antaa mennä vaan, ni kuulostaa yllättävän hyvältä ja menee luonnollisesti! Vois useemminki vaa soitella vaa miltä tuntuu sointujen pohjalta eikä yrittää vaa saaha just niiku biisissä on	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	5	f
e403f45b-5d66-425c-90f4-b2239db5e323	2021-06-18 09:00:00+00	\N	Jamit pihalla kahveeen kera	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	3	f
1e74b8e7-50fb-4d9a-a8d4-7def14e7a40c	2021-06-21 09:00:00+00	\N	Ehkä kaikki palaa itsestään ennalleen	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	5	f
737ef2fd-a95a-4868-b750-1849b3b56299	2021-06-23 09:00:00+00	\N	Ei uusia biisejä mutta vanhoja kultasia rimputteluja:)	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	3	f
67b17ec3-007e-4139-926d-136c3f347e28	2021-06-27 09:00:00+00	\N	Little wing alku	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	4	f
cb358785-d2dc-48f3-b898-06bb1c878f7a	2021-06-29 09:00:00+00	\N	Mestaripiirros	19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	3	f
f987ba68-dfbd-46ce-8caf-42d37794a8fd	2021-06-30 09:00:00+00	\N		19757979-66a4-4b3a-a8d3-0bff4b08b0bc	\N	3	f
\.


--
-- TOC entry 3089 (class 0 OID 16951)
-- Dependencies: 205
-- Data for Name: Quote; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Quote" (id, quote) FROM stdin;
70262b48-54ea-4ab1-a34c-9ff2184db837	Ihminen tekee töitä kuollakseen Ja kuolee töitä tehdäkseen —
08a76659-7fd0-423c-bb19-0faff4ff16f4	Ihminen tekee töitä kuollakseen Ja kuolee töitä tehdäkseen —
6b060bb2-7315-49b7-b235-bfa738a5bc8e	Ihminen tekee töitä kuollakseen Ja kuolee töitä tehdäkseen —
d0b82787-bf19-41d3-8cdd-c105b0dc0079	Ihminen tekee töitä kuollakseen Ja kuolee töitä tehdäkseen —
ddf1e0cf-9cdb-4c93-8183-3aebd4ffd8bd	Ihminen tekee töitä kuollakseen Ja kuolee töitä tehdäkseen —
dd3494ab-6dab-4e40-bf13-970ca8cc0b4c	Ihminen tekee töitä kuollakseen Ja kuolee töitä tehdäkseen —
8b8de020-d96e-4b0b-8043-692e486144fb	Ihminen tekee töitä kuollakseen Ja kuolee töitä tehdäkseen —
21912dc5-ca9f-453f-bef0-2ec95eef1c30	Mutta parempl kulntyhma ä
fac26a5d-e5f9-49cb-9ae5-b8a3ad8934a1	stwmim&fmm"*w a ei Gre!sHoma T-
822785c1-6933-4d8c-b2a8-f8e1573fcca9	Luonto ei kiitä se!
cbff06cb-830f-445d-b978-86e13fd8a3d1	Älä lyö Kosketa kovaa
8ca2d70b-7dac-410e-9120-79401da5c456	Älä elä tässä ja nyt Vaan täällä ja tänään
ded4983a-fdc8-4cbf-afc5-e0ef9cac658c	AY KT MIN TAVTTAKKUTANI
622103af-d8d4-49be-a43c-af79c24b921b	Kiistaton totuus on huonompi kuin kiistelty selitys
bc05bd5d-9ebc-44cf-a946-7509606d10a0	Oleminen on helpomp OIS AYU
c1ade438-dccc-4ad5-91ed-0995e7134702	Älä sano sitku Sano nytku
70727f27-f3b0-485f-886b-4326d09163e1	Nukkuminerš%?plille turhaa Jotka ovat levänneet
406d2af7-bc0f-44f1-ab5a-1e4c0dcd72f3	IS YL niin myöhemmin
bbed6c18-497c-4dee-8565-306b3ff70424	Asioilla on tapana tapahtua
557d7dda-107a-4963-a3be-c40302ddc8f1	Joskus on hyvä lentää perse edellä puuhun Joskus maha edellä maahan
88200ab6-311c-4184-92c0-b28e21efb815	aa töitä elämäsi SIS n Älätaakse
49cee9f3-d1e7-417d-80a2-5f996c08fe79	Näyttämölläkään ei ole sälekaihtimia
9b112bff-29fe-45e4-85db-244b48026b07	Rahi on yritys pelastaa huono sohva
aa5a1f46-949a-4375-9a02-faa62ce49a12	Merenpohja on kuivaa maata märkänä
13b82a68-a36f-4539-a396-a67e6b5fdc6c	Ikinä ei ole pakko Joskus on välttämtöntä
483e35fa-5b0f-4b36-afd9-7dd4e8626551	Elämä on pitkä aika Kaiken sujumiselle
69f9f51a-2392-43be-9555-71e4e5e4c6ed	Haahuilu on kävelyä ilman tarkoitusta
c79f6788-e8b4-4ae7-ab89-3892e0ee14f8	t,.a ie Vielä yksi on palfg&pi e Kuin ei eää kaksi — *
7b2d6b97-0bec-422f-8b29-494836c4fc1e	Peitto ei lämmitä niitä Joilta se on viety
6a122693-a4ed-4caa-8b70-5eb410725eb9	K aan . OION
092dcbdc-7356-442c-a2c6-253c2d17513c	Talossa jossa ei ole seiniä Ei kaiu —.
34863fab-543f-422d-83bb-4df01cf7c747	Sanojen merkitys katoaa niiden paljouteen
0e01e007-3fc2-4ce9-b4c3-d206aee057a0	Säädylliset sängyt pitää yllään petivaatteita
292d1d14-ad7b-4793-a571-ec2f4ffc4461	E Jäätyneet vesimolekyylit ovat lumihangen merkki
7d76bc00-7bdf-4c0d-bcca-ad4d296367c5	Suomalaisten elämä on iso kosteusvaurio
4e1d7499-4b06-4b3e-9535-aac701818724	Jos juot niin älä niele kaikkea pureskelematta
78f486c8-1a4a-4d1c-b89b-dbc8058d3abc	m-i" K ä e A .».( i * 4 E OO TT
18184b43-7036-4baa-b522-3555c4e02071	Vaivannäkeminen on parempi Kuin sen tekeminen
361929ce-96cf-4a92-bbde-5f9d0607a6c9	Elämä on täynnä mahdollisuuksia Ja nyt niitä on vähemmän
af67a351-4718-41e9-97cb-5d62947d9f2b	Sukka piilottaa ruman jalan AY KT EE T 7OS EIUIU TTT E ) OE PNN
3f9020f7-377c-4dd8-a6f6-fbc6713bdd53	Työn teko on hienoin teko Mitä voi tehdä Saadakseen rahaa
045905b2-7a4d-4bce-a49d-49a557b48433	Jos ihminen olisi pystyssä koko elämän Ihminen olisi lytyssä
b0d843b0-3557-44db-9dfe-e688288aa0f7	N k iii P il d * —Välillä on hyvä tönöttää seisomisen sijaan
f89eaf15-254b-4a23-b0ad-af8f226246c7	; P L * k- p 1 Opeta itsesi oppimaan opettajalta Jotta sinun ei tarvitsisi oppia
a7c75070-7dc3-4907-981e-bc314424bc1f	Raha ei tuo onnea Pk2 00a PN aa ONU TU e: keN N Jos olet surullinen
7cf0d404-0583-4c59-803f-d2b19a7104f4	Huomenna kun heräät on taas aamu Ja sitten pitää tehdä töitä
f87d4f97-9dc9-4b8b-a84c-dab18c7cc4d8	= a p  — — YL T n vs "x : Elä"-tarkoittaa kieltoa .
59984daa-1a4e-491f-a7c9-53497021fd74	Ihminen tekee töitä kuollakseen Ja kuolee töitä tehdäkseen —
\.


--
-- TOC entry 3090 (class 0 OID 16955)
-- Dependencies: 206
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (name, password, is_private, email, is_email_verified, created_at, finished_and_checked_challenges) FROM stdin;
uusi ukkeli	$2b$10$LZOk95DS5jawIsysodmvIezuft0diYVRhVMLphW9IV8Qx7mrN13SK	f	\N	f	2021-04-27 22:01:01.7228+00	{}
joku	$2b$10$//nNTmyODqlLO2jFS2XeZ.VYY5P3hHaRpW384TIYoNAdXdrVumsca	f	\N	f	2021-04-27 22:01:01.7228+00	{}
aowseifujawoi	$2b$10$5cBljZmbY5DgyYaG8Pe6zOUPtQXbxPQwaopYNsS/9LsBGDaIIzHsy	f	\N	f	2021-04-27 22:01:01.7228+00	{}
terve	$2b$10$WzjuFVkagVXN6VBkAUvx4.GuQgkMdxnaYw2CPku0eQpvz0aoo5jRG	f	\N	f	2021-04-27 22:01:01.7228+00	{}
wefawfw	$2b$10$lAWpjX6KNWoJ8k0.ch9dtOBw/LR2pYrl450XMonOXk8C/lce/.BA6	f	\N	f	2021-04-27 22:01:01.7228+00	{}
Tipi	$2b$10$.Eh86Fpzfe7LXc5JVBM9Sewgtkv4.H/RmM1c0eHHB6XtRivEIqtpW	f	\N	f	2021-04-27 22:01:01.7228+00	{}
ukkeli	$2b$10$8r0qPVaJeLES1i9m8J54BOw/StfV4H4Xrg9A4O0agr9UvaZTvBhye	f	\N	f	2021-04-27 22:01:01.7228+00	{}
awodijadio	$2b$10$Gq2S67Sr4UFZVbF4itvaeu2Tt2O02pcedkQVSDYz8LUADZZnLmMqe	f	\N	f	2021-04-27 22:01:01.7228+00	{}
awfdaf	$2b$10$t4lKbCeSBuXLyEd6B/dxLOwJP2E1FJP1jebmZ653dbsEzGVzH5kYi	f	\N	f	2021-04-27 22:01:01.7228+00	{}
rweagarweg	$2b$10$5wilbDkADAkhtLQd.ISaKu4orSY92brUorGH4wf0EJYFQelZBjRza	f	\N	f	2021-04-27 22:01:01.7228+00	{}
juhevalt	$2b$10$82ew99o0UCj0WVk.9qJiLOi35aoV0HaY/IaYEgqC.6n3oDWara3b6	f	\N	f	2021-04-27 22:01:01.7228+00	{}
oerigfjreoijg	$2b$10$5MzEjSeUxxyjPMXIZFG7MeoMpj89zu2VRE/kk.7GarHN3XkvwesE.	f	\N	f	2021-04-27 22:01:01.7228+00	{}
eke	$2b$10$hQTRQorcBpq3UZWptL5.cOGgOPxPyQBHCbuh18bdI3WD1dECRSKd.	f	\N	f	2021-04-27 22:01:01.7228+00	{}
aoeijfwoi	$2b$10$2MduoFz6VvODDVjkjti2Ye9yGLccAMmHBr2QcYM2juEqALLqqSqYS	f	\N	f	2021-04-27 22:01:01.7228+00	{}
eargaeg	$2b$10$j1UUHbQwo7tD3KDXNMcegeucZMaYeXti3EQDBX2NLzfYl/rAtTqam	f	\N	f	2021-04-27 22:01:01.7228+00	{}
asdasdawdawd	$2b$10$uxjgNv0fpsGaE6uwy9GwSODrj0D/ZtcezCMAmiWB6Kwgsi95KxomW	f	\N	f	2021-04-27 22:01:01.7228+00	{}
AWEFAEWF	$2b$10$f.weSi10li6K9IsQVoafcutVl7Bs8Ja2sMCNwYxDsL74a9L.vUXNO	f	\N	f	2021-04-27 22:01:01.7228+00	{}
aquamies	$2b$10$RKBC38VhT29WaNpIlU/tKuQeZ/poGYC.3HOycRsMtymopCRpJ4SYu	f	\N	f	2021-04-27 22:01:01.7228+00	{}
uusiukkeli	$2b$10$1jD0zvlR2jckqeJPheS71uhqhvpReItYJQhl2ylhlQdqVnJVc4HjG	f	\N	f	2021-04-27 22:01:01.7228+00	{}
Lassi	$2b$10$ILmmPrBeCNkBcqCw5SdBPudWbad2bkYbAbgWxwm2aoMniNyht3IF.	f	\N	f	2021-04-27 22:01:01.7228+00	{}
Heini	$2b$10$erzIzXqyMXPZ6Vd5YV4Kh.EID4XwSYE1GV4O47KsYFTRz8xA2/Bii	f	\N	f	2021-04-27 22:01:01.7228+00	{}
Päivänsäde63	$2b$10$UOLTiPLwBarlK.wJX1RCk.wP.YW8iqbt6/Bz2co7uPVgM/nbaQIxa	f	\N	f	2021-04-27 22:01:01.7228+00	{}
Lohkaremies	$2b$10$IZNtrk5LWNA/tc.barT.y..pnBGKOajDXjyyVFNHCINvFuajkvEfO	f	\N	f	2021-04-27 22:01:01.7228+00	{}
LohkareMies	$2b$10$8FI1ghrl9Tk2t2Fv47yPzeGx9hjoyIfQw/hDxDzaZeZ5pbxTvGJDK	f	\N	f	2021-04-27 22:01:01.7228+00	{}
testi1	$2b$10$m/AOh27GZVydiKVhCDuj3O1Bz4fNzRSrqwyL49lP97wVvh1Io1K.K	f	\N	f	2021-04-27 22:01:01.7228+00	{}
testi2	$2b$10$1qM0s/9A3cIZEprZgZ146OdXr4KhLaNan8HSfhomJ9DBf6cJrf3Y.	f	\N	f	2021-04-27 22:01:01.7228+00	{}
testi3	$2b$10$ieuFNRoaKfMmOCT9et.MB.VAZCcEAB.WhBFSn8l43KQYRv4taWCD2	f	\N	f	2021-04-27 22:01:01.7228+00	{}
testi4	$2b$10$a.33EhACp/6vtwItdeGaCufUf0q9PcdEFmThH1NjZlnvCP5PAeXYW	f	\N	f	2021-04-27 22:01:01.7228+00	{}
LohkareUkko	$2b$10$xp/fEd4ziS0piyLBYYgqUuyZv0xRWBZ8KbzXIXAss4mFii/cMYkWq	f	\N	f	2021-04-27 22:01:01.7228+00	{}
uusi-kayttaja	$2b$10$ij8DsN.BluLYW1aSogP7wuQgk896DH.5fKsgvPQ1neVjiz1m83tjK	t	\N	f	2021-04-27 22:01:01.7228+00	{}
annukka	$2b$10$flV5rxuRLFHqQ3qHf9PXoOOH2CDnIt8MAgnj4KZbvIzIxm6Gqtlly	f	\N	f	2021-04-27 22:01:01.7228+00	{}
Sippi	$2b$10$.kOz2Muwo4M4WGxX9VEHCO/JiL2K0c8xUG/pomUPCNvUcM0b3dh6i	f	\N	f	2021-04-27 22:01:01.7228+00	{}
tonttu	$2b$10$tRNspYqZiCD/SF3w729TCuTdu4RpAcfBTObydThEORFKfHM8TVVlG	f	\N	f	2021-04-27 22:01:01.7228+00	{}
jukka	$2b$10$E6QoS3RHJAvTB8Qf2/aGNuQzSkZTzh34VZdqKEOtZxcy5LtWR2Soe	t	\N	f	2021-04-27 22:01:01.7228+00	{}
huoletonhummeri	$2b$10$iKa28puj7/UU/uuI0528juDzMIpw6VeloAVQxIOLhPsRfiyKQ3k1u	f	\N	f	2021-04-27 22:01:01.7228+00	{}
mestari	$2b$10$8w61V0QR3QOB2GyDpJMJRO1rBq//HAKKTYn5rTJVOHCnJoG7EqQlq	f	\N	f	2021-04-27 22:01:01.7228+00	{}
main-user	$2b$10$rDJ0tOX659HgyRv0rsHb0ODD2aH74rfMu.Z/uLZ8zrR1EhnKLqpCO	f	\N	f	2021-04-27 22:01:01.7228+00	{}
created_at-testi	$2b$10$pTmwW/0Wj6.azHgRwH2gieSxa0b28CvX/xJQ2vXWsnJWd16aSrVaq	f	\N	f	2021-04-27 22:26:58.052+00	{}
testiukko	$2b$10$YX1YxQ4L22g0W96vJzjNqeimw8jfyhMlp8TUcJoywI46qG7sHgWn.	t	\N	f	2021-04-27 22:30:45.418+00	{}
Jontutu	$2b$10$.mYiyHJtw5LIs7pS3QEK1uZripUZLITqwSC4KPl8QGa6pRo2yImBG	f	joonas.eriksson1997@gmail.com	f	2021-04-27 23:05:23.01+00	{}
sinppa	$2b$10$7WYrypKjS2ghhbVODVdtYueWOTyPh/2ZHkQZSOh0Ez5b9FrfmvjKa	f	\N	f	2021-04-28 03:57:33.858+00	{}
zentleman	$2b$10$ladcjMAYUZatGjginv83qOdMDzr9l.ahw2xHDwD1VFL3wAwNNSN0G	t	\N	f	2021-04-28 05:39:17.144+00	{}
montte97	$2b$10$nh9QqQpix2xtS1VRAD4Xf.Tt.HrfQR5QPLOZVVw9L5gJVHnpr6Lme	t	\N	f	2021-04-28 06:00:15.313+00	{}
Zeniukko96	$2b$10$3yP8RHFvjD2fYut8xmVocewtcSYrl1rAYRD.OG2hgxrFYqqj1EZvG	f	\N	f	2021-04-28 14:02:02.841+00	{}
asdasd	$2b$10$nkyJiwVrNVCA23rEhHW5L.8KjzamlWYuZtp4/EbJqs6aQ.r7pKV2S	f	\N	f	2021-04-29 11:45:10.354+00	{}
rajuerkki	$2b$10$PEjPe1XcEzQhv01oMMEyfeshOpk5xcMI3BB8Kh8H2lMN0tZUj8kqe	f	eeerik@windowslive.com	f	2021-05-10 08:57:27.361+00	{}
naps	$2b$10$OHur/LG5qQTCAx1Wu0E75.3KsGkSbUwjLY75N3y1cCQ5Pu0.BorO.	f	napunapunapu@gmail.com	f	2021-06-04 07:52:20.1+00	{}
ekeukko	$2b$10$j9vWdlkeU/s3m0lwV2P3zOGt5g5VqtgY9ngRE.z9NqgcUibkQuX3a	f	\N	f	2021-04-27 22:01:01.7228+00	{f04c55a3-41c4-472b-bbe7-9127932455c2}
\.


--
-- TOC entry 2941 (class 2606 OID 16965)
-- Name: ChallengeParticipation ChallengeParticipation_challenge_id_user_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChallengeParticipation"
    ADD CONSTRAINT "ChallengeParticipation_challenge_id_user_name_key" UNIQUE (challenge_id, user_name);


--
-- TOC entry 2943 (class 2606 OID 16967)
-- Name: ChallengeParticipation ChallengeParticipation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChallengeParticipation"
    ADD CONSTRAINT "ChallengeParticipation_pkey" PRIMARY KEY (id);


--
-- TOC entry 2937 (class 2606 OID 16969)
-- Name: Challenge Challenge_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Challenge"
    ADD CONSTRAINT "Challenge_name_key" UNIQUE (name);


--
-- TOC entry 2939 (class 2606 OID 16971)
-- Name: Challenge Challenge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Challenge"
    ADD CONSTRAINT "Challenge_pkey" PRIMARY KEY (id);


--
-- TOC entry 2947 (class 2606 OID 16973)
-- Name: Marking Marking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_pkey" PRIMARY KEY (id);


--
-- TOC entry 2949 (class 2606 OID 16975)
-- Name: User User_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key" UNIQUE (email);


--
-- TOC entry 2951 (class 2606 OID 16977)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (name);


--
-- TOC entry 2945 (class 2606 OID 16979)
-- Name: ChallengeParticipation user_challenge_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChallengeParticipation"
    ADD CONSTRAINT user_challenge_uniq UNIQUE (user_name, challenge_id);


--
-- TOC entry 2953 (class 2606 OID 16980)
-- Name: ChallengeParticipation ChallengeParticipation_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChallengeParticipation"
    ADD CONSTRAINT "ChallengeParticipation_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES public."Challenge"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2954 (class 2606 OID 16985)
-- Name: ChallengeParticipation ChallengeParticipation_user_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChallengeParticipation"
    ADD CONSTRAINT "ChallengeParticipation_user_name_fkey" FOREIGN KEY (user_name) REFERENCES public."User"(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2952 (class 2606 OID 16990)
-- Name: Challenge Challenge_creator_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Challenge"
    ADD CONSTRAINT "Challenge_creator_name_fkey" FOREIGN KEY (creator_name) REFERENCES public."User"(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2955 (class 2606 OID 16995)
-- Name: Marking Marking_participation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_participation_id_fkey" FOREIGN KEY (participation_id) REFERENCES public."ChallengeParticipation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2021-08-25 00:00:02 UTC

--
-- PostgreSQL database dump complete
--


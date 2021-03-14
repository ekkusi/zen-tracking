--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Ubuntu 13.2-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.2

-- Started on 2021-03-14 23:39:52 EET

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

ALTER TABLE IF EXISTS ONLY public."Marking" DROP CONSTRAINT IF EXISTS "Marking_user_name_fkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Marking" DROP CONSTRAINT IF EXISTS "Marking_pkey";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Quote";
DROP TABLE IF EXISTS public."Marking";
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- TOC entry 2 (class 3079 OID 1595990)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4003 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 1596432)
-- Name: Marking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Marking" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_name character varying(254) NOT NULL,
    comment character varying(2000)
);


--
-- TOC entry 203 (class 1259 OID 3518681)
-- Name: Quote; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Quote" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quote character varying(254) NOT NULL
);


--
-- TOC entry 201 (class 1259 OID 1596423)
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    name character varying(254) NOT NULL,
    password character varying(254) NOT NULL,
    is_private boolean DEFAULT false NOT NULL
);


--
-- TOC entry 3996 (class 0 OID 1596432)
-- Dependencies: 202
-- Data for Name: Marking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Marking" (id, date, user_name, comment) FROM stdin;
42f473d8-0d5e-4de8-ba1c-0ae9bebe969a	2021-02-15 12:42:31.674461+00	eke	\N
d0c29bf1-2907-4538-912b-506b563abad2	2021-02-15 13:23:27.83314+00	joku	\N
3c0b19dd-31fa-49ea-815b-9278478f6aab	2021-02-15 13:50:35.529969+00	asdasdawdawd	\N
9fdfc2c3-78ba-42be-9c5a-75bb28d0415c	2021-02-13 09:38:55.702871+00	eke	\N
3eb03177-f3b4-4527-bd13-1481038a501c	2021-02-15 13:56:33.23574+00	awodijadio	\N
e36cc98e-5876-4349-8c69-27284cef9f3e	2021-02-15 20:30:00.979055+00	juhevalt	\N
0aeef8c2-0462-43c1-a191-c3ad1de1a712	2021-02-18 08:03:34.186895+00	eke	\N
b0681731-d3ff-4ca4-83da-5b79a4789a90	2021-02-20 10:00:00+00	eke	TEEERVE! Onpahan hauskaa koodailla menemään poikien kanssa. 10-sormijärjestelmä tykittää menemään merkkiä siihen tahtiin, että HUHHUH. Tässä vähän pidempi kommenti. Juu. Moro:)
e40b528f-6f7c-45be-86c2-42b315cc2dd9	2021-02-19 10:00:00+00	eke	
9af60de6-539f-485c-8e15-7398a91c10fe	2021-02-20 10:00:00+00	eke	
c144cb45-39f3-4ffa-bce6-efa6be0eee2d	2021-02-21 10:00:00+00	Lassi	Sama homma
1c268053-e0d9-4c07-b570-31a4a2915713	2021-02-20 10:00:00+00	Lassi	Moikka moi
9ced7d41-a0b7-4739-bd3c-adf6a9f6bb14	2021-03-01 10:00:00+00	ekeukko	
8c0e4efd-cac2-4f3f-ab8d-cbf6c302a20b	2021-02-22 13:46:24.171509+00	Lassi	Hello hello
b180c876-ad1d-4763-9277-2f2bb7e127f4	2021-03-01 16:18:23.94795+00	Päivänsäde63	Ensimmäinen 10min paikallaan olo ja yritys olla ajattelematta ("meditaatio?"). Mukava kokemus, mutta ei oo helppoa pistää aivoja zero tilaan.
faac2441-53c7-46ae-94d0-9b59be90c3a9	2021-03-01 16:41:47.45941+00	Sippi	Laulu ja kitara 15+15 minuuttia. 
198e1cf7-532c-4901-ab38-e80450d4ef6d	2021-03-01 20:59:09.702475+00	Lohkaremies	
02a88b4b-7f37-48a8-ab7b-e1188efac5cb	2021-02-28 10:00:00+00	Lohkaremies	
00667d74-f8b1-4f09-9eab-6f65a7784759	2021-02-25 10:00:00+00	Lohkaremies	
b5548b6f-d43a-4594-903e-fa90d78526d5	2021-03-01 21:00:16.325947+00	Lohkaremies	
0469986a-a597-4f52-9b59-0c19ffd8c35a	2021-02-28 10:00:00+00	Lohkaremies	
df37693f-e350-412f-ab54-d5ed7c228d3e	2021-02-26 10:00:00+00	Lohkaremies	
cc88fd5d-1cfb-4272-a57a-5296a14d0ce0	2021-03-01 21:01:32.082945+00	Lohkaremies	
41b89bfc-36e7-4aca-983b-aa1a31901775	2021-03-01 21:38:49.70278+00	Lohkaremies	
a8e386d5-e69f-448c-b798-7414f3c2edd9	2021-02-27 10:00:00+00	Lohkaremies	
c529faa2-838f-4715-a00a-2449c08713e9	2021-03-01 21:42:40.204161+00	eke	
659f0593-b80a-425c-8c23-e91d20672e50	2021-03-02 07:52:35.440103+00	ekeukko	Eka aamulenkki! Jokunen 20min tuli juoksenneltua. Oon kyllä aivan perkuleen innoissaan näistä haasteista:) Vähän pelottaa, miten penikat ja polvet kestää tuota juoksemista, mutta onneks voi aina ottaa mummomoden ja kävellä vaan, jos pettää!
96bfa921-2f3e-441e-8b5f-c54cc06483fa	2021-03-02 13:55:47.829597+00	Sippi	
6edb4f5e-1e4d-4954-a996-84722f648000	2021-03-02 17:08:35.943868+00	Päivänsäde63	Hiljaisuus ja hengittely oli rentouttavaa. Ajatuksetkin pysyivät aika pitkään poissa ja keskityin vaan hengitykseen. Kurkkukipu vähän häiritsi, vaikka toisaalta tuntui, että kurkku rentoutui
e0f4c018-54c0-4bc8-ac21-4a1cd827a4e4	2021-03-03 10:00:00+00	Päivänsäde63	Melko hyvä sessio ilman hirveesti ajatusten pomppimista. Istuiltaan hyvä.
b337d7c1-4913-4246-b065-450f4d0cee32	2021-03-03 18:25:58.727205+00	Sippi	
4a6522fa-caaa-4798-9c0c-e17bb48ec0b6	2021-03-03 21:06:04.350288+00	ekeukko	Aamulenkkiä Tourujoen varrella. Seurailin hetken siinä ohi lipuvia jäämurikoita ja keppejä ja ihmettelin jännää luontoo:) Lenkkihaaste jää nyt muutaman päivän vähän ketoosin varjoon, mutta ei se mittään!
4fba56d5-7ef2-469f-a75d-2ddf4fdb64f1	2021-03-04 10:00:00+00	eke	
70fc9158-c4ed-4222-8629-52dcd788accc	2021-03-04 20:51:13.616562+00	ekeukko	
7c9f25cc-397b-43b7-ac5e-873c5502095c	2021-03-04 20:54:42.080524+00	aquamies	Hiihdettiin 10km maman kanssa Ukko-Hallan maisemissa, nyt jalat painaa mutta oli mukavata:)
e316490e-4e56-4193-9246-20432a8c6d18	2021-03-03 10:00:00+00	aquamies	Käppäilin muutaman kilsan Ukko-Hallan keskuksesta sillan yli kehä 1:stä pitkin 2. Avenjuulle ja rötkähdin saman tien päikkäreille kun ei huvittanu mikään muu olleskaan
d4302e11-8425-4309-99b6-9e2429ff9e88	2021-03-02 10:00:00+00	aquamies	Ukko-Hallan huipulle menin revontulijahtiin käppäilemään yksin pilkkopimeään ja piileskelin lumikissaa. Ei näkyny revontulia mutta ihan tooosi nätti tähtitaivas ympäröi joka puolella ja pirun kirkas kuu nousi jälleen taivaalle heitellen varjoja lumeen. En malttanu jäädä sisään mökille palatessakaan vaan menin vielä vähän ulos käppäilemään ja kärkkymään revontulia keskiyöllä. Ei näkyny mutta oli niin hiljasta ja nättiä :3
b7d371ad-0153-4a30-bfc3-c9b95d61c395	2021-03-01 10:00:00+00	aquamies	Mietin tuossa pitkään illalla äidin kanssa melkein ysiin asti venyneen illalliskeskustelun jälkeen, että jaksanko lähteä ulos kävelylle vai alotanko tomerasti ja taitavasti maksamalla euron heti ekana päivänä. Päätin että eihän tästä tuu mitään jos luistan jo heti alkuunsa, että vähän parempaa asennetta nyt kehiin ja happihyppely tekee vaan hyvää. Lähdin, ja totesin että okei täällä on tooosi pimeää ja niin hiljasta että vähän pelottaa, mutta ku vilkasin taivasta ja näin tähdet ni totesin että okei vau, kyllähän täällä kelpaa. Käppäilin ja huomasin puiden lomasta jättimäisen valopallon loisteen ja tajusin että melkein täysikuuhan se siellä möllöttää ihan tajuttoman kirkkaana ja upeana, että vau. Olin entistä iloisempi. Sitten jatkoin kävelyä ja näin lisää kajastusta puiden takana ja mietin että mikäs asutuskeskittymä tässä muka niin lähellä, että pilviin heijastuis valosaastetta tuolla tavoin. Kattelin sitä aikani, kunnes ne pilvet alko lepattaa ja ymmärsin, että katselen kaukana siintäviä revontulia. Totesin, että tää oli selvääkin selvempi merkki sille, että yhtäkään kävelyä en kyllä voi missata koska jokainen on mahdollisuus johonki uskomattomaan!! Ja että vaikkei revontulia näkisikään ni happi tekee hyvää ja sen siistin kepin voikin vaikka löytää Mäki-Masan kaduilta. Tuolla oli niin jumalattoman kaunista että lopulta kykin siellä tunnin, ja lopuks ne revontulet kiiti suoraan mun ylitse ja lepatteli siinä tovin ennen ku katosivat kokonaan puiden taa.
04fc484a-b27c-4e48-b9f5-782f5807a0a9	2021-03-04 10:00:00+00	Sippi	
3fae499e-a72d-4a98-9a08-f32443c8c12e	2021-03-05 10:00:00+00	aquamies	Kympin hiihtolenkki päivällä kauniissa auringonpaisteessa ja pienet happihyppelyt vielä illasta tunturin huipulla tuhansien tähtösten alla:’)
337bc304-07f1-4f66-be7a-e5bcd12238f7	2021-03-06 10:00:00+00	Päivänsäde63	Kohtuullisesti, ajatuksia on vaan vaikea saada pysymään hilj
0dc3ca68-2c8f-470a-94a8-de77125b29ea	2021-03-07 10:00:00+00	Päivänsäde63	Ei oo helppoo, tuntuu liika yritykseltä. Ja korva/kurkunpää arkuus haittas kans keskittymistä. Pitäis kai osata laskeutua tähän tilaan paremmin
ce1ae595-a397-474d-81a4-350329995b7d	2021-03-07 20:46:59.351991+00	ekeukko	Muutameexcu Tiian kera:) tipsuteltiin lenkkiä Muuratsalon perukoilla ja takasi 6kilsaa. Robin hoodi oli jo kuiva!!
3add49f4-4298-49d9-af26-861d442842f5	2021-03-06 10:00:00+00	ekeukko	Ketoosipäiviä jälkikäteen merkkailua. Lenkki = kahvi housesta:D oli kyllä ihan ison kylän meininkiä heti herätessä käyvä hakemassa takeaway kahvi kuppilasta!
82ac7804-a880-48d8-b7b5-5afaa45a5cf2	2021-03-05 10:00:00+00	ekeukko	Housekahviaaa!
bc48cd1e-25fa-45f9-9b38-89b7a13c1707	2021-03-08 10:00:00+00	Lohkaremies	
8a756f0b-5a71-41fa-a681-58a6230fa06d	2021-03-07 10:00:00+00	Lohkaremies	
b228c17c-e405-448e-9b59-14638909d8d4	2021-03-08 10:00:00+00	ekeukko	Suoraan kasilta ulos. Talvi on perkule hienoo! Kimmelteli oksissa jäänpalaset ihanasti:) Aattelin, että käyn vaan pikaseen kävelemässä puiston ympäri, mutta lähinki juoksemaa ja kulki aika kivasti! Silti kyllä aamu lähtee käyntii vasta kahvin jälkee, ei tuo sitä korvaa.
15042e9f-b619-4ab1-a5e6-5bdd772b78ab	2021-03-08 10:00:00+00	Päivänsäde63	Aika pitkään onnistuin olemaan ajattelematta. Mutta on tää vaan vaikeeta. Varmaan onnituis paremmin jos vois tuijottaa vaikka järven selkää.
523a3372-3b2f-473d-b57d-4f02f98ba261	2021-03-08 18:22:47.885637+00	Sippi	
b893b5e7-933d-49b6-975e-fff4fa18f243	2021-03-05 10:00:00+00	Sippi	
a597eb6c-666a-4507-91f0-546a79850546	2021-03-06 10:00:00+00	Sippi	
2c1bb81d-cf0f-4e74-8b44-49cc6184a1f7	2021-03-07 10:00:00+00	Sippi	
482b1a2e-c58e-470b-9418-84fafcef7cbb	2021-03-09 10:00:00+00	Päivänsäde63	Nyt oli ok sessio, ihan rentoutui. Pitkällään ja silmät auki
b9524e24-80ac-40ef-b2ec-ec16293beb37	2021-03-10 10:00:00+00	Päivänsäde63	6min pötköttely, ok
809c78c9-0111-4506-b413-7f266d36c5d7	2021-03-06 10:00:00+00	aquamies	Käytiin maman kanssa vähän käppäilemässä jollain könkäällä/myllyllä
0e613e1e-b435-416f-a2ad-d9ca658d1ce1	2021-03-07 10:00:00+00	aquamies	Kauppareissulle, teki hyvää käppäillä monen tunnin ajomatkan jäljiltä😌
e08fb968-c4bd-41a6-94ef-421e92b5935e	2021-03-10 10:00:00+00	aquamies	Kävelin kaninkololle ja takasin, nättiä aurinkoista pakkassäätä ja tähtitaivasta:)
0ec9a5c8-8017-4891-960a-01bb8438e68f	2021-03-09 10:00:00+00	aquamies	Yhteiset mukavat aamukäppäilyt itse zenimestariukon kanssa:—)
dc2c4414-5d93-41e9-97a3-472470758d14	2021-03-11 10:00:00+00	Päivänsäde63	Mukava rentoutuminen vaikka välillä kävi ajatuksia, mut annoin vaan mennä ohi
5e5b5441-6351-4199-a563-b67c9950a77f	2021-03-11 10:00:00+00	aquamies	Melkein tajuton hiihtolenkki:’(
0163bdef-a296-44dc-86ef-ca602bef5377	2021-03-12 10:00:00+00	ekeukko	Tulipahan lenkiteltyä juoksenneltua, mutta oli kyllä hapokasta. Eilen oli biitsiä niin voipi vaikuttaa. Sen kyllä huomasin, että kiva on käydä ihan vaan näkemässä maailmaa heti aamusta! Pääsee ainakin pään sisästä pois, kun menee kävelemään/juoksemaan ja kahtoo, että tässähän näitä muita ihmisiä on ja tässä ne elelee:)
7fd45715-ca92-43c8-a534-9e037de3efa2	2021-03-11 10:00:00+00	ekeukko	
1f42e174-89a0-46d7-9673-177a938e8e82	2021-03-10 10:00:00+00	ekeukko	
61d9d129-db34-460f-8e20-394f38c86f82	2021-03-09 10:00:00+00	ekeukko	
18eb899c-21ca-44b2-9905-10f6cfdf8a06	2021-03-12 10:00:00+00	Päivänsäde63	Reissuun pakkaamisen lista vähän pyöri mielessä, mutta keksin vanhan rentoutumisharjoituksen miten jäsenet alkaa painaa alustaa vasten
08f95a69-5d48-4d2b-881c-09943ac96b78	2021-03-13 10:00:00+00	Päivänsäde63	Rukalla. Ilman kelloa pötköttely.
7352f776-6969-4a9c-add7-8b884bbbe448	2021-03-14 10:00:00+00	ekeukko	Pikanen kävely Mikaboin ja Alman kanssa. Mukavata höpöttelyä yksinäisyydestä ja muusta:)
d50c1d00-6ec5-46c3-ac50-52f73d576084	2021-03-14 21:38:49.162563+00	testi1	awdawd
c7929001-9b94-4944-9c53-ceee3b88becf	2021-03-04 10:00:00+00	testi1	
801ddc54-9cd4-4dbf-a6d8-60ef43c52e11	2021-03-02 10:00:00+00	testi1	
5cbc79ca-7267-4d94-836f-009d6fa034fe	2021-03-10 10:00:00+00	testi1	
b5620fec-e767-44f9-ad39-8f7d8894e33f	2021-01-13 10:00:00+00	testi3	
3afcaa13-36c2-4a48-80cd-a8167e2671e1	2021-01-22 10:00:00+00	testi3	
5e6b4d2b-9984-48eb-9ba3-3f20f3a1f9d3	2021-01-24 10:00:00+00	testi3	
778dedad-6525-460a-9777-3ae90c7c9471	2021-02-10 10:00:00+00	testi4	
54717131-613b-4373-8aa3-43fac4ea4f0e	2021-02-19 10:00:00+00	testi4	
\.


--
-- TOC entry 3997 (class 0 OID 3518681)
-- Dependencies: 203
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
-- TOC entry 3995 (class 0 OID 1596423)
-- Dependencies: 201
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (name, password, is_private) FROM stdin;
uusi ukkeli	$2b$10$LZOk95DS5jawIsysodmvIezuft0diYVRhVMLphW9IV8Qx7mrN13SK	f
joku	$2b$10$//nNTmyODqlLO2jFS2XeZ.VYY5P3hHaRpW384TIYoNAdXdrVumsca	f
aowseifujawoi	$2b$10$5cBljZmbY5DgyYaG8Pe6zOUPtQXbxPQwaopYNsS/9LsBGDaIIzHsy	f
terve	$2b$10$WzjuFVkagVXN6VBkAUvx4.GuQgkMdxnaYw2CPku0eQpvz0aoo5jRG	f
wefawfw	$2b$10$lAWpjX6KNWoJ8k0.ch9dtOBw/LR2pYrl450XMonOXk8C/lce/.BA6	f
Tipi	$2b$10$.Eh86Fpzfe7LXc5JVBM9Sewgtkv4.H/RmM1c0eHHB6XtRivEIqtpW	f
ukkeli	$2b$10$8r0qPVaJeLES1i9m8J54BOw/StfV4H4Xrg9A4O0agr9UvaZTvBhye	f
awodijadio	$2b$10$Gq2S67Sr4UFZVbF4itvaeu2Tt2O02pcedkQVSDYz8LUADZZnLmMqe	f
awfdaf	$2b$10$t4lKbCeSBuXLyEd6B/dxLOwJP2E1FJP1jebmZ653dbsEzGVzH5kYi	f
rweagarweg	$2b$10$5wilbDkADAkhtLQd.ISaKu4orSY92brUorGH4wf0EJYFQelZBjRza	f
juhevalt	$2b$10$82ew99o0UCj0WVk.9qJiLOi35aoV0HaY/IaYEgqC.6n3oDWara3b6	f
oerigfjreoijg	$2b$10$5MzEjSeUxxyjPMXIZFG7MeoMpj89zu2VRE/kk.7GarHN3XkvwesE.	f
eke	$2b$10$hQTRQorcBpq3UZWptL5.cOGgOPxPyQBHCbuh18bdI3WD1dECRSKd.	f
aoeijfwoi	$2b$10$2MduoFz6VvODDVjkjti2Ye9yGLccAMmHBr2QcYM2juEqALLqqSqYS	f
eargaeg	$2b$10$j1UUHbQwo7tD3KDXNMcegeucZMaYeXti3EQDBX2NLzfYl/rAtTqam	f
asdasdawdawd	$2b$10$uxjgNv0fpsGaE6uwy9GwSODrj0D/ZtcezCMAmiWB6Kwgsi95KxomW	f
AWEFAEWF	$2b$10$f.weSi10li6K9IsQVoafcutVl7Bs8Ja2sMCNwYxDsL74a9L.vUXNO	f
aquamies	$2b$10$RKBC38VhT29WaNpIlU/tKuQeZ/poGYC.3HOycRsMtymopCRpJ4SYu	f
uusiukkeli	$2b$10$1jD0zvlR2jckqeJPheS71uhqhvpReItYJQhl2ylhlQdqVnJVc4HjG	f
Lassi	$2b$10$ILmmPrBeCNkBcqCw5SdBPudWbad2bkYbAbgWxwm2aoMniNyht3IF.	f
Heini	$2b$10$erzIzXqyMXPZ6Vd5YV4Kh.EID4XwSYE1GV4O47KsYFTRz8xA2/Bii	f
Päivänsäde63	$2b$10$UOLTiPLwBarlK.wJX1RCk.wP.YW8iqbt6/Bz2co7uPVgM/nbaQIxa	f
Sippi	$2b$10$SN.ez2U7La8lPGP3VJZLTe5WV1kDabuOYCoFAgcvO4dcD5zqanxYK	f
Lohkaremies	$2b$10$IZNtrk5LWNA/tc.barT.y..pnBGKOajDXjyyVFNHCINvFuajkvEfO	f
ekeukko	$2b$10$Ntf.c/z3Dszao9WKCgC7BeVcTJ/la39B3yvI1cPksufisPyjPA112	f
LohkareMies	$2b$10$8FI1ghrl9Tk2t2Fv47yPzeGx9hjoyIfQw/hDxDzaZeZ5pbxTvGJDK	f
testi1	$2b$10$m/AOh27GZVydiKVhCDuj3O1Bz4fNzRSrqwyL49lP97wVvh1Io1K.K	f
testi2	$2b$10$1qM0s/9A3cIZEprZgZ146OdXr4KhLaNan8HSfhomJ9DBf6cJrf3Y.	f
testi3	$2b$10$ieuFNRoaKfMmOCT9et.MB.VAZCcEAB.WhBFSn8l43KQYRv4taWCD2	f
testi4	$2b$10$a.33EhACp/6vtwItdeGaCufUf0q9PcdEFmThH1NjZlnvCP5PAeXYW	f
\.


--
-- TOC entry 3863 (class 2606 OID 1596441)
-- Name: Marking Marking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_pkey" PRIMARY KEY (id);


--
-- TOC entry 3861 (class 2606 OID 1596431)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (name);


--
-- TOC entry 3864 (class 2606 OID 1596442)
-- Name: Marking Marking_user_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_user_name_fkey" FOREIGN KEY (user_name) REFERENCES public."User"(name) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2021-03-14 23:39:58 EET

--
-- PostgreSQL database dump complete
--


--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1 (Debian 13.1-1.pgdg100+1)
-- Dumped by pg_dump version 13.1 (Debian 13.1-1.pgdg100+1)

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

ALTER TABLE IF EXISTS ONLY public."Marking" DROP CONSTRAINT IF EXISTS "Marking_userName_fkey";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Marking" DROP CONSTRAINT IF EXISTS "Marking_pkey";
ALTER TABLE IF EXISTS public."Marking" ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP SEQUENCE IF EXISTS public."Marking_id_seq";
DROP TABLE IF EXISTS public."Marking";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Marking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Marking" (
    id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    comment text,
    "userName" text,
    activities text[]
);


--
-- Name: Marking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Marking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Marking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Marking_id_seq" OWNED BY public."Marking".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    name text NOT NULL,
    password text NOT NULL,
    "isPrivate" boolean DEFAULT false NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: Marking id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marking" ALTER COLUMN id SET DEFAULT nextval('public."Marking_id_seq"'::regclass);


--
-- Data for Name: Marking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Marking" (id, date, comment, "userName", activities) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (name, password, "isPrivate") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
34ca109f-9bb0-40e6-a8e9-6aa9c3b0a80b	7ca2e2471e9047644d054b54fba9c8736cb4d6b249b674f9075ebf57888a95	2021-02-12 22:01:45.890722+00	20210111080745_first_migration	\N	\N	2021-02-12 22:01:45.674389+00	1
a57dd60c-5606-49ca-a3dc-62a27d52dcdf	75f8d8c2106df5b8c5b5baea783def87df6bbd37555682b95354c1158eb942	2021-02-12 22:01:45.940449+00	20210113194845_migration	\N	\N	2021-02-12 22:01:45.898782+00	1
812cafcc-084d-467e-9c4b-f07ed6bc1801	3e1e4aa6745c5d319e9b2286da5d25b6d5fd83f8362a18155a606889f343838a	2021-02-12 22:01:45.973731+00	20210114195942_migration	\N	\N	2021-02-12 22:01:45.948802+00	1
476e4c4e-0d8d-4790-b778-7d0dd1a679a6	d3443acc367c151aa3d98f1b885ed6462e1ee0842efe87847120658ca97055	2021-02-12 22:01:54.901542+00	20210212220154_add_some_property	\N	\N	2021-02-12 22:01:54.874342+00	1
29c6267e-1c79-4b98-a8bf-a323fb450d51	cbf08c61e570944e3c8f271f7ce23f58d99dfb8bd3989acc4e15e8e66a1d429a	2021-02-12 22:06:06.588132+00	20210212220606_remove_some_property	\N	\N	2021-02-12 22:06:06.551187+00	1
\.


--
-- Name: Marking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Marking_id_seq"', 1, false);


--
-- Name: Marking Marking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (name);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Marking Marking_userName_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_userName_fkey" FOREIGN KEY ("userName") REFERENCES public."User"(name) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--


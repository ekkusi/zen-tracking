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

ALTER TABLE ONLY public."Marking" DROP CONSTRAINT "Marking_userName_fkey";
ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
ALTER TABLE ONLY public."Marking" DROP CONSTRAINT "Marking_pkey";
ALTER TABLE public."Marking" ALTER COLUMN id DROP DEFAULT;
DROP TABLE public._prisma_migrations;
DROP TABLE public."User";
DROP SEQUENCE public."Marking_id_seq";
DROP TABLE public."Marking";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Marking; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Marking" (
    id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    comment text,
    "userName" text,
    activities text[]
);


ALTER TABLE public."Marking" OWNER TO "user";

--
-- Name: Marking_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."Marking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Marking_id_seq" OWNER TO "user";

--
-- Name: Marking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."Marking_id_seq" OWNED BY public."Marking".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."User" (
    name text NOT NULL,
    password text NOT NULL,
    "isPrivate" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO "user";

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: user
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


ALTER TABLE public._prisma_migrations OWNER TO "user";

--
-- Name: Marking id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Marking" ALTER COLUMN id SET DEFAULT nextval('public."Marking_id_seq"'::regclass);


--
-- Data for Name: Marking; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Marking" (id, date, comment, "userName", activities) FROM stdin;
1	2021-01-05 00:00:00	\N	joku	\N
2	2021-01-05 00:00:00	\N	joku	\N
3	2021-01-05 00:00:00	\N	joku	\N
4	2021-01-05 00:00:00	\N	joku	\N
5	2021-01-14 20:09:59		ekeukko	{meditation,yoga,reading,journaling}
6	2021-01-14 20:11:16		ekeukko	{meditation,yoga,reading,journaling}
7	2021-02-07 09:35:54		eke	{meditation,yoga,reading,journaling}
8	2021-02-08 09:35:12		eke	{meditation,yoga,reading,journaling}
9	2021-02-08 09:40:27		eke	{meditation,yoga,reading,journaling}
10	2021-02-08 09:41:30		eke	{meditation,yoga,reading,journaling}
11	2021-02-08 09:41:33		eke	{meditation,yoga,reading,journaling}
12	2021-02-08 09:41:45		eke	{meditation,yoga,reading,journaling}
13	2021-02-08 09:41:48		eke	{meditation,yoga,reading,journaling}
14	2021-02-08 09:42:25		eke	{meditation,yoga,reading,journaling}
15	2021-02-08 09:43:49		eke	{meditation,yoga,reading,journaling}
16	2021-02-08 09:44:31		eke	{meditation,yoga,reading,journaling}
17	2021-02-08 09:44:42		eke	{meditation,yoga,reading,journaling}
18	2021-02-08 09:45:13		eke	{meditation,yoga,reading,journaling}
19	2021-02-08 09:45:44		eke	{meditation,yoga,reading,journaling}
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."User" (name, password, "isPrivate") FROM stdin;
joku	joku	f
ukko	asdasda	f
ekeukko	erkki123	f
eke	asd123	f
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4f6913ff-f5e4-416c-893f-c27776a544ab	7ca2e2471e9047644d054b54fba9c8736cb4d6b249b674f9075ebf57888a95	2021-01-12 15:39:03.947999+00	20210111080745_first_migration	\N	\N	2021-01-12 15:39:03.748448+00	1
40d98d71-d469-4906-ab80-600c55222159	75f8d8c2106df5b8c5b5baea783def87df6bbd37555682b95354c1158eb942	2021-01-13 19:48:45.703492+00	20210113194845_migration	\N	\N	2021-01-13 19:48:45.680128+00	1
02c8484c-3315-4a40-8c64-f78579a008be	3e1e4aa6745c5d319e9b2286da5d25b6d5fd83f8362a18155a606889f343838a	2021-01-14 19:59:42.203056+00	20210114195942_migration	\N	\N	2021-01-14 19:59:42.175564+00	1
\.


--
-- Name: Marking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."Marking_id_seq"', 19, true);


--
-- Name: Marking Marking_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (name);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Marking Marking_userName_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_userName_fkey" FOREIGN KEY ("userName") REFERENCES public."User"(name) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

